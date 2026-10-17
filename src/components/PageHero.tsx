import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { buttonStyles } from "@/lib/styles";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  current: string;
  showPrimaryAction?: boolean;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  current,
  showPrimaryAction = true,
  secondaryHref = "/faq",
  secondaryLabel = "Read FAQ",
}: PageHeroProps) {
  return (
    <section className="border-b border-border-subtle bg-surface-page">
      <div className="mx-auto max-w-wide px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-8 flex min-w-0 items-center gap-2 text-support text-text-tertiary">
          <Link
            href="/"
            className="shrink-0 transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="min-w-0 truncate" aria-current="page">{current}</span>
        </nav>

        <p className="w-fit text-support font-semibold text-brand-primary">
          {eyebrow}
        </p>

        <h1 className="mt-3 max-w-reading text-page-title tracking-normal text-text-primary sm:text-page-title-lg">
          {title}
        </h1>

        <p className="mt-5 max-w-reading text-lead text-text-secondary">
          {description}
        </p>

        {(showPrimaryAction || secondaryHref) ? (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            {showPrimaryAction ? (
              <Link
                href="/appointments/book"
                className={`${buttonStyles.primary} w-full sm:w-auto`}
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Book Appointment
              </Link>
            ) : null}
            {secondaryHref ? (
              <Link
                href={secondaryHref}
                className={`${buttonStyles.tertiary} justify-center sm:justify-start`}
              >
                {secondaryLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
