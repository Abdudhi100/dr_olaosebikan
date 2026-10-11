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
    <>
      <PageIntro
        title="Contact the clinic."
        description="Find contact details and consultation information, or request an appointment."
      />
      <section className="clinic-page-body">
        <div className="clinic-container clinic-contact-opening">
          <div>
            <p className="clinic-eyebrow">Appointment arrangements</p>
            <h2>
              Choose your preferences.
              <br />
              The clinic will confirm
              <br />
              the arrangements with you.
            </h2>
            <p>An appointment request is not a confirmed appointment.</p>
            <p>One-hour consultations. Fees are communicated privately.</p>
            <p>
              Ask the clinic how to share medical information before sending
              records.
            </p>
            <Link
              href="/appointments/book"
              className="clinic-button"
              style={{ marginTop: 40 }}
            >
              Request an appointment
            </Link>
          </div>
          <ContactMethods />
        </div>
      </section>
      <AppointmentFaq dark />
      <VenueSection dark />
    </>
  );
}
