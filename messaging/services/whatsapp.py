import urllib.parse
from django.conf import settings


class WhatsAppMessageBuilder:
    """
    Builds WhatsApp deep links in a clean, testable way.
    """

    def __init__(self, phone_number: str):
        self.phone_number = phone_number

    def build_message(self, text: str) -> str:
        encoded_text = urllib.parse.quote(text)
        return f"https://wa.me/{self.phone_number}?text={encoded_text}"

    @staticmethod
    def appointment_message(data: dict) -> str:
        return (
            "Hello Dr Olaosebikan,\n\n"
            "I would like to book an appointment.\n\n"
            f"Name: {data.get('patient_name')}\n"
            f"Phone: {data.get('phone')}\n"
            f"Preferred Date: {data.get('preferred_date')}\n"
            f"Service: {data.get('service')}\n"
        )

    @staticmethod
    def general_message(data: dict) -> str:
        return (
            "Hello Dr Olaosebikan,\n\n"
            "I would like to make an enquiry.\n\n"
            f"Name: {data.get('patient_name')}\n"
            f"Phone: {data.get('phone')}\n"
            f"Message: {data.get('message')}\n"
        )