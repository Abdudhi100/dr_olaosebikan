export const EMPTY_PUBLICATION_FALLBACK_SLUG = "publication-record-unavailable";

type PublicationSlugRecord = {
  slug: string;
};

export function assertNoReservedPublicationSlugs(
  publications: readonly PublicationSlugRecord[],
) {
  const reservedPublication = publications.find(
    (publication) => publication.slug === EMPTY_PUBLICATION_FALLBACK_SLUG,
  );

  if (reservedPublication) {
    throw new Error(
      `Publication slug "${EMPTY_PUBLICATION_FALLBACK_SLUG}" is reserved for the empty-state fallback. Choose a different slug.`,
    );
  }
}
