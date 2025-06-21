from django.db import models
from venues.models import Venue  # assuming your venue app is named 'venues'
from django.utils import timezone

class Booking(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="bookings")
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=40)
    group_size = models.PositiveIntegerField()
    check_in = models.DateField()
    check_out = models.DateField()
    message = models.TextField(blank=True)
    total_price = models.DecimalField(default=100, max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed = models.BooleanField(default=False)  # for manual admin approval

    def __str__(self):
        return f"{self.name} ({self.venue.name}) {self.check_in} – {self.check_out}"

    def nights(self):
        # Exclusive of check-out date
        return max((self.check_out - self.check_in).days, 0)

    def breakdown(self):
        price_per_day = self.venue.price or 0
        nights = self.nights()
        return {
            "price_per_day": price_per_day,
            "nights": nights,
            "group_size": self.group_size,
            "total": price_per_day * nights,
        }
