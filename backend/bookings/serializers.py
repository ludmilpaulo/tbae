from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id", "venue", "name", "email", "phone", "check_in",
            "check_out", "group_size", "total_price", "message", "created_at"
        ]
        read_only_fields = ("total_price", "id", "created_at")

