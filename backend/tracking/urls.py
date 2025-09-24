from django.urls import path
from . import views

urlpatterns = [
    path("o/<str:token>.png", views.open_pixel, name="track-open"),
    path("c/<str:token>/", views.click_redirect, name="track-click"),
]
