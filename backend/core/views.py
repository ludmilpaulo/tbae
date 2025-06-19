from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from .models import About, Event, GalleryImage, Homepage, Testimonial
from .serializers import AboutSerializer, EventSerializer, GalleryImageSerializer, HomepageSerializer, TestimonialSerializer

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all().order_by("-date")
    serializer_class = EventSerializer

class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    
    
class GalleryImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    
    
class AboutViewSet(ModelViewSet):
    queryset = About.objects.all()
    serializer_class = AboutSerializer

class HomepageViewSet(ModelViewSet):
    queryset = Homepage.objects.all()
    serializer_class = HomepageSerializer
