import os

from django.conf import settings

try:
    from celery import Celery
except Exception:  # Celery not installed
    Celery = None  # type: ignore[misc]

app = Celery("newsletter") if Celery else None

if app:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    app.config_from_object("django.conf:settings", namespace="CELERY")
    app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
