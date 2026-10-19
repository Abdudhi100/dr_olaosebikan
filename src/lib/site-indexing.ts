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

/**
 * A public collection should be indexed only when it contains at least one
 * validated, published record. Keep empty collection landing pages accessible
 * to people but out of the search index. Protected preview builds remain
 * noindex even if populated fixtures or real entries are available.
 */
export function shouldIndexPublishedCollection(
  release: ClinicIndexingRelease,
  publishedRecordCount: number,
  env?: ClinicIndexingEnvironment,
): boolean {
  return publishedRecordCount > 0 &&
    Number.isInteger(publishedRecordCount) &&
    shouldIndexClinic(release, env);
}

