from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from venues.models import Venue
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from datetime import datetime


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().select_related("venue")
    serializer_class = BookingSerializer


class BookingCreateAPIView(generics.CreateAPIView):
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        venue_id = data.get("venue")
        check_in = data.get("check_in")
        check_out = data.get("check_out")
        group_size = data.get("group_size")
        # Validate venue
        try:
            venue = Venue.objects.get(pk=venue_id)
        except Venue.DoesNotExist:
            return Response(
                {"detail": "Venue not found."}, status=status.HTTP_400_BAD_REQUEST
            )
        # Validate dates
        try:
            check_in_date = datetime.strptime(check_in, "%Y-%m-%d").date()
            check_out_date = datetime.strptime(check_out, "%Y-%m-%d").date()
        except Exception:
            return Response(
                {"detail": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST
            )
        nights = (check_out_date - check_in_date).days
        if nights <= 0:
            return Response(
                {"detail": "Check-out must be after check-in."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Calculate price
        price_per_day = venue.price or 0
        total_price = price_per_day * nights

        serializer = self.get_serializer(
            data={**data, "venue": venue.id, "total_price": total_price}
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        booking = serializer.instance

        # Send email to user
        try:
            html_content = render_to_string(
                "bookings/booking_confirmation_email.html",
                {
                    "booking": booking,
                    "venue": venue,
                    "price_per_day": price_per_day,
                    "nights": nights,
                    "total": total_price,
                    "company": "TBAE Team Building",
                    "company_email": settings.DEFAULT_FROM_EMAIL,
                    "company_phone": "+27 (0)12 345 6789",
                    "company_logo": "https://www.tbae.co.za/logo.png",  # update to your logo
                },
            )
            subject = f"Booking Confirmation — {venue.name}"
            msg = EmailMultiAlternatives(
                subject, "", settings.DEFAULT_FROM_EMAIL, [booking.email]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()
        except Exception as e:
            # Optional: log error, but do not block booking
            print("Failed to send booking email:", e)

        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "booking": serializer.data,
                "breakdown": {
                    "price_per_day": price_per_day,
                    "nights": nights,
                    "total": total_price,
                },
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )
