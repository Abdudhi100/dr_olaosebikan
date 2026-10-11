import { defineArrayMember, defineField, defineType, type Rule } from "sanity";
import {
  TOPICS,
  bodyErrors,
  releaseErrors,
  recordErrors,
} from "../../shared/publishing-policy.mjs";
import { ReviewFingerprint } from "../ReviewFingerprint";
const field = (name: string, title: string, type = "string", extra = {}) =>
  defineField({ name, title, type, ...extra });
const textBody = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Paragraph", value: "normal" },
      { title: "Heading", value: "h2" },
      { title: "Subheading", value: "h3" },
      { title: "Quote", value: "blockquote" },
    ],
    lists: [
      { title: "Bullets", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Bold", value: "strong" },
        { title: "Italic", value: "em" },
      ],
      annotations: [
        {
          name: "link",
          title: "HTTPS link",
          type: "object",
          fields: [
            field("href", "Link address", "url", {
              validation: (r: Rule) =>
                r.uri({ scheme: ["https"], allowRelative: false }),
            }),
          ],
        },
      ],
    },
  }),
];
const status = field("publicationStatus", "Release status", "string", {
  initialValue: "draft",
  description:
    "Ready allows publishing after all checks pass. Publishing starts a website build; it does not mean the content is live. To withdraw, use Unpublish and verify a successful removal build.",
  options: {
    list: [
      { title: "Draft / collecting material", value: "draft" },
      { title: "Ready for public release", value: "ready" },
      { title: "Withdrawn", value: "withdrawn" },
    ],
  },
});
const publicSafe = field(
  "publicSafeConfirmed",
  "All content and assets are public-safe",
  "boolean",
  {
    initialValue: false,
    description:
      "No patient information, confidential review notes, permissions documents or signed URLs. Evidence references below are non-secret identifiers only.",
  },
);
const sourceFields = [
  field("label", "Source title"),
  field("url", "Original HTTPS source", "url"),
  field("publishedDate", "Actual source publication date (if known)", "date"),
];
export const editorialEntry = defineType({
  name: "editorialEntry",
  title: "Article, video or news",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "review", title: "Review & release" },
    { name: "seo", title: "Search appearance" },
  ],
  initialValue: {
    publicationStatus: "draft",
    requiresClinicalReview: true,
    publicSafeConfirmed: false,
    clinicalReview: { status: "pending" },
  },
  preview: {
    select: { title: "title", kind: "kind", status: "publicationStatus" },
    prepare: ({ title, kind, status }) => ({
      title: title ?? "Untitled draft",
      subtitle: `${kind ?? "Choose a format"} · ${status ?? "draft"}`,
    }),
  },
  validation: (r) =>
    r.custom(async (doc) => {
      if (!doc || doc.publicationStatus !== "ready") return true;
      const errors = await releaseErrors(doc);
      return errors.length ? errors.join("\n") : true;
    }),
  fields: [
    field("kind", "Format", "string", {
      group: "content",
      options: { list: ["article", "video", "news"] },
      validation: (r: Rule) => r.required(),
    }),
    field("title", "Title", "string", { group: "content" }),
    field("slug", "Permalink slug", "slug", {
      group: "content",
      options: { source: "title", maxLength: 96 },
    }),
    field("summary", "Short introduction", "text", {
      group: "content",
      rows: 3,
    }),
    field("body", "Article / introduction body", "array", {
      group: "content",
      of: textBody,
      validation: (r: Rule) =>
        r.custom((value) =>
          !value ? true : bodyErrors(value).join("\n") || true,
        ),
    }),
    field("topic", "Topic", "string", {
      group: "content",
      options: { list: TOPICS },
    }),
    field("tags", "Tags", "array", {
      group: "content",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (r: Rule) => r.max(8).unique(),
    }),
    field("authorName", "Actual author name", "string", { group: "content" }),
    field("authorRole", "Author role / attribution", "string", {
      group: "content",
    }),
    field(
      "publishedAt",
      "Public publication date (Lagos WAT = UTC+1)",
      "datetime",
      {
        group: "content",
        description:
          "Enter the real publication time. Future dates are blocked; this MVP uses manual publication.",
      },
    ),
    field("modifiedAt", "Meaningful public-content update date", "datetime", {
      group: "content",
      description:
        "Set when the public content materially changes. Do not use automatic document-save time.",
    }),
    field("sources", "Evidence & further reading", "array", {
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "source",
          fields: sourceFields,
        }),
      ],
    }),
    field("correctionNote", "Public correction note (optional)", "text", {
      group: "content",
      rows: 3,
    }),
    field("featured", "Feature on the hub", "boolean", { group: "content" }),
    field("featuredImage", "Approved image / video thumbnail", "image", {
      group: "media",
      description:
        "Upload only public-safe, rights-cleared assets. Patient uploads are outside this system.",
      options: { hotspot: false },
    }),
    field("imageAlt", "Image alt text", "string", { group: "media" }),
    field("imageCredit", "Image credit", "string", { group: "media" }),
    field("mediaRightsStatus", "Media rights", "string", {
      group: "media",
      options: {
        list: [
          { title: "Owned", value: "owned" },
          { title: "Permission granted", value: "permission" },
          { title: "No media used", value: "no-media" },
        ],
      },
    }),
    field(
      "mediaRightsEvidenceReference",
      "Non-secret media rights evidence reference",
      "string",
      {
        group: "media",
        description:
          "Identifier only; store private permission/consent documents outside this dataset.",
      },
    ),
    field("video", "Hosted video & accessibility", "object", {
      group: "media",
      hidden: ({ document }: { document?: { kind?: string } }) =>
        document?.kind !== "video",
      fields: [
        field("platform", "Platform", "string", {
          options: { list: ["youtube", "vimeo"] },
        }),
        field("videoId", "Video ID"),
        field("sourceUrl", "Original video address", "url"),
        field("durationSeconds", "Actual duration in seconds", "number"),
        field("uploadedAt", "Actual upload date", "datetime"),
        field("speakerName", "Actual speaker(s)"),
        field(
          "captionsConfirmed",
          "Captions are available on the hosted video",
          "boolean",
        ),
        field(
          "transcriptReviewed",
          "Transcript has been checked by a human",
          "boolean",
        ),
        field("transcript", "Reviewed transcript", "text"),
      ],
    }),
    field("news", "Verified news context", "object", {
      group: "content",
      hidden: ({ document }: { document?: { kind?: string } }) =>
        document?.kind !== "news",
      fields: [
        field("eventAt", "Actual event / announcement date", "datetime"),
        field("organisation", "Announcing organisation"),
        field("sourceUrl", "Original announcement address", "url"),
      ],
    }),
    field(
      "requiresClinicalReview",
      "Content contains clinical claims",
      "boolean",
      {
        group: "review",
        description:
          "Articles and videos always require clinical review. Only purely nonclinical news can opt out.",
      },
    ),
    field("clinicalReview", "Clinical approval for this version", "object", {
      group: "review",
      fields: [
        field("status", "Review status", "string", {
          options: { list: ["pending", "approved", "not-required"] },
        }),
        field("reviewerName", "Actual reviewing clinician"),
        field("reviewerRole", "Verified professional role / credentials"),
        field(
          "credentialsVerified",
          "Reviewer identity and credentials verified",
          "boolean",
        ),
        field("reviewedAt", "Actual approval date", "datetime"),
        field(
          "evidenceReference",
          "Non-secret independent written approval reference",
          "string",
          {
            description:
              "Do not upload private sign-off documents or patient information.",
          },
        ),
        field(
          "approvedFingerprint",
          "Clinician-approved content fingerprint",
          "string",
          { components: { input: ReviewFingerprint } },
        ),
      ],
    }),
    { ...publicSafe, group: "review" },
    { ...status, group: "review" },
    field("seoTitle", "Search title", "string", {
      group: "seo",
      description: "3–70 characters. Describe the actual content.",
    }),
    field("seoDescription", "Search description", "text", {
      group: "seo",
      rows: 3,
      description: "30–170 characters. No unsupported claims.",
    }),
  ],
});
export const researchPublication = defineType({
  name: "researchPublication",
  title: "Verified research publication",
  type: "document",
  validation: (r) =>
    r.custom((doc) =>
      !doc || doc.publicationStatus !== "ready"
        ? true
        : recordErrors(doc).join("\n") || true,
    ),
  fields: [
    field("title", "Exact paper title"),
    field("slug", "Permalink slug", "slug", {
      options: { source: "title", maxLength: 96 },
    }),
    field("journal", "Journal"),
    field("year", "Publication year", "number"),
    field("authors", "Exact author names, in publication order", "array", {
      of: [defineArrayMember({ type: "string" })],
    }),
    field("abstract", "Approved abstract / summary", "text"),
    field("doiLink", "DOI address (if available)", "url"),
    field("sourceUrl", "Original public research record", "url"),
    field(
      "verified",
      "Bibliographic metadata and authorship verified",
      "boolean",
    ),
    publicSafe,
    status,
  ],
});
export const professionalAchievement = defineType({
  name: "professionalAchievement",
  title: "Verified professional achievement",
  type: "document",
  validation: (r) =>
    r.custom((doc) =>
      !doc || doc.publicationStatus !== "ready"
        ? true
        : recordErrors(doc).join("\n") || true,
    ),
  fields: [
    field("title", "Exact achievement title"),
    field("year", "Year", "number"),
    field("organisation", "Actual issuing organisation"),
    field("description", "Verified description", "text"),
    field("sourceUrl", "Original public institutional evidence", "url"),
    field("verified", "Achievement and issuer verified", "boolean"),
    publicSafe,
    status,
  ],
});
export const schemaTypes = [
  editorialEntry,
  researchPublication,
  professionalAchievement,
];
