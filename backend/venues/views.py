# venues/views.py

from rest_framework import viewsets, generics
from .models import Province, Town, Venue, VenueImage
from .serializers import (
    ProvinceSerializer,
    TownSerializer,
    VenueSerializer,
    VenueImageSerializer,
)


class ProvinceViewSet(viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer


class TownViewSet(viewsets.ModelViewSet):
    serializer_class = TownSerializer

    def get_queryset(self):
        queryset = Town.objects.all()
        province_id = self.request.query_params.get("province")
        if province_id:
            queryset = queryset.filter(province_id=province_id)
        return queryset


class VenueViewSet(viewsets.ModelViewSet):
    serializer_class = VenueSerializer

    def get_queryset(self):
        queryset = Venue.objects.all()
        province_id = self.request.query_params.get("province")
        town_id = self.request.query_params.get("town")
        if province_id:
            queryset = queryset.filter(province_id=province_id)
        if town_id:
            queryset = queryset.filter(town_id=town_id)
        return queryset


class VenueImageViewSet(viewsets.ModelViewSet):
    queryset = VenueImage.objects.all()
    serializer_class = VenueImageSerializer
