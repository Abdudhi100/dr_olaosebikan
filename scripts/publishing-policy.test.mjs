import assert from "node:assert/strict";
import test from "node:test";
import {
  contentFingerprint,
  releaseErrors,
  validateSnapshot,
  safeUrl,
  videoEmbed,
  recordErrors,
} from "../shared/publishing-policy.mjs";
import { fetchPublished, CONTENT_QUERY } from "./prepare-editorial.mjs";
import { entry, research, NOW, body } from "./fixtures/editorial.mjs";
const options = { now: NOW };
test("approved article, accessible video and nonclinical news pass release checks", async () => {
  for (const kind of ["article", "video", "news"])
    assert.deepEqual(await releaseErrors(await entry(kind), options), []);
});
test("clinical claims cannot be waived on articles or videos", async () => {
  for (const kind of ["article", "video"]) {
    const doc = await entry(kind);
    doc.requiresClinicalReview = false;
    doc.clinicalReview = { status: "not-required" };
    assert.match(
      (await releaseErrors(doc, options)).join(),
      /named clinician approval/,
    );
  }
});
test("any public content edit invalidates version-specific approval", async () => {
  const doc = await entry();
  doc.body = body(
    "Edited synthetic paragraph invalidates the recorded clinical approval.",
  );
  assert.match((await releaseErrors(doc, options)).join(), /does not match/);
});
test("editor-only changes do not invalidate public-content fingerprint", async () => {
  const doc = await entry();
  assert.equal(
    await contentFingerprint(doc),
    await contentFingerprint({
      ...doc,
      _rev: "new",
      _updatedAt: NOW.toISOString(),
      featured: true,
    }),
  );
});
test("Studio asset references and resolved build images have matching fingerprints", async () => {
  const doc = await entry("video");
  const studio = structuredClone(doc);
  delete studio.featuredImage.url;
  studio.video._type = "video";
  studio.slug._type = "slug";
  assert.equal(await contentFingerprint(doc), await contentFingerprint(studio));
});
test("review evidence cannot be a private signed URL", async () => {
  const doc = await entry();
  doc.clinicalReview.evidenceReference =
    "https://example.com/private?token=secret";
  assert.match(
    (await releaseErrors(doc, options)).join(),
    /non-secret evidence/,
  );
});
test("drafts, release versions, unpublished and withdrawn records never enter snapshot", async () => {
  const doc = await entry();
  const result = await validateSnapshot(
    [
      { ...doc, _id: "drafts.a" },
      { ...doc, _id: "versions.release.a" },
      { ...doc, _id: "withdrawn", publicationStatus: "withdrawn" },
      { ...doc, _id: "draft", publicationStatus: "draft" },
    ],
    options,
  );
  assert.equal(result.editorial.length, 0);
});
test("invalid ready API writes fail the build rather than exporting partial content", async () => {
  const doc = await entry();
  delete doc.clinicalReview;
  await assert.rejects(validateSnapshot([doc], options), /Release blocked/);
});
test("duplicate routes and document IDs are rejected", async () => {
  const doc = await entry();
  await assert.rejects(
    validateSnapshot([doc, { ...doc, _id: "another" }], options),
    /Duplicate public route/,
  );
  await assert.rejects(
    validateSnapshot([doc, doc], options),
    /Duplicate document ID/,
  );
});
test("reserved slugs, traversal, Unicode and excessive slug length are rejected", async () => {
  for (const slug of [
    "achievements",
    "../test",
    "A-slug",
    "café",
    "a".repeat(97),
  ]) {
    const doc = await entry("news", { slug: { current: slug } });
    assert.match((await releaseErrors(doc, options)).join(), /slug/);
  }
});
test("future, impossible and incorrect modification dates are rejected", async () => {
  for (const date of [
    "2030-01-01T00:00:00Z",
    "2026-02-31T09:00:00Z",
    "not-a-date",
  ])
    assert.match(
      (
        await releaseErrors(await entry("news", { publishedAt: date }), options)
      ).join(),
      /Publication date/,
    );
  const doc = await entry("news", { modifiedAt: "2019-01-01T00:00:00Z" });
  assert.match((await releaseErrors(doc, options)).join(), /modification date/);
});
test("unsafe URLs and unsupported rich-text content are rejected", async () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.com",
    "https://user:password@example.com",
    "https://example.com/\\evil",
  ])
    assert.equal(safeUrl(url), false);
  const doc = await entry("news");
  doc.body = [
    {
      ...body()[0],
      markDefs: [{ _key: "bad", _type: "link", href: "javascript:alert(1)" }],
    },
  ];
  assert.match((await releaseErrors(doc, options)).join(), /HTTPS/);
  doc.body = [{ _type: "html", html: "<script>alert(1)</script>" }];
  assert.match((await releaseErrors(doc, options)).join(), /unsupported block/);
});
test("video IDs cannot introduce arbitrary embeds or disagree with source", async () => {
  assert.equal(
    videoEmbed({
      platform: "youtube",
      sourceUrl: "https://evil.example/watch?v=abcdefghijk",
      videoId: "abcdefghijk",
    }),
    undefined,
  );
  const doc = await entry("video");
  doc.video.videoId = "aaaaaaaaaaa";
  assert.match((await releaseErrors(doc, options)).join(), /matching YouTube/);
});
test("video captions, reviewed transcript, thumbnail and rights are mandatory", async () => {
  const doc = await entry("video");
  doc.video.captionsConfirmed = false;
  doc.video.transcriptReviewed = false;
  delete doc.featuredImage;
  doc.mediaRightsStatus = "no-media";
  assert.match((await releaseErrors(doc, options)).join(), /captions/);
  assert.match((await releaseErrors(doc, options)).join(), /thumbnail/);
  assert.match((await releaseErrors(doc, options)).join(), /rights/);
});
test("news has dated institutional source; sources must use real dates", async () => {
  const doc = await entry("news");
  delete doc.news;
  doc.sources[0].publishedDate = "2020-02-31";
  assert.match((await releaseErrors(doc, options)).join(), /verified event/);
  assert.match((await releaseErrors(doc, options)).join(), /sources/);
});
test("research has exact authorship and a verified bibliographic record", () => {
  assert.deepEqual(recordErrors(research(), options), []);
  assert.match(
    recordErrors(research({ authors: [] }), options).join(),
    /exact author list/,
  );
  assert.match(
    recordErrors(research({ verified: false }), options).join(),
    /verified title/,
  );
});
test("public-safe confirmation is mandatory", async () => {
  assert.match(
    (
      await releaseErrors(
        await entry("news", { publicSafeConfirmed: false }),
        options,
      )
    ).join(),
    /public-safe/,
  );
});
test("CMS is opt-in and partial configuration fails closed", async () => {
  assert.deepEqual(await fetchPublished({}), []);
  await assert.rejects(
    fetchPublished({ SANITY_PROJECT_ID: "example1" }),
    /disabled/,
  );
  await assert.rejects(
    fetchPublished({ SANITY_CONTENT_MODE: "sanity" }),
    /valid SANITY/,
  );
});
test("query uses live API, explicit published perspective and build-only authentication", async () => {
  let observed;
  const documents = [await entry("news")];
  const result = await fetchPublished(
    {
      SANITY_CONTENT_MODE: "sanity",
      SANITY_PROJECT_ID: "example1",
      SANITY_DATASET: "production",
      SANITY_API_READ_TOKEN: "synthetic-token",
    },
    async (url, opts) => {
      observed = { url, opts };
      return new Response(JSON.stringify({ result: documents }), {
        status: 200,
      });
    },
  );
  assert.equal(result.length, 1);
  assert.equal(observed.url.hostname, "example1.api.sanity.io");
  assert.equal(observed.url.searchParams.get("perspective"), "published");
  assert.equal(observed.opts.cache, "no-store");
  assert.equal(observed.opts.headers.Authorization, "Bearer synthetic-token");
  assert.ok(!CONTENT_QUERY.includes("reviewNotes"));
  assert.ok(!CONTENT_QUERY.includes("..."));
});
test("query failures and malformed CMS responses stop the build", async () => {
  const env = {
    SANITY_CONTENT_MODE: "sanity",
    SANITY_PROJECT_ID: "example1",
    SANITY_DATASET: "production",
  };
  for (const response of [
    new Response("error", { status: 503 }),
    new Response('{"result":null}', { status: 200 }),
  ])
    await assert.rejects(fetchPublished(env, async () => response));
});
test("unpublishing removes cards and route candidates from a fresh snapshot", async () => {
  const doc = await entry();
  assert.equal((await validateSnapshot([doc], options)).editorial.length, 1);
  assert.equal((await validateSnapshot([], options)).editorial.length, 0);
});

test("missing or deleted image references cannot export incomplete media metadata", async () => {
  const doc = await entry("video");
  delete doc.featuredImage.url;
  await assert.rejects(validateSnapshot([doc], options), /must resolve/);
});

test("optional empty tags preserve old content fingerprints but added tags require new approval", async () => {
  const doc = await entry();
  assert.equal(
    await contentFingerprint(doc),
    await contentFingerprint({ ...doc, tags: null }),
  );
  assert.equal(
    await contentFingerprint(doc),
    await contentFingerprint({ ...doc, tags: [] }),
  );
  assert.match(
    (
      await releaseErrors(
        { ...doc, tags: ["Appointment preparation"] },
        options,
      )
    ).join(),
    /does not match/,
  );
});
test("tags reject duplicates, unsafe text and excessive counts", async () => {
  const doc = await entry("news");
  for (const tags of [
    ["Same", "Same"],
    ["<script>"],
    Array.from({ length: 9 }, (_, i) => `Tag ${i}`),
  ])
    assert.match(
      (await releaseErrors({ ...doc, tags }, options)).join(),
      /unique plain-text tags/,
    );
});
