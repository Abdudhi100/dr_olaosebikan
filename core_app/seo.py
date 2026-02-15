DEFAULT_META = {
    "title": None,
    "description": None,
    "keywords": None,
    "image": None,
    "type": "website",
    "schema_type": "MedicalClinic",
    "robots": "index, follow",
    "twitter_card": "summary_large_image",
}

def build_meta(**kwargs):
    meta = DEFAULT_META.copy()
    meta.update({k: v for k, v in kwargs.items() if v is not None and v != ""})
    return meta
