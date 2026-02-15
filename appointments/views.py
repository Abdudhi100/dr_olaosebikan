# appointments/views.py
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import CreateView, ListView, TemplateView

from core_app.mixins import SEOMixin
from messaging.models import MessageIntent
from .emails import send_booking_emails
from .forms import AppointmentCreateForm
from .models import Appointment, Service
from .utils import generate_or_get_availabilities, validate_booking_window


class AppointmentCreateView(SEOMixin, SuccessMessageMixin, CreateView):
    model = Appointment
    form_class = AppointmentCreateForm
    template_name = "appointments/book_appointment.html"
    success_url = reverse_lazy("appointments:success")
    success_message = "Your appointment request has been submitted."

    seo_title = "Book Appointment — Pain, Arthritis, Autoimmune & Rheumatology Clinic"
    seo_description = "Book a consultation for arthritis, gout, lupus, inflammatory back pain, joint pain and chronic pain management."


    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        # In your design, doctor is derived from service; still pass None for now.
        kwargs["doctor"] = None
        return kwargs

    @transaction.atomic
    def form_valid(self, form):
        response = super().form_valid(form)
        appointment = self.object

        MessageIntent.objects.create(
            appointment=appointment,
            patient_name=appointment.patient_name,
            phone=appointment.patient_phone,
            purpose="appointment",
            status="initiated",
        )

        # Send emails AFTER commit (so availability locking is finalized)
        transaction.on_commit(lambda: send_booking_emails(appointment))
        return response


class AppointmentSlotsView(TemplateView):
    """
    HTMX endpoint:
    GET /appointments/slots/?service=<id>&date=YYYY-MM-DD
    Returns a partial <option> list for the start_time field.
    """
    template_name = "appointments/partials/slot_options.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        service_id = self.request.GET.get("service")
        date_val = self.request.GET.get("date")

        ctx["slots"] = []

        if not service_id or not date_val:
            return ctx

        try:
            service = Service.objects.select_related("doctor").get(pk=service_id, is_active=True)
            chosen_date = AppointmentCreateForm.base_fields["date"].to_python(date_val)

            validate_booking_window(chosen_date)

            qs = generate_or_get_availabilities(
                doctor=service.doctor,
                service=service,
                date=chosen_date,
            )
            ctx["slots"] = qs
        except Exception:
            ctx["slots"] = []

        return ctx


class DoctorAppointmentListView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    model = Appointment
    template_name = "appointments/doctor_appointments.html"
    context_object_name = "appointments"
    paginate_by = 12

    def test_func(self):
        return getattr(self.request.user, "is_doctor", False)

    def get_queryset(self):
        return (
            Appointment.objects.filter(doctor=self.request.user)
            .select_related("service", "availability")
            .only(
                "id",
                "status",
                "created_at",
                "patient_name",
                "patient_phone",
                "patient_email",
                "service__name",
                "availability__date",
                "availability__start_time",
                "availability__end_time",
            )
            .order_by("-created_at")
        )


class AppointmentSuccessView(SEOMixin, TemplateView):
    template_name = "appointments/success.html"
    seo_title = "Appointment Request Submitted — Dr Olaosebikan"
    seo_description = "Your appointment request has been received. Our team will contact you shortly."


class AppointmentStatusUpdateView(LoginRequiredMixin, UserPassesTestMixin, View):
    status = None

    def test_func(self):
        return getattr(self.request.user, "is_doctor", False)

    def post(self, request, pk):
        if self.status is None:
            return redirect("appointments:doctor")

        appointment = get_object_or_404(
            Appointment.objects.only("id", "status", "doctor"),
            pk=pk,
            doctor=request.user,
        )
        appointment.status = self.status
        appointment.save(update_fields=["status"])
        return redirect("appointments:doctor")


class ConfirmAppointmentView(AppointmentStatusUpdateView):
    status = Appointment.STATUS_CONFIRMED


class CancelAppointmentView(AppointmentStatusUpdateView):
    status = Appointment.STATUS_CANCELLED
