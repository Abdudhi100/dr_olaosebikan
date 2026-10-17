const encoder = new TextEncoder();
const allowedTypes = new Set(["editorialEntry", "researchPublication", "professionalAchievement"]);
const MAX_BODY_BYTES = 16384;

function response(status, code) {
  return Response.json({ code }, { status, headers: { "Cache-Control": "no-store" } });
}

async function readBoundedBody(request) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) return null;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(total);
  let position = 0;
  for (const chunk of chunks) {
    body.set(chunk, position);
    position += chunk.byteLength;
  }
  return body;
}

function decodeBase64Url(value) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(value)) return null;
  try {
    const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/") + "=");
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    return null;
  }
}

async function verifiedSignature(header, body, secret, now) {
  const match = /^t=(\d{10}),v1=([A-Za-z0-9_-]{43})$/.exec(header || "");
  if (!match) return false;
  const timestamp = Number(match[1]);
  if (!Number.isSafeInteger(timestamp) || Math.abs(now() / 1000 - timestamp) > 300) return false;
  const signature = decodeBase64Url(match[2]);
  if (!signature) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const prefix = encoder.encode(`${timestamp}.`);
  const signed = new Uint8Array(prefix.length + body.length);
  signed.set(prefix);
  signed.set(body, prefix.length);
  return crypto.subtle.verify("HMAC", key, signature, signed);
}

/**
 * Pure, non-deployed preview dispatcher. The caller must provide an atomic,
 * durable claim(eventId) implementation; no in-memory fallback is allowed.
 * The Pages hook URL must be a secret bound to a verified preview branch.
 */
export async function handlePreviewPublishingWebhook(request, options) {
  const { secret, previewHookUrl, claim, fetchImpl = fetch, now = Date.now, log = () => {} } = options || {};
  if (!secret || !previewHookUrl || typeof claim !== "function") return response(503, "not_configured");
  if (request.method !== "POST") return response(405, "method_not_allowed");
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return response(415, "unsupported_media_type");
  const body = await readBoundedBody(request);
  if (!body) return response(413, "invalid_body_size");
  if (!(await verifiedSignature(request.headers.get("sanity-webhook-signature"), body, secret, now))) return response(401, "invalid_signature");
  let payload;
  try { payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)); }
  catch { return response(400, "invalid_json"); }
  if (payload?.projectId !== "zavdffj8" || payload?.dataset !== "production" || !allowedTypes.has(payload?.documentType) || !/^(?:drafts\.)?[A-Za-z0-9._-]{1,160}$/.test(payload?.documentId || "")) return response(400, "out_of_scope");
  const idempotencyKey = request.headers.get("idempotency-key");
  if (!idempotencyKey || !/^[A-Za-z0-9._:-]{8,160}$/.test(idempotencyKey)) return response(400, "invalid_event_id");
  let target;
  try { target = new URL(previewHookUrl); }
  catch { return response(503, "invalid_preview_hook"); }
  if (target.protocol !== "https:" || target.hostname !== "api.cloudflare.com" || !target.pathname.includes("/pages/webhooks/deploy_hooks/")) return response(503, "invalid_preview_hook");
  try {
    if (!(await claim(idempotencyKey))) return response(200, "duplicate_ignored");
  } catch {
    log({ event: "preview_claim_failed" });
    return response(503, "claim_failed");
  }
  try {
    const upstream = await fetchImpl(target.href, { method: "POST", redirect: "error" });
    if (!upstream.ok) {
      log({ event: "preview_trigger_failed", status: upstream.status });
      return response(502, "preview_trigger_failed");
    }
    log({ event: "preview_trigger_acknowledged", status: upstream.status });
    return response(202, "preview_trigger_acknowledged");
  } catch {
    // The claim remains consumed: an ambiguous network result is never auto-retried.
    log({ event: "preview_trigger_uncertain" });
    return response(502, "preview_trigger_uncertain");
  }
}
