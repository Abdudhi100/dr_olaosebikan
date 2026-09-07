export type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

export function serializeJsonLd(data: JsonLdData) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
