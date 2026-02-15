# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_DOCTOR = "doctor"
    ROLE_PATIENT = "patient"

    ROLE_CHOICES = [
        (ROLE_DOCTOR, "Doctor"),
        (ROLE_PATIENT, "Patient"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_PATIENT
    )

    
    @property
    def is_doctor(self):
        return self.role == self.ROLE_DOCTOR

    @property
    def is_patient(self):
        return self.role == self.ROLE_PATIENT
