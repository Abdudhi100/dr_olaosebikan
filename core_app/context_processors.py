# core_app/context_processors.py
from .models import SiteSettings

DEFAULT_SITE_SETTINGS = {
    "clinic_name": "Dr Olaosebikan Clinic",
    "phone": "+234 000 000 0000",
    "email": "info@clinic.com",
    "address": "123 Medical Avenue, Lagos, Nigeria",
    "hours": "Mon – Fri, 9:00 AM – 5:00 PM",
    # optional SEO fields if templates expect them:
    "meta_description": "Specialist clinic for pain, arthritis, autoimmune and rheumatic diseases.",
    "meta_keywords": "rheumatology, arthritis, autoimmune, pain clinic",
    "og_image": None,
}

DEFAULT_META = {
    "title": DEFAULT_SITE_SETTINGS["clinic_name"],
    "description": DEFAULT_SITE_SETTINGS["meta_description"],
    "keywords": DEFAULT_SITE_SETTINGS["meta_keywords"],
    "schema_type": "MedicalClinic",
    "type": "website",
    "robots": "index, follow",
    "twitter_card": "summary_large_image",
    "image": None,
}

def _safe_attr(obj, name, default=None):
    """Read attribute from model OR key from dict, with default."""
    if obj is None:
        return default
    if isinstance(obj, dict):
        return obj.get(name, default)
    return getattr(obj, name, default)

def _og_image_url(obj):
    """Return image URL safely for model ImageField or dict."""
    if obj is None:
        return None
    if isinstance(obj, dict):
        val = obj.get("og_image")
        # allow either a raw url string or None
        return val if isinstance(val, str) else None
    img = getattr(obj, "og_image", None)
    return getattr(img, "url", None) if img else None

def clinic_context(request):
    """
    Global clinic branding + SEO defaults (Render-safe).
    Exposes:
      - site_settings: SiteSettings model OR fallback dict (never None)
      - clinic_name: always a string
      - meta: always a dict
      - clinic: alias (backward compatibility)
    """
    obj = SiteSettings.objects.filter(is_active=True).first()

    # Fallback to dict so templates never crash on missing DB row
    site_settings = obj or DEFAULT_SITE_SETTINGS

    clinic_name = _safe_attr(site_settings, "clinic_name", DEFAULT_SITE_SETTINGS["clinic_name"])

    meta = {
        "title": clinic_name,
        "description": _safe_attr(site_settings, "meta_description", DEFAULT_META["description"]) or DEFAULT_META["description"],
        "keywords": _safe_attr(site_settings, "meta_keywords", DEFAULT_META["keywords"]) or DEFAULT_META["keywords"],
        "schema_type": DEFAULT_META["schema_type"],
        "type": DEFAULT_META["type"],
        "robots": DEFAULT_META["robots"],
        "twitter_card": DEFAULT_META["twitter_card"],
        "image": _og_image_url(site_settings),
    }

    return {
        "site_settings": site_settings,
        "clinic_name": clinic_name,
        "meta": meta,
        "clinic": site_settings,  # backward compatibility if templates used {{ clinic.* }}
    }
