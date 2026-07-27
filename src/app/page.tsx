import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Bone,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { doctor, publications, services, site } from "@/lib/content";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
import { physicianJsonLd } from "@/lib/seo";

const conditionLinks = [
  {
    title: "Rheumatoid arthritis treatment in Lagos",
    href: "/rheumatoid-arthritis-treatment-lagos",
  },
  {
    title: "Gout treatment in Lagos",
    href: "/gout-treatment-lagos",
  },
  {
    title: "Lupus care in Lagos",
    href: "/lupus-care-lagos",
  },
  {
    title: "Autoimmune disease specialist in Lagos",
    href: "/autoimmune-disease-specialist-lagos",
  },
  {
    title: "Joint pain and stiffness clinic in Lagos",
    href: "/joint-pain-and-stiffness-clinic-lagos",
  },
  {
    title: "Rheumatology FAQ",
    href: "/faq",
  },
];

const iconMap = {
  "shield-check": ShieldCheck,
  activity: Activity,
  "heart-pulse": HeartPulse,
  bone: Bone,
  stethoscope: Stethoscope,
  "clipboard-check": ClipboardCheck,
};

export default function HomePage() {
  const featuredPublications = publications
    .filter((publication) => publication.isPublished !== false)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={physicianJsonLd()} />

      <section className="relative min-h-[72vh] overflow-hidden bg-slate-950 pb-10 text-white">
        <Image
          src="/images/hero/clinic-hero-1600.webp"
          alt="Clinic consultation for pain, arthritis and autoimmune care"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:min-h-[72vh] lg:py-24">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold text-blue-700">
                Rheumatology & Autoimmune Expertise
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800">
                No referral needed
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {site.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-100 sm:text-xl">
              {site.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/appointments/book"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-8 sm:text-base"
              >
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                {site.heroCtaText}
              </Link>
              <a
                href={appointmentWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-8 sm:text-base"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-12 pb-8" aria-label="Care highlights">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-3 sm:px-6">
          {["Specialist-led care", "Evidence-based diagnosis", "Clear next steps"].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-md shadow-slate-950/5">
              <CheckCircle2 className="h-5 w-5 text-blue-700" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-blue-100/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-[38rem] h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />

      <section className="relative py-12 sm:py-14" aria-labelledby="doctor-heading">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative aspect-[4/4.15] overflow-hidden rounded-2xl bg-slate-200 shadow-sm ring-1 ring-slate-200 sm:aspect-[4/3.6] lg:aspect-[4/4.25]">
            <Image
              src={doctor.profilePhoto}
              alt={`Photo of ${doctor.displayName}`}
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover object-top"
            />
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
              {doctor.title}
            </span>
            <h2 id="doctor-heading" className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {doctor.displayName}
            </h2>
            <p className="mt-3 text-lg font-semibold text-slate-700">
              {doctor.specialization} - {doctor.yearsOfExperience}+ years experience
            </p>
            <div className="mt-5 space-y-4 leading-relaxed text-slate-700">
              {doctor.bio.slice(0, 2).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link href="/about-dr-olaosebikan" className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800">
              Learn more about Dr Olaosebikan
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="relative py-14 sm:py-16" aria-labelledby="services-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <header className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
              Rheumatology Clinic Services
            </span>
            <h2 id="services-heading" className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Pain, Arthritis & Autoimmune Care
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Targeted, evidence-based care for joint pain, stiffness, inflammation, autoimmune conditions, and chronic pain with clear plans and structured follow-up.
            </p>
          </header>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap] || ShieldCheck;
              return (
                <Link
                  key={service.slug}
                  href="/appointments/book"
                  className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{service.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                    Book this service
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative mx-auto my-6 max-w-7xl overflow-hidden rounded-none py-16 sm:my-10 sm:rounded-3xl sm:py-20" aria-labelledby="conditions-heading">
        <Image
          src="/images/sections/clinic-hero-1200.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/95 to-cyan-50/90" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <header className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
              Specialist Care Areas
            </span>
            <h2 id="conditions-heading" className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Explore conditions and specialist care
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Learn more about arthritis, autoimmune disease, lupus, gout, joint pain, and specialist rheumatology care in Lagos.
            </p>
          </header>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {conditionLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex min-h-32 flex-col justify-between rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-extrabold text-blue-700 ring-1 ring-blue-100">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-5 flex items-center justify-between gap-4 font-bold leading-snug text-slate-950">
                  <span>{link.title}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-blue-700 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredPublications.length > 0 ? (
        <section className="relative py-14 sm:py-16" aria-labelledby="publications-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <header className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-800 ring-1 ring-amber-100">
                Research & Scholarship
              </span>
              <h2 id="publications-heading" className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Publications & Rheumatology Insights
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                Peer-reviewed research and clinical contributions supporting better outcomes in arthritis, autoimmune disease, and pain care.
              </p>
            </header>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPublications.map((publication) => (
                <Link
                  key={publication.slug}
                  href={`/publications/${publication.slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <h3 className="text-lg font-bold leading-snug text-slate-950">
                    {publication.title}
                  </h3>
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    {publication.journal} - {publication.year}
                  </p>
                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-600">
                    {publication.abstract}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/publications"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                View all publications
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
      </div>

      <section className="relative -mt-1 rounded-t-[2rem] bg-blue-600 py-16 text-white sm:py-20" aria-labelledby="final-cta-heading">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 id="final-cta-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Move better. Hurt less. Live fully.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-blue-50">
            Book a consultation for joint pain, stiffness, inflammatory back pain, arthritis, gout, lupus, and autoimmune conditions.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/appointments/book"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
            >
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
              Book an Appointment
            </Link>
            <a
              href={appointmentWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-700 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
