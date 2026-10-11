/** Shared by Studio and the static build. Process checks are not independent proof of clinician approval. */
export const TOPICS = [
  "Arthritis",
  "Joint Pain",
  "Gout",
  "Lupus",
  "Autoimmune Conditions",
  "Rheumatology Care",
  "Clinic News",
  "Research",
];
export const KINDS = ["article", "video", "news"];
const folders = { article: "articles", video: "videos", news: "news" };
const reserved = new Set([
  "index",
  "new",
  "draft",
  "preview",
  "publication-record-unavailable",
  "achievements",
]);
const publicFields = [
  "kind",
  "title",
  "slug",
  "summary",
  "body",
  "topic",
  "publishedAt",
  "modifiedAt",
  "authorName",
  "authorRole",
  "sources",
  "seoTitle",
  "seoDescription",
  "featuredImage",
  "imageAlt",
  "imageCredit",
  "video",
  "news",
  "correctionNote",
];
export function editorialPath(entry) {
  return `/insights/${folders[entry.kind]}/${entry.slug.current}`;
}
export function isPublishedId(id) {
  return (
    typeof id === "string" &&
    !id.startsWith("drafts.") &&
    !id.startsWith("versions.")
  );
}
export function safeUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const u = new URL(value);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !!u.hostname &&
      !/[\u0000-\u0020\\]/.test(value)
    );
  } catch {
    return false;
  }
}
export function safeImageUrl(value) {
  return (
    safeUrl(value) &&
    new URL(value).hostname === "cdn.sanity.io" &&
    /^\/images\/[a-z0-9]+\/[a-z0-9_-]+\/[a-zA-Z0-9_-]+-\d+x\d+\.(jpg|jpeg|png|webp|gif)$/.test(
      new URL(value).pathname,
    ) &&
    !new URL(value).search
  );
}
export function videoEmbed(video) {
  if (!video || !safeUrl(video.sourceUrl)) return undefined;
  const u = new URL(video.sourceUrl);
  if (
    video.platform === "youtube" &&
    /^[a-zA-Z0-9_-]{11}$/.test(video.videoId)
  ) {
    const sourceId =
      u.hostname === "youtu.be"
        ? u.pathname.slice(1)
        : ["www.youtube.com", "youtube.com"].includes(u.hostname)
          ? u.pathname === "/watch"
            ? u.searchParams.get("v")
            : u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1]
          : null;
    if (sourceId === video.videoId)
      return `https://www.youtube-nocookie.com/embed/${video.videoId}`;
  }
  if (
    video.platform === "vimeo" &&
    /^\d{6,12}$/.test(video.videoId) &&
    ["vimeo.com", "www.vimeo.com"].includes(u.hostname) &&
    u.pathname === `/${video.videoId}`
  )
    return `https://player.vimeo.com/video/${video.videoId}`;
  return undefined;
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .filter(
          (k) =>
            !["_key", "_type", "_rev", "_createdAt", "_updatedAt"].includes(k),
        )
        .sort()
        .map((k) => [k, canonical(value[k])]),
    );
  return value;
}
export async function contentFingerprint(doc) {
  const normalized = {
    ...doc,
    ...(doc.featuredImage
      ? { featuredImage: { asset: doc.featuredImage.asset } }
      : {}),
  };
  const content = Object.fromEntries(
    publicFields
      .filter((k) => normalized[k] !== undefined)
      .map((k) => [k, normalized[k]]),
  );
  const bytes = new TextEncoder().encode(JSON.stringify(canonical(content)));
  const hash = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
function text(value, min, max) {
  return (
    typeof value === "string" &&
    value.trim().length >= min &&
    value.length <= max
  );
}
function dateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const d = new Date(value + "T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
function evidence(value) {
  return (
    typeof value === "string" &&
    /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,159}$/.test(value)
  );
}
function validDate(value, now) {
  return (
    typeof value === "string" &&
    dateOnly(value.slice(0, 10)) &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    ) &&
    Number.isFinite(Date.parse(value)) &&
    Date.parse(value) <= now.getTime()
  );
}
function slugValid(doc) {
  return (
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(doc.slug?.current ?? "") &&
    doc.slug.current.length <= 96 &&
    !reserved.has(doc.slug.current)
  );
}
export function bodyErrors(body) {
  if (!Array.isArray(body) || !body.length || body.length > 200)
    return ["Body must contain 1–200 text blocks."];
  const errors = [];
  for (const block of body) {
    if (
      block?._type !== "block" ||
      !["normal", "h2", "h3", "blockquote"].includes(block.style ?? "normal") ||
      !Array.isArray(block.children) ||
      !block.children.length ||
      block.children.length > 200
    ) {
      errors.push("Body contains an unsupported block.");
      continue;
    }
    if (block.listItem && !["bullet", "number"].includes(block.listItem))
      errors.push("Unsupported list type.");
    if (block.level && block.level !== 1)
      errors.push("Only single-level lists are supported.");
    const definitions = block.markDefs ?? [];
    if (
      !Array.isArray(definitions) ||
      definitions.length > 100 ||
      definitions.some(
        (d) => d?._type !== "link" || !text(d._key, 1, 100) || !safeUrl(d.href),
      )
    )
      errors.push("Body links must be ordinary HTTPS links.");
    const allowedMarks = new Set([
      "strong",
      "em",
      ...(Array.isArray(definitions) ? definitions : []).map((d) => d?._key),
    ]);
    for (const span of block.children) {
      if (
        span?._type !== "span" ||
        !text(span.text, 0, 10000) ||
        !Array.isArray(span.marks ?? []) ||
        (span.marks ?? []).some((m) => !allowedMarks.has(m))
      )
        errors.push("Body contains unsupported text or marks.");
    }
  }
  const plain = body
    .flatMap((b) =>
      Array.isArray(b?.children)
        ? b.children.map((s) => (typeof s?.text === "string" ? s.text : ""))
        : [],
    )
    .join("");
  if (plain.trim().length < 40 || plain.length > 100000)
    errors.push("Body must contain 40–100000 characters of substantive text.");
  return [...new Set(errors)];
}
function commonErrors(doc, now) {
  const errors = [];
  for (const [key, min, max] of [
    ["title", 3, 160],
    ["summary", 20, 500],
    ["authorName", 2, 120],
    ["authorRole", 2, 160],
    ["seoTitle", 3, 70],
    ["seoDescription", 30, 170],
  ])
    if (!text(doc[key], min, max))
      errors.push(`${key} must contain ${min}–${max} characters.`);
  if (!slugValid(doc))
    errors.push(
      "Choose a unique lowercase slug without reserved route names (maximum 96 characters).",
    );
  if (!validDate(doc.publishedAt, now))
    errors.push(
      "Publication date must be a real past or current timestamp; scheduled publishing is not enabled.",
    );
  if (
    doc.modifiedAt &&
    (!validDate(doc.modifiedAt, now) ||
      Date.parse(doc.modifiedAt) < Date.parse(doc.publishedAt))
  )
    errors.push(
      "Meaningful modification date must follow publication and cannot be in the future.",
    );
  if (
    !Array.isArray(doc.sources) ||
    !doc.sources.length ||
    doc.sources.length > 30 ||
    doc.sources.some(
      (s) =>
        !text(s?.label, 2, 200) ||
        !safeUrl(s?.url) ||
        (s.publishedDate &&
          (!dateOnly(s.publishedDate) ||
            s.publishedDate > now.toISOString().slice(0, 10))),
    )
  )
    errors.push("Supply 1–30 named HTTPS sources with accurate source dates.");
  if (doc.publicSafeConfirmed !== true)
    errors.push(
      "Confirm content and assets are public-safe, with no patient information or confidential evidence.",
    );
  if (!["owned", "permission", "no-media"].includes(doc.mediaRightsStatus))
    errors.push("Record cleared media rights, or confirm no media.");
  const image = doc.featuredImage;
  if (image) {
    // Studio stores an asset reference; the build resolves it to its canonical CDN URL.
    const ref = image?.asset?._ref;
    if (
      !safeImageUrl(image.url) &&
      !(
        typeof ref === "string" &&
        /^image-[a-zA-Z0-9]+-\d+x\d+-(jpg|jpeg|png|webp|gif)$/.test(ref)
      )
    )
      errors.push("Featured image must be an approved Sanity image asset.");
    if (!text(doc.imageAlt, 3, 250) || !text(doc.imageCredit, 2, 200))
      errors.push(
        "Provide descriptive image alt text and accurate image credit.",
      );
  }
  if (image || doc.kind === "video") {
    if (
      doc.mediaRightsStatus === "no-media" ||
      !evidence(doc.mediaRightsEvidenceReference)
    )
      errors.push(
        "Supply a non-secret rights evidence reference for all media.",
      );
  }
  if (doc.correctionNote && !text(doc.correctionNote, 3, 1000))
    errors.push("Correction note must contain 3–1000 characters.");
  return errors;
}
export async function releaseErrors(doc, { now = new Date() } = {}) {
  if (!doc || typeof doc !== "object") return ["Content must be a document."];
  const errors = commonErrors(doc, now);
  if (!KINDS.includes(doc.kind)) errors.push("Select article, video or news.");
  if (!TOPICS.includes(doc.topic)) errors.push("Choose an approved topic.");
  errors.push(...bodyErrors(doc.body));
  // Articles and videos always need clinical review. News may be nonclinical, explicitly classified.
  if (typeof doc.requiresClinicalReview !== "boolean")
    errors.push("Classify whether the content makes clinical claims.");
  const needsReview =
    ["article", "video"].includes(doc.kind) ||
    doc.requiresClinicalReview === true;
  if (needsReview) {
    const review = doc.clinicalReview;
    if (
      review?.status !== "approved" ||
      !text(review?.reviewerName, 2, 120) ||
      !text(review?.reviewerRole, 3, 200) ||
      review?.credentialsVerified !== true ||
      !validDate(review?.reviewedAt, now) ||
      !evidence(review?.evidenceReference)
    )
      errors.push(
        "Record named clinician approval, verified credentials, date and a non-secret evidence reference.",
      );
    if (review?.approvedFingerprint !== (await contentFingerprint(doc)))
      errors.push(
        "Clinical approval does not match this content version. Obtain approval for the current fingerprint.",
      );
    if (
      doc.modifiedAt &&
      Date.parse(review?.reviewedAt) < Date.parse(doc.modifiedAt)
    )
      errors.push(
        "Clinical approval must follow the meaningful content modification.",
      );
  } else if (doc.clinicalReview?.status !== "not-required")
    errors.push(
      "Nonclinical news must explicitly record that clinical review is not required.",
    );
  if (doc.kind === "video") {
    const v = doc.video;
    if (!videoEmbed(v))
      errors.push("Supply matching YouTube or Vimeo source URL and video ID.");
    if (
      !Number.isInteger(v?.durationSeconds) ||
      v.durationSeconds < 1 ||
      v.durationSeconds > 86400
    )
      errors.push(
        "Video duration must be accurate, between 1 second and 24 hours.",
      );
    if (!text(v?.speakerName, 2, 200) || !validDate(v?.uploadedAt, now))
      errors.push("Supply actual speaker and video upload date.");
    if (
      v?.captionsConfirmed !== true ||
      v?.transcriptReviewed !== true ||
      !text(v?.transcript, 40, 100000)
    )
      errors.push(
        "Confirm available captions and a human-reviewed transcript (40–100000 characters).",
      );
    if (!doc.featuredImage)
      errors.push("Video requires an accurate, rights-cleared thumbnail.");
  }
  if (doc.kind === "news") {
    if (
      !validDate(doc.news?.eventAt, now) ||
      !text(doc.news?.organisation, 2, 200) ||
      !safeUrl(doc.news?.sourceUrl)
    )
      errors.push(
        "News requires a verified event date, organisation and original HTTPS announcement source.",
      );
  }
  return [...new Set(errors)];
}
export function recordErrors(doc, { now = new Date() } = {}) {
  const errors = [];
  if (
    !text(doc?.title, 3, 300) ||
    !Number.isInteger(doc.year) ||
    doc.year < 1900 ||
    doc.year > now.getUTCFullYear() ||
    !safeUrl(doc.sourceUrl) ||
    doc.verified !== true ||
    doc.publicSafeConfirmed !== true
  )
    errors.push(
      "Provide verified title, year and original public HTTPS evidence, and confirm public-safe content.",
    );
  if (doc._type === "researchPublication") {
    if (
      !slugValid(doc) ||
      !text(doc.journal, 2, 200) ||
      !Array.isArray(doc.authors) ||
      !doc.authors.length ||
      doc.authors.length > 200 ||
      doc.authors.some((a) => !text(a, 2, 200))
    )
      errors.push(
        "Research requires a valid slug, journal and exact author list.",
      );
    if (doc.abstract && !text(doc.abstract, 1, 100000))
      errors.push("Research abstract exceeds 100000 characters.");
    if (
      doc.doiLink &&
      (!safeUrl(doc.doiLink) || new URL(doc.doiLink).hostname !== "doi.org")
    )
      errors.push("DOI link must use https://doi.org.");
  } else if (doc._type === "professionalAchievement") {
    if (doc.description && !text(doc.description, 1, 5000))
      errors.push("Achievement description exceeds 5000 characters.");
    if (!text(doc.organisation, 2, 200))
      errors.push("Achievement requires the genuine issuing organisation.");
  } else errors.push("Unsupported record type.");
  return errors;
}
export async function validateSnapshot(docs, options = {}) {
  if (!Array.isArray(docs) || docs.length > 2000)
    throw new Error("CMS response must be an array of at most 2000 documents.");
  const snapshot = { editorial: [], research: [], achievements: [] };
  const ids = new Set(),
    paths = new Set();
  for (const doc of docs) {
    if (!isPublishedId(doc?._id) || doc.publicationStatus !== "ready") continue;
    const errors =
      doc._type === "editorialEntry"
        ? await releaseErrors(doc, options)
        : recordErrors(doc, options);
    if (
      doc._type === "editorialEntry" &&
      doc.featuredImage &&
      !safeImageUrl(doc.featuredImage.url)
    )
      errors.push(
        "Featured image asset must resolve to a valid public Sanity CDN URL during the build.",
      );
    if (errors.length)
      throw new Error(`Release blocked for ${doc._id}: ${errors.join(" ")}`);
    if (ids.has(doc._id)) throw new Error(`Duplicate document ID: ${doc._id}`);
    ids.add(doc._id);
    const path =
      doc._type === "editorialEntry"
        ? editorialPath(doc)
        : doc._type === "researchPublication"
          ? `/publications/${doc.slug.current}`
          : undefined;
    if (path && paths.has(path))
      throw new Error(`Duplicate public route: ${path}`);
    if (path) paths.add(path);
    if (doc._type === "editorialEntry") snapshot.editorial.push(doc);
    else if (doc._type === "researchPublication") snapshot.research.push(doc);
    else snapshot.achievements.push(doc);
  }
  snapshot.editorial.sort(
    (a, b) =>
      Date.parse(b.publishedAt) - Date.parse(a.publishedAt) ||
      a._id.localeCompare(b._id),
  );
  return snapshot;
}
