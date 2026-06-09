import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{json,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clinic: {
          blue: "#2563eb",
          navy: "#0f172a",
          mint: "#0f766e",
          gold: "#b45309",
        },
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [typography],
};
