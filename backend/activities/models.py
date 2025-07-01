# activities/models.py

from django.db import models
from django.utils.text import slugify

class ActivityCategory(models.Model):
    name = models.CharField(max_length=64, unique=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["order", "name"]

class Activity(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    short_description = models.CharField(max_length=300)
    description = models.TextField()  # Allow HTML
    duration = models.CharField(max_length=100, blank=True)
    physical_intensity = models.CharField(max_length=100, blank=True)
    main_outcomes = models.CharField(max_length=255, blank=True)
    category = models.ForeignKey(ActivityCategory, related_name="activities", on_delete=models.SET_NULL, null=True, blank=True)
    is_premium = models.BooleanField(default=False)
    image = models.ImageField(upload_to="activities/images/", blank=True, null=True)
    brochure_page = models.PositiveIntegerField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["order", "title"]
