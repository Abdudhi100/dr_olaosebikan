import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { shouldIndexClinic } from "../src/lib/site-indexing.ts";

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

test("pending or unverified clinic release remains noindex", () => {
  const current = JSON.parse(read("../config/clinic-release.json"));
  assert.equal(current.releaseStatus, "pending");
  assert.equal(shouldIndexClinic(current, { CF_PAGES: "1", CF_PAGES_BRANCH: "main" }), false);
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
