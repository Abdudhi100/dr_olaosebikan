# appointments/utils.py
from __future__ import annotations

from datetime import datetime, timedelta
from typing import List, Tuple

from django.conf import settings
from django.utils import timezone

from .models import Availability, Service


def _parse_hhmm(value: str):
    # "09:00" -> time(9,0)
    return datetime.strptime(value, "%H:%M").time()


def _combine_local(date, t):
    """
    Combine date + time in the project's timezone. We store date/time separately
    in DB, but we use this to validate 'not in the past'.
    """
    tz = timezone.get_current_timezone()
    dt = datetime.combine(date, t)
    return timezone.make_aware(dt, tz)


def _service_step_minutes(service: Service) -> int:
    # You already have duration_minutes on Service.
    # This becomes the slot length for that service.
    return max(5, int(service.duration_minutes))


def generate_or_get_availabilities(*, doctor, service: Service, date) -> List[Availability]:
    """
    Doctor is available every day.
    For a selected date and service, we create Availability slots for that day
    (if not already created), with slot size = service.duration_minutes.

    Availability rows are marked is_available=True initially.
    Booking locks them to False via Appointment.save().
    """
    start_t = _parse_hhmm(settings.APPOINTMENT_DAY_START)
    end_t = _parse_hhmm(settings.APPOINTMENT_DAY_END)

    step = _service_step_minutes(service)

    day_start = datetime.combine(date, start_t)
    day_end = datetime.combine(date, end_t)

    slots: List[Tuple] = []
    cursor = day_start
    while cursor + timedelta(minutes=step) <= day_end:
        s = cursor.time()
        e = (cursor + timedelta(minutes=step)).time()
        slots.append((s, e))
        cursor += timedelta(minutes=step)

    # Create missing slots idempotently
    existing = set(
        Availability.objects.filter(
            doctor=doctor,
            date=date,
        ).values_list("start_time", "end_time")
    )

    to_create = []
    for s, e in slots:
        if (s, e) not in existing:
            to_create.append(
                Availability(
                    doctor=doctor,
                    date=date,
                    start_time=s,
                    end_time=e,
                    is_available=True,
                )
            )

    if to_create:
        Availability.objects.bulk_create(to_create, ignore_conflicts=True)

    return Availability.objects.filter(
    doctor=doctor,
    date=date,
    is_available=True,
).order_by("start_time")



def validate_booking_window(date) -> None:
    today = timezone.localdate()
    max_day = today + timedelta(days=int(settings.APPOINTMENT_LOOKAHEAD_DAYS))
    if date < today:
        raise ValueError("You cannot book a past date.")
    if date > max_day:
        raise ValueError(f"You can only book up to {settings.APPOINTMENT_LOOKAHEAD_DAYS} days ahead.")


def validate_not_in_past(date, start_time) -> None:
    dt = _combine_local(date, start_time)
    if dt < timezone.now():
        raise ValueError("This time slot is already in the past.")
