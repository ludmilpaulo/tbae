from django.contrib import admin
from .models import QuoteRequest

@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "event_type", "created")
    search_fields = ("name", "email", "company", "message")
  
