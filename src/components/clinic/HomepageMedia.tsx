/** Review-only selections. Publication remains blocked by clinic-release.json. */
export const homepageMedia = {
  pain: { src: "pain-knee-a02-1200.webp", alt: "Illustration of hands around a knee with an orange joint highlight." },
  arthritis: { src: "/images/figma/arthritis.webp", alt: "Illustrative arthritis assessment." },
  autoimmune: { src: "autoimmune-hands-1280.webp", alt: "Hands resting gently over one another." },
  gout: { src: "gout-foot-examination-1280.webp", alt: "Illustrative examination of a foot." },
  notes: { src: "rheumatology-notes-1280.webp", alt: "Illustrative photograph of a clinician taking notes; not the clinic premises." },
  laptop: { src: "followup-laptop-1280.webp", alt: "Illustrative photograph of a person using a laptop." },
  movement: { src: "movement-desktop.webp", alt: "Two people walking together outdoors." },
  preparation: { src: "preparation-desktop.webp", alt: "A hand writing in a notebook." },
} as const;

export function HomepageMedia({ media }: { media: keyof typeof homepageMedia }) {
  const item = homepageMedia[media];
  return (
    <div className="clinic-media-slot clinic-selected-media" data-media-review="candidate-rights-pending">
      <img
        src={item.src.startsWith("/") ? item.src : `/images/review/${item.src}`}
        alt={item.alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
