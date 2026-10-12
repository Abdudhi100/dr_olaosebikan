import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { doctor, getPageBySlug, site } from "@/lib/content";
import { defaultMetadata, physicianJsonLd } from "@/lib/seo";
import { VenueSection, FaqList } from "@/components/clinic/ClinicSections";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
const page = getPageBySlug("about-dr-olaosebikan")!;
export const metadata = defaultMetadata({
  title: page.seoTitle,
  description: page.seoDescription,
  keywords: page.keywords,
  path: page.path,
});
export default function SpecialistPage() {
  return (
    <>
      <JsonLd data={physicianJsonLd()} />
      <article className="clinic-specialist-page">
        <section className="clinic-profile-intro">
          <div className="clinic-container">
            <p className="clinic-eyebrow">The specialist</p>
            <h1>
              Dr Hakeem
              <br />
              Olaosebikan.
            </h1>
            <p className="clinic-profile-role">
              Associate Professor and Senior Consultant Rheumatologist
            </p>
            <div className="clinic-profile-summary">
              <div>
                <p>
                  Specialist consultations for pain, arthritis and autoimmune
                  concerns, in person and virtually.
                </p>
                <p>
                  One-hour consultations. Fees are communicated privately. An
                  appointment request is not a confirmed appointment.
                </p>
              </div>
              <div>
                <div className="clinic-actions">
                  <Link href="/appointments/book" className="clinic-button">
                    Request an appointment
                  </Link>
                  <a
                    href={appointmentWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clinic-text-link"
                  >
                    Contact via WhatsApp <span aria-hidden>↗</span>
                  </a>
                </div>
                <a href={`tel:${site.phoneDial}`} className="clinic-text-link">
                  +234 803 575 1154
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="clinic-profile-main clinic-section clinic-dark clinic-rounded">
          <div className="clinic-container clinic-two">
            <img
              className="clinic-portrait"
              src="/images/figma/specialist.webp"
              width="548"
              height="822"
              alt="Dr Hakeem Olaosebikan"
              loading="lazy"
            />
            <div>
              <p className="clinic-eyebrow">Introduction</p>
              <h2>
                Specialist care,
                <br />
                with you in mind.
              </h2>
              <p className="clinic-lead">{doctor.bio[0]}</p>
              <div className="clinic-profile-focus">
              <p className="clinic-eyebrow">
                Care focus
              </p>
              {[
                {
                  title: "Joint & musculoskeletal concerns",
                  items: [
                    "Joint pain",
                    "Musculoskeletal concerns",
                    "Inflammatory back pain",
                  ],
                },
                {
                  title: "Inflammatory & autoimmune conditions",
                  items: [
                    "Inflammatory arthritis",
                    "Gout",
                    "Lupus",
                    "Autoimmune symptoms",
                  ],
                },
                {
                  title: "Ongoing rheumatology care",
                  items: ["Long-term follow-up for chronic rheumatic disease"],
                },
              ].map((g) => (
                <div className="clinic-focus-group" key={g.title}>
                  <h3>{g.title}</h3>
                  <div className="clinic-chips">
                    {g.items.map((x) => (
                      <span className="clinic-chip" key={x}>
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>
        <section className="clinic-biography clinic-section">
          <div className="clinic-container">
            <div className="clinic-faq-list">
              <details open>
                <summary>Biography</summary>
                <div className="clinic-biography-text">
                  <div>
                    <p className="clinic-eyebrow">Rheumatology care in Lagos</p>
                    <h3>
                      Careful assessment.
                      <br />
                      Clear diagnosis.
                      <br />
                      Practical treatment planning.
                    </h3>
                  </div>
                  <div className="clinic-copy">
                    {doctor.bio.map((x) => (
                      <p key={x}>{x}</p>
                    ))}
                  </div>
                </div>
              </details>
            </div>
            <div className="clinic-profile-approach">
            <div>
            <p className="clinic-eyebrow">
              Consultation approach
            </p>
            <h2 className="clinic-subtitle">
              Understanding your concerns.
              <br />
              Planning your care.
            </h2>
            </div>
            <FaqList
              items={[
                {
                  question: "Clinical assessment & diagnosis",
                  answer:
                    page.sections
                      .find((s) => s.heading === "How diagnosis is approached")
                      ?.body?.join(" ") || doctor.bio[2],
                },
                {
                  question: "Treatment planning & symptom control",
                  answer:
                    page.sections
                      .find((s) => s.heading === "Treatment approach")
                      ?.body?.join(" ") || doctor.bio[2],
                },
                {
                  question: "Patient education & structured follow-up",
                  answer: doctor.bio[2],
                },
              ]}
            />
            </div>
          </div>
        </section>
        <section className="clinic-profile-related clinic-section clinic-sage clinic-rounded">
          <div className="clinic-container">
            <p className="clinic-eyebrow">Related care</p>
            <h2 className="clinic-title">Explore relevant care.</h2>
            <div className="clinic-related-grid">
              {[
                {
                  image: "rheumatology",
                  title: "Rheumatology consultation",
                  description:
                    "A specialist consultation for rheumatology concerns and next-step guidance.",
                  href: "/appointments/book",
                },
                {
                  image: "autoimmune",
                  title: "Lupus care",
                  description:
                    "Arrange a consultation about lupus and your ongoing care.",
                  href: "/lupus-care-lagos",
                },
                {
                  image: "gout",
                  title: "Gout treatment",
                  description:
                    "Arrange a consultation to discuss gout and your care.",
                  href: "/gout-treatment-lagos",
                },
              ].map((c) => (
                <div className="clinic-related-card" key={c.title}>
                  <img
                    src={`/images/figma/${c.image}.webp`}
                    alt=""
                    loading="lazy"
                  />
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                    <Link href={c.href} className="clinic-text-link">
                      {c.href.includes("appointments")
                        ? "Request an appointment"
                        : "Explore this care"}{" "}
                      <span aria-hidden>↗</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <VenueSection />
      </article>
    </>
  );
}
