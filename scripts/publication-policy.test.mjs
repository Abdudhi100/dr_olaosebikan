import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  assertNoReservedPublicationSlugs,
  EMPTY_PUBLICATION_FALLBACK_SLUG,
} from "../src/lib/publication-policy.ts";

const publications = JSON.parse(
  await readFile(new URL("../src/content/publications.json", import.meta.url), "utf8"),
);

test("current publication content does not use the reserved fallback slug", () => {
  assert.doesNotThrow(() => assertNoReservedPublicationSlugs(publications));
});

test("published and unpublished records cannot use the reserved fallback slug", () => {
  for (const isPublished of [true, false]) {
    assert.throws(
      () =>
        assertNoReservedPublicationSlugs([
          { slug: EMPTY_PUBLICATION_FALLBACK_SLUG, isPublished },
        ]),
      {
        message:
          'Publication slug "publication-record-unavailable" is reserved for the empty-state fallback. Choose a different slug.',
      },
    );
  }
});
