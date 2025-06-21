from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from .models import About, GalleryImage, Homepage, Testimonial
from .serializers import AboutSerializer, GalleryImageSerializer, HomepageSerializer, TestimonialSerializer



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
