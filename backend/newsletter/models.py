from __future__ import annotations
import uuid
import builtins
from django.contrib.auth import get_user_model
from django.db import models
from slugify import slugify

User = get_user_model()

class List(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True, max_length=140)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.name}-{uuid.uuid4().hex[:6]}")
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name

    class Meta:
        ordering = ["name"]


class Subscriber(models.Model):
    list = models.ForeignKey(List, related_name="subscribers", on_delete=models.CASCADE)
    email = models.EmailField()
    first_name = models.CharField(max_length=120, blank=True)
    last_name = models.CharField(max_length=120, blank=True)
    # Use the built-in list callable explicitly to avoid the field name collision:
    tags = models.JSONField(default=builtins.list, blank=True)   # <- change here
    is_confirmed = models.BooleanField(default=False)
    confirm_token = models.CharField(max_length=64, default=uuid.uuid4, unique=True)
    unsubscribe_token = models.CharField(max_length=64, default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    client_date_added = models.DateField(null=True, blank=True)
    contact_date_added = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ("list", "email")
        ordering = ["email"]

    def __str__(self) -> str:
        return f"{self.email} [{self.list.slug}]"

class Template(models.Model):
    name = models.CharField(max_length=120)
    subject = models.CharField(max_length=240)
    html = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
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

    name = models.CharField(max_length=160)
    list = models.ForeignKey(List, on_delete=models.CASCADE)
    template = models.ForeignKey(Template, on_delete=models.PROTECT)
    from_email = models.EmailField()
    scheduled_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=DRAFT)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name


class Delivery(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    subscriber = models.ForeignKey(Subscriber, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True, default=uuid.uuid4)
    message_id = models.CharField(max_length=255, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    bounce_reason = models.TextField(blank=True)
    complaint_at = models.DateTimeField(null=True, blank=True)
    unique_clicks = models.IntegerField(default=0)

    class Meta:
        unique_together = ("campaign", "subscriber")
