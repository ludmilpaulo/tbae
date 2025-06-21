from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("bookings/", include("bookings.urls")),
    path("gallery/", include("gallery.urls")),
    path('api/', include('core.urls')),
    path('venues/', include('venues.urls')),  # Add this line for the venues API
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
