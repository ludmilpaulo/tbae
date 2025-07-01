# activities/admin.py

from django.contrib import admin
from .models import Activity, ActivityCategory

@admin.register(ActivityCategory)
class ActivityCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "order")
    ordering = ("order",)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "duration", "physical_intensity", "is_premium")
    list_filter = ("category", "is_premium")
    search_fields = ("title", "short_description")
    prepopulated_fields = {"slug": ("title",)}
