from pathlib import Path
import os

from dotenv import load_dotenv
import dj_database_url

# ------------------------------------------------------------
# Base / Env
# ------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env for local dev only.
# IMPORTANT: do NOT override real env vars on Render.
if os.getenv("RENDER") != "true":
    load_dotenv(BASE_DIR / ".env")

def env(key: str, default=None):
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

# ------------------------------------------------------------
# Security basics
# ------------------------------------------------------------
DEBUG = env_bool("DEBUG", False)

SECRET_KEY = env("SECRET_KEY")
if not SECRET_KEY:
    # safe fallback for local dev only
    if DEBUG:
        SECRET_KEY = "dev-only-secret-key"
    else:
        raise RuntimeError("SECRET_KEY is required in production")

# Hosts / CSRF
ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", ["127.0.0.1", "localhost"] if DEBUG else [])
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", [])

# Render / proxy HTTPS
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ------------------------------------------------------------
# Database (Render: DATABASE_URL; local: DB_*; fallback: sqlite)
# ------------------------------------------------------------
DATABASE_URL = env("DATABASE_URL", "").strip()

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=60,
            ssl_require=not DEBUG,  # Render Postgres should use SSL
        )
    }
else:
    db_engine = env("DB_ENGINE", "").strip()
    db_name = env("DB_NAME", "").strip()

    if not db_engine or not db_name:
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
                "NAME": db_name,
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
    "whitenoise.runserver_nostatic",
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
# Templates  (FIXED: your version had broken brackets)
# ------------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "core_app.context_processors.clinic_context",
            ],
        },
    },
]

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

# In production, STATICFILES_DIRS is usually unnecessary; it can be kept for dev.
STATICFILES_DIRS = [BASE_DIR / "static"] if DEBUG else []

STORAGES = {
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"}
}

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# If you hit "Missing staticfiles manifest entry" you can temporarily set:
# WHITENOISE_MANIFEST_STRICT = False

# ------------------------------------------------------------
# Cache (Redis optional)
# ------------------------------------------------------------
REDIS_URL = env("REDIS_URL", "").strip()
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
# Security headers
# ------------------------------------------------------------
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"

# HTTPS behavior
SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

# HSTS only in production
if not DEBUG:
    SECURE_HSTS_SECONDS = int(env("SECURE_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
else:
    SECURE_HSTS_SECONDS = 0

# ------------------------------------------------------------
# Project constants
# ------------------------------------------------------------
DOCTOR_WHATSAPP_NUMBER = env("DOCTOR_WHATSAPP_NUMBER", "2348107971507")

# ------------------------------------------------------------
# Email
# ------------------------------------------------------------
EMAIL_BACKEND = env("EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = env("EMAIL_HOST", "")
EMAIL_PORT = int(env("EMAIL_PORT", "587"))
EMAIL_HOST_USER = env("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
DEFAULT_FROM_EMAIL = env(
    "DEFAULT_FROM_EMAIL",
    "Dr Olaosebikan <dhikrullahabdullah92@gmail.com>",
)
DOCTOR_NOTIFICATION_EMAIL = env("DOCTOR_NOTIFICATION_EMAIL", "dhikrullahabdullah92@gmail.com")

# ------------------------------------------------------------
# Booking configuration
# ------------------------------------------------------------
APPOINTMENT_DAY_START = env("APPOINTMENT_DAY_START", "09:00")
APPOINTMENT_DAY_END = env("APPOINTMENT_DAY_END", "17:00")
APPOINTMENT_LOOKAHEAD_DAYS = int(env("APPOINTMENT_LOOKAHEAD_DAYS", "60"))

# ------------------------------------------------------------
# Logging
# ------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "INFO"},
    "loggers": {
        "django.request": {"handlers": ["console"], "level": "ERROR", "propagate": False},
        "appointments": {"handlers": ["console"], "level": "INFO", "propagate": False},
    },
}
