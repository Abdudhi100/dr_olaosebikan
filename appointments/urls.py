from django.urls import path
from .views import (
    AppointmentCreateView,
    DoctorAppointmentListView,
    AppointmentSuccessView,
    CancelAppointmentView,
    ConfirmAppointmentView,
    AppointmentSlotsView,
)

app_name = "appointments"

urlpatterns = [
    path("book/", AppointmentCreateView.as_view(), name="book"),
    path("success/", AppointmentSuccessView.as_view(), name="success"),

    # HTMX endpoint
    path("slots/", AppointmentSlotsView.as_view(), name="slots"),

    # Doctor views
    path("doctor/", DoctorAppointmentListView.as_view(), name="doctor"),
    path("doctor/<int:pk>/confirm/", ConfirmAppointmentView.as_view(), name="confirm"),
    path("doctor/<int:pk>/cancel/", CancelAppointmentView.as_view(), name="cancel"),
]
