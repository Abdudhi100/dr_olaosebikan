"use client";
import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { BookingEntryLink } from "@/components/booking/BookingEntryLink";
const services = [
  {
    image: "pain",
    title: "Pain, joint pain & stiffness",
    description:
      "A consultation to discuss pain, stiffness and the concerns affecting your daily activities.",
    href: "/joint-pain-and-stiffness-clinic-lagos",
    reason: "Pain consultation",
  },
  {
    image: "arthritis",
    title: "Arthritis consultation",
    description:
      "Discuss arthritis-related concerns and your ongoing care with a rheumatology specialist.",
    href: "/rheumatoid-arthritis-treatment-lagos",
    reason: "Arthritis consultation",
  },
  {
    image: "autoimmune",
    title: "Autoimmune & lupus care",
    description:
      "Arrange a consultation about autoimmune concerns or lupus care.",
    href: "/autoimmune-disease-specialist-lagos",
    second: "/lupus-care-lagos",
    reason: "Autoimmune consultation",
  },
  {
    image: "gout",
    title: "Gout treatment",
    description: "Arrange a consultation to discuss gout and your care.",
    href: "/gout-treatment-lagos",
    reason: "Gout treatment",
  },
  {
    image: "rheumatology",
    title: "Rheumatology consultation",
    description:
      "A specialist consultation for rheumatology concerns and next-step guidance.",
    reason: "Rheumatology consultation",
  },
  {
    image: "followup",
    title: "Follow-up consultation",
    description:
      "Request a follow-up appointment to discuss your ongoing care.",
    reason: "Follow-up consultation",
  },
];
export function ServicesView() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const filtered = services.filter((s) =>
    `${s.title} ${s.description}`.toLowerCase().includes(normalized),
  );
  return (
    <>
      <section className="clinic-hero clinic-services-hero">
        <img
          className="clinic-hero-photo"
          src="/images/figma/services-hero.webp"
          alt=""
          fetchPriority="high"
        />
        <div className="clinic-hero-shade" />
        <div className="clinic-container clinic-hero-content">
          <p className="clinic-eyebrow">Our care</p>
          <h1>
            Find the right care
            <br />
            for your concerns.
          </h1>
          <div className="clinic-search" role="search">
            <label htmlFor="care-search">
              <Search aria-hidden />
              <span className="sr-only">Search our areas of care</span>
            </label>
            <input
              id="care-search"
              type="search"
              placeholder="Search our care…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-controls="care-results"
            />
          </div>
        </div>
        <span className="clinic-media-state">Still image</span>
      </section>
      <section className="clinic-page-body">
        <div className="clinic-container">
          <p className="clinic-services-intro">
            Consult Dr Hakeem Olaosebikan for pain, arthritis and autoimmune
            concerns. Explore our areas of care and request an in-person or
            virtual consultation.
          </p>
          {normalized && (
            <p
              role="status"
              className="clinic-small"
              style={{ marginBottom: 24 }}
            >
              {filtered.length} care {filtered.length === 1 ? "area" : "areas"}{" "}
              found.
            </p>
          )}
          <div id="care-results" className="clinic-service-grid">
            {filtered.map((s) => (
              <article className="clinic-service-card" key={s.title}>
                <img
                  src={`/images/figma/${s.image}.webp`}
                  alt=""
                  loading="lazy"
                />
                <div className="clinic-service-card-content">
                  <h2>{s.title}</h2>
                  <p>{s.description}</p>
                  {s.href ? (
                    <Link href={s.href}>
                      {s.image === "arthritis"
                        ? "Rheumatoid arthritis care"
                        : s.image === "autoimmune"
                          ? "Autoimmune care"
                          : "Explore this care"}{" "}
                      <span aria-hidden>↗</span>
                    </Link>
                  ) : (
                    <BookingEntryLink seed={{ reason: s.reason }}>
                      Request an appointment <span aria-hidden>↗</span>
                    </BookingEntryLink>
                  )}
                  {s.second && (
                    <>
                      <br />
                      <Link href={s.second}>
                        Lupus care <span aria-hidden>↗</span>
                      </Link>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="clinic-inline-status">
              <p>No care areas match your search.</p>
              <button
                type="button"
                className="clinic-text-link"
                onClick={() => setQuery("")}
              >
                Clear search
              </button>
              <p>
                You can contact the clinic if you are unsure which consultation
                to request.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
