# profiles/models.py
from django.conf import settings
from django.db import models
from django.utils.text import slugify

User = settings.AUTH_USER_MODEL


class DoctorProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="doctor_profile",
    )

    slug = models.SlugField(unique=True, blank=True, db_index=True)
    title = models.CharField(max_length=255, default="Consultant Physician")

    full_name = models.CharField(max_length=255)
    specialization = models.CharField(max_length=255)
    years_of_experience = models.PositiveIntegerField()
    bio = models.TextField()

    profile_photo = models.ImageField(
        upload_to="doctors/photos/",
        blank=True,
        null=True,
    )

    hospital_affiliations = models.TextField(blank=True)
    professional_memberships = models.TextField(blank=True)

    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Doctor Profile"
        verbose_name_plural = "Doctor Profiles"
        ordering = ["-is_active", "-updated_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.full_name)[:200]
            self.slug = base
            # Ensure uniqueness if two similar names exist
            i = 2
            while DoctorProfile.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{base}-{i}"
                i += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name or (self.user.get_full_name() or self.user.username)
