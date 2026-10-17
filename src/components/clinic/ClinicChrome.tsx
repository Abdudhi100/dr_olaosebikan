"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { site } from "@/lib/content";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
import { heroRoutes } from "@/lib/hero-media";
const links = [
  { href: "/services", label: "Our care" },
  { href: "/about-dr-olaosebikan", label: "The specialist" },
  { href: "/appointments/book", label: "Consultations" },
  { href: "/contact-location", label: "Contact" },
];
const resourceLinks = [
  { href: "/insights", label: "Insights & Media" },
  { href: "/publications", label: "Research & Publications" },
  { href: "/publications/achievements", label: "Achievements & Recognitions" },
];
function ResourcesNavigation() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const group = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !group.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return <div className="clinic-resources" ref={group}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={(event) => {
      if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
    }}>
    <button ref={trigger} type="button" aria-expanded={open} aria-controls="clinic-resources-links"
      className="clinic-resources-trigger" data-current={path?.startsWith("/insights") || path?.startsWith("/publications") || undefined}
      onClick={() => setOpen(!open)}>Resources <ChevronDown size={16} aria-hidden="true" /></button>
    <div id="clinic-resources-links" className="clinic-resources-links" hidden={!open}>
      {resourceLinks.map((link) => <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>)}
    </div>
  </div>;
}
export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const overlay = path !== null && Object.hasOwn(heroRoutes, path);
  const lightHero = path === "/about-dr-olaosebikan" || path === "/appointments/book";
  const dark =
    (overlay && !lightHero) ||
    path === "/faq" ||
    path === "/contact-location" ||
    path?.startsWith("/publications") ||
    path?.startsWith("/insights");
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    function outside(e: PointerEvent) {
      if (
        e.target instanceof Node &&
        !panel.current?.contains(e.target) &&
        !button.current?.contains(e.target)
      )
        setOpen(false);
    }
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header
      className={`clinic-header ${path === "/" ? "clinic-header-home" : ""} ${path === "/services" ? "clinic-header-services" : ""} ${dark ? "on-dark" : ""} ${overlay ? "over-hero" : ""}`}
    >
      <div className="clinic-header-row">
        <Link
          className="clinic-brand"
          href="/"
          aria-label={`${site.clinicName} — Home`}
        >
          <img src="/images/clinic-symbol.jpg" width="60" height="60" alt="" />
          <span>
            Pain, Arthritis, Autoimmune
            <br />
            &amp; Rheumatology Clinic
          </span>
        </Link>
        <nav className="clinic-desktop-nav" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={path === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <ResourcesNavigation />
          <Link
            href="/appointments/book"
            className={`clinic-button ${dark ? "clinic-button-inverse" : ""}`}
          >
            Book an appointment
          </Link>
        </nav>
        <button
          ref={button}
          className="clinic-menu"
          type="button"
          aria-expanded={open}
          aria-controls="clinic-mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>
      <nav
        ref={panel}
        id="clinic-mobile-navigation"
        hidden={!open}
        aria-label="Mobile primary"
        className="clinic-mobile-nav"
        onBlur={(e) => {
          if (
            e.relatedTarget instanceof Node &&
            !e.currentTarget.contains(e.relatedTarget) &&
            e.relatedTarget !== button.current
          )
            setOpen(false);
        }}
      >
        {links.map((l) => (
          <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/faq" aria-current={path === "/faq" ? "page" : undefined} onClick={() => setOpen(false)}>FAQ</Link>
        <div className="clinic-mobile-resources" aria-label="Resources">
          <p className="clinic-eyebrow">Resources</p>
          {resourceLinks.map((link) => <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>)}
        </div>
        <Link
          href="/appointments/book"
          className="clinic-button clinic-button-inverse"
        >
          Request an appointment
        </Link>
      </nav>
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="clinic-footer clinic-dark">
      <div className="clinic-container">
        <div className="clinic-footer-top">
          <div>
            <p>{site.clinicName}</p>
            <h2>
              Take the next step
              <br />
              in your care.
            </h2>
            <p>
              Arrange an in-person or virtual consultation with Dr Hakeem
              Olaosebikan.
            </p>
            <p className="clinic-small">
              Submitting a request does not confirm an appointment. Fees are
              communicated privately.
            </p>
            <Link
              href="/appointments/book"
              className="clinic-button clinic-button-inverse"
            >
              Request an appointment
            </Link>
          </div>
          <nav aria-label="Footer explore">
            <p className="clinic-eyebrow">Explore</p>
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <Link href="/faq">FAQ</Link>
          </nav>
          <nav aria-label="Footer resources">
            <p className="clinic-eyebrow">Resources</p>
            {resourceLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
            <Link href="/contact-location">Contact channels</Link>
            <Link href="/rheumatoid-arthritis-treatment-lagos">
              Rheumatoid arthritis
            </Link>
            <Link href="/gout-treatment-lagos">Gout treatment</Link>
            <Link href="/lupus-care-lagos">Lupus care</Link>
            <Link href="/autoimmune-disease-specialist-lagos">
              Autoimmune care
            </Link>
          </nav>
        </div>
        <div className="clinic-footer-contact">
          <div>
            <p className="clinic-eyebrow">In-person consultations</p>
            <p>
              Consultations available in person at Maryamville Medical Center,
              <br />
              144 Bode Thomas Road, Surulere, Lagos.
            </p>
          </div>
          <div>
            <p className="clinic-eyebrow">Contact channels</p>
            <a href={`tel:${site.phoneDial}`}>+234 803 575 1154</a>
            <a
              href={appointmentWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp: +234 803 575 1154
            </a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
        <div className="clinic-legal">
          <p>
            © {new Date().getFullYear()} {site.clinicName}.
          </p>
          <p>
            The medical information provided on this website is for general
            educational purposes only and does not replace professional medical
            advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}
