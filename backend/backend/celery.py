import os
try:
    from celery import Celery  # type: ignore
except Exception:
    Celery = None  # type: ignore[assignment]

if Celery is None:
    class _NoopCeleryApp:
        def task(self, *args, **kwargs):
            def _decorator(func):
                return func
            return _decorator
        def autodiscover_tasks(self, *args, **kwargs):
            return []

    app = _NoopCeleryApp()  # type: ignore[assignment]
else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    app = Celery("backend")
    app.config_from_object("django.conf:settings", namespace="CELERY")
    app.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "memory://")
    app.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND")
    app.autodiscover_tasks()
