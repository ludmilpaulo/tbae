import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# --- Security / Env ---
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-secret")  # override in prod via Secret Manager
DEBUG = os.environ.get("DEBUG", "false").lower() == "true"

# For first boot you can keep "*", then tighten to your run.app / custom domains
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(",")

# --- Apps ---
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "django_filters",
    "careers",
    "venues",
    "bookings",
    "gallery",
    "quotes",
    "core",
    "activities",
    "storages",  # for GCS media
]

REST_FRAMEWORK = {
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"]
}

# --- Middleware (Whitenoise for static) ---
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [BASE_DIR / "templates"],
    "APP_DIRS": True,
    "OPTIONS": {
        "context_processors": [
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
        ],
    },
}]

WSGI_APPLICATION = "backend.wsgi.application"

# --- CORS ---
CORS_ALLOW_ALL_ORIGINS = os.environ.get("CORS_ALLOW_ALL", "false").lower() == "true"
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://www.tbae.co.za",
]
CORS_ALLOW_CREDENTIALS = True

# --- Database (Cloud SQL via DATABASE_URL; sqlite fallback for local) ---
DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get("DATABASE_URL", f"sqlite:///{BASE_DIR / 'db.sqlite3'}"),
        conn_max_age=600,
    )
}

# --- Auth validators ---
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --- I18N ---
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- Static & Media ---
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Use Google Cloud Storage for media
DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
GS_BUCKET_NAME = os.environ.get("GS_BUCKET_NAME")           # e.g., funnamics-media
GS_LOCATION = os.environ.get("GS_LOCATION", "media")        # optional folder prefix

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"  # only used if not using GCS

# --- Security behind Cloud Run proxy ---
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
CSRF_TRUSTED_ORIGINS = [
    "https://www.tbae.co.za",
] + [d for d in os.environ.get("CSRF_EXTRA", "").split(",") if d]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- Email (read from env / secrets in Cloud Run) ---
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "support@tbae.co.za")
EMAIL_HOST = os.environ.get("EMAIL_HOST", "uk71.siteground.eu")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "465"))
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "false").lower() == "true"
EMAIL_USE_SSL = os.environ.get("EMAIL_USE_SSL", "true").lower() == "true"
