# gallery/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("items/", views.GalleryEventList.as_view(), name="gallery-event-list"),
    path("categories/", views.GalleryCategoryList.as_view(), name="gallery-category-list"),
    path("years/", views.GalleryYearsList.as_view(), name="gallery-years-list"),
]
