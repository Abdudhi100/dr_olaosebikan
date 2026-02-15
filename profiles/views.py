# profiles/views.py
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.generic import DetailView

from core_app.mixins import SEOMixin
from .models import DoctorProfile


@method_decorator(cache_page(60 * 15), name="dispatch")  # 15 mins
class DoctorProfileDetailView(SEOMixin, DetailView):
    model = DoctorProfile
    template_name = "profiles/doctor_profile.html"
    context_object_name = "doctor"
    slug_field = "slug"
    slug_url_kwarg = "slug"

    def get_queryset(self):
        # One query, no invalid prefetch
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
        # Use slug from URL: /doctor/<slug>/
        queryset = queryset or self.get_queryset()
        return get_object_or_404(queryset, slug=self.kwargs.get(self.slug_url_kwarg))

    # If your SEOMixin reads `get_meta()`, keep this:
    def get_meta(self):
        doctor = self.object
        bio = (doctor.bio or "").strip()
        desc = bio[:160] if bio else f"Profile of Dr {doctor.full_name} — {doctor.specialization}."

        image = doctor.profile_photo.url if doctor.profile_photo else None

        return {
            "title": f"Dr {doctor.full_name} — {doctor.specialization}",
            "description": desc,
            "image": image,
            "type": "profile",
        }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        doctor = self.object

        context["schema"] = {
            "@context": "https://schema.org",
            "@type": "Physician",
            "name": f"Dr {doctor.full_name}",
            "image": doctor.profile_photo.url if doctor.profile_photo else None,
            "medicalSpecialty": doctor.specialization,
            "description": (doctor.bio or "").strip(),
            "url": self.request.build_absolute_uri(),
            "affiliation": doctor.hospital_affiliations,  # ✅ correct field name
        }
        return context
