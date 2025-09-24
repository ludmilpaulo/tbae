from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ListViewSet, SubscriberViewSet, TemplateViewSet, CampaignViewSet,
    ImportJobViewSet, ImportCreateView,
    unsubscribe_public, track_open, track_click,
)

app_name = "newsletter"  # allows namespacing if included with namespace

router = DefaultRouter()
router.register("lists", ListViewSet, basename="nl-lists")
router.register("subscribers", SubscriberViewSet, basename="nl-subscribers")
router.register("templates", TemplateViewSet, basename="nl-templates")
router.register("campaigns", CampaignViewSet, basename="nl-campaigns")
router.register("import-jobs", ImportJobViewSet, basename="nl-import-jobs")

urlpatterns = [
    path("", include(router.urls)),

    # Import create (multipart form-data)
    path("import/create/", ImportCreateView.as_view(), name="nl-import-create"),

    # Public tracking/unsubscribe endpoints (names must match utils.py)
    path("nl/unsubscribe/<str:token>/", unsubscribe_public, name="nl-unsubscribe"),
    path("nl/open/<str:token>/",        track_open,        name="nl-open"),
    path("nl/click/<str:token>/",       track_click,       name="nl-click"),
]
