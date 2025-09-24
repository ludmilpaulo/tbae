from __future__ import annotations
import uuid
from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from slugify import slugify

User = get_user_model()

# ---- helpers (no lambdas) ----------------------------------------------------
def gen_token() -> str:
    return uuid.uuid4().hex

def subscriber_tags_default():
    # explicit factory so Django can serialize it in migrations
    return []

def gallery_upload_to(instance, filename):  # keep if you ever add upload_to later
    return f"gallery/{getattr(instance, 'id', 'misc')}/{filename}"

# ------------------------------------------------------------------------------
class List(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True, max_length=140, db_index=True)
    created_by = models.ForeignKey(
        User, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="newsletter_lists"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *a, **kw):
        if not self.slug:
            self.slug = slugify(f"{self.name}-{uuid.uuid4().hex[:6]}")
        return super().save(*a, **kw)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Subscriber(models.Model):
    list = models.ForeignKey(List, related_name="subscribers", on_delete=models.CASCADE)
    email = models.EmailField(db_index=True)
    first_name = models.CharField(max_length=120, blank=True)
    last_name = models.CharField(max_length=120, blank=True)
    tags = models.JSONField(default=subscriber_tags_default, blank=True)
    is_confirmed = models.BooleanField(default=False)
    confirm_token = models.CharField(max_length=64, default=gen_token, unique=True)
    unsubscribe_token = models.CharField(max_length=64, default=gen_token, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    client_date_added = models.DateField(null=True, blank=True)
    contact_date_added = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ("list", "email")
        ordering = ["email"]

    def __str__(self):
        return f"{self.email} [{self.list.slug}]"


class Template(models.Model):
    name = models.CharField(max_length=120)
    subject = models.CharField(max_length=240)
    html = models.TextField()
    created_by = models.ForeignKey(
        User, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="newsletter_templates"
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Campaign(models.Model):
    DRAFT, SCHEDULED, SENDING, SENT, CANCELLED = ("draft", "scheduled", "sending", "sent", "cancelled")
    STATUS_CHOICES = [
        (DRAFT, "Draft"),
        (SCHEDULED, "Scheduled"),
        (SENDING, "Sending"),
        (SENT, "Sent"),
        (CANCELLED, "Cancelled"),
    ]

    name = models.CharField(max_length=160, db_index=True)
    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name="campaigns")
    template = models.ForeignKey(Template, on_delete=models.PROTECT, related_name="campaigns")
    from_email = models.EmailField()
    scheduled_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=DRAFT, db_index=True)
    created_by = models.ForeignKey(
        User, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="newsletter_campaigns"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def is_scheduled_future(self):
        return bool(self.scheduled_at and self.scheduled_at > timezone.now())

    def __str__(self):
        return self.name


class Delivery(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="deliveries")
    subscriber = models.ForeignKey(Subscriber, on_delete=models.CASCADE, related_name="deliveries")
    token = models.CharField(max_length=64, unique=True, default=gen_token)
    message_id = models.CharField(max_length=255, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    bounce_reason = models.TextField(blank=True)
    complaint_at = models.DateTimeField(null=True, blank=True)
    unique_clicks = models.IntegerField(default=0)

    class Meta:
        unique_together = ("campaign", "subscriber")
        indexes = [
            models.Index(fields=["campaign", "sent_at"]),
            models.Index(fields=["token"]),
        ]


# --- CSV Import Jobs (to satisfy ImportCard + ImportHistoryTable UIs) ---
class ImportJob(models.Model):
    PENDING, VALIDATING, PROCESSING, COMPLETED, FAILED = ("pending", "validating", "processing", "completed", "failed")
    STATUS_CHOICES = [
        (PENDING, "pending"),
        (VALIDATING, "validating"),
        (PROCESSING, "processing"),
        (COMPLETED, "completed"),
        (FAILED, "failed"),
    ]

    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name="import_jobs")
    created_by = models.ForeignKey(
        User, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="newsletter_import_jobs"
    )
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=PENDING, db_index=True)
    note = models.CharField(max_length=240, blank=True)
    rows_total = models.IntegerField(default=0)
    rows_created = models.IntegerField(default=0)
    rows_updated = models.IntegerField(default=0)
    rows_skipped = models.IntegerField(default=0)
    rows_errors = models.IntegerField(default=0)
    error_report = models.URLField(blank=True)  # could be a path in storage
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"ImportJob #{self.id} ({self.status})"
