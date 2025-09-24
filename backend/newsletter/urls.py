from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ListViewSet, SubscriberViewSet, TemplateViewSet, CampaignViewSet

router = DefaultRouter()
router.register("lists", ListViewSet, basename="nl-lists")
router.register("subscribers", SubscriberViewSet, basename="nl-subscribers")
router.register("templates", TemplateViewSet, basename="nl-templates")
router.register("campaigns", CampaignViewSet, basename="nl-campaigns")

urlpatterns = [path("", include(router.urls))]
