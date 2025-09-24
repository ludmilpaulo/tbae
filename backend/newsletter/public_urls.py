from django.urls import path
from . import public_views as v

urlpatterns = [
    path("subscribe/", v.subscribe, name="nl-public-subscribe"),
    path("confirm/<str:token>/", v.confirm, name="nl-public-confirm"),
    path("unsubscribe/<str:token>/", v.unsubscribe, name="nl-public-unsubscribe"),
]
