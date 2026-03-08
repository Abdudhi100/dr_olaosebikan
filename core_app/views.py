from django.http import HttpResponse
from django.views import View
from django.views.generic import DetailView, TemplateView

from appointments.models import Service
from core_app.mixins import SEOMixin
from core_app.models import StaticPage
from profiles.models import DoctorProfile
from publications.models import Achievement, Publication


def get_active_doctor_profile():
    """
    Single-doctor clinic helper.
    Returns the active doctor profile or None.
    """
    return (
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
            "user__first_name",
            "user__last_name",
        )
        .first()
    )


class HomeView(SEOMixin, TemplateView):
    template_name = "core_app/home.html"
    seo_title = "Pain, Arthritis, Autoimmune & Rheumatology Clinic — Dr Olaosebikan"
    seo_description = (
        "Specialist care for arthritis, gout, lupus, autoimmune conditions, "
        "joint pain, stiffness, inflammatory back pain, and chronic pain management in Lagos."
    )
    seo_schema_type = "MedicalClinic"

    def get_seo_keywords(self):
        return (
            "rheumatology clinic Lagos, arthritis specialist Lagos, autoimmune specialist Lagos, "
            "joint pain clinic Lagos, gout treatment Lagos, lupus care Lagos"
        )

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        doctor = get_active_doctor_profile()
        ctx["doctor"] = doctor

        ctx["achievements"] = (
            Achievement.objects
            .filter(is_published=True)
            .only("id", "title", "year")
            .order_by("-year", "-created_at")[:4]
        )

        ctx["publications"] = (
            Publication.objects
            .filter(is_published=True)
            .only("id", "title", "year", "journal", "slug", "abstract", "is_featured", "created_at")
            .order_by("-is_featured", "-year", "-created_at")[:3]
        )

        if doctor:
            ctx["services"] = (
                Service.objects
                .filter(is_active=True, doctor_id=doctor.user_id)
                .only("id", "name", "description", "duration_minutes", "position")
                .order_by("position", "name")[:6]
            )
        else:
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
                "updated_at",
            )
        )

    def get_seo_title(self):
        page = self.get_object()
        return page.title

    def get_seo_description(self):
        page = self.get_object()
        return page.meta_description or None

    def get_seo_keywords(self):
        page = self.get_object()
        return page.meta_keywords or None

    def get_seo_schema_type(self):
        return "WebPage"


class ContactView(SEOMixin, TemplateView):
    template_name = "core_app/contact.html"
    seo_title = "Contact — Pain, Arthritis, Autoimmune & Rheumatology Clinic"
    seo_description = "Contact the clinic via phone, WhatsApp, email, and social channels."
    seo_schema_type = "MedicalClinic"

    def get_seo_keywords(self):
        return (
            "contact rheumatology clinic Lagos, arthritis clinic contact Lagos, "
            "book rheumatology appointment Lagos"
        )


class AboutDoctorPageView(SEOMixin, TemplateView):
    template_name = "pages/about_doctor.html"
    seo_schema_type = "AboutPage"

    def get_seo_title(self):
        return "About Dr Olaosebikan | Rheumatology Specialist in Lagos"

    def get_seo_description(self):
        return (
            "Learn about Dr Olaosebikan, a specialist in pain, arthritis, "
            "autoimmune and rheumatology care in Lagos."
        )

    def get_seo_keywords(self):
        return (
            "Dr Olaosebikan, rheumatologist in Lagos, arthritis specialist Lagos, "
            "autoimmune doctor Lagos, pain clinic Lagos"
        )

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["doctor"] = get_active_doctor_profile()
        return ctx


class RheumatoidArthritisPageView(SEOMixin, TemplateView):
    template_name = "pages/rheumatoid_arthritis.html"
    seo_schema_type = "MedicalWebPage"

    def get_seo_title(self):
        return "Rheumatoid Arthritis Treatment in Lagos | Dr Olaosebikan"

    def get_seo_description(self):
        return (
            "Get expert evaluation and treatment for rheumatoid arthritis in Lagos. "
            "Learn symptoms, diagnosis, and care options with Dr Olaosebikan."
        )

    def get_seo_keywords(self):
        return (
            "rheumatoid arthritis treatment Lagos, arthritis specialist Lagos, "
            "rheumatology clinic Lagos, joint pain specialist Lagos"
        )


class GoutPageView(SEOMixin, TemplateView):
    template_name = "pages/gout_treatment.html"
    seo_schema_type = "MedicalWebPage"

    def get_seo_title(self):
        return "Gout Treatment in Lagos | Dr Olaosebikan"

    def get_seo_description(self):
        return (
            "Learn about gout symptoms, causes, diagnosis, and treatment in Lagos "
            "with specialist care from Dr Olaosebikan."
        )

    def get_seo_keywords(self):
        return (
            "gout treatment Lagos, gout doctor Lagos, rheumatologist Lagos, "
            "arthritis clinic Lagos"
        )


class LupusPageView(SEOMixin, TemplateView):
    template_name = "pages/lupus_care.html"
    seo_schema_type = "MedicalWebPage"

    def get_seo_title(self):
        return "Lupus Care in Lagos | Dr Olaosebikan"

    def get_seo_description(self):
        return (
            "Specialist lupus care in Lagos. Understand symptoms, diagnosis, monitoring, "
            "and treatment options with Dr Olaosebikan."
        )

    def get_seo_keywords(self):
        return (
            "lupus care Lagos, lupus specialist Lagos, autoimmune doctor Lagos, "
            "rheumatology clinic Lagos"
        )


class JointPainPageView(SEOMixin, TemplateView):
    template_name = "pages/joint_pain_clinic.html"
    seo_schema_type = "MedicalWebPage"

    def get_seo_title(self):
        return "Joint Pain and Stiffness Clinic in Lagos | Dr Olaosebikan"

    def get_seo_description(self):
        return (
            "Joint pain and stiffness assessment and treatment in Lagos. "
            "Find expert care for arthritis, inflammation, and mobility concerns."
        )

    def get_seo_keywords(self):
        return (
            "joint pain clinic Lagos, stiffness treatment Lagos, arthritis clinic Lagos, "
            "rheumatologist Lagos"
        )


class AutoimmuneSpecialistPageView(SEOMixin, TemplateView):
    template_name = "pages/autoimmune_specialist.html"
    seo_schema_type = "MedicalWebPage"

    def get_seo_title(self):
        return "Autoimmune Disease Specialist in Lagos | Dr Olaosebikan"

    def get_seo_description(self):
        return (
            "Consult an autoimmune disease specialist in Lagos for expert diagnosis, "
            "monitoring, and long-term care."
        )

    def get_seo_keywords(self):
        return (
            "autoimmune disease specialist Lagos, autoimmune clinic Lagos, "
            "rheumatologist Lagos, lupus specialist Lagos"
        )


class FAQPageView(SEOMixin, TemplateView):
    template_name = "pages/faq.html"
    seo_schema_type = "FAQPage"

    def get_seo_title(self):
        return "Rheumatology FAQ | Dr Olaosebikan"

    def get_seo_description(self):
        return (
            "Frequently asked questions about arthritis, autoimmune diseases, appointments, "
            "diagnosis, and treatment."
        )

    def get_seo_keywords(self):
        return (
            "rheumatology FAQ, arthritis FAQ Lagos, autoimmune clinic questions, "
            "joint pain FAQ Lagos"
        )


class ContactLocationPageView(SEOMixin, TemplateView):
    template_name = "pages/contact_location.html"
    seo_schema_type = "ContactPage"

    def get_seo_title(self):
        return "Contact and Clinic Location | Dr Olaosebikan"

    def get_seo_description(self):
        return (
            "Contact Dr Olaosebikan’s clinic, view location details, and book an appointment "
            "for specialist arthritis and autoimmune care in Lagos."
        )

    def get_seo_keywords(self):
        return (
            "contact rheumatologist Lagos, clinic location Lagos, "
            "book arthritis appointment Lagos"
        )


class RobotsTxtView(View):
    def get(self, request, *args, **kwargs):
        lines = [
            "User-Agent: *",
            "Disallow: /admin/",
            "Disallow: /accounts/",
            f"Sitemap: {request.build_absolute_uri('/sitemap.xml')}",
        ]
        return HttpResponse("\n".join(lines), content_type="text/plain")


class HealthzView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse("ok", content_type="text/plain")