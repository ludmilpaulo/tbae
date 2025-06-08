from rest_framework import viewsets
from .models import Event, GalleryImage, Testimonial
from .serializers import EventSerializer, GalleryImageSerializer, TestimonialSerializer

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all().order_by("-date")
    serializer_class = EventSerializer

class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    
    
class GalleryImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
