from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from profiles.models import DoctorProfile
from publications.models import Publication


class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = "weekly"

    def items(self):
        return ["core_app:home", "appointments:book"]

    def location(self, item):
        return reverse(item)


class DoctorProfileSitemap(Sitemap):
    priority = 1.0
    changefreq = "monthly"

    def items(self):
        return DoctorProfile.objects.all()


class PublicationSitemap(Sitemap):
    priority = 0.7
    changefreq = "yearly"

    def items(self):
        return Publication.objects.all()
