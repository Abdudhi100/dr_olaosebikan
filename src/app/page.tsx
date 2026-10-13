import { ClinicHeroVideo } from "@/components/clinic/ClinicHeroVideo";
import Link from "next/link";
import { QuickBookingPanel } from "@/components/booking/QuickBookingPanel";
import { BookingEntryLink } from "@/components/booking/BookingEntryLink";
import { CareRail } from "@/components/clinic/CareRail";
import { AppointmentFaq } from "@/components/clinic/ClinicSections";
import { HomepageMedia } from "@/components/clinic/HomepageMedia";
export default function HomePage() {
  return (
    <div className="clinic-home">
      <section className="clinic-hero">
        <ClinicHeroVideo variant="home" />
        <div className="clinic-container clinic-hero-content">
          <h1>
            Specialist
            <br />
            rheumatology care.
          </h1>
          <p className="clinic-hero-description">
            Consult Dr Hakeem Olaosebikan for pain, arthritis and autoimmune
            concerns. Appointments are available in person and virtually.
          </p>
          <Link href="/services" className="clinic-text-link">
            Explore our care <span aria-hidden>↗</span>
          </Link>
          <QuickBookingPanel
            requestLabel="Continue to appointment request"
            whatsappLabel="Book via WhatsApp"
          />
        </div>
      </section>
      <section className="clinic-practice clinic-section clinic-dark clinic-rounded">
        <div className="clinic-container">
          <p className="clinic-eyebrow">Our care</p>
          <h2 className="clinic-title">
            Care for the concerns that affect your everyday.
          </h2>
          <div className="clinic-practice-grid">
            <HomepageMedia media="notes" />
            <div className="clinic-copy clinic-lead">
              <p>
                Specialist consultations for pain, arthritis and autoimmune
                concerns, in person and virtually.
              </p>
              <p>
                Explore our areas of care and choose the consultation that best
                matches what you would like to discuss.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="clinic-specialist-preview">
        <div className="clinic-container clinic-two">
          <div className="clinic-home-portrait">
          <img
            className="clinic-portrait"
            src="/images/dr_hakeem.webp"
            width="420"
            height="630"
            alt="Dr Hakeem Olaosebikan"
            loading="lazy"
          />
          </div>
          <div className="clinic-copy">
            <p className="clinic-eyebrow">The specialist behind your care</p>
            <h2 className="clinic-preview-heading">
              Meet Dr Hakeem
              <br />
              Olaosebikan.
            </h2>
            <p className="clinic-lead">
              Associate Professor and Senior Consultant Rheumatologist.
            </p>
            <p className="clinic-lead">
              Specialist consultations for pain, arthritis and autoimmune
              concerns, in person and virtually.
            </p>
            <Link href="/about-dr-olaosebikan" className="clinic-text-link">
              Meet the specialist <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>
      <CareRail />
      <section className="clinic-setting">
        <div className="clinic-container">
          <h2 className="clinic-title">
            Your consultation.
            <br />
            Your choice of setting.
          </h2>
          <div className="clinic-two">
            <div className="clinic-setting-card">
              <HomepageMedia media="notes" />
              <h3>In-person consultations</h3>
              <p>
                Consultations available in person at Maryamville Medical Center,
                144 Bode Thomas Road, Surulere, Lagos.
              </p>
              <p>
                Appointments are arranged in advance. The clinic will confirm
                your date, time and attendance details.
              </p>
              <BookingEntryLink
                seed={{ consultationType: "in-person" }}
                className="clinic-text-link"
              >
                Request a consultation <span aria-hidden>↗</span>
              </BookingEntryLink>
            </div>
            <div className="clinic-setting-card">
              <HomepageMedia media="laptop" />
              <h3>Virtual consultations</h3>
              <p>
                Consult Dr Hakeem Olaosebikan remotely. Joining instructions
                will be shared once your appointment is confirmed.
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
      <section className="clinic-whole-care">
        <div className="clinic-container clinic-two">
          <div>
            <p className="clinic-eyebrow">Your consultation</p>
            <h2 className="clinic-subtitle">
              Rheumatology care,
              <br />
              with the whole
              <br />
              picture in mind.
            </h2>
            <p className="clinic-lead">
              Your consultation is an opportunity to discuss your symptoms,
              previous assessments and ongoing care with Dr Hakeem Olaosebikan,
              and to clarify the next steps.
            </p>
          </div>
          <div className="clinic-collage">
            <HomepageMedia media="autoimmune" />
            <HomepageMedia media="movement" />
            <HomepageMedia media="preparation" />
          </div>
        </div>
      </section>
      <section className="clinic-journey">
        <div className="clinic-container">
          <p className="clinic-eyebrow">Arranging your visit</p>
          <h2 className="clinic-subtitle">
            A clear path to your consultation.
          </h2>
          <div className="clinic-steps">
            {[
              {
                title: "Send your request",
                body: "Share your contact details and appointment preferences.",
              },
              {
                title: "Confirm the arrangements",
                body: "The clinic will contact you to agree availability and communicate the consultation fee.",
              },
              {
                title: "Attend your consultation",
                body: "Attend in person or join virtually, using the confirmed instructions.",
              },
            ].map((step, i) => (
              <div className="clinic-step" key={step.title}>
                <p className="clinic-step-number">0{i + 1}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <AppointmentFaq dark />
    </div>
  );
}
