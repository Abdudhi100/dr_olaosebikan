from django.conf import settings
from django.shortcuts import redirect
from django.views.generic import FormView

from .forms import WhatsAppMessageForm
from .models import MessageIntent
from .services.whatsapp import WhatsAppMessageBuilder


class WhatsAppMessageView(FormView):
    template_name = "messaging/contact_whatsapp.html"
    form_class = WhatsAppMessageForm

    def form_valid(self, form):
        intent = MessageIntent.objects.create(
            patient_name=form.cleaned_data["patient_name"],
            phone=form.cleaned_data["phone"],
            purpose="general",
            status="initiated",
        )

        message_text = WhatsAppMessageBuilder.general_message(
            form.cleaned_data
        )

        whatsapp_url = WhatsAppMessageBuilder(
            settings.DOCTOR_WHATSAPP_NUMBER
        ).build_message(message_text)

        intent.status = "redirected"
        intent.save(update_fields=["status"])

        return redirect(whatsapp_url)