"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/content";
import release from "../../../config/clinic-release.json";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import styles from "./insights.module.css";
const links = [
  { label: "Our care", href: "/#services" },
  { label: "The specialist", href: "/about-dr-olaosebikan" },
  { label: "Consultations", href: "/appointments/book" },
  { label: "Contact", href: "/contact-location" },
];
function InsightsHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !panel.current?.contains(event.target) &&
        !button.current?.contains(event.target)
      )
        setOpen(false);
    }
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header className={`${styles.scope} ${styles.header}`}>
      <div className={styles.headerRow}>
        <Link href="/" className={styles.brand}>
          <img src="/images/clinic-symbol.jpg" width={60} height={60} alt="" />
          <span>
            Pain, Arthritis, Autoimmune
            <br />
            &amp; Rheumatology Clinic
          </span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/appointments/book" className={styles.inverseButton}>
            Request an appointment
          </Link>
        </nav>
        <button
          ref={button}
          className={styles.menuButton}
          type="button"
          aria-expanded={open}
          aria-controls="insights-mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav
        ref={panel}
        id="insights-mobile-navigation"
        hidden={!open}
        className={styles.mobileNav}
        aria-label="Mobile primary"
        onBlur={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            !event.currentTarget.contains(event.relatedTarget) &&
            event.relatedTarget !== button.current
          )
            setOpen(false);
        }}
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link href="/insights" onClick={() => setOpen(false)}>
          Insights &amp; media
        </Link>
      </nav>
    </header>
  );
}
function InsightsFooter() {
  return (
    <footer className={`${styles.scope} ${styles.footer}`}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
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
            <p>
              {release.booking.enabled
                ? "Submitting a request does not confirm an appointment. Fees are communicated privately."
                : "Contact the clinic by WhatsApp, phone or email. Appointment times and fees are confirmed directly."}
            </p>
            <Link className={styles.inverseButton} href="/appointments/book">
              Request an appointment
            </Link>
          </div>
          <nav aria-label="Footer explore">
            <p className={styles.eyebrow}>Explore</p>
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/faq">FAQ</Link>
            <Link href="/insights">Insights &amp; media</Link>
          </nav>
        </div>
        <div className={styles.contactGrid}>
          <div>
            <p className={styles.eyebrow}>In-person consultations</p>
            <p>
              Consultations available in person at Maryamville Medical Center,
              144 Bode Thomas Road, Surulere, Lagos.
            </p>
          </div>
          <div>
            <p className={styles.eyebrow}>Contact channels</p>
            <a href={`tel:${site.phoneDial}`}>Phone: {site.phone}</a>
            <a
              href="https://wa.me/2348035751154"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp: +234 803 575 1154
            </a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
        <div className={styles.legal}>
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
export function SiteHeader() {
  const path = usePathname();
  return path?.startsWith("/insights") ? <InsightsHeader /> : <Header />;
}
export function SiteFooter() {
  const path = usePathname();
  return path?.startsWith("/insights") ? <InsightsFooter /> : <Footer />;
}
