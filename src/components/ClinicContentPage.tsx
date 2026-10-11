import Link from "next/link";
import type { ClinicPage } from "@/lib/content";
import { BookingEntryLink } from "@/components/booking/BookingEntryLink";
const copy: Record<
  string,
  { title: string; description: string; headings: string[] }
> = {
  "rheumatoid-arthritis-treatment-lagos": {
    title: "Rheumatoid arthritis\ncare in Lagos.",
    description:
      "Specialist assessment and ongoing care for inflammatory joint concerns.",
    headings: [
      "Understanding rheumatoid arthritis",
      "Concerns you may want to discuss",
      "Your specialist assessment",
      "An individual approach to care",
      "Discuss your next steps",
    ],
  },
  "gout-treatment-lagos": {
    title: "Gout care\nin Lagos.",
    description:
      "Specialist review for gout symptoms, recurring attacks and long-term care planning.",
    headings: [
      "Understanding gout",
      "Concerns you may want to discuss",
      "Your specialist assessment",
      "An individual approach to care",
      "Discuss your next steps",
    ],
  },
  "lupus-care-lagos": {
    title: "Lupus care,\nwith you in mind.",
    description:
      "Specialist assessment, monitoring and ongoing autoimmune care in Lagos.",
    headings: [
      "Understanding lupus",
      "Concerns you may want to discuss",
      "Your specialist assessment",
      "An individual approach to care",
      "Discuss your next steps",
    ],
  },
  "joint-pain-and-stiffness-clinic-lagos": {
    title: "When joint pain\naffects your everyday.",
    description:
      "Specialist assessment of persistent pain, stiffness and movement concerns.",
    headings: [
      "Understanding joint pain and stiffness",
      "Concerns you may want to discuss",
      "Your specialist assessment",
      "An individual approach to care",
      "Discuss your next steps",
    ],
  },
  "autoimmune-disease-specialist-lagos": {
    title: "A clearer picture\nof autoimmune concerns.",
    description:
      "Specialist evaluation for autoimmune symptoms and ongoing rheumatology care.",
    headings: [
      "Understanding autoimmune concerns",
      "Concerns you may want to discuss",
      "Your specialist assessment",
      "An individual approach to care",
      "Discuss your next steps",
    ],
  },
};
export function ClinicContentPage({ page }: { page: ClinicPage }) {
  const design = copy[page.slug] ?? {
    title: page.title,
    description: page.description,
    headings: page.sections.map((s) => s.heading),
  };
  const nav = [
    "Overview",
    "Common symptoms",
    "Your assessment",
    "Approach to care",
    "Request a consultation",
  ];
  return (
    <article>
      <section className="clinic-care-intro clinic-dark clinic-rounded">
        <div className="clinic-container">
          <nav className="clinic-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/services">Our care</Link>
            <span aria-hidden>/</span>
            {page.eyebrow}
          </nav>
          <h1 className="clinic-title">{design.title}</h1>
          <p className="clinic-lead">{design.description}</p>
          <BookingEntryLink className="clinic-button clinic-button-inverse">
            Request an appointment
          </BookingEntryLink>
        </div>
      </section>
      <section className="clinic-section">
        <div className="clinic-container clinic-care-body">
          <nav className="clinic-care-menu" aria-label="On this page">
            <p className="clinic-eyebrow">On this page</p>
            {nav.map((label, i) => (
              <a href={`#care-section-${i}`} key={label}>
                {label}
              </a>
            ))}
          </nav>
          <div>
            {page.sections.map((section, i) => (
              <section
                id={`care-section-${i}`}
                className="clinic-care-section"
                key={section.heading}
              >
                <h2>{design.headings[i] ?? section.heading}</h2>
                {section.body?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {section.cards && (
                  <div className="clinic-symptom-grid">
                    {section.cards.map((c) => (
                      <div className="clinic-symptom-card" key={c.title}>
                        <h3>{c.title}</h3>
                        <p>{c.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                {i === page.sections.length - 1 && (
                  <>
                    <BookingEntryLink className="clinic-button">
                      Request an appointment
                    </BookingEntryLink>
                    <p className="clinic-small" style={{ marginTop: 24 }}>
                      In person or virtually. One-hour appointments. Fees are
                      communicated privately. A request is not a confirmed
                      appointment.
                    </p>
                  </>
                )}
              </section>
            ))}
            <p
              className="clinic-small"
              style={{ borderTop: "1px solid #bbc9c6", paddingTop: 32 }}
            >
              General educational information, not a diagnosis or a substitute
              for individual medical advice.
            </p>
            <section className="clinic-care-section">
              <h2>Explore related care</h2>
              {page.related.map((r) => (
                <Link
                  href={r.href}
                  key={r.href}
                  className="clinic-related-link"
                >
                  {r.title} <span aria-hidden>↗</span>
                </Link>
              ))}
            </section>
          </div>
        </div>
      </section>
    </article>
  );
}
