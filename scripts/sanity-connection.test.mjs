import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fetchPublished } from "./prepare-editorial.mjs";
import { clinicReadiness } from "./clinic-release.mjs";

const text = (relative) => readFileSync(new URL("../" + relative, import.meta.url), "utf8");

test("Sanity Studio uses the owner's existing project, not a fresh or unrelated dataset", () => {
  for (const file of ["studio/sanity.config.ts", "studio/sanity.cli.ts", "studio/.env.example", ".env.publishing.example"]) {
    assert.match(text(file), /zavdffj8/);
    assert.match(text(file), /production/);
  }
});

test("webhook targets relevant published document types and does not ignore withdrawals", () => {
  const filter = text("publishing/sanity-webhook-filter.groq").split("\n").filter((line) => !line.trim().startsWith("//")).join("\n");
  for (const type of ["editorialEntry", "researchPublication", "professionalAchievement"]) assert.ok(filter.includes(type));
  assert.ok(!filter.includes("publicationStatus"));
});

test("CMS source fails closed on bad configuration; cannot publish stale data", async () => {
  await assert.rejects(() => fetchPublished({ SANITY_CONTENT_MODE: "sanity", SANITY_PROJECT_ID: "invalid!", SANITY_DATASET: "production" }), /Set valid SANITY_PROJECT_ID/);
  let fetched = false;
  const result = await fetchPublished({ SANITY_CONTENT_MODE: "sanity", SANITY_PROJECT_ID: "zavdffj8", SANITY_DATASET: "production" }, async (url) => {
    fetched = true;
    assert.equal(url.hostname, "zavdffj8.api.sanity.io");
    assert.match(url.pathname, /\/data\/query\/production$/);
    assert.equal(url.searchParams.get("perspective"), "published");
    const query = url.searchParams.get("query");
    for (const type of ["editorialEntry", "researchPublication", "professionalAchievement"]) assert.ok(query.includes(type));
    assert.match(query, /drafts\.\*\*/);
    return new Response(JSON.stringify({ result: [] }), { status: 200 });
  });
  assert.equal(fetched, true);
  assert.deepEqual(result, []);
  await assert.rejects(() => fetchPublished({ SANITY_CONTENT_MODE: "sanity", SANITY_PROJECT_ID: "zavdffj8", SANITY_DATASET: "production" }, async () => new Response("unavailable", { status: 503 })), /CMS query failed/);
});

test("CMS setup never toggles booking or public release", () => {
  assert.equal(clinicReadiness.releaseStatus, "approved");
  assert.equal(clinicReadiness.booking.enabled, true);
  assert.equal(clinicReadiness.booking.retentionApproved, true);
  assert.equal(clinicReadiness.booking.rateProtectionVerified, true);
  assert.ok(clinicReadiness.evidenceReferences.universityMailboxApproved.includes("2026-10-17"));
});
