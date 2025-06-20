from django.contrib import admin
from .models import Province, Town, Venue, VenueImage
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin

class VenueImageInline(SortableInlineAdminMixin, admin.TabularInline):
    model = VenueImage
    extra = 1
    readonly_fields = ("preview",)

    def preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="width:120px;height:auto;"/>'
        return ""
    preview.allow_tags = True

@admin.register(Venue)
class VenueAdmin(SortableAdminMixin, admin.ModelAdmin):
    inlines = [VenueImageInline]
    list_display = ("name", "province", "town")
    search_fields = ("name", "description", "town__name", "province__name")

@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    search_fields = ("name",)

@admin.register(Town)
class TownAdmin(admin.ModelAdmin):
    list_display = ("name", "province")
    search_fields = ("name", "province__name")
