# publications/models.py
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()


class Achievement(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="achievements")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    year = models.PositiveIntegerField()
    organization = models.CharField(max_length=255, blank=True)

    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-year", "-created_at"]
        indexes = [models.Index(fields=["doctor", "year"]), models.Index(fields=["is_published"])]

    def save(self, *args, **kwargs):
        if self.is_published and self.published_at is None:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.year})"


class Publication(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="publications")

    title = models.CharField(max_length=255)
    journal = models.CharField(max_length=255)
    year = models.PositiveIntegerField()

    authors = models.CharField(max_length=500, blank=True)
    abstract = models.TextField(blank=True)
    doi_link = models.URLField(blank=True)

    pdf = models.FileField(upload_to="publications/pdfs/", blank=True, null=True)

    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    slug = models.SlugField(max_length=320, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-year", "-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["doctor", "slug"], name="unique_publication_slug_per_doctor"),
        ]
        indexes = [
            models.Index(fields=["doctor", "year"]),
            models.Index(fields=["is_featured"]),
            models.Index(fields=["is_published"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(f"{self.title}-{self.year}")[:250]
            # keep it stable-ish and unique per doctor
            self.slug = f"{base}-{self.doctor_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
