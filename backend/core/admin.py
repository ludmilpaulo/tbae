# backend/faq/admin.py

from django.contrib import admin
from .models import FAQ, Client, FAQCategory

@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "order")
    ordering = ("order", "name")
    search_fields = ("name",)

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "category", "order", "is_active")
    list_filter = ("category", "is_active")
    ordering = ("category__order", "order")
    search_fields = ("question", "answer")

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("name", "order", "website")
    list_editable = ("order",)
    search_fields = ("name",)