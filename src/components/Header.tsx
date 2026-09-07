"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { doctor } from "@/lib/content";
import { buttonStyles } from "@/lib/styles";

type HeaderLink = {
  label: string;
  href: string;
  description: string;
};

const careLinks: HeaderLink[] = [
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

const resourceLinks: HeaderLink[] = [
  {
    label: "FAQ",
    href: "/faq",
    description: "Common questions about rheumatology care",
  },
  {
    label: "Publications",
    href: "/publications",
    description: "Verified publication records",
  },
  {
    label: "Achievements",
    href: "/publications/achievements",
    description: "Verified achievement records",
  },
];

const mainLinks: HeaderLink[] = [
  {
    label: "Services",
    href: "/#services",
    description: "Clinic services and care options",
  },
  {
    label: "Contact",
    href: "/contact-location",
    description: "Clinic location and contact details",
  },
];

const CARE_NAVIGATION_PANEL_ID = "care-navigation-panel";
const RESOURCES_NAVIGATION_PANEL_ID = "resources-navigation-panel";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isExactRoute(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return pathname === href;
}

function isNavigationActive(pathname: string, href: string) {
  if (href === "/publications") {
    return (
      pathname === "/publications" ||
      (pathname.startsWith("/publications/") &&
        !pathname.startsWith("/publications/achievements"))
    );
  }

  return isExactRoute(pathname, href);
}

function desktopLinkClass(active: boolean) {
  return classNames(
    "inline-flex items-center gap-2 text-sm transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
    active ? "font-bold text-text-primary" : "font-semibold text-text-secondary",
  );
}

function dropdownButtonClass(active: boolean) {
  return classNames(
    "inline-flex items-center gap-2 text-sm transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
    active ? "font-bold text-text-primary" : "font-semibold text-text-secondary",
  );
}

function dropdownLinkClass(active: boolean) {
  return classNames(
    "block border-l-2 border-b border-border-subtle px-4 py-3 text-sm transition last:border-b-0 hover:bg-surface-muted focus:outline-none focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary",
    active
      ? "border-l-brand-primary font-bold text-text-primary"
      : "border-l-transparent font-semibold text-text-secondary",
  );
}

function mobileLinkClass(active: boolean) {
  return classNames(
    "block py-2.5 text-sm transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
    active ? "font-bold text-text-primary" : "font-semibold text-text-secondary",
  );
}

export function Header() {
  const pathname = usePathname() || "/";
  const careMenuButtonRef = useRef<HTMLButtonElement>(null);
  const resourcesMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const suppressDesktopFocusOpenRef = useRef(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<"care" | "resources" | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const careActive = careLinks.some((link) => isExactRoute(pathname, link.href));
  const resourcesActive = resourceLinks.some((link) => isNavigationActive(pathname, link.href));
  const contactActive = pathname === "/contact-location" || pathname === "/contact";
  const appointmentActive = pathname === "/appointments/book";
  const careMenuOpen = openDesktopMenu === "care";
  const resourcesMenuOpen = openDesktopMenu === "resources";

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 4);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      const activeElement = document.activeElement;
      let focusTarget: HTMLButtonElement | null = null;

      if (activeElement instanceof Node) {
        if (document.getElementById("mobile-menu")?.contains(activeElement)) {
          focusTarget = mobileMenuButtonRef.current;
        } else if (document.getElementById(CARE_NAVIGATION_PANEL_ID)?.contains(activeElement)) {
          focusTarget = careMenuButtonRef.current;
        } else if (document.getElementById(RESOURCES_NAVIGATION_PANEL_ID)?.contains(activeElement)) {
          focusTarget = resourcesMenuButtonRef.current;
        }
      }

      if (focusTarget) {
        suppressDesktopFocusOpenRef.current = true;
        focusTarget.focus();
        suppressDesktopFocusOpenRef.current = false;
      }

      setMobileOpen(false);
      setOpenDesktopMenu(null);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function closeMobile() {
    setMobileOpen(false);
  }

  function closeDesktopMenuOnBlur(event: React.FocusEvent<HTMLDivElement>) {
    const nextFocus = event.relatedTarget;

    if (!(nextFocus instanceof Node) || !event.currentTarget.contains(nextFocus)) {
      setOpenDesktopMenu(null);
    }
  }

  return (
    <header className={classNames(
      "sticky top-0 z-50 border-b border-border-subtle bg-surface-emphasis/95 backdrop-blur transition-shadow",
      scrolled && "shadow-subtle",
    )}>
      <nav className="mx-auto flex h-16 max-w-wide items-center justify-between gap-2 px-3 sm:px-6 md:gap-4" aria-label="Primary">
        <Link
          href="/"
          className="inline-flex min-w-0 flex-1 flex-col justify-center rounded-lg py-1 leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 md:max-w-xs md:flex-none lg:max-w-sm"
          onClick={closeMobile}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <span data-brand-element className="block truncate text-sm font-bold text-text-primary sm:text-base">
            {doctor.displayName}
          </span>
          <span data-brand-element className="hidden truncate text-xs text-text-tertiary sm:block">
            {doctor.specialization}
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <Link href="/#services" className={desktopLinkClass(false)}>
            Services
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setOpenDesktopMenu("care")}
            onMouseLeave={() => setOpenDesktopMenu(null)}
            onFocus={() => {
              if (!suppressDesktopFocusOpenRef.current) setOpenDesktopMenu("care");
            }}
            onBlur={closeDesktopMenuOnBlur}
          >
            <button
              ref={careMenuButtonRef}
              type="button"
              className={dropdownButtonClass(careActive)}
              aria-expanded={careMenuOpen}
              aria-controls={CARE_NAVIGATION_PANEL_ID}
              aria-label={careActive ? "Care Areas, current section" : "Care Areas"}
              onClick={() => setOpenDesktopMenu(careMenuOpen ? null : "care")}
            >
              Care Areas
              <ChevronDown className={classNames("h-4 w-4 transition", careMenuOpen && "rotate-180")} aria-hidden="true" />
            </button>
            <div id={CARE_NAVIGATION_PANEL_ID} className={classNames(
              "absolute left-0 top-full mt-2 w-80 overflow-hidden rounded-lg border border-border-subtle bg-surface-emphasis shadow-floating transition",
              careMenuOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0",
            )}>
              {careLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={dropdownLinkClass(isExactRoute(pathname, link.href))}
                  aria-current={isExactRoute(pathname, link.href) ? "page" : undefined}
                  onClick={() => setOpenDesktopMenu(null)}
                >
                  {link.label}
                  <span className="mt-1 block text-xs font-normal text-text-tertiary">
                    {link.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenDesktopMenu("resources")}
            onMouseLeave={() => setOpenDesktopMenu(null)}
            onFocus={() => {
              if (!suppressDesktopFocusOpenRef.current) setOpenDesktopMenu("resources");
            }}
            onBlur={closeDesktopMenuOnBlur}
          >
            <button
              ref={resourcesMenuButtonRef}
              type="button"
              className={dropdownButtonClass(resourcesActive)}
              aria-expanded={resourcesMenuOpen}
              aria-controls={RESOURCES_NAVIGATION_PANEL_ID}
              aria-label={resourcesActive ? "Resources, current section" : "Resources"}
              onClick={() => setOpenDesktopMenu(resourcesMenuOpen ? null : "resources")}
            >
              Resources
              <ChevronDown className={classNames("h-4 w-4 transition", resourcesMenuOpen && "rotate-180")} aria-hidden="true" />
            </button>
            <div id={RESOURCES_NAVIGATION_PANEL_ID} className={classNames(
              "absolute left-0 top-full mt-2 w-72 overflow-hidden rounded-lg border border-border-subtle bg-surface-emphasis shadow-floating transition",
              resourcesMenuOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0",
            )}>
              {resourceLinks.map((link) => {
                const active = isNavigationActive(pathname, link.href);
                const current = isExactRoute(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={dropdownLinkClass(active)}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpenDesktopMenu(null)}
                  >
                    {link.label}
                    <span className="mt-1 block text-xs font-normal text-text-tertiary">
                      {link.description}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <Link
            href="/contact-location"
            className={desktopLinkClass(contactActive)}
            aria-current={pathname === "/contact-location" ? "page" : undefined}
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Contact
          </Link>

          <Link
            href="/appointments/book"
            className={buttonStyles.primarySmall}
            aria-current={appointmentActive ? "page" : undefined}
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Book Appointment
          </Link>
        </div>

        <Link
          href="/appointments/book"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-primary px-3 text-sm font-semibold text-white transition hover:bg-brand-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 lg:hidden min-[430px]:px-4"
          aria-label="Book Appointment"
          aria-current={appointmentActive ? "page" : undefined}
          onClick={closeMobile}
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          <span className="hidden min-[430px]:inline">Book Appointment</span>
          <span className="min-[430px]:hidden">Book</span>
        </Link>

        <button
          ref={mobileMenuButtonRef}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen ? (
        <div id="mobile-menu" className="border-t border-border-subtle bg-surface-emphasis lg:hidden">
          <div className="mx-auto max-w-wide px-4 py-4 sm:px-6">
            <Link
              href="/appointments/book"
              onClick={closeMobile}
              className={`${buttonStyles.primary} w-full`}
              aria-current={appointmentActive ? "page" : undefined}
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Book Appointment
            </Link>

            <div className="mt-5 space-y-5">
              <MobileSection title="Main" links={mainLinks} pathname={pathname} closeMobile={closeMobile} />
              <MobileSection title="Care Areas" links={careLinks} pathname={pathname} closeMobile={closeMobile} />
              <MobileSection title="Resources" links={resourceLinks} pathname={pathname} closeMobile={closeMobile} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

type MobileSectionProps = {
  title: string;
  links: HeaderLink[];
  pathname: string;
  closeMobile: () => void;
};

function MobileSection({ title, links, pathname, closeMobile }: MobileSectionProps) {
  return (
    <section aria-labelledby={`mobile-${title.toLowerCase().replace(/\s+/g, "-")}-heading`}>
      <h2 id={`mobile-${title.toLowerCase().replace(/\s+/g, "-")}-heading`} className="text-xs font-bold text-text-tertiary">
        {title}
      </h2>
      <div className="mt-2 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobile}
            className={mobileLinkClass(isNavigationActive(pathname, link.href))}
            aria-current={isExactRoute(pathname, link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
