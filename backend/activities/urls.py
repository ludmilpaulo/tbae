from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ActivityViewSet,
    ActivityCategoryViewSet,
    BrochureViewSet,
    LatestBrochureView,
)

router = DefaultRouter()
router.register(r"categories", ActivityCategoryViewSet, basename="activitycategory")
router.register(r"activities", ActivityViewSet, basename="activity")
router.register(r"brochures", BrochureViewSet, basename="brochure")

urlpatterns = [
    path("", include(router.urls)),
    path("brochure/latest/", LatestBrochureView.as_view(), name="latest-brochure"),
]
