# gallery/serializers.py

from rest_framework import serializers
from .models import GalleryEvent, GalleryPhoto, GalleryVideo, GalleryCategory

class GalleryPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryPhoto
        fields = ("id", "image", "caption", "order")

class GalleryVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryVideo
        fields = ("id", "youtube_url", "caption", "order")

class GalleryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryCategory
        fields = ("id", "name", "display_name")

class GalleryEventSerializer(serializers.ModelSerializer):
    photos = GalleryPhotoSerializer(many=True, read_only=True)
    videos = GalleryVideoSerializer(many=True, read_only=True)
    category = GalleryCategorySerializer()
    class Meta:
        model = GalleryEvent
        fields = (
            "id", "title", "description", "event_type", "category", "year",
            "date", "tags", "photos", "videos",
        )
