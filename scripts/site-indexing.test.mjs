import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { shouldIndexClinic, shouldIndexPublishedCollection } from "../src/lib/site-indexing.ts";

const read = (rel) => readFileSync(new URL(rel, import.meta.url), "utf8");
const approved = {
  releaseStatus: "approved",
  canonicalDomainConfirmed: true,
  productionBranch: "main",
};

test("both SEO and robots use the same release-controlled indexing rule", () => {
  assert.match(read("../src/lib/seo.ts"), /index: shouldIndexClinic\(clinicRelease\)/);
  assert.match(read("../src/app/robots.ts"), /const indexable = shouldIndexClinic\(clinicRelease\)/);
  assert.doesNotMatch(read("../src/lib/seo.ts"), /index: process\.env\.CLINIC_RELEASE/);
  assert.doesNotMatch(read("../src/app/robots.ts"), /process\.env\.CLINIC_RELEASE/);
});

test("approved public release indexes main but never unverified builds", () => {
  const current = JSON.parse(read("../config/clinic-release.json"));
  assert.equal(current.releaseStatus, "approved");
  assert.equal(shouldIndexClinic(current, { CF_PAGES: "1", CF_PAGES_BRANCH: "main" }), true);
  assert.equal(shouldIndexClinic({ ...approved, canonicalDomainConfirmed: false }, {}), false);
  assert.equal(shouldIndexClinic({ ...approved, releaseStatus: "pending" }, {}), false);
  assert.equal(shouldIndexClinic({ ...approved, productionBranch: "" }, {}), false);
});

test("approved public main is indexable, but approved previews never are", () => {
  assert.equal(shouldIndexClinic(approved, { CF_PAGES: "1", CF_PAGES_BRANCH: "main" }), true);
  assert.equal(shouldIndexClinic(approved, { CF_PAGES: "1", CF_PAGES_BRANCH: "preview/clinic-20261014" }), false);
  assert.equal(shouldIndexClinic(approved, { CF_PAGES: "1" }), false);
  assert.equal(shouldIndexClinic(approved, { CF_PAGES: "1", CF_PAGES_BRANCH: "release/clinic-v1-readiness-20261017" }), false);
  assert.equal(shouldIndexClinic(approved, {}), true);
});

test("content hubs index only verified populated collections on approved public main", () => {
  const main = { CF_PAGES: "1", CF_PAGES_BRANCH: "main" };
  const preview = { CF_PAGES: "1", CF_PAGES_BRANCH: "preview/editorial" };
  for (const count of [0, -1]) {
    assert.equal(shouldIndexPublishedCollection(approved, count, main), false);
  }
  for (const count of [1, 12]) {
    assert.equal(shouldIndexPublishedCollection(approved, count, main), true);
    assert.equal(shouldIndexPublishedCollection(approved, count, preview), false);
    assert.equal(shouldIndexPublishedCollection(approved, count, { CF_PAGES: "1" }), false);
    assert.equal(shouldIndexPublishedCollection({ ...approved, releaseStatus: "pending" }, count, main), false);
    assert.equal(shouldIndexPublishedCollection({ ...approved, canonicalDomainConfirmed: false }, count, main), false);
  }
  assert.equal(shouldIndexPublishedCollection(approved, 1, {}), true);
  assert.equal(shouldIndexPublishedCollection(approved, NaN, main), false);
});

test("all three public collection pages use approved release and published content counts", () => {
  for (const [file, recordSet] of [
    ["../src/app/insights/page.tsx", "editorialEntries"],
    ["../src/app/publications/page.tsx", "visiblePublications"],
    ["../src/app/publications/achievements/page.tsx", "visibleAchievements"],
  ]) {
    const source = read(file);
    assert.match(source, /import clinicRelease from ["'][^"']+config\/clinic-release\.json["']/);
    assert.match(source, new RegExp(`shouldIndexPublishedCollection\\(clinicRelease, ${recordSet}\\.length\\)`));
    assert.doesNotMatch(source, /process\.env\.CLINIC_RELEASE/);
  }
});
