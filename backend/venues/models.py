from django.db import models
from adminsortable2.admin import SortableInlineAdminMixin


class Province(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class Town(models.Model):
    name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, related_name="towns", on_delete=models.CASCADE)
    class Meta:
        unique_together = ("name", "province")
    def __str__(self):
        return f"{self.name} ({self.province.name})"

class Venue(models.Model):
    name = models.CharField(max_length=200)
    province = models.ForeignKey(Province, on_delete=models.PROTECT, related_name='venues')
    town = models.ForeignKey(Town, on_delete=models.PROTECT, related_name='venues')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField(blank=True)
    details = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    def __str__(self):
        return f"{self.name} ({self.town.name}, {self.province.name})"

    class Meta:
        ordering = ['name']  # or whatever field(s) you want


class VenueImage(models.Model):
    venue = models.ForeignKey(Venue, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='venues/images/')
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0, editable=False, db_index=True)
    class Meta:
        ordering = ['order']
    def __str__(self):
        return f"Image for {self.venue.name}"
