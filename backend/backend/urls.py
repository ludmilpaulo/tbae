from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("bookings/", include("bookings.urls")),
    path("gallery/", include("gallery.urls")),
    path('api/', include('core.urls')),
    path('careers/', include('careers.urls')),
    path("quotes/", include("quotes.urls")),
    path("activities/", include("activities.urls")),
    path('venues/', include('venues.urls')), 
    path("n/", include("newsletter.urls")),  # Newsletter CRUD + campaign actions
    path("t/", include("tracking.urls")), 
    path("ingest/", include("ingest.urls")),
      
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
