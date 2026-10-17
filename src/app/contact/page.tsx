import Link from "next/link";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
export const metadata = defaultMetadata({
  title: "Contact channels | Dr Olaosebikan",
  description:
    "Contact the clinic through phone, WhatsApp or email to arrange your consultation.",
  path: "/contact",
});
export default function ContactPage() {
  return (
    <section className="clinic-section clinic-channels">
      <div className="clinic-container">
        <nav className="clinic-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden>/</span>Contact channels
        </nav>
        <h1 className="clinic-subtitle">How can we help?</h1>
        <p className="clinic-lead" style={{ maxWidth: 740 }}>
          For appointment arrangements, contact the clinic directly through
          WhatsApp, phone or email using the channels below.
        </p>
        <Link
          href="/appointments/book"
          className="clinic-button"
          style={{ marginBlock: 32 }}
        >
          Request an appointment
        </Link>
        <div className="clinic-channel-rows">
          {[
            {
              label: "Phone",
              value: "+234 803 575 1154",
              href: `tel:${site.phoneDial}`,
              action: "Call the clinic",
            },
            {
              label: "WhatsApp",
              value: "+234 803 575 1154",
              href: appointmentWhatsAppUrl(),
              action: "Book via WhatsApp",
            },
            {
              label: "Email",
              value: site.email,
              href: `mailto:${site.email}`,
              action: "Email the clinic",
            },
          ].map((m) => (
            <div key={m.label} className="clinic-channel-row">
              <div>
                <p className="clinic-small">{m.label}</p>
                <p className="clinic-lead">{m.value}</p>
              </div>
              <a
                href={m.href}
                className="clinic-button clinic-button-outline"
                {...(m.label === "WhatsApp"
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {m.action}
              </a>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 40 }}>
          For in-person venue details and virtual consultation guidance, see
          Contact and location.
        </p>
        <Link
          href="/contact-location"
          className="clinic-button clinic-button-outline"
          style={{ marginTop: 32 }}
        >
          View consultation details
        </Link>
      </div>
    </section>
  );
}
