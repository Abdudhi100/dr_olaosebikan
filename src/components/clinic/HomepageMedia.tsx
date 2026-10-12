/** Review-only selections. Publication remains blocked by clinic-release.json. */
export const homepageMedia = {
  pain: { src: "pain-knee-a02-1200.webp", alt: "Illustration of hands around a knee with an orange joint highlight.", width: 1200, height: 750 },
  arthritis: { src: "/images/figma/arthritis.webp", alt: "Illustrative arthritis assessment.", width: 1920, height: 1080 },
  autoimmune: { src: "autoimmune-hands-1280.webp", alt: "Hands resting gently over one another.", width: 1280, height: 800 },
  gout: { src: "gout-foot-examination-1280.webp", alt: "Illustrative examination of a foot.", width: 1280, height: 800 },
  notes: { src: "rheumatology-notes-1280.webp", alt: "Illustrative photograph of a clinician taking notes; not the clinic premises.", width: 1280, height: 800 },
  laptop: { src: "followup-laptop-1280.webp", alt: "Illustrative photograph of a person using a laptop.", width: 1280, height: 800 },
  movement: { src: "movement-desktop.webp", alt: "Two people walking together outdoors.", width: 660, height: 920 },
  preparation: { src: "preparation-desktop.webp", alt: "A hand writing in a notebook.", width: 828, height: 436 },
} as const;

export function HomepageMedia({ media }: { media: keyof typeof homepageMedia }) {
  const item = homepageMedia[media];
  return (
    <div className="clinic-media-slot clinic-selected-media" data-media-review="candidate-rights-pending">
      <img
        src={item.src.startsWith("/") ? item.src : `/images/review/${item.src}`}
        alt={item.alt}
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
