from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone

from appointments.models import Appointment, Availability, Service

User = get_user_model()


class AppointmentAvailabilityTest(TestCase):
    """
    Ensures availability is locked on booking
    and unlocked when an appointment is cancelled.
    """

    def setUp(self):
        # Create doctor
        self.doctor = User.objects.create_user(
            username="doctor1",
            password="pass123",
            role=User.ROLE_DOCTOR,
        )

        # Create patient
        self.patient = User.objects.create_user(
            username="patient1",
            password="pass123",
            role=User.ROLE_PATIENT,
        )

        # Create service
        self.service = Service.objects.create(
            doctor=self.doctor,
            name="Consultation",
            description="General health consultation",
            duration_minutes=30,
        )

        # Create availability slot
        self.availability = Availability.objects.create(
            doctor=self.doctor,
            date=timezone.now().date(),
            start_time="10:00",
            end_time="10:30",
            is_available=True,
        )

    def test_availability_unlocks_on_cancel(self):
        # Sanity check: slot starts available
        self.assertTrue(self.availability.is_available)

        # Create confirmed appointment
        appointment = Appointment.objects.create(
            patient=self.patient,
            service=self.service,
            availability=self.availability,
            status=Appointment.STATUS_CONFIRMED,
            patient_name="John Doe",
            patient_email="john@example.com",
            patient_phone="08012345678",
        )

        # Availability should be locked
        self.availability.refresh_from_db()
        self.assertFalse(self.availability.is_available)

        # Cancel appointment
        appointment.status = Appointment.STATUS_CANCELLED
        appointment.save()

        # Availability should unlock
        self.availability.refresh_from_db()
        self.assertTrue(self.availability.is_available)
