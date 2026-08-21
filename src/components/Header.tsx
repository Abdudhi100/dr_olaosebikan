"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  ChevronDown,
  MapPin,
  Menu,
  Stethoscope,
  X,
} from "lucide-react";
import { achievements, publications, site } from "@/lib/content";
import { buttonStyles } from "@/lib/styles";

const careLinks = [
  {
    label: "About Dr Olaosebikan",
    href: "/about-dr-olaosebikan",
    description: "Meet the specialist behind the clinic",
  },
  {
    label: "Rheumatoid Arthritis",
    href: "/rheumatoid-arthritis-treatment-lagos",
    description: "Assessment and long-term care",
  },
  {
    label: "Gout Treatment",
    href: "/gout-treatment-lagos",
    description: "Flare-up care and prevention",
  },
  {
    label: "Lupus Care",
    href: "/lupus-care-lagos",
    description: "Autoimmune disease support and monitoring",
  },
  {
    label: "Joint Pain & Stiffness",
    href: "/joint-pain-and-stiffness-clinic-lagos",
    description: "Persistent pain, swelling and mobility concerns",
  },
  {
    label: "Autoimmune Specialist",
    href: "/autoimmune-disease-specialist-lagos",
    description: "Specialist autoimmune evaluation in Lagos",
  },
];

const hasVisiblePublications = publications.some(
  (publication) => publication.isPublished !== false,
);
const hasVisibleAchievements = achievements.some(
  (achievement) => achievement.isPublished !== false,
);

const resourceLinks = [
  ...(hasVisiblePublications
    ? [
        {
          label: "Publications",
          href: "/publications",
          description: "Research, papers and clinical insights",
          icon: BookOpen,
        },
      ]
    : []),
  ...(hasVisibleAchievements
    ? [
        {
          label: "Achievements",
          href: "/publications/achievements",
          description: "Awards, recognitions and milestones",
          icon: Award,
        },
      ]
    : []),
  {
    label: "FAQ",
    href: "/faq",
    description: "Common questions about rheumatology care",
    icon: Stethoscope,
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-emphasis/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-wide items-center justify-between gap-4 px-4 sm:px-6" aria-label="Primary">
        <Link
          href="/"
          className="inline-flex min-w-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          onClick={closeMobile}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-primary text-sm font-bold text-white">
            {site.clinicInitials}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-bold text-text-primary sm:text-base">
              {site.clinicName}
            </span>
            <span className="hidden truncate text-xs text-text-tertiary sm:block">
              {site.clinicTagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link href="/#services" className="text-sm font-semibold text-text-secondary hover:text-brand-primary">
            Services
          </Link>

          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand-primary"
              aria-haspopup="true"
            >
              Care Areas
              <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-0 top-full w-80 translate-y-3 overflow-hidden rounded-lg border border-border-subtle bg-surface-emphasis opacity-0 shadow-floating transition group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-2 group-focus-within:opacity-100">
              {careLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block border-b border-border-subtle px-4 py-3 text-sm font-semibold text-text-primary last:border-b-0 hover:bg-surface-muted"
                >
                  {link.label}
                  <span className="mt-1 block text-xs font-normal text-text-tertiary">
                    {link.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand-primary"
              aria-haspopup="true"
            >
              Resources
              <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-0 top-full w-72 translate-y-3 overflow-hidden rounded-lg border border-border-subtle bg-surface-emphasis opacity-0 shadow-floating transition group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-2 group-focus-within:opacity-100">
              {resourceLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex gap-3 border-b border-border-subtle px-4 py-3 text-sm font-semibold text-text-primary last:border-b-0 hover:bg-surface-muted"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                    <span>
                      {link.label}
                      <span className="mt-1 block text-xs font-normal text-text-tertiary">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <Link href="/contact-location" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand-primary">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Contact
          </Link>

          <Link
            href="/appointments/book"
            className={buttonStyles.primarySmall}
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Book Appointment
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen ? (
        <div id="mobile-menu" className="border-t border-border-subtle bg-surface-emphasis md:hidden">
          <div className="mx-auto max-w-wide space-y-4 px-4 py-4 sm:px-6">
            <Link
              href="/#services"
              onClick={closeMobile}
              className="block rounded-lg px-4 py-3 text-sm font-semibold text-text-primary hover:bg-surface-muted"
            >
              Services
            </Link>

            <MobileGroup title="Care Areas" links={careLinks} closeMobile={closeMobile} />
            <MobileGroup title="Resources" links={resourceLinks} closeMobile={closeMobile} />

            <Link
              href="/contact-location"
              onClick={closeMobile}
              className="block rounded-lg px-4 py-3 text-sm font-semibold text-text-primary hover:bg-surface-muted"
            >
              Contact
            </Link>
            <Link
              href="/appointments/book"
              onClick={closeMobile}
              className={`${buttonStyles.primary} w-full`}
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Book Appointment
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

type MobileGroupProps = {
  title: string;
  links: Array<{ label: string; href: string; description: string }>;
  closeMobile: () => void;
};

function MobileGroup({ title, links, closeMobile }: MobileGroupProps) {
  return (
    <details className="overflow-hidden rounded-lg border border-border-subtle">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-text-primary">
        {title}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </summary>
      <div className="border-t border-border-subtle">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobile}
            className="block border-b border-border-subtle px-4 py-3 text-sm font-semibold text-text-secondary last:border-b-0 hover:bg-surface-muted"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
