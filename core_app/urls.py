from django.urls import path

from .views import (
    AboutDoctorPageView,
    AutoimmuneSpecialistPageView,
    ContactLocationPageView,
    ContactView,
    FAQPageView,
    GoutPageView,
    HealthzView,
    HomeView,
    JointPainPageView,
    LupusPageView,
    RheumatoidArthritisPageView,
    RobotsTxtView,
    StaticPageDetailView,
)

app_name = "core_app"

urlpatterns = [
    path("", HomeView.as_view(), name="home"),

    path(
        "about-dr-olaosebikan/",
        AboutDoctorPageView.as_view(),
        name="about_doctor",
    ),
    path(
        "rheumatoid-arthritis-treatment-lagos/",
        RheumatoidArthritisPageView.as_view(),
        name="ra_treatment",
    ),
    path(
        "gout-treatment-lagos/",
        GoutPageView.as_view(),
        name="gout_treatment",
    ),
    path(
        "lupus-care-lagos/",
        LupusPageView.as_view(),
        name="lupus_care",
    ),
    path(
        "joint-pain-and-stiffness-clinic-lagos/",
        JointPainPageView.as_view(),
        name="joint_pain_clinic",
    ),
    path(
        "autoimmune-disease-specialist-lagos/",
        AutoimmuneSpecialistPageView.as_view(),
        name="autoimmune_specialist",
    ),
    path(
        "faq/",
        FAQPageView.as_view(),
        name="faq",
    ),
    path(
        "contact-location/",
        ContactLocationPageView.as_view(),
        name="contact_location",
    ),

    path("contact/", ContactView.as_view(), name="contact"),
    path("pages/<slug:slug>/", StaticPageDetailView.as_view(), name="static_page"),
    path("robots.txt", RobotsTxtView.as_view(), name="robots"),
    path("healthz/", HealthzView.as_view(), name="healthz"),
]