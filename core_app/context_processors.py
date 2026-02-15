# core_app/context_processors.py
from .models import SiteSettings

DEFAULT_SITE_SETTINGS = {
    # Brand
    "clinic_name": "Pain, Arthritis, Autoimmune & Rheumatology Clinic",
    "clinic_tagline": "Specialist care for pain, arthritis, autoimmune & rheumatic diseases.",

    # Contact (model field names)
    "contact_phone": "+2348035751154",
    "contact_email": "hakeemolaosebikan37@gmail.com",
    "clinic_address": "Block 117, Alaka LSDPC, Lagos, Nigeria",
    "whatsapp_number": "2348035751154",

    # SEO
    "meta_description": (
        "Specialist rheumatology clinic for pain, arthritis, autoimmune and rheumatic diseases. "
        "Book an appointment with Dr Olaosebikan."
    ),
    "meta_keywords": "rheumatology, arthritis, autoimmune, pain clinic",
    "og_image": None,

    # Template aliases (so existing templates keep working)
    "phone": "+2348035751154",
    "email": "hakeemolaosebikan37@gmail.com",
    "address": "Block 117, Alaka LSDPC, Lagos, Nigeria",
    "hours": "Mon – Fri, 9:00 AM – 5:00 PM",
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

def _get(obj, name, default=None):
    """Get attribute from model or key from dict."""
    if obj is None:
        return default
    if isinstance(obj, dict):
        return obj.get(name, default)
    return getattr(obj, name, default)

def _og_image_url(obj):
    """Return og_image.url safely for model ImageField OR dict."""
    if obj is None:
        return None
    if isinstance(obj, dict):
        val = obj.get("og_image")
        return val if isinstance(val, str) else None
    img = getattr(obj, "og_image", None)
    return getattr(img, "url", None) if img else None

def clinic_context(request):
    """
    Global clinic branding + SEO defaults.

    Provides:
      - site_settings: model instance OR fallback dict (never None)
      - clinic: alias for backward compatibility
      - clinic_name: always a string
      - meta: always a dict
    """

    obj = SiteSettings.objects.filter(is_active=True).first()
    site_settings = obj or DEFAULT_SITE_SETTINGS

    # Values based on your model fields (with safe fallbacks)
    clinic_name = _get(site_settings, "clinic_name", DEFAULT_SITE_SETTINGS["clinic_name"])

    # Build meta (always safe)
    meta = {
        "title": clinic_name,
        "description": _get(site_settings, "meta_description", DEFAULT_META["description"]) or DEFAULT_META["description"],
        "keywords": _get(site_settings, "meta_keywords", DEFAULT_META["keywords"]) or DEFAULT_META["keywords"],
        "schema_type": DEFAULT_META["schema_type"],
        "type": DEFAULT_META["type"],
        "robots": DEFAULT_META["robots"],
        "twitter_card": DEFAULT_META["twitter_card"],
        "image": _og_image_url(site_settings),
    }

    # 🔥 Template-friendly aliases (so templates using phone/email/address won't crash)
    # If site_settings is a model, add these computed values separately.
    phone = _get(site_settings, "contact_phone", DEFAULT_SITE_SETTINGS["phone"])
    email = _get(site_settings, "contact_email", DEFAULT_SITE_SETTINGS["email"])
    address = _get(site_settings, "clinic_address", DEFAULT_SITE_SETTINGS["address"])

    # hours isn't in your model; keep a default or later add a model field.
    hours = DEFAULT_SITE_SETTINGS["hours"]

    return {
        # primary
        "site_settings": site_settings,
        "clinic": site_settings,  # alias
        "clinic_name": clinic_name,
        "meta": meta,

        # aliases used in templates
        "phone": phone,
        "email": email,
        "address": address,
        "hours": hours,
    }
