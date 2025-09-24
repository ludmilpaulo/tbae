from django.contrib import admin
from .models import List, Subscriber, Template, Campaign, Delivery

@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ("id","name","slug","created_by","created_at")
    search_fields = ("name","slug")
    prepopulated_fields = {}

@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ("id","email","list","is_confirmed","unsubscribed_at","created_at")
    list_filter = ("list","is_confirmed")
    search_fields = ("email","first_name","last_name","tags")

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ("id","name","subject","updated_at","created_by")
    search_fields = ("name","subject")

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ("id","name","list","template","from_email","status","scheduled_at","created_at")
    list_filter = ("status","list","template")
    search_fields = ("name","from_email")

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ("id","campaign","subscriber","sent_at","opened_at","clicked_at","unique_clicks")
    search_fields = ("campaign__name","subscriber__email","token")
    list_filter = ("campaign",)
