import { site } from "@/lib/content";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./Booking.module.css";

/**
 * Contact-only launch: renders no patient data form, no Web3Forms transport,
 * and no personal booking details in outbound URLs.
 */
export function ContactOnlyBooking({ placement = "page" }: { placement?: "page" | "hero" }) {
  const headingId = placement === "hero" ? "hero-contact-heading" : "booking-contact-heading";
  return (
    <section data-booking-mode="contact-only" aria-labelledby={headingId}
      className={`${styles.contactOnly} ${placement === "hero" ? styles.contactOnlyHero : styles.contactOnlyPage}`}>
      <p className={styles.contactOnlyEyebrow}>Appointment enquiries</p>
      <h2 id={headingId}>Contact the clinic to arrange your consultation.</h2>
      <p>
        In-person and virtual appointments are arranged directly with the clinic.
        There is no online appointment submission form at present.
      </p>
      <div className={styles.contactOnlyLinks} aria-label="Ways to request an appointment">
        <a href={appointmentWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="clinic-button">
          Request via WhatsApp
        </a>
        <a href={`tel:${site.phoneDial}`} className="clinic-button clinic-button-outline">
          Call the clinic
        </a>
        <a href={`mailto:${site.email}`} className="clinic-text-link">
          Email the clinic
        </a>
      </div>
      <p className={styles.contactOnlyHelp}>
        Opening a contact channel does not book or confirm an appointment.
        The clinic will agree a time and fee with you. Please do not include
        medical records or detailed medical information in an initial enquiry.
      </p>
      <p className={styles.contactOnlyDetails}>
        Telephone/WhatsApp: +234 803 575 1154 · {site.email}
      </p>
    </section>
  );
}
