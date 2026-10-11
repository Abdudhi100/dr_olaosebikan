import Link from "next/link";
import { ServicesView } from "@/components/clinic/ServicesView";
import {
  AppointmentFaq,
  VenueSection,
  FaqList,
} from "@/components/clinic/ClinicSections";
import { defaultMetadata } from "@/lib/seo";
export const metadata = defaultMetadata({
  title: "Our care | Dr Olaosebikan",
  description:
    "Explore specialist consultations for pain, arthritis, autoimmune and rheumatology concerns in Lagos.",
  path: "/services",
});
export default function ServicesPage() {
  return (
    <>
      <ServicesView />
      <section className="clinic-services-guidance clinic-section clinic-dark clinic-rounded">
        <div className="clinic-container">
          <p className="clinic-eyebrow">Your consultation</p>
          <h2 className="clinic-title">
            Rheumatology care,
            <br />
            with the whole picture in mind.
          </h2>
          <div className="clinic-two">
            <div>
              <FaqList
                items={[
                  {
                    question: "Discuss your concerns",
                    answer:
                      "Your consultation is an opportunity to discuss your symptoms, previous assessments and ongoing care with Dr Hakeem Olaosebikan, and to clarify the next steps.",
                  },
                  {
                    question: "Choose your consultation setting",
                    answer:
                      "Appointments are available in person and virtually. The clinic will confirm the arrangements with you.",
                  },
                  {
                    question: "Arrange follow-up care",
                    answer:
                      "Request a follow-up appointment to discuss your ongoing care.",
                  },
                ]}
              />
              <Link href="/about-dr-olaosebikan" className="clinic-text-link">
                Meet the specialist <span aria-hidden>↗</span>
              </Link>
            </div>
            <div>
              <img
                className="clinic-portrait"
                src="/images/dr_hakeem.webp"
                width="300"
                height="450"
                alt="Dr Hakeem Olaosebikan"
                loading="lazy"
              />
              <p style={{ fontSize: 21, marginTop: 24 }}>
                Dr Hakeem Olaosebikan
              </p>
              <p className="clinic-small" style={{ marginTop: 12 }}>
                Associate Professor and Senior Consultant Rheumatologist
              </p>
            </div>
          </div>
        </div>
      </section>
      <AppointmentFaq />
      <VenueSection />
    </>
  );
}
