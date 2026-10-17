import type { BookingDraft } from "./booking";

export type AppointmentMessageFields = Partial<BookingDraft> & {
  name?: string;
  phone?: string;
  email?: string;
  preferredDate?: string;
  preferredTime?: string;
  service?: string;
  message?: string;
};

export const APPOINTMENT_WHATSAPP_NUMBER = "2348035751154";
export const APPOINTMENT_WHATSAPP_MESSAGE =
  "Hello, I would like to request an appointment with Dr Hakeem Olaosebikan. Please let me know the available dates and how to proceed. Thank you.";

export function whatsappUrl(
  message: string,
  phoneNumber = APPOINTMENT_WHATSAPP_NUMBER,
) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export const APPOINTMENT_WHATSAPP_URL = whatsappUrl(
  APPOINTMENT_WHATSAPP_MESSAGE,
);

/** Legacy arguments remain compatible, but appointment links never include their values. */
export function appointmentMessage(_fields: AppointmentMessageFields = {}) {
  return APPOINTMENT_WHATSAPP_MESSAGE;
}

export function appointmentWhatsAppUrl(_fields?: AppointmentMessageFields) {
  return APPOINTMENT_WHATSAPP_URL;
}
