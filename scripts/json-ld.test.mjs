import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { serializeJsonLd } from "../src/lib/json-ld.ts";

test("ordinary structured data retains its JSON representation", () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Book Appointment",
    url: "https://example.test/appointments/book",
  };

  assert.equal(serializeJsonLd(data), JSON.stringify(data));
});

test("nested and script-like values serialize safely without mutation", () => {
  const data = {
    "@context": "https://schema.org",
    "@type": ["MedicalWebPage", "FAQPage"],
    headline: "Quotes: \"care\" & support for \u1eccla <community>",
    nested: {
      items: [
        { name: "First < second", available: true },
        { name: "</script><div data-test='sentinel'>example</div>", count: 2 },
      ],
    },
  };
  const original = structuredClone(data);

  const serialized = serializeJsonLd(data);

  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes("&lt;"), false);
  assert.match(serialized, /\\u003c\/script>/);
  assert.deepEqual(JSON.parse(serialized), original);
  assert.deepEqual(data, original);
});

test("the production component uses the tested serializer", async () => {
  const componentSource = await readFile(
    new URL("../src/components/JsonLd.tsx", import.meta.url),
    "utf8",
  );

  assert.match(componentSource, /import \{ serializeJsonLd, type JsonLdData \}/);
  assert.match(componentSource, /__html: serializeJsonLd\(data\)/);
  assert.doesNotMatch(componentSource, /JSON\.stringify/);
});
