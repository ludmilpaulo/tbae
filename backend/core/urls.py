from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .contact_views import ContactRequestCreateView

from .about_views import AboutDetailView, StatListView, TeamMemberListView, TimelineEventListView

from .client_views import ClientListAPIView

from .faq_views import AskFAQView, FAQCategoryList, FAQList
from .views import  GalleryImageViewSet, HomepageViewSet, TestimonialViewSet

router = DefaultRouter()
router.register(r'testimonials', TestimonialViewSet)
router.register(r'gallery', GalleryImageViewSet)

router.register(r'homepage', HomepageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("contact/", ContactRequestCreateView.as_view(), name="contact-request"),
    path("about/", AboutDetailView.as_view(), name="about"),
    path("about/stats/", StatListView.as_view(), name="about-stats"),
    path("about/timeline/", TimelineEventListView.as_view(), name="about-timeline"),
    path("about/team/", TeamMemberListView.as_view(), name="about-team"),
    path('clients/', ClientListAPIView.as_view(), name='client-list'),
    path("faqs/", FAQList.as_view(), name="faq-list"),                         # /api/faqs/
    path("faqs/categories/", FAQCategoryList.as_view(), name="faq-category-list"),  # /api/faqs/categories/
    path("faqs/ask/", AskFAQView.as_view(), name='faq-ask'),                   # /api/faqs/ask/
]
