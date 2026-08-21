import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { doctor, pages, services, site } from "@/lib/content";
import { buttonStyles } from "@/lib/styles";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
import { physicianJsonLd } from "@/lib/seo";

const conditionRouteOrder = [
  "/rheumatoid-arthritis-treatment-lagos",
  "/gout-treatment-lagos",
  "/lupus-care-lagos",
  "/autoimmune-disease-specialist-lagos",
  "/joint-pain-and-stiffness-clinic-lagos",
];

const carePathways = conditionRouteOrder.flatMap((path) => {
  const page = pages.find((candidate) => candidate.path === path);
  return page
    ? [
        {
          title: page.title,
          href: page.path,
          description: page.description,
        },
      ]
    : [];
});

const professionalDetails = [
  {
    label: "Professional title",
    value: doctor.title,
  },
  {
    label: "Specialty focus",
    value: doctor.specialization,
  },
  {
    label: "Clinic location",
    value: doctor.hospitalAffiliations.join(", "),
  },
  {
    label: "Professional networks",
    value: doctor.professionalMemberships.join(", "),
  },
];

const carePrinciples = [
  "Careful clinical assessment",
  "Clear diagnosis",
  "Structured follow-up",
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={physicianJsonLd()} />

      <section className="bg-surface-page" aria-labelledby="homepage-hero-heading">
        <div className="mx-auto max-w-wide px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] lg:items-center">
            <div className="max-w-reading">
              <p className="text-sm font-semibold text-brand-primary">
                {doctor.title}
              </p>
              <h1
                id="homepage-hero-heading"
                className="mt-3 text-page-title tracking-normal text-text-primary sm:text-page-title-lg lg:text-display"
              >
                {doctor.displayName}
              </h1>
              <p className="mt-4 text-subsection-title tracking-normal text-text-secondary">
                {doctor.specialization}
              </p>
              <p className="mt-5 text-lead text-text-secondary">
                {site.heroSubtitle}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/appointments/book" className={`${buttonStyles.primary} w-full sm:w-auto`}>
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {site.heroCtaText}
                </Link>
                <Link href="#care-areas" className={`${buttonStyles.tertiary} justify-center sm:justify-start`}>
                  Can he help me?
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[26rem] lg:mr-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted ring-1 ring-border-subtle">
                <Image
                  src={doctor.profilePhoto}
                  alt={`Photo of ${doctor.displayName}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 430px"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

          <dl className="mt-8 grid gap-5 border-t border-border-subtle pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-support font-semibold text-text-tertiary">
                Clinic
              </dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                {doctor.hospitalAffiliations[0]}
              </dd>
            </div>
            <div>
              <dt className="text-support font-semibold text-text-tertiary">
                Focus
              </dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                Pain, arthritis and autoimmune care
              </dd>
            </div>
            <div>
              <dt className="text-support font-semibold text-text-tertiary">
                Access
              </dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                No referral needed
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-y border-brand-primary-border bg-brand-primary-subtle py-8 sm:py-16" aria-labelledby="approach-heading">
        <div className="mx-auto grid max-w-wide gap-7 px-4 sm:px-6 lg:grid-cols-[minmax(17rem,0.68fr)_minmax(0,1.32fr)] lg:items-center">
          <div className="lg:max-w-sm">
            <p className="text-sm font-semibold text-brand-primary">
              Care approach
            </p>
            <h2 id="approach-heading" className="mt-3 text-section-title tracking-normal text-text-primary sm:text-section-title-lg">
              Specialist review with clear next steps
            </h2>
          </div>
          <div className="max-w-[52rem] text-body text-text-secondary">
            <p className="max-w-reading">
              {doctor.bio[2]}
            </p>
            <div className="mt-6 grid border-y border-brand-primary-border sm:grid-cols-3 sm:divide-x sm:divide-brand-primary-border">
              {carePrinciples.map((item, index) => (
                <div key={item} className="border-b border-brand-primary-border py-4 last:border-b-0 sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:pr-0">
                  <p className="text-xs font-bold text-brand-primary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-text-primary">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-surface-page py-8 sm:py-16" aria-labelledby="services-heading">
        <div className="mx-auto max-w-wide px-4 sm:px-6">
          <div className="max-w-reading">
            <p className="text-sm font-semibold text-brand-primary">
              Clinic services
            </p>
            <h2 id="services-heading" className="mt-3 text-section-title tracking-normal text-text-primary sm:text-section-title-lg">
              {site.heroTitle}
            </h2>
            <p className="mt-4 text-body text-text-secondary">
              Targeted, evidence-based care for joint pain, stiffness, inflammation, autoimmune conditions, and chronic pain with clear plans and structured follow-up.
            </p>
          </div>

          <div className="mt-9 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <section key={service.slug} className="border-t border-border-subtle py-5" aria-labelledby={`${service.slug}-heading`}>
                <h3 id={`${service.slug}-heading`} className="text-subsection-title tracking-normal text-text-primary">
                  {service.name}
                </h3>
                <p className="mt-2 text-support text-text-secondary">
                  {service.description}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section id="care-areas" className="bg-surface-emphasis py-8 sm:py-16" aria-labelledby="care-areas-heading">
        <div className="mx-auto max-w-wide px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.74fr_1fr] lg:items-start">
            <header>
              <p className="text-sm font-semibold text-brand-primary">
                Can he help me?
              </p>
              <h2 id="care-areas-heading" className="mt-3 text-section-title tracking-normal text-text-primary sm:text-section-title-lg">
                Explore condition pathways
              </h2>
              <p className="mt-4 text-body text-text-secondary">
                Learn more about arthritis, autoimmune disease, lupus, gout, joint pain, and specialist rheumatology care in Lagos.
              </p>
            </header>

            <div className="border-b border-border-subtle">
              {carePathways.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group grid gap-3 border-t border-border-subtle py-5 transition hover:border-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 sm:grid-cols-[3rem_1fr_auto]"
                >
                  <span className="text-sm font-semibold text-text-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-base font-bold text-text-primary">
                      {link.title}
                    </span>
                    <span className="mt-2 block text-support text-text-secondary">
                      {link.description}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-brand-primary transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-page py-8 sm:py-16" aria-labelledby="doctor-context-heading">
        <div className="mx-auto grid max-w-wide gap-9 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="max-w-reading">
            <p className="text-sm font-semibold text-brand-primary">
              Professional context
            </p>
            <h2 id="doctor-context-heading" className="mt-3 text-section-title tracking-normal text-text-primary sm:text-section-title-lg">
              Care led by {doctor.displayName}
            </h2>
            <div className="mt-5 space-y-4 text-body text-text-secondary">
              {doctor.bio.slice(0, 2).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link href="/about-dr-olaosebikan" className={`${buttonStyles.tertiary} mt-6`}>
              Learn more about Dr Olaosebikan
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:pt-2">
            {professionalDetails.map((detail) => (
              <div key={detail.label} className="border-l border-border-default pl-4">
                <dt className="text-support font-semibold text-text-tertiary">
                  {detail.label}
                </dt>
                <dd className="mt-2 text-body font-semibold text-text-primary">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-text-primary py-10 text-white sm:py-16" aria-labelledby="final-cta-heading">
        <div className="mx-auto max-w-standard px-4 text-center sm:px-6">
          <h2 id="final-cta-heading" className="text-section-title tracking-normal sm:text-section-title-lg">
            Ready to plan the next step?
          </h2>
          <p className="mx-auto mt-4 max-w-reading text-body text-blue-50">
            Book a consultation for joint pain, stiffness, inflammatory back pain, arthritis, gout, lupus, and autoimmune conditions.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/appointments/book" className={`${buttonStyles.primary} w-full sm:w-auto`}>
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Book an Appointment
            </Link>
            <a
              href={appointmentWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-blue-100 underline-offset-4 transition hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-text-primary"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
