# activities/serializers.py

from rest_framework import serializers
from .models import Activity, ActivityCategory

class ActivityCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityCategory
        fields = ("id", "name", "order")

class ActivitySerializer(serializers.ModelSerializer):
    category = ActivityCategorySerializer()
    class Meta:
        model = Activity
        fields = (
            "id", "title", "slug", "short_description", "description", "duration",
            "physical_intensity", "main_outcomes", "category", "is_premium", "image", "brochure_page"
        )
