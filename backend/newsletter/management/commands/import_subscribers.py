import csv
from pathlib import Path
from typing import Optional

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db import transaction

from newsletter.models import List, Subscriber

User = get_user_model()


class Command(BaseCommand):
    help = (
        "Import subscribers from a CSV file.\n\n"
        "Headers supported: email,first_name,last_name,is_confirmed,list,list_id,list_slug\n"
        "You can also force a single list for all rows using --list or --list-slug."
    )

    def add_arguments(self, parser):
        parser.add_argument("csv_path", type=str, help="Path to CSV")
        parser.add_argument(
            "--list",
            type=int,
            dest="list_id",
            default=None,
            help="List ID to assign to all rows",
        )
        parser.add_argument(
            "--list-slug",
            type=str,
            dest="list_slug",
            default=None,
            help="List slug to assign to all rows (created if missing)",
        )
        parser.add_argument(
            "--create-list",
            action="store_true",
            help="Create list if not found (when using --list-slug or CSV list_slug/name)",
        )
        parser.add_argument(
            "--confirm",
            action="store_true",
            help="Force is_confirmed=True for all rows",
        )

    def get_list_from_args_or_row(
        self,
        *,
        list_id_arg: Optional[int],
        list_slug_arg: Optional[str],
        row: dict,
        create_list: bool,
    ) -> List:
        # Priority: CLI --list / --list-slug > CSV list_id > CSV list/list_slug
        if list_id_arg:
            try:
                return List.objects.get(id=list_id_arg)
            except List.DoesNotExist as e:
                raise CommandError(f"List with id={list_id_arg} not found") from e

        if list_slug_arg:
            if create_list:
                obj, _ = List.objects.get_or_create(slug=list_slug_arg, defaults={"name": list_slug_arg})
                return obj
            return List.objects.get(slug=list_slug_arg)

        # From CSV
        if row.get("list_id"):
            return List.objects.get(id=int(row["list_id"]))  # may raise DoesNotExist

        slug = (row.get("list_slug") or "").strip()
        name = (row.get("list") or "").strip()

        if slug:
            if create_list:
                obj, _ = List.objects.get_or_create(slug=slug, defaults={"name": name or slug})
                return obj
            return List.objects.get(slug=slug)

        if name:
            # Make a slug-ish lookup by name if present
            # Fallback: try exact name; if none and create_list, create.
            qs = List.objects.filter(name=name)
            if qs.exists():
                return qs.first()  # type: ignore[return-value]
            if create_list:
                return List.objects.create(name=name)

        raise CommandError(
            "No mailing list provided. Use --list / --list-slug, or include list_id/list_slug/list column in CSV."
        )

    @transaction.atomic
    def handle(self, *args, **options):
        csv_path = Path(options["csv_path"])
        if not csv_path.exists():
            raise CommandError(f"CSV not found: {csv_path}")

        list_id_arg = options.get("list_id")
        list_slug_arg = options.get("list_slug")
        force_confirm = bool(options.get("confirm"))
        create_list = bool(options.get("create_list"))

        created = 0
        updated = 0
        skipped = 0
        errors = 0

        with csv_path.open(newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            if "email" not in (reader.fieldnames or []):
                raise CommandError("CSV must include 'email' column")

            for idx, row in enumerate(reader, start=2):  # start at 2 (account for header)
                email = (row.get("email") or "").strip().lower()
                if not email:
                    skipped += 1
                    continue

                try:
                    list_obj = self.get_list_from_args_or_row(
                        list_id_arg=list_id_arg,
                        list_slug_arg=list_slug_arg,
                        row=row,
                        create_list=create_list,
                    )
                except Exception as e:
                    self.stderr.write(self.style.ERROR(f"Row {idx}: {e}"))
                    errors += 1
                    continue

                first_name = (row.get("first_name") or "").strip()
                last_name = (row.get("last_name") or "").strip()

                is_conf = force_confirm
                if not force_confirm:
                    val = (row.get("is_confirmed") or "").strip().lower()
                    is_conf = val in {"1", "true", "yes", "y"}

                sub, created_flag = Subscriber.objects.get_or_create(
                    list=list_obj,
                    email=email,
                    defaults={
                        "first_name": first_name,
                        "last_name": last_name,
                        "is_confirmed": is_conf,
                    },
                )

                if created_flag:
                    created += 1
                else:
                    # Update details (don’t flip confirmed from True -> False)
                    changed = False
                    if first_name and sub.first_name != first_name:
                        sub.first_name = first_name
                        changed = True
                    if last_name and sub.last_name != last_name:
                        sub.last_name = last_name
                        changed = True
                    if is_conf and not sub.is_confirmed:
                        sub.is_confirmed = True
                        changed = True
                    if changed:
                        sub.save(update_fields=["first_name", "last_name", "is_confirmed"])
                        updated += 1

        self.stdout.write(
            self.style.SUCCESS(f"Done. created={created} updated={updated} skipped={skipped} errors={errors}")
        )
