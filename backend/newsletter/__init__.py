# Optional Celery hookup; safe even if Celery is not installed.
try:
    from .celery import app as celery_app  # noqa: F401
except Exception:
    celery_app = None
