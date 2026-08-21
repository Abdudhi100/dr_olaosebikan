const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2";
const focusRingOnDark = "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary";
const focusRingSuccess = "focus:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2";

export const buttonStyles = {
  primary:
    `inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-hover ${focusRing}`,
  primarySmall:
    `inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary-hover ${focusRing}`,
  secondary:
    `inline-flex items-center justify-center gap-2 rounded-lg border border-border-default bg-surface-emphasis px-6 py-3 text-sm font-semibold text-text-secondary transition hover:bg-surface-muted ${focusRing}`,
  secondarySuccess:
    `inline-flex items-center justify-center gap-2 rounded-lg border border-success-border bg-success-subtle px-6 py-3 text-sm font-semibold text-success transition hover:bg-emerald-100 ${focusRingSuccess}`,
  secondaryOnBrand:
    `inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-brand-primary-hover px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 ${focusRingOnDark}`,
  tertiary:
    `inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition hover:text-brand-primary-hover ${focusRing}`,
};

export const surfaceStyles = {
  card: "rounded-lg border border-border-subtle bg-surface-emphasis",
  muted: "rounded-lg border border-border-subtle bg-surface-muted",
  elevated: "rounded-lg border border-border-subtle bg-surface-emphasis shadow-floating",
};
