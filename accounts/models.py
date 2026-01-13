from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    # Add any additional fields if needed
    is_doctor = models.BooleanField(default=False)
    is_patient = models.BooleanField(default=False)