from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.contrib.auth import get_user_model

User = get_user_model()

class Service(models.Model):
    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="services"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(
        help_text="Duration in minutes"
    )
    is_active = models.BooleanField(default=True)
    position = models.PositiveSmallIntegerField(default=0, db_index=True)
    order = models.PositiveIntegerField(default=0)

    icon = models.CharField(
        max_length=50,
        blank=True,
        default="shield-check",
        help_text="Icon key (e.g. shield-check, bolt, heart, beaker, hand-raised)"
    )

    class Meta:
        ordering = ["position", "name", "order"]
        constraints = [
            models.UniqueConstraint(
                fields=["doctor", "name"],
                name="unique_service_per_doctor"
            )
        ]

    def __str__(self):
        return self.name


class Availability(models.Model):
    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="availabilities"
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ["date", "start_time"]
        constraints = [
            models.UniqueConstraint(
                fields=["doctor", "date", "start_time", "end_time"],
                name="unique_doctor_time_slot"
            )
        ]
        indexes = [
            models.Index(fields=["doctor", "date"]),
        ]

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError(
                "Start time must be earlier than end time."
            )

    def __str__(self):
        return f"{self.date} ({self.start_time} - {self.end_time})"



class Appointment(models.Model):
    STATUS_PENDING = "pending"
    STATUS_CONFIRMED = "confirmed"
    STATUS_CANCELLED = "cancelled"
    STATUS_COMPLETED = "completed"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_CANCELLED, "Cancelled"),
        (STATUS_COMPLETED, "Completed"),
    ]

    # --------------------
    # Relations
    # --------------------
    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    service = models.ForeignKey(
        "Service",
        on_delete=models.PROTECT,
        related_name="appointments"
    )

    availability = models.OneToOneField(
        "Availability",
        on_delete=models.PROTECT,
        related_name="appointment"
    )

    patient = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="patient_appointments"
    )

    # --------------------
    # Patient snapshot
    # --------------------
    patient_name = models.CharField(max_length=255)
    patient_email = models.EmailField()
    patient_phone = models.CharField(max_length=20, blank=True)

    # --------------------
    # Meta
    # --------------------
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING
    )

    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["doctor", "status"]),
            models.Index(fields=["patient_email"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["availability"],
                name="unique_appointment_per_availability"
            )
        ]

    # --------------------
    # Validation
    # --------------------
    def clean(self):
        if not self.service_id or not self.availability_id:
            return

        if self.service.doctor_id != self.availability.doctor_id:
            raise ValidationError(
                "Service and availability must belong to the same doctor."
            )

        if not self.pk and not self.availability.is_available:
            raise ValidationError(
                "This time slot is no longer available."
            )

    # --------------------
    # Persistence logic
    # --------------------
    def save(self, *args, **kwargs):
        # ✅ Guarantee doctor BEFORE DB insert/update
        if self.service_id:
            self.doctor = self.service.doctor

        with transaction.atomic():
            availability = (
                Availability.objects
                .select_for_update()
                .get(pk=self.availability_id)
            )

            self.full_clean()
            super().save(*args, **kwargs)

            # Centralized locking rules
            LOCKED_STATUSES = {
                self.STATUS_PENDING,
                self.STATUS_CONFIRMED,
                self.STATUS_COMPLETED,
            }

            availability.is_available = self.status not in LOCKED_STATUSES
            availability.save(update_fields=["is_available"])

    def __str__(self):
        return f"{self.patient_name} – {self.service} ({self.status})"
