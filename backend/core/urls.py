from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AboutViewSet, EventViewSet, GalleryImageViewSet, HomepageViewSet, TestimonialViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'gallery', GalleryImageViewSet)
router.register(r'about', AboutViewSet)
router.register(r'homepage', HomepageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
