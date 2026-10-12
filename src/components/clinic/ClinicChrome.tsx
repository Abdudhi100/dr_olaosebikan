"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { site, visibleAchievements, visiblePublications } from "@/lib/content";
import { editorialEntries } from "@/lib/editorial";
const hasEditorialContent = editorialEntries.length > 0;
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
const links = [
  { href: "/services", label: "Our care" },
  { href: "/about-dr-olaosebikan", label: "The specialist" },
  { href: "/appointments/book", label: "Consultations" },
  { href: "/contact-location", label: "Contact" },
];
export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const overlay = path === "/" || path === "/services";
  const dark =
    overlay ||
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
      className={`clinic-header ${dark ? "on-dark" : ""} ${overlay ? "over-hero" : ""}`}
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
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/faq">FAQ</Link>
        {hasEditorialContent && (
          <Link href="/insights">Insights &amp; media</Link>
        )}
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
            {visiblePublications.length > 0 && (
              <Link href="/publications">Publications</Link>
            )}
            {visibleAchievements.length > 0 && (
              <Link href="/publications/achievements">Achievements</Link>
            )}
            {hasEditorialContent && (
              <Link href="/insights">Insights &amp; media</Link>
            )}
            <Link href="/contact">Contact channels</Link>
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
