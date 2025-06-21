# gallery/admin.py

from django.contrib import admin
from .models import GalleryCategory, GalleryEvent, GalleryPhoto, GalleryVideo

class GalleryPhotoInline(admin.TabularInline):
    model = GalleryPhoto
    extra = 1
    fields = ["image", "caption", "order", "thumbnail"]
    readonly_fields = ["thumbnail"]
    ordering = ["order"]
    def thumbnail(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="width:80px;height:auto;border-radius:5px" />'
        return ""
    thumbnail.allow_tags = True

class GalleryVideoInline(admin.TabularInline):
    model = GalleryVideo
    extra = 1
    fields = ["youtube_url", "caption", "order", "preview"]
    readonly_fields = ["preview"]
    ordering = ["order"]
    def preview(self, obj):
        if obj.youtube_url:
            from django.utils.html import format_html
            import re
            match = re.search(r"(?:v=|be/|embed/|shorts/)([\w\-]+)", obj.youtube_url)
            vid_id = match.group(1) if match else None
            if vid_id:
                return format_html(
                    '<img src="https://img.youtube.com/vi/{}/hqdefault.jpg" style="width:90px;border-radius:5px"/>', vid_id
                )
        return ""
    preview.allow_tags = True

@admin.register(GalleryEvent)
class GalleryEventAdmin(admin.ModelAdmin):
    list_display = ("title", "event_type", "year", "date", "category")
    list_filter = ("event_type", "year", "category")
    search_fields = ("title", "description", "tags")
    inlines = [GalleryPhotoInline, GalleryVideoInline]

@admin.register(GalleryCategory)
class GalleryCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "display_name")
    search_fields = ("name",)

# Optional: register photos/videos if you want direct access
@admin.register(GalleryPhoto)
class GalleryPhotoAdmin(admin.ModelAdmin):
    list_display = ("event", "caption", "order")
    list_filter = ("event",)
    ordering = ("event", "order")

@admin.register(GalleryVideo)
class GalleryVideoAdmin(admin.ModelAdmin):
    list_display = ("event", "caption", "order")
    list_filter = ("event",)
    ordering = ("event", "order")
