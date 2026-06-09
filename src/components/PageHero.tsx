import Link from "next/link";
import { CalendarDays, MessageCircle } from "lucide-react";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  current: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  current,
  secondaryHref = "/faq",
  secondaryLabel = "Read FAQ",
}: PageHeroProps) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
          <Link href="/" className="hover:text-blue-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page">{current}</span>
        </nav>

        <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
          {eyebrow}
        </span>

        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">
          {description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/appointments/book"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
            Book Appointment
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {secondaryLabel}
          </Link>
          <a
            href={appointmentWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
