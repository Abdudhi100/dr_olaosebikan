import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { heroMedia, heroVideoSource } from "../src/lib/hero-media.ts";
test("hero mapping preserves real posters and fails closed on every remote host", () => {
  for (const media of Object.values(heroMedia)) {
    assert.equal(media.rightsApproved, false);
    assert.equal(media.fallback, "existing");
    if (media.poster) assert.ok(fs.existsSync("public" + media.poster));
    else assert.ok(media.missing);
    for (const host of ["clinic.example", "preview.pages.dev", "localhost.evil.test"]) assert.equal(heroVideoSource(media, host, "?heroVideoReview=1"), undefined);
    assert.equal(heroVideoSource(media, "localhost", ""), undefined);
  }
});
test("explicit loopback review maps only the two matched real clips", () => {
  for (const host of ["localhost", "127.0.0.1", "[::1]"]) {
    assert.equal(heroVideoSource(heroMedia.home, host, "?heroVideoReview=1"), "/__clinic-review-media/home.mp4");
    assert.equal(heroVideoSource(heroMedia.services, host, "?heroVideoReview=1"), "/__clinic-review-media/services.mp4");
    assert.equal(heroVideoSource(heroMedia.specialist, host, "?heroVideoReview=1"), undefined);
  }
});
test("an approved source still requires explicit rights approval", () => {
  const candidate = { fallback: "existing", approvedSource: "/media/approved.mp4", rightsApproved: false };
  assert.equal(heroVideoSource(candidate, "clinic.example", ""), undefined);
  assert.equal(heroVideoSource({ ...candidate, rightsApproved: true }, "clinic.example", ""), candidate.approvedSource);
});
