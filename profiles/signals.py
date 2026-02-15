from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.cache import cache
from .models import DoctorProfile

@receiver(post_save, sender=DoctorProfile)
def clear_doctor_profile_cache(sender, instance, **kwargs):
    cache.delete("doctor_profile_main")
