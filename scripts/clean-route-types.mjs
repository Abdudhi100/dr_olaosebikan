import { rm } from "node:fs/promises";

// Content withdrawal removes generated source routes. Next typegen does not
// remove all old per-page definitions, so discard only its generated types.
await rm(new URL("../.next/types/", import.meta.url), {
  recursive: true,
  force: true,
});
