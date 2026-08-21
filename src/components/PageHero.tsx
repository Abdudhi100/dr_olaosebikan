import Link from "next/link";
import { CalendarDays, MessageCircle } from "lucide-react";
import { buttonStyles } from "@/lib/styles";
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
    <section className="border-b border-border-subtle bg-surface-emphasis">
      <div className="mx-auto max-w-standard px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-support text-text-tertiary">
          <Link href="/" className="hover:text-brand-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page">{current}</span>
        </nav>

        <span className="inline-flex items-center rounded-full bg-brand-primary-subtle px-4 py-1.5 text-support font-semibold text-brand-primary ring-1 ring-brand-primary-border">
          {eyebrow}
        </span>

        <h1 className="mt-5 max-w-reading text-page-title text-text-primary sm:text-page-title-lg">
          {title}
        </h1>

        <p className="mt-5 max-w-reading text-lead text-text-secondary">
          {description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/appointments/book"
            className={buttonStyles.primary}
          >
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
            Book Appointment
          </Link>
          <Link
            href={secondaryHref}
            className={buttonStyles.secondary}
          >
            {secondaryLabel}
          </Link>
          <a
            href={appointmentWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles.secondarySuccess}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
