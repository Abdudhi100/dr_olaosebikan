# core_app/admin.py
from django.contrib import admin
from .models import SiteSettings, StaticPage


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("clinic_name", "clinic_tagline", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("clinic_name", "clinic_tagline", "contact_email", "contact_phone")
    readonly_fields = ("updated_at",)

    fieldsets = (
        ("Brand", {
            "fields": ("clinic_name", "clinic_tagline")
        }),
        ("Hero", {
            "fields": ("hero_title", "hero_subtitle", "hero_cta_text", "hero_cta_link")
        }),
        ("Contact", {
            "fields": ("contact_email", "contact_phone", "whatsapp_number", "clinic_address")
        }),
        ("Social", {
            "fields": (
                "social_facebook", "social_instagram", "social_twitter",
                "social_linkedin", "social_youtube"
            )
        }),
        ("SEO Defaults", {
            "fields": ("meta_description", "meta_keywords", "og_image")
        }),
        ("Status", {
            "fields": ("is_active", "updated_at")
        }),
    )


@admin.register(StaticPage)
class StaticPageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_published", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("updated_at",)
