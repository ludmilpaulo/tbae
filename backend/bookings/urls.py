from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingCreateAPIView, BookingViewSet

router = DefaultRouter()
router.register(r"bookings", BookingViewSet, basename="booking")

urlpatterns = [
    path("create/", BookingCreateAPIView.as_view(), name="booking-create"),
    path("", include(router.urls)),
]
