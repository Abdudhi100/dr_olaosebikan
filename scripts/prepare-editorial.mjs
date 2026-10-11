import { mkdir, writeFile, rename, rm, cp } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { validateSnapshot } from "../shared/publishing-policy.mjs";
// Explicit public-field projection. Never query confidential workflow documents or arbitrary document spreads.
export const CONTENT_QUERY = `*[_type in ["editorialEntry", "researchPublication", "professionalAchievement"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
 _id,_type,kind,title,slug,summary,body,topic,publishedAt,modifiedAt,authorName,authorRole,sources,seoTitle,seoDescription,featured,
 featuredImage{asset, "url": asset->url},imageAlt,imageCredit,requiresClinicalReview,
 clinicalReview{status,reviewerName,reviewerRole,credentialsVerified,reviewedAt,evidenceReference,approvedFingerprint},
 mediaRightsStatus,mediaRightsEvidenceReference,publicSafeConfirmed,publicationStatus,correctionNote,
 video{platform,videoId,sourceUrl,durationSeconds,uploadedAt,speakerName,captionsConfirmed,transcriptReviewed,transcript},
 news{eventAt,organisation,sourceUrl},journal,year,authors,abstract,doiLink,sourceUrl,verified,organisation,description
}`;
export async function fetchPublished(env = process.env, fetcher = fetch) {
  const mode = env.SANITY_CONTENT_MODE ?? "disabled";
  if (!["disabled", "sanity"].includes(mode))
    throw new Error("SANITY_CONTENT_MODE must be disabled or sanity.");
  if (mode === "disabled") {
    if (
      env.SANITY_PROJECT_ID ||
      env.SANITY_DATASET ||
      env.SANITY_API_READ_TOKEN
    )
      throw new Error(
        "CMS settings are present but SANITY_CONTENT_MODE is disabled. Enable sanity mode explicitly.",
      );
    return [];
  }
  const project = env.SANITY_PROJECT_ID,
    dataset = env.SANITY_DATASET;
  if (
    !/^[a-z0-9]+$/.test(project ?? "") ||
    !/^[a-z0-9_-]+$/.test(dataset ?? "")
  )
    throw new Error(
      "Set valid SANITY_PROJECT_ID and SANITY_DATASET for CMS builds.",
    );
  const url = new URL(
    `https://${project}.api.sanity.io/v2026-06-09/data/query/${dataset}`,
  );
  url.searchParams.set("query", CONTENT_QUERY);
  url.searchParams.set("perspective", "published");
  const response = await fetcher(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
    headers: env.SANITY_API_READ_TOKEN
      ? { Authorization: `Bearer ${env.SANITY_API_READ_TOKEN}` }
      : {},
  });
  if (!response.ok)
    throw new Error(
      `CMS query failed (${response.status}); no partial or stale snapshot will be built.`,
    );
  const length = Number(response.headers.get("content-length") ?? 0);
  if (length > 10_000_000)
    throw new Error("CMS response exceeds build size limit.");
  const raw = await response.text();
  if (raw.length > 10_000_000)
    throw new Error("CMS response exceeds build size limit.");
  const data = JSON.parse(raw);
  if (!Array.isArray(data.result))
    throw new Error("CMS query returned an invalid result.");
  return data.result;
}
export async function prepareEditorial({
  env = process.env,
  fetcher = fetch,
} = {}) {
  const snapshot = await validateSnapshot(await fetchPublished(env, fetcher));
  // Remove release evidence from the browser bundle; only public display data is carried forward.
  const editorial = snapshot.editorial.map(
    ({
      mediaRightsEvidenceReference,
      mediaRightsStatus,
      publicSafeConfirmed,
      publicationStatus,
      clinicalReview,
      ...entry
    }) => ({
      ...entry,
      ...(clinicalReview?.status === "approved"
        ? {
            clinicalReview: {
              status: "approved",
              reviewerName: clinicalReview.reviewerName,
              reviewerRole: clinicalReview.reviewerRole,
              reviewedAt: clinicalReview.reviewedAt,
            },
          }
        : {}),
    }),
  );
  const research = snapshot.research.map(
    ({ verified, publicSafeConfirmed, publicationStatus, ...entry }) => entry,
  );
  const achievements = snapshot.achievements.map(
    ({ verified, publicSafeConfirmed, publicationStatus, ...entry }) => entry,
  );
  const directory = new URL("../src/generated/", import.meta.url);
  await mkdir(directory, { recursive: true });
  const target = new URL("editorial.json", directory),
    temporary = new URL("editorial.json.tmp", directory);
  await writeFile(
    temporary,
    JSON.stringify({ editorial, research, achievements }, null, 2) + "\n",
  );
  await rename(temporary, target);
  await writeFile(
    new URL("research.json", directory),
    JSON.stringify({ research, achievements }) + "\n",
  );
  await writeFile(
    new URL("navigation.json", directory),
    JSON.stringify({ hasInsights: editorial.length > 0 }) + "\n",
  );
  // Next 15 static export rejects empty generateStaticParams lists. Activate only real formats.
  const routes = new URL("../src/app/insights/(entries)/", import.meta.url);
  await rm(routes, { recursive: true, force: true });
  for (const [kind, folder] of [
    ["article", "articles"],
    ["video", "videos"],
    ["news", "news"],
  ]) {
    if (editorial.some((entry) => entry.kind === kind)) {
      await mkdir(routes, { recursive: true });
      await cp(
        new URL(`../src/editorial-routes/${folder}`, import.meta.url),
        new URL(folder, routes),
        { recursive: true },
      );
    }
  }
  console.log(
    `Prepared ${editorial.length} editorial entries, ${research.length} research records and ${achievements.length} achievements.`,
  );
}
if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
)
  await prepareEditorial();
