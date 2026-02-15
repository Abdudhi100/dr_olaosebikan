# appointments/forms.py
from django import forms
from django.utils import timezone

from .models import Appointment, Availability, Service
from .utils import (
    generate_or_get_availabilities,
    validate_booking_window,
    validate_not_in_past,
)


class AppointmentCreateForm(forms.ModelForm):
    date = forms.DateField(
        widget=forms.DateInput(attrs={"type": "date"}),
        help_text="Select a day you want to visit."
    )
    start_time = forms.ChoiceField(choices=[], help_text="Select an available time.")

    class Meta:
        model = Appointment
        fields = [
            "patient_name",
            "patient_email",
            "patient_phone",
            "service",
            "date",
            "start_time",
            "notes",
        ]

    def __init__(self, *args, **kwargs):
        self.doctor = kwargs.pop("doctor", None)  # we pass doctor from the view
        super().__init__(*args, **kwargs)

        base = "mt-1 w-full rounded-lg border-gray-300 focus:border-blue-600 focus:ring-blue-600"
        for f in self.fields.values():
            f.widget.attrs["class"] = base

        self.fields["notes"].widget.attrs.update({"rows": 4, "placeholder": "Additional notes (optional)"})
        self.fields["patient_name"].widget.attrs["placeholder"] = "Full name"
        self.fields["patient_email"].widget.attrs["placeholder"] = "Email address"
        self.fields["patient_phone"].widget.attrs["placeholder"] = "Phone number"

        # limit services to active services only
        self.fields["service"].queryset = Service.objects.filter(is_active=True).select_related("doctor")

        # Pre-fill choices if user already selected service+date
        service_id = self.data.get("service") or self.initial.get("service")
        date_val = self.data.get("date") or self.initial.get("date")

        self.fields["start_time"].choices = [("", "Select a time")]

        if service_id and date_val:
            try:
                service = self.fields["service"].queryset.get(pk=service_id)
                # doctor is derived from service (single doctor site still works)
                doctor = service.doctor
                chosen_date = forms.DateField().to_python(date_val)
                validate_booking_window(chosen_date)

                qs = generate_or_get_availabilities(
                    doctor=doctor,
                    service=service,
                    date=chosen_date,
                )
                self.fields["start_time"].choices += [
                    (a.start_time.strftime("%H:%M"), f"{a.start_time.strftime('%H:%M')} - {a.end_time.strftime('%H:%M')}")
                    for a in qs
                ]
            except Exception:
                # keep base choices
                pass

    def clean(self):
        cleaned = super().clean()

        service: Service = cleaned.get("service")
        date = cleaned.get("date")
        start_time_str = cleaned.get("start_time")

        if not service or not date or not start_time_str:
            return cleaned

        # booking window validation
        try:
            validate_booking_window(date)
        except ValueError as e:
            raise forms.ValidationError(str(e))

        # parse "HH:MM"
        try:
            start_time = timezone.datetime.strptime(start_time_str, "%H:%M").time()
        except Exception:
            raise forms.ValidationError("Invalid start time format.")

        try:
            validate_not_in_past(date, start_time)
        except ValueError as e:
            raise forms.ValidationError(str(e))

        # ensure the Availability exists & is available
        doctor = service.doctor
        qs = generate_or_get_availabilities(doctor=doctor, service=service, date=date)

        availability = qs.filter(start_time=start_time).first()
        if not availability:
            raise forms.ValidationError("That time slot is no longer available. Please pick another time.")

        cleaned["availability_obj"] = availability
        return cleaned

    def save(self, commit=True):
        obj: Appointment = super().save(commit=False)
        service = self.cleaned_data["service"]

        obj.doctor = service.doctor
        obj.service = service
        obj.availability = self.cleaned_data["availability_obj"]

        if commit:
            obj.save()
        return obj
