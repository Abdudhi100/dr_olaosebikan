import Link from "next/link";
import {
  PageIntro,
  ContactMethods,
  AppointmentFaq,
  VenueSection,
} from "@/components/clinic/ClinicSections";
import { defaultMetadata } from "@/lib/seo";
export const metadata = defaultMetadata({
  title: "Contact and location | Dr Olaosebikan",
  description:
    "Contact the clinic and find in-person and virtual consultation information for Dr Hakeem Olaosebikan.",
  path: "/contact-location",
});
export default function ContactLocationPage() {
  return (
    <div className="clinic-contact-location">
      <PageIntro
        variant="contact"
        eyebrow="Contact & location"
        title={<>Contact{" "}<br className="clinic-mobile-break" />the clinic.</>}
        description="Find contact details and consultation information, or request an appointment."
      />
      <section className="clinic-page-body">
        <div className="clinic-container clinic-contact-opening">
          <ContactMethods />
          <div>
            <p className="clinic-eyebrow">Appointment arrangements</p>
            <h2>Arrange your consultation.</h2>
            <p>Choose your preferences. The clinic will confirm the arrangements with you.</p>
            <Link href="/appointments/book" className="clinic-button">Request an appointment</Link>
            <div className="clinic-contact-guidance">
            <p>An appointment request is not a confirmed appointment.</p>
            <p>One-hour consultations. Fees are communicated privately.</p>
            <p>
              Ask the clinic how to share medical information before sending
              records.
            </p>
            </div>
          </div>
        </div>
      </section>
      <AppointmentFaq dark />
      <VenueSection dark />
    </div>
  );
}
