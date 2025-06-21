from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .faq_views import AskFAQView, FAQCategoryList, FAQList
from .views import AboutViewSet, GalleryImageViewSet, HomepageViewSet, TestimonialViewSet

router = DefaultRouter()
router.register(r'testimonials', TestimonialViewSet)
router.register(r'gallery', GalleryImageViewSet)
router.register(r'about', AboutViewSet)
router.register(r'homepage', HomepageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # FAQ Endpoints:
    path("faqs/", FAQList.as_view(), name="faq-list"),                         # /api/faqs/
    path("faqs/categories/", FAQCategoryList.as_view(), name="faq-category-list"),  # /api/faqs/categories/
    path("faqs/ask/", AskFAQView.as_view(), name='faq-ask'),                   # /api/faqs/ask/
]
