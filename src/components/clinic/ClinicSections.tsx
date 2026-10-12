import Link from "next/link";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { site } from "@/lib/content";
import { BookingEntryLink } from "@/components/booking/BookingEntryLink";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
export const appointmentFaqs = [
  {
    question: "Where are in-person consultations held?",
    answer:
      "Consultations are available in person at Maryamville Medical Center, 144 Bode Thomas Road, Surulere, Lagos, by appointment.",
  },
  {
    question: "Can I request a virtual consultation?",
    answer:
      "Yes. You can request a virtual consultation. The clinic will share the joining arrangements once your appointment is confirmed.",
  },
  {
    question: "How long is a consultation?",
    answer: "Consultations are arranged as one-hour appointments.",
  },
  {
    question: "How will I know the consultation fee?",
    answer:
      "Fees are communicated privately by the clinic when arranging your appointment.",
  },
  {
    question: "Does submitting the form confirm my appointment?",
    answer:
      "No. Your preferred date and time are a request. The clinic will contact you to confirm availability and the consultation arrangements.",
  },
  {
    question: "Can I book through WhatsApp?",
    answer:
      "You can contact the clinic through WhatsApp to request an appointment. Opening WhatsApp does not submit this form or send a message.",
  },
  {
    question: "Should I send medical records through this form?",
    answer:
      "Please do not include medical records or detailed medical information in the appointment form. Ask the clinic how to share medical information before sending records.",
  },
];
export function MediaSlot({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`clinic-media-slot ${className}`}
      data-media-review="pending"
      role="img"
      aria-label={`${label} — approved image pending`}
    >
      <span>
        {label}
        <br />
        Image awaiting approval
      </span>
    </div>
  );
}
export function FaqList({
  items = appointmentFaqs,
  firstOpen = true,
}: {
  items?: { question: string; answer: string }[];
  firstOpen?: boolean;
}) {
  return (
    <div className="clinic-faq-list">
      {items.map((f, i) => (
        <details
          key={f.question}
          open={firstOpen && i === 0 ? true : undefined}
        >
          <summary>{f.question}</summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
export function AppointmentFaq({ dark = false, layout = "columns" }: { dark?: boolean; layout?: "columns" | "full-width" }) {
  return (
    <section
      className={`clinic-faq-panel clinic-rounded ${dark ? "clinic-dark" : ""}`}
    >
      <div className="clinic-container clinic-faq-layout">
        <div>
          {layout === "full-width" && <p className="clinic-eyebrow">Questions &amp; answers</p>}
          <h2 className="clinic-title">
            {layout === "full-width" ? "Before your appointment." : <>Before your<br />appointment.</>}
          </h2>
          <p>Helpful answers about arranging your consultation.</p>
        </div>
        <FaqList />
      </div>
    </section>
  );
}
export function VenueSection({ dark = false }: { dark?: boolean }) {
  return (
    <section
      className={`clinic-section clinic-venue ${dark ? "clinic-dark clinic-rounded" : ""}`}
    >
      <div className="clinic-container">
        <h2 className="clinic-subtitle">
          Your consultation.
          <br />
          Your choice of setting.
        </h2>
        <div className="clinic-venue-cards">
          <div
            className="clinic-venue-card"
            style={dark ? { color: "#002a30" } : undefined}
          >
            <p className="clinic-eyebrow">In-person consultations</p>
            <h3>
              Maryamville
              <br />
              Medical Center
            </h3>
            <p>
              144 Bode Thomas Road,
              <br />
              Surulere, Lagos.
            </p>
            <p>
              Appointments are arranged in advance. The clinic will confirm your
              date, time and attendance details.
            </p>
            <BookingEntryLink
              seed={{ consultationType: "in-person" }}
              className="clinic-text-link"
            >
              Request a consultation <span aria-hidden>↗</span>
            </BookingEntryLink>
          </div>
          <div className="clinic-venue-card">
            <p className="clinic-eyebrow">Virtual consultations</p>
            <h3>Consult remotely.</h3>
            <p>
              Consult Dr Hakeem Olaosebikan remotely. Joining instructions will
              be shared once your appointment is confirmed.
            </p>
            <BookingEntryLink
              seed={{ consultationType: "virtual" }}
              className="clinic-text-link"
            >
              Request a consultation <span aria-hidden>↗</span>
            </BookingEntryLink>
          </div>
        </div>
        <p className="clinic-small">
          One-hour appointments. Fees are communicated privately.
        </p>
      </div>
    </section>
  );
}
export function PageIntro({
  title,
  description,
  eyebrow,
  variant = "standard",
}: {
  title: React.ReactNode;
  description: string;
  eyebrow?: string;
  variant?: "standard" | "faq" | "resources" | "achievements" | "contact";
}) {
  return (
    <section
      className={`clinic-page-hero clinic-dark clinic-page-hero-${variant}`}
    >
      <div className="clinic-container">
        {eyebrow && <p className="clinic-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p className="clinic-page-description">{description}</p>
        <BookingEntryLink className="clinic-button clinic-button-inverse clinic-page-cta">
          Request an appointment
        </BookingEntryLink>
      </div>
    </section>
  );
}
export function ContactMethods() {
  const methods = [
    {
      label: "Phone",
      icon: Phone,
      value: "+234 803 575 1154",
      href: `tel:${site.phoneDial}`,
      action: "Call the clinic",
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      value: "+234 803 575 1154",
      href: appointmentWhatsAppUrl(),
      action: "Open WhatsApp",
    },
    {
      label: "Email",
      icon: Mail,
      value: site.email,
      href: `mailto:${site.email}`,
      action: "Email the clinic",
    },
  ];
  return (
    <div className="clinic-contact-methods">
      {methods.map((m) => (
        <div key={m.label} className="clinic-contact-card">
          <p className="clinic-eyebrow clinic-contact-channel"><m.icon aria-hidden />{m.label}</p>
          <a className="clinic-contact-value" href={m.href}>
            {m.value}
          </a>
          <a
            className="clinic-text-link"
            href={m.href}
            {...(m.label === "WhatsApp"
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {m.action}
            <span aria-hidden>↗</span>
          </a>
        </div>
      ))}
    </div>
  );
}
export function ResourceExplore({ variant = "publications" }: { variant?: "publications" | "achievements" }) {
  const routes = variant === "achievements" ? [
    { href: "/about-dr-olaosebikan", label: "Meet the specialist", description: "Read the specialist profile." },
    { href: "/contact-location", label: "Consultation information", description: "Find practical appointment guidance." },
    { href: "/faq", label: "Common questions", description: "Read the common clinic questions." },
  ] : [
    { href: "/about-dr-olaosebikan", label: "Meet the specialist", description: "Read the specialist profile." },
    { href: "/faq", label: "Frequently asked questions", description: "Explore general rheumatology information." },
    { href: "/contact-location", label: "Contact & location", description: "Find consultation and contact information." },
  ];
  return (
    <aside className="clinic-resource-explore clinic-dark">
      <p className="clinic-eyebrow">Explore the clinic</p>
      <h2>{variant === "achievements" ? "Learn more about the specialist" : "Other ways to explore care"}</h2>
      {routes.map((route) => <div className="clinic-resource-route" key={route.href}>
        <Link href={route.href}>{route.label}<span aria-hidden>↗</span></Link>
        <p>{route.description}</p>
      </div>)}
    </aside>
  );
}
