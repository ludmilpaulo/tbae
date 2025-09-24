from __future__ import annotations
from typing import Optional, List as TList
from rest_framework import serializers
from django.utils import timezone
from .models import List, Subscriber, Template, Campaign, Delivery, ImportJob

class ListSerializer(serializers.ModelSerializer):
    subscribers_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = List
        fields = ["id","name","slug","created_by","created_at","updated_at","subscribers_count"]
        read_only_fields = ["created_by","created_at","updated_at","subscribers_count"]

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ["id","list","email","first_name","last_name","tags","is_confirmed",
                  "confirm_token","unsubscribe_token","created_at","unsubscribed_at",
                  "client_date_added","contact_date_added"]
        read_only_fields = ["confirm_token","unsubscribe_token","created_at","unsubscribed_at"]

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ["id","name","subject","html","created_by","updated_at"]
        read_only_fields = ["created_by","updated_at"]

class CampaignSerializer(serializers.ModelSerializer):
    deliveries_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Campaign
        fields = ["id","name","list","template","from_email","scheduled_at","status","created_by","created_at","deliveries_count"]
        read_only_fields = ["status","created_by","created_at","deliveries_count"]

class CampaignSendSerializer(serializers.Serializer):
    mode = serializers.ChoiceField(choices=[("all","all"),("selected","selected")])
    subscribers = serializers.ListField(child=serializers.IntegerField(), required=False)
    def validate(self, attrs):
        if attrs["mode"] == "selected" and not attrs.get("subscribers"):
            raise serializers.ValidationError("Provide 'subscribers' for mode=selected.")
        return attrs

# Import job
class ImportJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImportJob
        fields = ["id","status","created_at","started_at","finished_at","rows_total","rows_created","rows_updated",
                  "rows_skipped","rows_errors","error_report","note","list"]
