from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"provinces", views.ProvinceViewSet, basename="province")
router.register(r"towns", views.TownViewSet, basename="town")
router.register(r"venues", views.VenueViewSet, basename="venue")
router.register(r"venueimages", views.VenueImageViewSet, basename="venueimage")

urlpatterns = [
    # For DRF viewsets (CRUD, filtering, etc.)
    *router.urls,
]
