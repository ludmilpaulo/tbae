from django.urls import path
from .views import QuoteRequestCreateView

urlpatterns = [
    path('request/', QuoteRequestCreateView.as_view(), name="quote-request"),
]
