from django.contrib import admin
from .models import MessageIntent


@admin.register(MessageIntent)
class MessageIntentAdmin(admin.ModelAdmin):
    list_display = (
        "patient_name",
        "phone",
        "purpose",
        "status",
        "created_at",
    )
    list_filter = ("purpose", "created_at")
    readonly_fields = [field.name for field in MessageIntent._meta.fields]
    
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False