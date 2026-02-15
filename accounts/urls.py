# accounts/urls.py
from django.urls import path
from .views import (RegisterView,UserLoginView,UserLogoutView,UserPasswordChangeView,UserPasswordChangeDoneView,DoctorDashboardView,PatientDashboardView,DashboardRedirectView
)
app_name = "accounts"
urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("logout/", UserLogoutView.as_view(), name="logout"),
    path("dashboard/", DashboardRedirectView.as_view(), name="dashboard"),

    path("password-change/", UserPasswordChangeView.as_view(), name="password_change"),
    path(
        "password-change/done/",
        UserPasswordChangeDoneView.as_view(),
        name="password_change_done",
    ),
    path("dashboard/doctor/", DoctorDashboardView.as_view(), name="doctor-dashboard"),
    path("dashboard/patient/", PatientDashboardView.as_view(), name="patient-dashboard"),


]
