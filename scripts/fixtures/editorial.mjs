// Synthetic nonmedical test fixtures. Never loaded by the production CMS query.
import { contentFingerprint } from "../../shared/publishing-policy.mjs";
export const NOW = new Date("2026-10-11T12:00:00Z");
export function body(
  text = "Synthetic test paragraph. This is not medical guidance.",
) {
  return [
    {
      _type: "block",
      _key: "paragraph",
      style: "normal",
      children: [{ _type: "span", _key: "text", text, marks: [] }],
      markDefs: [],
    },
  ];
}
export async function entry(kind = "article", overrides = {}) {
  const doc = {
    _id: `synthetic-${kind}`,
    _type: "editorialEntry",
    kind,
    title: `Synthetic ${kind} export test`,
    slug: { current: `synthetic-${kind}-test` },
    summary:
      "Synthetic content used only to verify the publishing system. Not a real clinic publication.",
    body: body(),
    topic: kind === "news" ? "Clinic News" : "Rheumatology Care",
    publishedAt: "2020-01-03T09:00:00Z",
    authorName: "Synthetic test author",
    authorRole: "Test fixture",
    sources: [
      {
        label: "Synthetic source",
        url: "https://example.com/source",
        publishedDate: "2020-01-01",
      },
    ],
    seoTitle: `Synthetic ${kind} export test`,
    seoDescription:
      "Synthetic metadata for verifying static export, authorship, sources and accurate dates.",
    requiresClinicalReview: kind !== "news",
    mediaRightsStatus: "no-media",
    publicSafeConfirmed: true,
    publicationStatus: "ready",
    ...overrides,
  };
  if (kind === "video") {
    Object.assign(
      doc,
      {
        featuredImage: {
          asset: { _ref: "image-testasset-640x360-jpg" },
          url: "https://cdn.sanity.io/images/example1/production/testasset-640x360.jpg",
        },
        imageAlt: "Synthetic test video thumbnail",
        imageCredit: "Synthetic asset fixture",
        mediaRightsStatus: "owned",
        mediaRightsEvidenceReference: "TEST-MEDIA-1",
        video: {
          platform: "youtube",
          sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
          videoId: "abcdefghijk",
          durationSeconds: 125,
          uploadedAt: "2020-01-02T09:00:00Z",
          speakerName: "Synthetic test speaker",
          captionsConfirmed: true,
          transcriptReviewed: true,
          transcript:
            "Synthetic transcript to verify rendering only. This is not clinical advice.",
        },
      },
      overrides,
    );
  }
  if (kind === "news")
    doc.news ??= {
      eventAt: "2020-01-02T09:00:00Z",
      organisation: "Synthetic organisation",
      sourceUrl: "https://example.com/announcement",
    };
  if (doc.requiresClinicalReview || kind !== "news")
    doc.clinicalReview = {
      status: "approved",
      reviewerName: "Synthetic test reviewer",
      reviewerRole: "Synthetic credentials, not a real clinician",
      credentialsVerified: true,
      reviewedAt: "2020-01-02T12:00:00Z",
      evidenceReference: "TEST-APPROVAL-1",
      approvedFingerprint: await contentFingerprint(doc),
    };
  else doc.clinicalReview = { status: "not-required" };
  return doc;
}
export function research(overrides = {}) {
  return {
    _id: "synthetic-research",
    _type: "researchPublication",
    title: "Synthetic bibliographic test record",
    slug: { current: "synthetic-research-test" },
    journal: "Synthetic journal fixture",
    year: 2020,
    authors: ["Actual fixture author"],
    sourceUrl: "https://example.com/research",
    verified: true,
    publicSafeConfirmed: true,
    publicationStatus: "ready",
    ...overrides,
  };
}
