# appointments/emails.py
import logging
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def _clean_recipients(recipients):
    """Remove blanks/None and duplicates."""
    cleaned = []
    for r in (recipients or []):
        r = (r or "").strip()
        if r and r not in cleaned:
            cleaned.append(r)
    return cleaned


def send_booking_emails(appointment) -> None:
    """
    Sends:
    - patient confirmation email
    - doctor notification email

    Booking should NEVER crash if email fails.
    """
    try:
        ctx = {"a": appointment}

        # -------------------------
        # Patient email
        # -------------------------
        patient_to = _clean_recipients([getattr(appointment, "patient_email", "")])
        if patient_to:
            patient_subject = "Appointment request received — Dr Olaosebikan"
            patient_txt = render_to_string("appointments/emails/patient_booking.txt", ctx)
            patient_html = render_to_string("appointments/emails/patient_booking.html", ctx)

            msg1 = EmailMultiAlternatives(
                subject=patient_subject,
                body=patient_txt,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=patient_to,
                reply_to=_clean_recipients([getattr(settings, "DOCTOR_NOTIFICATION_EMAIL", "")]),
            )
            msg1.attach_alternative(patient_html, "text/html")
            msg1.send(fail_silently=False)

        # -------------------------
        # Doctor email
        # -------------------------
        doctor_to = []

        # Prefer the doctor user email if attached
        if getattr(appointment, "doctor", None) and getattr(appointment.doctor, "email", None):
            doctor_to = [appointment.doctor.email]
        else:
            doctor_to = [getattr(settings, "DOCTOR_NOTIFICATION_EMAIL", "")]

        doctor_to = _clean_recipients(doctor_to)

        if doctor_to:
            doctor_subject = f"New appointment booking — {appointment.patient_name}"
            doctor_txt = render_to_string("appointments/emails/doctor_booking.txt", ctx)
            doctor_html = render_to_string("appointments/emails/doctor_booking.html", ctx)

            msg2 = EmailMultiAlternatives(
                subject=doctor_subject,
                body=doctor_txt,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=doctor_to,
                reply_to=_clean_recipients([getattr(appointment, "patient_email", "")]),
            )
            msg2.attach_alternative(doctor_html, "text/html")
            msg2.send(fail_silently=False)

    except Exception:
        # IMPORTANT: don't break the booking flow
        logger.exception("Failed sending booking emails for appointment_id=%s", appointment.id)