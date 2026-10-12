import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import {
  PageIntro,
  FaqList,
  appointmentFaqs,
} from "@/components/clinic/ClinicSections";
import { faqs } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
const allFaqs = [...faqs, ...appointmentFaqs];
export const metadata = defaultMetadata({
  title: "Frequently asked questions | Dr Olaosebikan",
  description:
    "Answers about rheumatology care, consultations and appointment arrangements.",
  path: "/faq",
});
export default function FaqPage() {
  return (
    <div className="clinic-faq-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: allFaqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      <PageIntro
        variant="faq"
        eyebrow="Your questions, answered"
        title="Common questions."
        description="Answers to common questions about rheumatology, joint pain and specialist care."
      />
      <section className="clinic-page-body">
        <div className="clinic-container clinic-faq-layout">
          <div>
            <p className="clinic-eyebrow">Questions about your health</p>
            <h2 className="clinic-subtitle">
              Understand your next steps.
            </h2>
            <p>
              These answers offer general information and do not replace an
              individual clinical assessment.
            </p>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>
      <section className="clinic-faq-panel clinic-dark clinic-rounded">
        <div className="clinic-container clinic-faq-layout">
          <div>
            <p className="clinic-eyebrow">Appointment arrangements</p>
            <h2 className="clinic-subtitle">
              Before your
              <br />
              appointment.
            </h2>
          </div>
          <FaqList />
        </div>
      </section>
      <section className="clinic-section">
        <div className="clinic-container">
          <p className="clinic-eyebrow">Continue exploring</p>
          <h2 className="clinic-subtitle">Related care and next steps.</h2>
          <div className="clinic-next-step-grid">
            {[
              {
                title: "Rheumatoid arthritis care",
                description:
                  "Information about inflammatory arthritis and specialist care.",
                href: "/rheumatoid-arthritis-treatment-lagos",
              },
              {
                title: "Autoimmune care",
                description:
                  "Explore autoimmune concerns and specialist assessment.",
                href: "/autoimmune-disease-specialist-lagos",
              },
              {
                title: "Appointments",
                description: "Request an in-person or virtual consultation.",
                href: "/appointments/book",
              },
            ].map((card) => (
              <article key={card.href}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link href={card.href}>
                  Explore <span aria-hidden>↗</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
