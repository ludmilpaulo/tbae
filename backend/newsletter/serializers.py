from __future__ import annotations
from rest_framework import serializers
from .models import List, Subscriber, Template, Campaign

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = "__all__"

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = "__all__"

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = "__all__"

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = "__all__"

class CampaignSendSerializer(serializers.Serializer):
    mode = serializers.ChoiceField(choices=[("all", "all"), ("selected", "selected")], default="all")
    subscribers = serializers.ListField(child=serializers.IntegerField(min_value=1), required=False, allow_empty=False)

    def validate(self, attrs):
        if attrs.get("mode") == "selected" and not attrs.get("subscribers"):
            raise serializers.ValidationError("subscribers is required when mode='selected'")
        return attrs
