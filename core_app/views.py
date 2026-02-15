from django.http import HttpResponse
from django.views import View
from django.views.generic import DetailView, TemplateView

from core_app.mixins import SEOMixin
from core_app.models import StaticPage

from profiles.models import DoctorProfile
from publications.models import Achievement, Publication
from appointments.models import Service


class HomeView(SEOMixin, TemplateView):
    template_name = "core_app/home.html"

    seo_title = "Pain, Arthritis, Autoimmune & Rheumatology Clinic — Dr Olaosebikan"
    seo_description = (
        "Specialist care for arthritis (RA/OA), gout, lupus, autoimmune conditions, "
        "inflammatory back pain, joint pain, stiffness and chronic pain management."
    )
    seo_schema_type = "MedicalClinic"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        # Single-doctor clinic: get active profile
        doctor = (
            DoctorProfile.objects
            .select_related("user")
            .filter(is_active=True)
            .only(
                "id",
                "user_id",
                "slug",
                "title",
                "full_name",
                "specialization",
                "years_of_experience",
                "bio",
                "profile_photo",
                "hospital_affiliations",
                "professional_memberships",
            )
            .first()
        )
        ctx["doctor"] = doctor

        # Featured achievements (latest 4)
        ctx["achievements"] = (
            Achievement.objects
            .filter(is_published=True)
            .only("id", "title", "year")
            .order_by("-year")[:4]
        )

        # Featured publications (latest 3)
        ctx["publications"] = (
            Publication.objects
            .filter(is_published=True)
            .only("id", "title", "year", "journal", "slug", "abstract", "is_featured")
            .order_by("-is_featured", "-year", "-created_at")[:3]
        )


        # Featured services (top 6) — filter by doctor for safety
        if doctor:
            ctx["services"] = (
                Service.objects
                .filter(is_active=True, doctor_id=doctor.user_id)
                .only("id", "name", "description", "duration_minutes", "position")
                .order_by("position", "name")[:6]
            )
        else:
            # If profile not configured yet, still show something
            ctx["services"] = (
                Service.objects
                .filter(is_active=True)
                .only("id", "name", "description", "duration_minutes", "position")
                .order_by("position", "name")[:6]
            )

        return ctx


class StaticPageDetailView(SEOMixin, DetailView):
    model = StaticPage
    template_name = "pages/cms_page.html"
    context_object_name = "page"
    seo_schema_type = "WebPage"

    def get_queryset(self):
        return (
            StaticPage.objects
            .filter(is_published=True)
            .only(
                "title",
                "slug",
                "content",
                "meta_description",
                "meta_keywords",
            )
        )

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        page = ctx["page"]

        # Page-level SEO overrides (premium)
        self.seo_title = page.title
        if page.meta_description:
            self.seo_description = page.meta_description
        if page.meta_keywords:
            self.seo_keywords = page.meta_keywords

        return ctx


class ContactView(SEOMixin, TemplateView):
    template_name = "core_app/contact.html"
    seo_title = "Contact — Pain, Arthritis, Autoimmune & Rheumatology Clinic"
    seo_description = "Contact the clinic via phone, WhatsApp, email, and social channels."
    seo_schema_type = "MedicalClinic"


class RobotsTxtView(View):
    def get(self, request):
        lines = [
            "User-Agent: *",
            "Disallow: /admin/",
            "Disallow: /accounts/",
            f"Sitemap: {request.build_absolute_uri('/sitemap.xml')}",
        ]

        return HttpResponse("\n".join(lines), content_type="text/plain")
