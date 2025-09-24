from __future__ import annotations
from django.db import models

class ImportJob(models.Model):
    PENDING, VALIDATING, PROCESSING, COMPLETED, FAILED = (
        "pending", "validating", "processing", "completed", "failed"
    )
    STATUS_CHOICES = [(x, x) for x in (PENDING, VALIDATING, PROCESSING, COMPLETED, FAILED)]

    file = models.FileField(upload_to="imports/")
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=PENDING)
    error_report = models.FileField(upload_to="imports/errors/", null=True, blank=True)

    # Import options & notes
    list_id = models.IntegerField(null=True, blank=True)
    list_slug = models.SlugField(null=True, blank=True)
    create_list = models.BooleanField(default=False)
    confirm_all = models.BooleanField(default=True)
    dry_run = models.BooleanField(default=False)
    note = models.CharField(max_length=255, blank=True)

    # Counters
    rows_total = models.IntegerField(default=0)
    rows_created = models.IntegerField(default=0)
    rows_updated = models.IntegerField(default=0)
    rows_skipped = models.IntegerField(default=0)
    rows_errors = models.IntegerField(default=0)

    class Meta:
        ordering = ["-id"]
