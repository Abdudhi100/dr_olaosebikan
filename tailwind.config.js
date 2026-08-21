import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{json,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#2563eb",
        "brand-primary-hover": "#1d4ed8",
        "brand-primary-subtle": "#eff6ff",
        "brand-primary-border": "#bfdbfe",
        "text-primary": "#0f172a",
        "text-secondary": "#334155",
        "text-tertiary": "#64748b",
        "surface-page": "#f8fafc",
        "surface-muted": "#f1f5f9",
        "surface-emphasis": "#ffffff",
        "border-subtle": "#e2e8f0",
        "border-default": "#cbd5e1",
        success: "#0f766e",
        "success-subtle": "#ecfdf5",
        "success-border": "#a7f3d0",
        warning: "#b45309",
        "warning-subtle": "#fffbeb",
        "warning-border": "#fde68a",
        danger: "#b91c1c",
        "danger-subtle": "#fef2f2",
        "danger-border": "#fecaca",
        clinic: {
          blue: "#2563eb",
          navy: "#0f172a",
          mint: "#0f766e",
          gold: "#b45309",
        },
      },
      maxWidth: {
        wide: "73.75rem",
        standard: "65rem",
        reading: "68ch",
      },
      fontSize: {
        display: ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        "page-title": ["2.125rem", { lineHeight: "1.12", letterSpacing: "-0.015em", fontWeight: "700" }],
        "page-title-lg": ["2.625rem", { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "700" }],
        "section-title": ["1.75rem", { lineHeight: "1.18", letterSpacing: "-0.01em", fontWeight: "700" }],
        "section-title-lg": ["2rem", { lineHeight: "1.16", letterSpacing: "-0.01em", fontWeight: "700" }],
        "subsection-title": ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        lead: ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
        body: ["1rem", { lineHeight: "1.65", fontWeight: "400" }],
        support: ["0.875rem", { lineHeight: "1.55", fontWeight: "400" }],
      },
      borderRadius: {
        "foundation-sm": "0.25rem",
        "foundation-md": "0.5rem",
        "foundation-lg": "0.75rem",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(15, 23, 42, 0.06)",
        floating: "0 16px 36px rgba(15, 23, 42, 0.12)",
        soft: "0 1px 2px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [typography],
};
