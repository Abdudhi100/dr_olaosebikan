import Link from "next/link";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import publishingNavigation from "@/generated/navigation.json";
import { doctor, site, visiblePublications, visibleAchievements } from "@/lib/content";

const careLinks = [
  { label: "Rheumatoid Arthritis", href: "/rheumatoid-arthritis-treatment-lagos" },
  { label: "Gout Treatment", href: "/gout-treatment-lagos" },
  { label: "Lupus Care", href: "/lupus-care-lagos" },
  { label: "Joint Pain & Stiffness", href: "/joint-pain-and-stiffness-clinic-lagos" },
  { label: "Autoimmune Specialist", href: "/autoimmune-disease-specialist-lagos" },
];

const resourceLinks = [
  ...(publishingNavigation.hasInsights ? [{label: "Insights & media", href: "/insights"}] : []),
  { label: "About Dr Olaosebikan", href: "/about-dr-olaosebikan" },
  { label: "FAQ", href: "/faq" },
  { label: "Publications", href: "/publications" },
  { label: "Achievements", href: "/publications/achievements" },
].filter(link => (link.href !== "/publications" || visiblePublications.length > 0) && (link.href !== "/publications/achievements" || visibleAchievements.length > 0));

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-wide px-6 py-10 sm:py-12">
        <div className="grid gap-8 text-sm lg:grid-cols-[1.2fr_1.45fr_1.1fr]">
          <div className="max-w-sm">
            <h2 data-brand-element className="text-base font-bold text-white">
              {doctor.displayName}
            </h2>
            <p data-brand-element className="mt-1 text-xs text-slate-400">
              {doctor.specialization}
            </p>
            <p className="mt-4 leading-relaxed text-slate-400">
              {site.clinicTagline}
            </p>
            <Link href="/about-dr-olaosebikan" className="mt-5 inline-block font-semibold text-blue-300 hover:text-white">
              Learn more about Dr Olaosebikan
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-7">
            <div>
              <h3 className="mb-3 font-semibold text-white">Care</h3>
              <ul className="space-y-2.5">
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
              <h3 className="mb-3 font-semibold text-white">Resources</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/#services" className="hover:text-white">
                    Services
                  </Link>
                </li>
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-white">Visit / Contact</h3>
            <ul className="space-y-3.5 text-slate-400">
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
                <Link href="/appointments/book" className="font-semibold text-blue-300 hover:text-white">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-8 border-t border-slate-800" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-slate-400 md:flex-row md:items-center">
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
