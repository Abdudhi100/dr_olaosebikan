import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

/**
 * Next.js must decide the public video release at BUILD time, using the
 * real Cloudflare Pages branch, never a visitor URL or untrusted browser flag.
 * Use only a syntactically valid, explicitly fictional Web3Forms identifier.
 */
const fakeKey = "123e4567-e89b-42d3-a456-426614174000";
function inspect(env) {
  const base = {
    ...process.env,
    CF_PAGES: "",
    CF_PAGES_BRANCH: "",
    CLINIC_REVIEW_BUILD: "",
    CLINIC_HERO_VIDEOS_DISABLED: "",
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: "",
    ...env,
  };
  const program = [
    "import config from './next.config.mjs';",
    "process.stdout.write(JSON.stringify({",
    "  public: config.env.NEXT_PUBLIC_CLINIC_HERO_PUBLIC,",
    "  preview: config.env.NEXT_PUBLIC_CLINIC_HERO_PREVIEW,",
    "  booking: config.env.NEXT_PUBLIC_BOOKING_DELIVERY_APPROVED,",
    "}));",
  ].join("\n");
  const r = spawnSync(process.execPath, ["--input-type=module", "-e", program], {
    encoding: "utf8",
    env: base,
    timeout: 20000,
  });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}
test("only Cloudflare production main enables owner-cleared videos and real booking", () => {
  const local = inspect({});
  assert.deepEqual(local, { public: "0", preview: "0", booking: "0" });
  const unapprovedPreview = inspect({
    CF_PAGES: "1", CF_PAGES_BRANCH: "feat/nine-hero-videos-production-20261018",
  });
  assert.deepEqual(unapprovedPreview, { public: "0", preview: "0", booking: "0" });
  const approvedReview = inspect({
    CF_PAGES: "1", CF_PAGES_BRANCH: "feat/nine-hero-videos-production-20261018",
    CLINIC_REVIEW_BUILD: "1",
  });
  assert.deepEqual(approvedReview, { public: "0", preview: "1", booking: "0" });
  const production = inspect({
    CF_PAGES: "1", CF_PAGES_BRANCH: "main",
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: fakeKey,
  });
  assert.deepEqual(production, { public: "1", preview: "0", booking: "1" });
  const emergency = inspect({
    CF_PAGES: "1", CF_PAGES_BRANCH: "main",
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: fakeKey,
    CLINIC_HERO_VIDEOS_DISABLED: "1",
  });
  assert.deepEqual(emergency, { public: "0", preview: "0", booking: "1" },
    "Emergency media disable must not disrupt live appointment booking");
});
test("missing Web3Forms production key still blocks the entire build", () => {
  const output = spawnSync(process.execPath, ["--input-type=module", "-e",
    "await import('./next.config.mjs')"], {
    encoding: "utf8",
    env: {
      ...process.env,
      CF_PAGES: "1",
      CF_PAGES_BRANCH: "main",
      NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: "",
    },
    timeout: 20000,
  });
  assert.notEqual(output.status, 0);
  assert.match(output.stderr, /production Web3Forms access key missing or invalid/);
});
