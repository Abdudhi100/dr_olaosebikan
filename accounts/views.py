# accounts/views.py
from django.contrib.auth import get_user_model, login
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.views import (
    LoginView,
    LogoutView,
    PasswordChangeView,
    PasswordChangeDoneView,
)
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.utils import timezone
from django.views import View
from django.views.generic import CreateView, ListView, TemplateView

from .forms import UserRegisterForm, StyledAuthenticationForm
from appointments.models import Appointment, Service
from publications.models import Publication, Achievement

User = get_user_model()


class RegisterView(CreateView):
    model = User
    form_class = UserRegisterForm
    template_name = "accounts/register.html"
    success_url = reverse_lazy("accounts:dashboard")

    def form_valid(self, form):
        response = super().form_valid(form)
        login(self.request, self.object)
        return response


class UserLoginView(LoginView):
    template_name = "accounts/login.html"
    authentication_form = StyledAuthenticationForm
    redirect_authenticated_user = True


class UserLogoutView(LogoutView):
    next_page = reverse_lazy("accounts:login")


class UserPasswordChangeView(LoginRequiredMixin, PasswordChangeView):
    template_name = "accounts/password_change.html"
    success_url = reverse_lazy("accounts:password_change_done")


class UserPasswordChangeDoneView(LoginRequiredMixin, PasswordChangeDoneView):
    template_name = "accounts/password_change_done.html"


class DashboardRedirectView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        if request.user.role == User.ROLE_DOCTOR:
            return redirect("accounts:doctor-dashboard")
        return redirect("accounts:patient-dashboard")


class DoctorDashboardView(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = "accounts/dashboards/doctor_dashboard.html"

    def test_func(self):
        return self.request.user.role == User.ROLE_DOCTOR

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        today = timezone.localdate()

        context["today_appointments"] = (
            Appointment.objects.select_related("service", "availability")
            .filter(
                doctor=self.request.user,
                availability__date=today,
                status=Appointment.STATUS_CONFIRMED,
            )
            .order_by("availability__start_time")
        )

        context["pending_appointments"] = (
            Appointment.objects.select_related("service", "availability")
            .filter(doctor=self.request.user, status=Appointment.STATUS_PENDING)
            .order_by("-created_at")
        )

        context["services_count"] = Service.objects.filter(doctor=self.request.user).count()
        context["publications_count"] = Publication.objects.filter(doctor=self.request.user).count()
        context["achievements_count"] = Achievement.objects.filter(doctor=self.request.user).count()
        return context


class PatientDashboardView(LoginRequiredMixin, ListView):
    template_name = "accounts/dashboards/patient_dashboard.html"
    context_object_name = "appointments"
    paginate_by = 10

    def get_queryset(self):
        return (
            Appointment.objects.select_related("service", "availability")
            .filter(patient=self.request.user)
            .order_by("-created_at")
        )
