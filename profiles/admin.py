from django.contrib import admin
from .models import DoctorProfile

@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "specialization",
        "years_of_experience",
        "is_active",
        "created_at",
    )
    search_fields = ("full_name", "specialization")
    readonly_fields = ("created_at", "updated_at")
    list_select_related = ("user",)

    def save_model(self, request, obj, form, change):
        if obj.is_active:
            DoctorProfile.objects.exclude(pk=obj.pk).update(is_active=False)
        super().save_model(request, obj, form, change)
