from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet, ActivityCategoryViewSet, LatestBrochureView

router = DefaultRouter()
router.register(r"categories", ActivityCategoryViewSet)
router.register(r"activities", ActivityViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('brochure/latest/', LatestBrochureView.as_view(), name='latest-brochure'),
]
