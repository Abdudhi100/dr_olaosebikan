# core/settings.py
from pathlib import Path
import os
from dotenv import load_dotenv
# core/settings.py
import dj_database_url

# ------------------------------------------------------------
# Base / Env
# ------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env (local/dev). In production, prefer real env vars.
load_dotenv(BASE_DIR / ".env", override=True)


def env(key: str, default=None):
    """Simple env getter with default."""
    return os.getenv(key, default)

def env_bool(key: str, default: bool = False) -> bool:
    val = env(key)
    if val is None:
        return default
    return str(val).strip().lower() in {"1", "true", "yes", "on"}

def env_list(key: str, default=None):
    if default is None:
        default = []
    raw = env(key, "")
    if not raw.strip():
        return default
    return [x.strip() for x in raw.split(",") if x.strip()]

SECRET_KEY = env("SECRET_KEY", "django-insecure-change-me")  # MUST be set in production
DEBUG = env_bool("DEBUG", False)

# ------------------------------------------------------------
# Security / Hosts (Render-safe)
# ------------------------------------------------------------
SECRET_KEY = env("SECRET_KEY", "django-insecure-change-me")  # set on Render
DEBUG = env_bool("DEBUG", False)

ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", ["127.0.0.1", "localhost"] if DEBUG else [])
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", [])

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG


# ------------------------------------------------------------
# Database (local via DB_* OR production via DATABASE_URL)
# ------------------------------------------------------------


# ------------------------------------------------------------
# Database (Render: DATABASE_URL; Local: DB_*; Absolute fallback: sqlite)
# ------------------------------------------------------------
DATABASE_URL = env("DATABASE_URL", "").strip()

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=60,
            ssl_require=not DEBUG,
        )
    }
else:
    db_engine = env("DB_ENGINE", "django.db.backends.postgresql").strip()

    # If DB_ENGINE is blank or DB_NAME missing, fall back to sqlite (dev safety)
    if not db_engine or not env("DB_NAME", "").strip():
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": BASE_DIR / "db.sqlite3",
            }
        }
    else:
        DATABASES = {
            "default": {
                "ENGINE": db_engine,
                "NAME": env("DB_NAME", ""),
                "USER": env("DB_USER", ""),
                "PASSWORD": env("DB_PASSWORD", ""),
                "HOST": env("DB_HOST", "127.0.0.1"),
                "PORT": env("DB_PORT", "5432"),
                "CONN_MAX_AGE": 60,
            }
        }



# ------------------------------------------------------------
# Core Django
# ------------------------------------------------------------
AUTH_USER_MODEL = "accounts.User"

ROOT_URLCONF = "core.urls"
WSGI_APPLICATION = "core.wsgi.application"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ------------------------------------------------------------
# Apps
# ------------------------------------------------------------
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "ckeditor",
    "django_htmx",
    "widget_tweaks",
    "whitenoise.runserver_nostatic",  # improves dev static handling w/ whitenoise
]

LOCAL_APPS = [
    "accounts",
    "appointments",
    "profiles",
    "publications",
    "core_app",
    "messaging",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

if DEBUG:
    INSTALLED_APPS += ["debug_toolbar"]

# ------------------------------------------------------------
# Middleware
# ------------------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django_htmx.middleware.HtmxMiddleware",
]

if DEBUG:
    MIDDLEWARE = ["debug_toolbar.middleware.DebugToolbarMiddleware", *MIDDLEWARE]
    INTERNAL_IPS = env_list("INTERNAL_IPS", ["127.0.0.1"])

# ------------------------------------------------------------
# Templates
# ------------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "core_app.context_processors.clinic_context",
        ],
        },
    },
]

# ------------------------------------------------------------
# Database
# ------------------------------------------------------------


# ------------------------------------------------------------
# Password validation
# ------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ------------------------------------------------------------
# Internationalization
# ------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = env("TIME_ZONE", "Africa/Lagos")
USE_I18N = True
USE_TZ = True

# ------------------------------------------------------------
# Static / Media (Whitenoise)
# ------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

# Whitenoise optimized storage
STORAGES = {
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"}
}

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ------------------------------------------------------------
# Cache (Redis)
# ------------------------------------------------------------
REDIS_URL = os.getenv("REDIS_URL", "")

if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_URL,
            "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
            "TIMEOUT": int(env("CACHE_TIMEOUT", "300")),
        }
    }
else:
    CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}


# ------------------------------------------------------------
# Auth redirects
# ------------------------------------------------------------
LOGIN_URL = "accounts:login"
LOGIN_REDIRECT_URL = "accounts:dashboard"
LOGOUT_REDIRECT_URL = "accounts:login"

# ------------------------------------------------------------
# Security (safe defaults)
# ------------------------------------------------------------
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True

# Modern Django uses this instead of deprecated SECURE_BROWSER_XSS_FILTER
SECURE_REFERRER_POLICY = "same-origin"

# Set to True in production (HTTPS)
SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

# HSTS only in production (avoid breaking local dev)
if not DEBUG:
    SECURE_HSTS_SECONDS = int(env("SECURE_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
else:
    SECURE_HSTS_SECONDS = 0

# Optional: allow building absolute URLs behind proxy/CDN (Nginx/Cloudflare)
# If you're behind a proxy that sets X-Forwarded-Proto=https, uncomment:
# SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ------------------------------------------------------------
# Project constants (move to DB later if you want)
# ------------------------------------------------------------
DOCTOR_WHATSAPP_NUMBER = env("DOCTOR_WHATSAPP_NUMBER", "2348107971507")

# ------------------------------------------------------------
# Email (SMTP)
# ------------------------------------------------------------
EMAIL_BACKEND = env("EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = env("EMAIL_HOST", "")
EMAIL_PORT = int(env("EMAIL_PORT", "587"))
EMAIL_HOST_USER = env("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", "Dr Olaosebikan <dhikrullahabdullah92@gmail.com>")

# Where doctor receives booking notifications
DOCTOR_NOTIFICATION_EMAIL = env("DOCTOR_NOTIFICATION_EMAIL", "dhikrullahabdullah92@gmail.com")

# ------------------------------------------------------------
# Booking configuration (doctor available all days)
# ------------------------------------------------------------
APPOINTMENT_DAY_START = env("APPOINTMENT_DAY_START", "09:00")  # clinic opens
APPOINTMENT_DAY_END = env("APPOINTMENT_DAY_END", "17:00")      # clinic closes
APPOINTMENT_LOOKAHEAD_DAYS = int(env("APPOINTMENT_LOOKAHEAD_DAYS", "60"))  # allow booking up to N days ahead



LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "loggers": {
        "appointments": {
            "handlers": ["console"],
            "level": "INFO",
        },
    },
}




pw = os.environ.get("EMAIL_HOST_PASSWORD", "")




# core/settings.py

print("DEBUG:", DEBUG)
print("DATABASE_URL set?:", bool(DATABASE_URL))
print("DB_ENGINE:", os.getenv("DB_ENGINE"))
print("DB_NAME:", os.getenv("DB_NAME"))
