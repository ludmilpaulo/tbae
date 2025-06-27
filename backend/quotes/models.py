from django.db import models

EVENT_TYPES = [
    ("Team Building", "Team Building"),
    ("Corporate Event", "Corporate Event"),
    ("Workshop", "Workshop"),
    ("Virtual Event", "Virtual Event"),
    ("Other", "Other"),
]

class QuoteRequest(models.Model):
    name = models.CharField(max_length=120)
    company = models.CharField(max_length=120, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    event_type = models.CharField(max_length=32, choices=EVENT_TYPES)
    venue = models.CharField(max_length=120, blank=True)
    date = models.DateField(null=True, blank=True)
    message = models.TextField()
    spam = models.CharField(max_length=64, blank=True)   # Honeypot
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email}) — {self.event_type}"
