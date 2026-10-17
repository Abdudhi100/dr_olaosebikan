import Link from "next/link";
import { ServicesView } from "@/components/clinic/ServicesView";
import {
  AppointmentFaq,
  VenueSection,
} from "@/components/clinic/ClinicSections";
import { BookingEntryLink } from "@/components/booking/BookingEntryLink";
import { defaultMetadata } from "@/lib/seo";
export const metadata = defaultMetadata({
  title: "Our care | Dr Olaosebikan",
  description:
    "Explore specialist consultations for pain, arthritis, autoimmune and rheumatology concerns in Lagos.",
  path: "/services",
});
export default function ServicesPage() {
  return (
    <div className="clinic-services-page">
      <ServicesView />
      <section className="clinic-services-guidance clinic-section clinic-dark clinic-rounded">
        <div className="clinic-container">
          <p className="clinic-eyebrow">Your consultation</p>
          <h2 className="clinic-title">
            Your consultation, <span>with the whole picture in mind.</span>
          </h2>
          <div className="clinic-services-disclosures">
            <div className="clinic-services-discussion">
            <details open>
              <summary>Discuss your concerns</summary>
              <div>
              <p>Your consultation is an opportunity to discuss your symptoms, previous assessments and ongoing care with Dr Hakeem Olaosebikan, and to clarify the next steps.</p>
              <Link href="/about-dr-olaosebikan" className="clinic-text-link">
                Meet the specialist <span aria-hidden>↗</span>
              </Link>
              <BookingEntryLink className="clinic-button clinic-button-inverse">
                Request an appointment
              </BookingEntryLink>
              </div>
            </details>
            <div className="clinic-services-identity">
              <img
                className="clinic-portrait"
                src="/images/dr_hakeem.webp"
                width="300"
                height="450"
                alt="Dr Hakeem Olaosebikan"
                loading="lazy"
              />
              <p className="clinic-services-name">
                Dr Hakeem Olaosebikan
              </p>
              <p className="clinic-small">
                Associate Professor and Senior Consultant Rheumatologist
              </p>
            </div>
            </div>
            <details>
              <summary>Choose your consultation setting</summary>
              <p>Appointments are available in person and virtually. The clinic will confirm the arrangements with you.</p>
            </details>
            <details>
              <summary>Arrange follow-up care</summary>
              <p>Request a follow-up appointment to discuss your ongoing care.</p>
            </details>
          </div>
        </div>
      </section>
      <AppointmentFaq layout="full-width" />
      <VenueSection />
    </div>
  );
}
