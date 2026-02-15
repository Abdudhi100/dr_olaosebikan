from django.db import models
from django.utils import timezone
from appointments.models import Appointment


class MessageIntent(models.Model):
    PURPOSE_CHOICES = (
        ("appointment", "Appointment"),
        ("follow_up", "Follow Up"),
        ("general", "General Enquiry"),
    )

    STATUS_CHOICES = (
        ("initiated", "Initiated"),
        ("redirected", "Redirected to WhatsApp"),
        ("completed", "Completed"),
    )

    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="message_intents",
    )
    patient_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="initiated"
    )
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["purpose"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.patient_name} - {self.purpose}"