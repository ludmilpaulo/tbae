# venues/serializers.py

from rest_framework import serializers
from .models import Province, Town, Venue, VenueImage


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ["id", "name"]


class TownSerializer(serializers.ModelSerializer):
    province = ProvinceSerializer(read_only=True)
    province_id = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(), source="province", write_only=True
    )

    class Meta:
        model = Town
        fields = ["id", "name", "province", "province_id"]


class VenueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueImage
        fields = ["id", "venue", "image", "caption", "order"]


class VenueSerializer(serializers.ModelSerializer):
    province = ProvinceSerializer(read_only=True)
    town = TownSerializer(read_only=True)
    images = VenueImageSerializer(many=True, read_only=True)
    province_id = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(),
        source="province",
        write_only=True,
        required=False,
    )
    town_id = serializers.PrimaryKeyRelatedField(
        queryset=Town.objects.all(), source="town", write_only=True, required=False
    )

    class Meta:
        model = Venue
        fields = [
            "id",
            "name",
            "province",
            "province_id",
            "town",
            "town_id",
            "price",
            "description",
            "details",
            "latitude",
            "longitude",
            "images",
        ]
