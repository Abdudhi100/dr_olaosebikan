# core_app/models.py
from django.db import models
from django.utils.text import slugify


class SiteSettings(models.Model):
    """
    Single source of truth for clinic branding + global SEO defaults.
    You can keep ONE active row (enforced in admin logic).
    """

    # BRAND
    clinic_name = models.CharField(
        max_length=200,
        default="Pain, Arthritis, Autoimmune & Rheumatology Clinic",
        help_text="Main brand name shown in navbar, footer, titles.",
    )
    clinic_tagline = models.CharField(
        max_length=255,
        default="Specialist care for pain, arthritis, autoimmune & rheumatic diseases.",
    )

    # HERO
    hero_title = models.CharField(
        max_length=255,
        default="Expert Rheumatology Care You Can Trust",
    )
    hero_subtitle = models.TextField(
        default="Evidence-based treatment for arthritis, autoimmune disease, chronic pain and inflammatory conditions.",
    )
    hero_cta_text = models.CharField(max_length=100, default="Book an Appointment")
    hero_cta_link = models.CharField(max_length=200, default="/appointments/book/")

    # CONTACT
    contact_email = models.EmailField(blank=True, default="")
    contact_phone = models.CharField(max_length=30, blank=True, default="")
    whatsapp_number = models.CharField(
        max_length=30,
        blank=True,
        default="2348107971507",
        help_text="International format recommended, e.g. 2348XXXXXXXXXX",
    )
    clinic_address = models.CharField(max_length=255, blank=True, default="")

    # SOCIALS
    social_facebook = models.URLField(blank=True, default="")
    social_instagram = models.URLField(blank=True, default="")
    social_twitter = models.URLField(blank=True, default="")
    social_linkedin = models.URLField(blank=True, default="")
    social_youtube = models.URLField(blank=True, default="")

    # SEO DEFAULTS
    meta_description = models.TextField(
        default="Specialist rheumatology clinic for pain, arthritis, autoimmune and rheumatic diseases. Book an appointment with Dr Olaosebikan.",
        help_text="Default SEO description (used site-wide unless overridden).",
    )
    meta_keywords = models.CharField(
        max_length=400,
        default="rheumatology, arthritis, autoimmune, pain clinic, joint pain, inflammation, lupus, gout, back pain, rheumatoid arthritis",
    )
    og_image = models.ImageField(
        upload_to="seo/",
        blank=True,
        null=True,
        help_text="Default OpenGraph image used for link previews.",
    )

    # OPS
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.clinic_name


class StaticPage(models.Model):
    PAGE_CHOICES = (
        ("about", "About"),
        ("services", "Services"),
        ("contact", "Contact"),
        ("privacy", "Privacy Policy"),
    )

    slug = models.SlugField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField()

    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=400, blank=True)
    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
