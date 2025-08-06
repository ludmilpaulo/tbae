from django.contrib import admin
from .models import Province, Town, Venue, VenueImage

# Inline for Venue Images
class VenueImageInline(admin.TabularInline):
    model = VenueImage
    extra = 1
    fields = ('image', 'caption')  # 'order' removed because it's non-editable
    readonly_fields = ('order',)   # optional: display order as read-only
    ordering = ('order',)

# Admin for Venue
@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'province', 'town', 'price')
    list_filter = ('province', 'town')
    search_fields = ('name', 'description', 'details')
    inlines = [VenueImageInline]

# Admin for Province
@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Admin for Town
@admin.register(Town)
class TownAdmin(admin.ModelAdmin):
    list_display = ('name', 'province')
    list_filter = ('province',)
    search_fields = ('name',)

# Admin for VenueImage (optional, mostly managed inline)
@admin.register(VenueImage)
class VenueImageAdmin(admin.ModelAdmin):
    list_display = ('venue', 'caption', 'order')
    list_filter = ('venue',)
    search_fields = ('caption',)
    readonly_fields = ('order',)  # ensure no errors in forms
