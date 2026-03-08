from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from core_app.models import StaticPage
from profiles.models import DoctorProfile
from publications.models import Publication


class StaticViewSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9

    def items(self):
        return [
            "core_app:home",
            "core_app:about_doctor",
            "core_app:ra_treatment",
            "core_app:gout_treatment",
            "core_app:lupus_care",
            "core_app:joint_pain_clinic",
            "core_app:autoimmune_specialist",
            "core_app:faq",
            "core_app:contact_location",
            "appointments:book",
            "publications:publication_list",
            "publications:achievements",
        ]

    def location(self, item):
        return reverse(item)


class DoctorProfileSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8

    def items(self):
        return (
            DoctorProfile.objects
            .filter(is_active=True)
            .only("slug", "updated_at")
        )

    def lastmod(self, obj):
        return obj.updated_at


class PublicationSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.7

    def items(self):
        return (
            Publication.objects
            .filter(is_published=True)
            .only("slug")
        )

    


class StaticPageSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6

    def items(self):
        return (
            StaticPage.objects
            .filter(is_published=True)
            .only("slug", "updated_at")
        )

    def lastmod(self, obj):
        return obj.updated_at