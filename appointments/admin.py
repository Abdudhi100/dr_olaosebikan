from django.contrib import admin
from .models import Service, Availability, Appointment

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "doctor", "duration_minutes", "is_active")
    list_filter = ("doctor", "is_active")

@admin.action(description="Mark selected slots as available")
def make_available(modeladmin, request, queryset):
    queryset.update(is_available=True)

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = (
        "doctor",
        "date",
        "start_time",
        "end_time",
        "is_available",
    )
    list_filter = ("doctor", "date", "is_available")
    date_hierarchy = "date"
    ordering = ("date", "start_time")
    search_fields = ("doctor__username",)
    actions = [make_available]
    fieldsets = (
        (None, {
            "fields": ("doctor", "date")
        }),
        ("Time Slot", {
            "fields": ("start_time", "end_time")
        }),
        ("Status", {
            "fields": ("is_available",)
        }),
    )

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("patient_name", "service", "status", "created_at")
    list_filter = ("status", "service")
    search_fields = ("patient_name", "patient_email")
    list_select_related = ("doctor", "patient", "service")






    
