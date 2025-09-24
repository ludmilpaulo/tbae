from __future__ import annotations
from django.db import models
from django.utils import timezone
from newsletter.models import Delivery

class Click(models.Model):
    delivery = models.ForeignKey(Delivery, related_name="clicks", on_delete=models.CASCADE)
    url = models.TextField()
    ts = models.DateTimeField(default=timezone.now)

class Open(models.Model):
    delivery = models.OneToOneField(Delivery, related_name="open", on_delete=models.CASCADE)
    ts = models.DateTimeField(default=timezone.now)
