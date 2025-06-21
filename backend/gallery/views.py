# gallery/views.py

from rest_framework import generics, filters
from rest_framework.response import Response
from .models import GalleryEvent, GalleryCategory
from .serializers import GalleryEventSerializer, GalleryCategorySerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

class GalleryEventPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = "page_size"
    max_page_size = 50

class GalleryEventList(generics.ListAPIView):
    serializer_class = GalleryEventSerializer
    pagination_class = GalleryEventPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["event_type", "year", "category"]
    search_fields = ["title", "description", "tags"]
    ordering_fields = ["date", "year"]

    def get_queryset(self):
        qs = GalleryEvent.objects.prefetch_related("photos", "videos", "category").all()
        event_type = self.request.GET.get("event_type")
        year = self.request.GET.get("year")
        if event_type:
            qs = qs.filter(event_type=event_type)
        if year:
            qs = qs.filter(year=year)
        return qs

class GalleryCategoryList(generics.ListAPIView):
    queryset = GalleryCategory.objects.all()
    serializer_class = GalleryCategorySerializer

class GalleryYearsList(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        years = GalleryEvent.objects.values_list("year", flat=True).distinct().order_by("-year")
        return Response(list(years))
