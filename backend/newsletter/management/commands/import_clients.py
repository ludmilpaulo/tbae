import csv
import io
from datetime import datetime
from pathlib import Path
from typing import Optional

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from newsletter.models import List, Subscriber


DATE_PATTERNS = [
    "%Y-%m-%d",
    "%d/%m/%Y",
    "%m/%d/%Y",
    "%Y/%m/%d",
    "%d-%m-%Y",
    "%m-%d-%Y",
]


def parse_date(val: Optional[str]):
    if not val:
        return None
    txt = str(val).strip()
    if not txt:
        return None
    for fmt in DATE_PATTERNS:
        try:
            return datetime.strptime(txt, fmt).date()
        except Exception:
            continue
    return None


def split_name(name: str):
    name = (name or "").strip()
    if not name:
        return "", ""
    parts = name.split()
    if len(parts) == 1:
        return parts[0], ""
    return " ".join(parts[:-1]), parts[-1]


class Command(BaseCommand):
    help = "Import newsletter subscribers from a CSV into a list."

    def add_arguments(self, parser):
        parser.add_argument("csv_path", type=str, help="Path to CSV file.")
        parser.add_argument(
            "--list-slug",
            type=str,
            required=True,
            help="Target list slug (created if missing).",
        )
        parser.add_argument(
            "--list-name",
            type=str,
            default=None,
            help="List display name (if creating a new list). Defaults to slug.",
        )
        parser.add_argument(
            "--confirm-all",
            action="store_true",
            help="Mark all imported subscribers as confirmed.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Validate only; do not write to the database.",
        )
        parser.add_argument(
            "--encoding",
            type=str,
            default="utf-8",
            help='File encoding (default "utf-8").',
        )

    def handle(self, *args, **opts):
        csv_path = Path(opts["csv_path"])
        list_slug = opts["list_slug"].strip()
        list_name = opts["list_name"] or list_slug
        confirm_all = bool(opts["confirm_all"])
        dry_run = bool(opts["dry_run"])
        encoding = opts["encoding"]

        if not csv_path.exists():
            raise CommandError(f"CSV not found: {csv_path}")

        # Ensure list exists (or create)
        lst, created_list = List.objects.get_or_create(
            slug=list_slug, defaults={"name": list_name}
        )
        if created_list:
            self.stdout.write(self.style.SUCCESS(f"Created list '{lst.name}' ({lst.slug})"))
        else:
            self.stdout.write(f"Using existing list '{lst.name}' ({lst.slug})")

        # Read file
        raw = csv_path.read_bytes()
        text = raw.decode(encoding, errors="ignore")

        # Auto-detect delimiter
        try:
            sample = text.splitlines()[0]
            dialect = csv.Sniffer().sniff(sample)
            delimiter = dialect.delimiter
        except Exception:
            delimiter = ","

        reader = csv.DictReader(io.StringIO(text), delimiter=delimiter)
        headers = reader.fieldnames or []
        if not headers:
            raise CommandError("CSV has no headers.")

        self.stdout.write(f"Detected delimiter: '{delimiter}'")
        self.stdout.write(f"Headers: {headers}")

        total = created = updated = skipped = failed = 0
        errors = []

        @transaction.atomic
        def do_row(row: dict):
            nonlocal created, updated, skipped, failed

            # tolerate case
            row_l = { (k or "").strip().lower(): v for k, v in row.items() }
            email = (row_l.get("email") or row.get("Email") or "").strip().lower()
            if not email:
                failed += 1
                errors.append({**row, "error": "email missing"})
                return

            # names
            first = (row_l.get("first_name") or "").strip()
            last = (row_l.get("last_name") or "").strip()
            if not (first or last):
                nm = (row_l.get("name") or row.get("Name") or "").strip()
                f, l = split_name(nm)
                first = first or f
                last = last or l

            # optional dates
            client_added = parse_date(row.get("Client Date Added") or row_l.get("client date added"))
            contact_added = parse_date(row.get("Contact Date Added") or row_l.get("contact date added"))

            try:
                sub = Subscriber.objects.get(list=lst, email=email)
                changed = False
                fields = []
                if first and sub.first_name != first:
                    sub.first_name = first; fields.append("first_name"); changed = True
                if last and sub.last_name != last:
                    sub.last_name = last; fields.append("last_name"); changed = True
                if confirm_all and not sub.is_confirmed:
                    sub.is_confirmed = True; fields.append("is_confirmed"); changed = True
                if client_added and sub.client_date_added != client_added:
                    sub.client_date_added = client_added; fields.append("client_date_added"); changed = True
                if contact_added and sub.contact_date_added != contact_added:
                    sub.contact_date_added = contact_added; fields.append("contact_date_added"); changed = True

                if changed:
                    if not dry_run:
                        sub.save(update_fields=fields)
                    updated += 1
                else:
                    skipped += 1
            except Subscriber.DoesNotExist:
                if not dry_run:
                    Subscriber.objects.create(
                        list=lst,
                        email=email,
                        first_name=first,
                        last_name=last,
                        is_confirmed=confirm_all,
                        client_date_added=client_added,
                        contact_date_added=contact_added,
                    )
                created += 1

        # Iterate
        for row in reader:
            total += 1
            try:
                do_row(row)
            except Exception as e:
                failed += 1
                errors.append({**row, "error": str(e)})

        # Summary
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(f"Total: {total}"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created}"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated}"))
        self.stdout.write(self.style.WARNING(f"Skipped (no change): {skipped}"))
        if failed:
            self.stdout.write(self.style.ERROR(f"Failed: {failed}"))
            out = io.StringIO()
            err_headers = list(errors[0].keys()) if errors else []
            if "error" not in err_headers:
                err_headers.append("error")
            w = csv.DictWriter(out, fieldnames=err_headers)
            w.writeheader()
            w.writerows(errors)
            # Write alongside the input CSV
            err_path = csv_path.with_name(csv_path.stem + "_errors.csv")
            err_path.write_text(out.getvalue(), encoding="utf-8")
            self.stdout.write(self.style.ERROR(f"Wrote error report: {err_path}"))

        if dry_run:
            raise CommandError("Dry-run: no changes written. Re-run without --dry-run to save.")


