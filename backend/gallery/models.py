# gallery/models.py

from django.db import models

EVENT_TYPES = [
    ("indoor", "Indoor"),
    ("outdoor", "Outdoor"),
    ("virtual", "Virtual"),
    ("other", "Other"),
]

class GalleryCategory(models.Model):
    name = models.CharField(max_length=64, unique=True)
    display_name = models.CharField(max_length=128, blank=True)
    def __str__(self):
        return self.display_name or self.name

class GalleryEvent(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    event_type = models.CharField(max_length=16, choices=EVENT_TYPES, db_index=True)
    category = models.ForeignKey(GalleryCategory, null=True, blank=True, on_delete=models.SET_NULL, related_name="events")
    year = models.PositiveIntegerField(db_index=True)
    date = models.DateField(null=True, blank=True)
    tags = models.CharField(max_length=200, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-id"]

    def __str__(self):
        return f"{self.title} ({self.year})"

class GalleryPhoto(models.Model):
    event = models.ForeignKey(GalleryEvent, related_name="photos", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="gallery/photos/")
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    def __str__(self):
        return f"Photo: {self.event.title}"

    class Meta:
        ordering = ["order"]

class GalleryVideo(models.Model):
    event = models.ForeignKey(GalleryEvent, related_name="videos", on_delete=models.CASCADE)
    youtube_url = models.URLField()
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    def __str__(self):
        return f"Video: {self.event.title}"

    class Meta:
        ordering = ["order"]
