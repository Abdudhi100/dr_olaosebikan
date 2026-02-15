# core/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.contrib.sitemaps.views import sitemap
from core_app.sitemaps import StaticViewSitemap, DoctorProfileSitemap, PublicationSitemap

sitemaps = {
    "static": StaticViewSitemap,
    "profiles": DoctorProfileSitemap,
    "publications": PublicationSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include(("accounts.urls", "accounts"), namespace="accounts")),
    path('doctor/', include('profiles.urls')),
    path('publications/', include('publications.urls')),
    path('appointments/', include('appointments.urls')),
    path('', include(('core_app.urls', 'core_app'), namespace='core_app')),
    path('messaging/', include(('messaging.urls', 'messaging'), namespace='messaging')),
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="django.contrib.sitemaps.views.sitemap"),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
