from django.contrib import admin
from django.utils.html import mark_safe
from .models import Activity, ActivityCategory, Brochure

admin.site.register(Brochure)

@admin.register(ActivityCategory)
class ActivityCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "order")
    ordering = ("order",)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "duration", "physical_intensity", "is_premium", "thumbnail")
    list_filter = ("category", "is_premium")
    search_fields = ("title", "short_description")
    prepopulated_fields = {"slug": ("title",)}

    def thumbnail(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="60" height="40" style="object-fit:cover; border-radius:6px;" />')
        return "-"
    thumbnail.short_description = "Image"
