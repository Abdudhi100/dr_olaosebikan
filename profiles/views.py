import json

from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.generic import DetailView

from core_app.mixins import SEOMixin
from .models import DoctorProfile


@method_decorator(cache_page(60 * 15), name="dispatch")
class DoctorProfileDetailView(SEOMixin, DetailView):
    model = DoctorProfile
    template_name = "profiles/doctor_profile.html"
    context_object_name = "doctor"
    slug_field = "slug"
    slug_url_kwarg = "slug"
    seo_schema_type = "Physician"

    def get_queryset(self):
        return (
            DoctorProfile.objects.filter(is_active=True)
            .select_related("user")
            .only(
                "id",
                "slug",
                "full_name",
                "title",
                "specialization",
                "years_of_experience",
                "bio",
                "profile_photo",
                "hospital_affiliations",
                "professional_memberships",
                "user__first_name",
                "user__last_name",
            )
        )

    def get_object(self, queryset=None):
        queryset = queryset or self.get_queryset()
        return get_object_or_404(queryset, slug=self.kwargs.get(self.slug_url_kwarg))

    def get_seo_title(self):
        doctor = self.get_object()
        return f"Dr {doctor.full_name} — {doctor.specialization}"

    def get_seo_description(self):
        doctor = self.get_object()
        bio = (doctor.bio or "").strip()
        return bio[:160] if bio else f"Profile of Dr {doctor.full_name} — {doctor.specialization}."

    def get_seo_image(self):
        doctor = self.get_object()
        if doctor.profile_photo:
            return doctor.profile_photo.url
        return None

    def get_seo_type(self):
        return "profile"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        doctor = self.object

        image_url = None
        if doctor.profile_photo:
            image_url = self.request.build_absolute_uri(doctor.profile_photo.url)

        context["schema"] = json.dumps({
            "@context": "https://schema.org",
            "@type": "Physician",
            "name": f"Dr {doctor.full_name}",
            "image": image_url,
            "medicalSpecialty": doctor.specialization,
            "description": (doctor.bio or "").strip(),
            "url": self.request.build_absolute_uri(),
            "affiliation": doctor.hospital_affiliations,
        })

        return context