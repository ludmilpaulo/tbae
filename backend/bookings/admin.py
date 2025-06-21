from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("venue", "name", "check_in", "check_out", "total_price", "confirmed")
    list_filter = ("confirmed", "venue", "check_in")
    search_fields = ("name", "email", "phone", "venue__name")
    readonly_fields = ("total_price", "created_at")
