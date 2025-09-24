from __future__ import annotations

import csv
import io
from typing import Iterable, Optional

from celery import shared_task
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db import transaction
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives

from .models import Campaign, Subscriber, Delivery, ImportJob, List
from .utils import render_email, inject_unsubscribe


@shared_task(bind=True, ignore_result=True)
def send_campaign_task(self, campaign_id: int, subscriber_ids: Optional[Iterable[int]] = None):
    campaign = Campaign.objects.select_related("template", "list").get(id=campaign_id)
    Campaign.objects.filter(id=campaign.id).update(status=Campaign.SENDING)

    qs = Subscriber.objects.filter(
        list=campaign.list,
        is_confirmed=True,
        unsubscribed_at__isnull=True,
    )
    if subscriber_ids:
        qs = qs.filter(id__in=list(subscriber_ids))

    sent = 0
    for s in qs.iterator(chunk_size=500):
        delivery, _ = Delivery.objects.get_or_create(campaign=campaign, subscriber=s)

        # Per-subscriber HTML: inject unsubscribe URL first
        html_source = inject_unsubscribe(campaign.template.html, s.unsubscribe_token)

        html, text = render_email(html_source, delivery.token)

        msg = EmailMultiAlternatives(
            subject=campaign.template.subject,
            body=text,
            from_email=campaign.from_email,
            to=[s.email],
        )
        msg.attach_alternative(html, "text/html")

        try:
            msg.send(fail_silently=False)
            delivery.sent_at = timezone.now()
        except Exception as e:
            delivery.bounce_reason = (str(e) or "")[:2000]
        finally:
            delivery.save(update_fields=["sent_at", "bounce_reason"])
            sent += 1

    Campaign.objects.filter(id=campaign.id).update(status=Campaign.SENT)
    return {"sent": sent}


@shared_task(bind=True, ignore_result=True)
def process_import_job(self, job_id: int, csv_text: str, confirm_all: bool = True):
    """
    Minimal CSV importer:
    - Required: email
    - Optional: first_name, last_name, tags (comma-separated), list_id/list_slug handled by caller (ImportCreateView)
    Updates ImportJob counters and writes an error report CSV if needed.
    """
    job = ImportJob.objects.get(id=job_id)
    job.status = "processing"
    job.started_at = timezone.now()
    job.save(update_fields=["status", "started_at"])

    rows_total = rows_created = rows_updated = rows_skipped = rows_errors = 0
    err_buf = io.StringIO()
    err_writer = csv.writer(err_buf)
    wrote_header = False

    reader = csv.DictReader(io.StringIO(csv_text))
    # Figure out which list to use from job.list (the view ensures it)
    target_list: List = job.list

    with transaction.atomic():
        for row in reader:
            rows_total += 1
            email = (row.get("email") or "").strip().lower()
            if not email:
                rows_errors += 1
                if not wrote_header:
                    err_writer.writerow(["row", "error", "data"])
                    wrote_header = True
                err_writer.writerow([rows_total, "missing email", dict(row)])
                continue

            first_name = (row.get("first_name") or "").strip()
            last_name = (row.get("last_name") or "").strip()
            tags_raw = (row.get("tags") or "").strip()
            tags = [t.strip() for t in tags_raw.split(",") if t.strip()] if tags_raw else []

            try:
                sub, created = Subscriber.objects.get_or_create(
                    list=target_list,
                    email=email,
                    defaults={
                        "first_name": first_name,
                        "last_name": last_name,
                        "tags": tags,
                        "is_confirmed": bool(confirm_all),
                    },
                )
                if created:
                    rows_created += 1
                else:
                    changed = False
                    if first_name and sub.first_name != first_name:
                        sub.first_name = first_name; changed = True
                    if last_name and sub.last_name != last_name:
                        sub.last_name = last_name; changed = True
                    if tags and sub.tags != tags:
                        sub.tags = tags; changed = True
                    if confirm_all and not sub.is_confirmed:
                        sub.is_confirmed = True; changed = True
                    if changed:
                        sub.save(update_fields=["first_name", "last_name", "tags", "is_confirmed"])
                        rows_updated += 1
                    else:
                        rows_skipped += 1
            except Exception as e:
                rows_errors += 1
                if not wrote_header:
                    err_writer.writerow(["row", "error", "data"])
                    wrote_header = True
                err_writer.writerow([rows_total, str(e), dict(row)])

    # Persist error report if any
    error_report_url = None
    if rows_errors > 0:
        content = err_buf.getvalue().encode("utf-8")
        path = f"newsletter/import_errors/job_{job.id}.csv"
        default_storage.save(path, ContentFile(content))
        if hasattr(default_storage, "url"):
            try:
                error_report_url = default_storage.url(path)
            except Exception:
                error_report_url = None

    job.rows_total = rows_total
    job.rows_created = rows_created
    job.rows_updated = rows_updated
    job.rows_skipped = rows_skipped
    job.rows_errors = rows_errors
    job.status = "completed" if rows_errors == 0 else "completed"  # still completed; errors are per-row
    job.finished_at = timezone.now()
    if error_report_url is not None and hasattr(job, "error_report"):
        job.error_report = error_report_url  # field is optional in some schemas
        job.save(update_fields=[
            "rows_total", "rows_created", "rows_updated", "rows_skipped", "rows_errors",
            "status", "finished_at", "error_report",
        ])
    else:
        job.save(update_fields=[
            "rows_total", "rows_created", "rows_updated", "rows_skipped", "rows_errors",
            "status", "finished_at",
        ])
    return {
        "rows_total": rows_total,
        "rows_created": rows_created,
        "rows_updated": rows_updated,
        "rows_skipped": rows_skipped,
        "rows_errors": rows_errors,
        "error_report": error_report_url,
    }
