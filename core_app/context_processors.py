# core_app/context_processors.py
from .models import SiteSettings

DEFAULT_META = {
    "title": "Pain, Arthritis, Autoimmune & Rheumatology Clinic",
    "description": "Specialist clinic for pain, arthritis, autoimmune and rheumatic diseases.",
    "keywords": "rheumatology, arthritis, autoimmune, pain clinic",
    "schema_type": "MedicalClinic",
    "type": "website",
    "robots": "index, follow",
    "twitter_card": "summary_large_image",
    "image": None,
}

def clinic_context(request):
    """
    Global clinic branding + SEO defaults.
    Exposes:
      - clinic (SiteSettings or None)
      - meta   (dict; always present)
    """
    clinic = SiteSettings.objects.filter(is_active=True).first()

    if not clinic:
        return {"clinic": None, "meta": DEFAULT_META}

    meta = {
        "title": clinic.clinic_name,
        "description": clinic.meta_description or DEFAULT_META["description"],
        "keywords": clinic.meta_keywords or DEFAULT_META["keywords"],
        "schema_type": "MedicalClinic",
        "type": "website",
        "robots": "index, follow",
        "twitter_card": "summary_large_image",
        "image": clinic.og_image.url if clinic.og_image else None,
    }
    return {"clinic": clinic, "meta": meta}
