import { visibleAchievements } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import { PageIntro, ResourceExplore } from "@/components/clinic/ClinicSections";
export const metadata = {
  ...defaultMetadata({
    title: "Achievements & recognitions | Dr Olaosebikan",
    description: "Verified professional milestones and recognitions.",
    path: "/publications/achievements",
  }),
  robots: {
    index:
      process.env.CLINIC_RELEASE === "approved" &&
      visibleAchievements.length > 0,
    follow: true,
  },
};
export default function AchievementsPage() {
  return (
    <>
      <PageIntro
        variant="achievements"
        eyebrow="Professional milestones"
        title={
          <>
            Achievements &amp;<br className="clinic-mobile-break" /> recognitions.
          </>
        }
        description="A dedicated page for professional milestones and recognitions when their details are verified."
      />
      <section className="clinic-page-body">
        <div className="clinic-container">
          <p className="clinic-eyebrow">Professional record</p>
          <h2 className="clinic-subtitle">Milestones and recognitions.</h2>
          <div className="clinic-resource-layout">
            <div>
              {visibleAchievements.length === 0 ? (
                <div className="clinic-resource-empty clinic-achievement-empty">
                  <p className="clinic-eyebrow">Verification pending</p>
                  <h3 className="clinic-subtitle">
                    Achievements pending verification
                  </h3>
                  <p>
                    Verified achievements have not been added to the website
                    yet.
                  </p>
                  <p>
                    No awards, fellowships, professional recognitions or
                    milestone dates are displayed without verification.
                  </p>
                </div>
              ) : (
                visibleAchievements.map((a) => (
                  <article
                    key={`${a.title}-${a.year}`}
                    className="clinic-resource-record"
                  >
                    <p className="clinic-small">
                      {a.year}
                      {a.organization ? ` · ${a.organization}` : ""}
                    </p>
                    <h3 className="clinic-subtitle">{a.title}</h3>
                    {a.description && <p>{a.description}</p>}
                    {a.sourceUrl && (
                      <a
                        className="clinic-text-link"
                        href={a.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View source <span aria-hidden>↗</span>
                      </a>
                    )}
                  </article>
                ))
              )}
            </div>
            <ResourceExplore variant="achievements" />
          </div>
          {visibleAchievements.length === 0 && (
            <div className="clinic-inline-status">
              <p className="clinic-eyebrow" style={{ marginBottom: 8 }}>
                Current content status
              </p>
              <p>This page contains no achievement entries at present.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
