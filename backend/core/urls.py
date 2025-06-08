from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, GalleryImageViewSet, TestimonialViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'gallery', GalleryImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
