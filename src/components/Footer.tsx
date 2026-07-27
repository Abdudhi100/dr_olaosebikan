import Link from "next/link";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { publications, site } from "@/lib/content";

const careLinks = [
  { label: "Rheumatoid Arthritis", href: "/rheumatoid-arthritis-treatment-lagos" },
  { label: "Gout Treatment", href: "/gout-treatment-lagos" },
  { label: "Lupus Care", href: "/lupus-care-lagos" },
  { label: "Joint Pain & Stiffness", href: "/joint-pain-and-stiffness-clinic-lagos" },
  { label: "Autoimmune Specialist", href: "/autoimmune-disease-specialist-lagos" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const hasVisiblePublications = publications.some(
    (publication) => publication.isPublished !== false,
  );

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 text-sm md:grid-cols-4">
          <div>
            <h2 className="mb-3 text-base font-extrabold text-white">
              {site.clinicName}
            </h2>
            <p className="leading-relaxed text-slate-400">{site.clinicTagline}</p>
            <p className="mt-4 text-xs text-slate-500">
              Trusted care. Specialist-led evaluation. Patient-centred treatment.
            </p>
            <Link href="/about-dr-olaosebikan" className="mt-5 inline-block font-semibold text-blue-300 hover:text-white">
              Learn more about Dr Olaosebikan
            </Link>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/#services" className="hover:text-white">Services</Link></li>
              <li><Link href="/appointments/book" className="hover:text-white">Book Appointment</Link></li>
              {hasVisiblePublications ? (
                <li><Link href="/publications" className="hover:text-white">Publications</Link></li>
              ) : null}
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/contact-location" className="hover:text-white">Contact & Location</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-white">Care Areas</h3>
            <ul className="space-y-2">
              {careLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-white">Contact</h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                <span>{site.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                <a href={`tel:${site.phoneDial}`} className="hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="break-all hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                <Link href="/appointments/book" className="hover:text-white">
                  Book a consultation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-10 border-t border-slate-800" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-slate-500 md:flex-row md:items-center">
          <p>
            Copyright {year} {site.clinicName}. All rights reserved.
          </p>
          <p className="max-w-2xl leading-relaxed">
            The medical information provided on this website is for general educational purposes only and does not replace professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}
