from django.contrib import admin
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin

from .models import (
    FAQCategory, FAQ, Testimonial, GalleryImage, Stat,
    TimelineEvent, TeamMember, About, ContactRequest,
    Homepage, Client
)



# ========== ADMIN CLASSES ==========
class FAQInline(SortableInlineAdminMixin, admin.TabularInline):
    model = FAQ
    extra = 1
    fields = ('question', 'is_active', 'order')
    ordering = ('order',)
    show_change_link = True


@admin.register(FAQCategory)
class FAQCategoryAdmin(SortableAdminMixin, admin.ModelAdmin):  # Must inherit SortableAdminMixin!
    list_display = ('name', 'order')
    inlines = [FAQInline]
    ordering = ('order', 'name')
    search_fields = ('name',)


@admin.register(FAQ)
class FAQAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('question', 'category', 'is_active', 'order')
    list_filter = ('category', 'is_active')
    search_fields = ('question', 'answer')
    ordering = ('category__order', 'order')

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'preview_avatar')
    search_fields = ('name', 'company', 'feedback')
    
    def preview_avatar(self, obj):
        if obj.avatar:
            return f"<img src='{obj.avatar.url}' width='50' height='50' style='object-fit:cover;' />"
        return "-"
    preview_avatar.allow_tags = True
    preview_avatar.short_description = "Avatar"


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'url')
    search_fields = ('title', 'alt')


@admin.register(Stat)
class StatAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('label', 'value', 'order')
    ordering = ('order',)
    search_fields = ('label',)


@admin.register(TimelineEvent)
class TimelineEventAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('year', 'title', 'order')
    ordering = ('order', 'year')
    search_fields = ('title', 'desc')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'order')
    search_fields = ('name', 'role', 'bio')
    ordering = ('order', 'name')


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ('__str__',)
    fieldsets = (
        ('Main Content', {'fields': ('content',)}),
        ('Social Media Links', {
            'fields': (
                'facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url',
                'youtube_url', 'tiktok_url', 'whatsapp_url', 'pinterest_url'
            )
        }),
    )


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at', 'responded')
    search_fields = ('name', 'email', 'phone', 'message')
    list_filter = ('responded', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Homepage)
class HomepageAdmin(admin.ModelAdmin):
    list_display = ('bannerTitle', 'bannerImage')
    search_fields = ('bannerTitle',)


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):  # remove SortableAdminMixin if not needed!
    list_display = ('name', 'website', 'order')
    ordering = ('order',)
    search_fields = ('name', 'website')

