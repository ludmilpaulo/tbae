from rest_framework import serializers
from .models import About, GalleryImage, Homepage, Testimonial
# backend/faq/serializers.py

from .models import FAQ, FAQCategory
from .models import Client
from rest_framework import serializers
from rest_framework import serializers
from .models import Stat, TimelineEvent, TeamMember, About
from .models import ContactRequest

class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = ['id', 'name', 'email', 'phone', 'message', 'created_at', 'responded']
        read_only_fields = ['id', 'created_at', 'responded']

class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = ['id', 'label', 'value']

class TimelineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineEvent
        fields = ['id', 'year', 'title', 'desc']

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'photo', 'bio']

class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = [
            'id', 'content', 'facebook_url', 'twitter_url', 'instagram_url',
            'linkedin_url', 'youtube_url', 'tiktok_url', 'whatsapp_url', 'pinterest_url'
        ]


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["id", "name", "logo", "website", "order"]

class FAQCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQCategory
        fields = ["id", "name", "order"]

class FAQSerializer(serializers.ModelSerializer):
    category = FAQCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=FAQCategory.objects.all(), source="category", write_only=True, required=False
    )

    class Meta:
        model = FAQ
        fields = ["id", "category", "category_id", "question", "answer", "order", "is_active"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = "__all__"
        
        
class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = "__all__"

class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = '__all__'

class HomepageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homepage
        fields = '__all__'
