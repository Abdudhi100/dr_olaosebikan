import { ClinicHeroVideo } from "@/components/clinic/ClinicHeroVideo";
import Link from "next/link";
import { BookingForm } from "@/components/booking/BookingForm";
import release from "../../../../config/clinic-release.json";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
export const metadata = defaultMetadata({
  title: "Request an appointment | Dr Olaosebikan",
  description:
    "Request an in-person or virtual consultation. Appointment dates, times and fees are confirmed privately by the clinic.",
  path: "/appointments/book",
});
export default function BookingPage() {
  return (
    <section className="clinic-booking">
      <div className="clinic-booking-hero clinic-video-host">
        <ClinicHeroVideo variant="appointments" overlayClassName="clinic-hero-shade clinic-hero-shade-paper" />
        <div className="clinic-container">
          <nav className="clinic-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden>/</span>Appointment request
          </nav>
          <div className="clinic-booking-heading">
            <h1>Request an appointment</h1>
            <p>
              {release.booking.enabled
                ? "Choose your preferences and tell us how to contact you. The clinic will confirm availability and the consultation arrangements."
                : "Request an in-person or virtual consultation directly through WhatsApp, phone or email. The clinic will confirm availability and fees."}
            </p>
          </div>
        </div>
      </div>
      <div className="clinic-container">
        <div className="clinic-booking-layout">
          <BookingForm />
          <aside className="clinic-booking-sidebar">
            <h2>What happens next?</h2>
            <div>
              <h3>Agree the arrangements</h3>
              <p>
                The clinic will contact you to confirm availability and
                communicate the consultation fee privately.
              </p>
            </div>
            <hr />
            <p>
              In-person consultations available at Maryamville Medical Center,
              144 Bode Thomas Road, Surulere, Lagos.
            </p>
            <p>
              For virtual consultations, joining instructions are shared after
              confirmation.
            </p>
            <a
              href={appointmentWhatsAppUrl()}
              className="clinic-button clinic-button-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book via WhatsApp
            </a>
            <a href={`tel:${site.phoneDial}`} className="clinic-text-link">
              +234 803 575 1154
            </a>
            <Link href="/contact-location" className="clinic-text-link">
              Contact and location <span aria-hidden>↗</span>
            </Link>
            <a href={`mailto:${site.email}`} className="clinic-text-link">
              {site.email}
            </a>
            {release.booking.enabled && (
              <Link href="/appointment-privacy" className="clinic-text-link">
                Appointment privacy information <span aria-hidden>↗</span>
              </Link>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
