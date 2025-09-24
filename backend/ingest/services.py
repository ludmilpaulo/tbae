from __future__ import annotations
import csv
import io
from typing import Dict, Tuple
from django.core.files.base import ContentFile
from django.db import transaction
from django.utils import timezone
from newsletter.models import List, Subscriber
from .models import ImportJob

def _resolve_list(job: ImportJob, row: Dict[str, str]) -> List | None:
    if job.list_id:
        try:
            return List.objects.get(id=job.list_id)
        except List.DoesNotExist:
            return None
    if job.list_slug:
        try:
            return List.objects.get(slug=job.list_slug)
        except List.DoesNotExist:
            return None
    if row.get("list_id"):
        try:
            return List.objects.get(id=int(row["list_id"]))
        except Exception:
            pass
    if row.get("list_slug"):
        try:
            return List.objects.get(slug=row["list_slug"])
        except List.DoesNotExist:
            pass
    if row.get("list"):
        try:
            return List.objects.get(slug=row["list"])
        except List.DoesNotExist:
            try:
                return List.objects.get(name=row["list"])
            except List.DoesNotExist:
                pass
    if job.create_list and row.get("list"):
        return List.objects.create(name=row["list"], slug=row["list"])
    return None

from datetime import datetime
from typing import Optional

DATE_PATTERNS = [
    "%Y-%m-%d",
    "%d/%m/%Y",
    "%m/%d/%Y",
    "%Y/%m/%d",
    "%d-%m-%Y",
    "%m-%d-%Y",
]

def _parse_date(s: Optional[str]) -> Optional[datetime.date]:
    if not s:
        return None
    txt = s.strip()
    if not txt:
        return None
    for fmt in DATE_PATTERNS:
        try:
            return datetime.strptime(txt, fmt).date()
        except Exception:
            continue
    # last resort: let pandas/np parse? we keep it simple; otherwise ignore
    return None

def upsert_subscriber(*, list_obj: List, row: Dict[str, str], confirm_all: bool, dry_run: bool) -> Tuple[bool, bool]:
    # Accept various casings
    email = (row.get("email") or row.get("Email") or "").strip().lower()
    if not email:
        raise ValueError("email missing")

    # first/last from explicit columns OR split Name
    first = (row.get("first_name") or row.get("First Name") or "").strip()
    last = (row.get("last_name") or row.get("Last Name") or "").strip()
    if not (first or last):
        nm = (row.get("name") or row.get("Name") or "").strip()
        if nm:
            parts = nm.split()
            if len(parts) == 1:
                first = parts[0]
            else:
                first = " ".join(parts[:-1])
                last = parts[-1]

    # parse optional dates from CSV
    client_added = _parse_date(row.get("client date added") or row.get("Client Date Added"))
    contact_added = _parse_date(row.get("contact date added") or row.get("Contact Date Added"))

    is_conf = confirm_all
    if not confirm_all:
        v = (row.get("is_confirmed") or row.get("Is Confirmed") or "").strip().lower()
        is_conf = v in {"1", "true", "yes", "y"}

    try:
        sub = Subscriber.objects.get(list=list_obj, email=email)
        would_update = False
        # compute updates
        fields = []
        if first and sub.first_name != first:
            sub.first_name = first; fields.append("first_name"); would_update = True
        if last and sub.last_name != last:
            sub.last_name = last; fields.append("last_name"); would_update = True
        if is_conf and not sub.is_confirmed:
            sub.is_confirmed = True; fields.append("is_confirmed"); would_update = True
        if client_added and sub.client_date_added != client_added:
            sub.client_date_added = client_added; fields.append("client_date_added"); would_update = True
        if contact_added and sub.contact_date_added != contact_added:
            sub.contact_date_added = contact_added; fields.append("contact_date_added"); would_update = True

        if would_update and not dry_run:
            sub.save(update_fields=fields)
        return (False, would_update)
    except Subscriber.DoesNotExist:
        if not dry_run:
            Subscriber.objects.create(
                list=list_obj,
                email=email,
                first_name=first,
                last_name=last,
                is_confirmed=is_conf,
                client_date_added=client_added,
                contact_date_added=contact_added,
            )
        return (True, False)


def process_job(job: ImportJob) -> ImportJob:
    job.status = ImportJob.VALIDATING
    job.started_at = timezone.now()
    job.save(update_fields=["status", "started_at"])

    f = job.file
    f.open("rb")
    raw = f.read()
    f.close()

    text = raw.decode("utf-8", errors="ignore")

    # Try to auto-detect delimiter (comma/semicolon)
    try:
        dialect = csv.Sniffer().sniff(text.splitlines()[0])
        delimiter = dialect.delimiter
    except Exception:
        delimiter = ","

    reader = csv.DictReader(io.StringIO(text), delimiter=delimiter)

    # Normalize headers to lowercase keys when we read rows
    original_headers = reader.fieldnames or []
    if not original_headers:
        job.status = ImportJob.FAILED
        job.rows_errors = 0
        job.finished_at = timezone.now()
        job.save(update_fields=["status", "rows_errors", "finished_at"])
        return job

    required = {"email"}  # after normalization we look up email in both 'email' and 'Email'
    # (We’ll validate per-row below)

    job.status = ImportJob.PROCESSING
    job.save(update_fields=["status"])

    errors: list[Dict[str, str]] = []
    total = created = updated = skipped = failed = 0

    for raw_row in reader:
        # normalize row keys to lowercase
        row = { (k or "").strip().lower(): v for k, v in raw_row.items() }
        total += 1
        try:
            # If no email after normalization, try upper-case key
            if not (row.get("email") or raw_row.get("Email")):
                raise ValueError("email missing")

            lst = _resolve_list(job, raw_row | row)  # pass both casings so _resolve_list can find list_id/list_slug
            if not lst:
                raise ValueError("cannot resolve list (set List ID/Slug in the UI or add list columns)")

            c, u = upsert_subscriber(list_obj=lst, row=raw_row | row, confirm_all=job.confirm_all, dry_run=job.dry_run)
            created += int(c)
            updated += int(u)
        except Exception as e:
            failed += 1
            row_copy = dict(raw_row)
            row_copy["error"] = str(e)
            errors.append(row_copy)

    # Write error CSV if any
    if errors:
        out = io.StringIO()
        writer = csv.DictWriter(out, fieldnames=list(errors[0].keys()))
        writer.writeheader()
        writer.writerows(errors)
        job.error_report.save(f"import_errors_{job.id}.csv", ContentFile(out.getvalue().encode("utf-8")), save=False)

    job.rows_total = total
    job.rows_created = created
    job.rows_updated = updated
    job.rows_skipped = skipped
    job.rows_errors = failed
    job.status = ImportJob.COMPLETED
    job.finished_at = timezone.now()
    job.save()
    return job
