import assert from "node:assert/strict";
import { test } from "node:test";
import { handlePreviewPublishingWebhook } from "./preview-publishing-webhook.mjs";

const secret = "synthetic-test-secret";
const target = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/synthetic-preview-only";
const now = 1791849600000;
const payload = { projectId: "zavdffj8", dataset: "production", documentType: "editorialEntry", documentId: "clinic-review-item" };
async function signedRequest(data = payload, overrides = {}) {
  const text = JSON.stringify(data);
  const timestamp = Math.floor(now / 1000);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${text}`));
  const signature = Buffer.from(bytes).toString("base64url");
  return new Request("https://preview.example.test/webhook", { method: "POST", headers: { "content-type": "application/json", "sanity-webhook-signature": `t=${timestamp},v1=${signature}`, "idempotency-key": "synthetic-event-1", ...overrides }, body: text });
}
function options(extra = {}) {
  const claimed = new Set();
  const requests = [];
  return { secret, previewHookUrl: target, now: () => now, claim: async (id) => { if (claimed.has(id)) return false; claimed.add(id); return true; }, fetchImpl: async (url, init) => { requests.push({ url, init }); return new Response(null, { status: 202 }); }, requests, ...extra };
}
test("signed publication triggers exactly one preview POST and duplicate is ignored", async () => {
  const opt = options();
  assert.equal((await handlePreviewPublishingWebhook(await signedRequest(), opt)).status, 202);
  assert.equal((await handlePreviewPublishingWebhook(await signedRequest(), opt)).status, 200);
  assert.deepEqual(opt.requests.map(({ url, init }) => [url, init.method]), [[target, "POST"]]);
});
test("signed withdrawal triggers a rebuild even when published content disappears", async () => {
  const opt = options();
  const req = await signedRequest({ ...payload, documentId: "drafts.clinic-review-item" });
  assert.equal((await handlePreviewPublishingWebhook(req, opt)).status, 202);
  assert.equal(opt.requests.length, 1);
});
test("unsigned, tampered, stale and wrong-dataset requests never trigger", async () => {
  const opt = options();
  const tampered = await signedRequest();
  tampered.headers.set("sanity-webhook-signature", "t=1791849600,v1=" + "A".repeat(43));
  const stale = await signedRequest();
  assert.equal((await handlePreviewPublishingWebhook(tampered, opt)).status, 401);
  assert.equal((await handlePreviewPublishingWebhook(stale, { ...opt, now: () => now + 600000 })).status, 401);
  assert.equal((await handlePreviewPublishingWebhook(await signedRequest({ ...payload, dataset: "other" }), opt)).status, 400);
  assert.equal(opt.requests.length, 0);
});
test("unconfigured or non-preview hook fails closed", async () => {
  const opt = options({ previewHookUrl: "https://example.com/production" });
  assert.equal((await handlePreviewPublishingWebhook(await signedRequest(), opt)).status, 503);
  assert.equal((await handlePreviewPublishingWebhook(await signedRequest(), { ...opt, claim: undefined })).status, 503);
  assert.equal(opt.requests.length, 0);
});
test("upstream failures and uncertain responses are reported without retry", async () => {
  for (const fetchImpl of [async () => new Response(null, { status: 500 }), async () => { throw Error("timeout"); }]) {
    const opt = options({ fetchImpl });
    assert.equal((await handlePreviewPublishingWebhook(await signedRequest(), opt)).status, 502);
    assert.equal((await handlePreviewPublishingWebhook(await signedRequest(), opt)).status, 200);
  }
});
