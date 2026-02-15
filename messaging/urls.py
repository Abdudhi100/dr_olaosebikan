from django.urls import path
from .views import WhatsAppMessageView

app_name = "messaging"

urlpatterns = [
    path("contact/whatsapp/", WhatsAppMessageView.as_view(), name="whatsapp"),
]