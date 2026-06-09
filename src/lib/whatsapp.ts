import { site } from "@/lib/content";

export type AppointmentMessageFields = {
  name?: string;
  phone?: string;
  email?: string;
  preferredDate?: string;
  preferredTime?: string;
  service?: string;
  message?: string;
};

export function whatsappUrl(message: string, phoneNumber = site.whatsappNumber) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function appointmentMessage(fields: AppointmentMessageFields = {}) {
  const lines = [
    "Hello Dr Olaosebikan,",
    "",
    "I would like to book an appointment.",
    "",
    fields.name ? `Name: ${fields.name}` : "Name:",
    fields.phone ? `Phone: ${fields.phone}` : "Phone:",
    fields.email ? `Email: ${fields.email}` : "Email:",
    fields.preferredDate ? `Preferred Date: ${fields.preferredDate}` : "Preferred Date:",
    fields.preferredTime ? `Preferred Time: ${fields.preferredTime}` : "Preferred Time:",
    fields.service ? `Service/Complaint: ${fields.service}` : "Service/Complaint:",
    fields.message ? `Message/Symptoms: ${fields.message}` : "Message/Symptoms:",
  ];

  return lines.join("\n");
}

export function appointmentWhatsAppUrl(fields?: AppointmentMessageFields) {
  return whatsappUrl(appointmentMessage(fields));
}
