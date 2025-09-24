from __future__ import annotations
from rest_framework import serializers
from .models import ImportJob

class ImportJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImportJob
        fields = "__all__"

class ImportJobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImportJob
        fields = ["file", "list_id", "list_slug", "create_list", "confirm_all", "dry_run", "note"]
