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
import { site } from "@/lib/content";

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

const resourceLinks = [
  {
    label: "Publications",
    href: "/publications",
    description: "Research, papers and clinical insights",
    icon: BookOpen,
  },
  {
    label: "Achievements",
    href: "/publications/achievements",
    description: "Awards, recognitions and milestones",
    icon: Award,
  },
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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Primary">
        <Link
          href="/"
          className="inline-flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          onClick={closeMobile}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-sm font-extrabold text-white shadow-sm shadow-blue-600/20">
            {site.clinicInitials}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-extrabold text-slate-950 sm:text-base">
              {site.clinicName}
            </span>
            <span className="hidden truncate text-xs text-slate-500 sm:block">
              {site.clinicTagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link href="/#services" className="text-sm font-semibold text-slate-700 hover:text-blue-700">
            Services
          </Link>

          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-700"
              aria-haspopup="true"
            >
              Care Areas
              <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-0 top-full w-80 translate-y-3 overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-2 group-focus-within:opacity-100">
              {careLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 last:border-b-0 hover:bg-slate-50"
                >
                  {link.label}
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    {link.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-700"
              aria-haspopup="true"
            >
              Resources
              <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-0 top-full w-72 translate-y-3 overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-2 group-focus-within:opacity-100">
              {resourceLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex gap-3 border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 last:border-b-0 hover:bg-slate-50"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
                    <span>
                      {link.label}
                      <span className="mt-1 block text-xs font-normal text-slate-500">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <Link href="/contact-location" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-700">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Contact
          </Link>

          <Link
            href="/appointments/book"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Book Appointment
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen ? (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
            <Link
              href="/#services"
              onClick={closeMobile}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50"
            >
              Services
            </Link>

            <MobileGroup title="Care Areas" links={careLinks} closeMobile={closeMobile} />
            <MobileGroup title="Resources" links={resourceLinks} closeMobile={closeMobile} />

            <Link
              href="/contact-location"
              onClick={closeMobile}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50"
            >
              Contact
            </Link>
            <Link
              href="/appointments/book"
              onClick={closeMobile}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20"
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
    <details className="overflow-hidden rounded-xl border border-slate-200">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-extrabold text-slate-950">
        {title}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </summary>
      <div className="border-t border-slate-200">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobile}
            className="block border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 last:border-b-0 hover:bg-slate-50"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
