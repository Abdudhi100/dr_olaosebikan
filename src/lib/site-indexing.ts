/**
 * One consistent search-indexing switch for SEO metadata and robots.txt.
 * A public site is indexable only after release sign-off. On Cloudflare Pages,
 * never let a preview branch become indexable just because the clinic is live.
 * No separate CLINIC_RELEASE environment switch is required.
 */
export type ClinicIndexingRelease = {
  releaseStatus: string;
  canonicalDomainConfirmed: boolean;
  productionBranch: string;
};

export type ClinicIndexingEnvironment = {
  CF_PAGES?: string;
  CF_PAGES_BRANCH?: string;
};

export function shouldIndexClinic(
  release: ClinicIndexingRelease,
  env: ClinicIndexingEnvironment = {
    CF_PAGES: process.env.CF_PAGES,
    CF_PAGES_BRANCH: process.env.CF_PAGES_BRANCH,
  },
): boolean {
  if (
    release.releaseStatus !== "approved" ||
    release.canonicalDomainConfirmed !== true ||
    !release.productionBranch.trim()
  ) return false;
  return env.CF_PAGES !== "1" || env.CF_PAGES_BRANCH === release.productionBranch;
}
