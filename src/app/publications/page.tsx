import Link from "next/link";
import { visiblePublications } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import clinicRelease from "../../../config/clinic-release.json";
import { shouldIndexPublishedCollection } from "@/lib/site-indexing";
import { PageIntro, ResourceExplore } from "@/components/clinic/ClinicSections";
export const metadata = {
  ...defaultMetadata({
    title: "Research & publications | Dr Olaosebikan",
    description:
      "Verified research and publication information from Dr Hakeem Olaosebikan.",
    path: "/publications",
  }),
  robots: {
    index:
      shouldIndexPublishedCollection(clinicRelease, visiblePublications.length),
    follow: true,
  },
};
export default function PublicationsPage() {
  return (
    <>
      <PageIntro
        variant="resources"
        eyebrow="Research & publications"
        title={
          <>
            Research &amp; <br className="clinic-mobile-break" />
            publications.
          </>
        }
        description="Publication information will be shown here once the details are verified."
      />
      <section className="clinic-page-body">
        <div className="clinic-container">
          <p className="clinic-eyebrow">Publication record</p>
          <h2 className="clinic-subtitle">Research and publications.</h2>
          <div className="clinic-resource-layout">
            <div>
              {visiblePublications.length === 0 ? (
                <div className="clinic-resource-empty">
                  <p className="clinic-eyebrow">Verification pending</p>
                  <h3 className="clinic-subtitle">
                    Publications pending verification
                  </h3>
                  <p>
                    Verified publication details have not been added to the
                    website yet.
                  </p>
                  <p>
                    No publication titles, journals, authors or publication
                    dates are displayed without verification.
                  </p>
                </div>
              ) : (
                visiblePublications.map((p) => (
                  <article className="clinic-resource-record" key={p.slug}>
                    <p className="clinic-small">
                      {p.journal} · {p.year}
                    </p>
                    <h3 className="clinic-subtitle">
                      <Link href={`/publications/${p.slug}`}>{p.title}</Link>
                    </h3>
                    {p.authors && <p>{p.authors}</p>}
                    {p.abstract && (
                      <p style={{ marginTop: 20 }}>{p.abstract}</p>
                    )}
                    <Link
                      className="clinic-text-link"
                      href={`/publications/${p.slug}`}
                    >
                      View publication <span aria-hidden>↗</span>
                    </Link>
                  </article>
                ))
              )}
            </div>
            <ResourceExplore />
          </div>
          {visiblePublications.length === 0 && (
            <div className="clinic-inline-status">
              <p className="clinic-eyebrow" style={{ marginBottom: 8 }}>
                Current content status
              </p>
              <p>This page contains no publication entries at present.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
