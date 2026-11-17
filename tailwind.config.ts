import type { Config } from "tailwindcss";

/**
 * Colours are CSS variables (space-separated RGB) so the storefront is dark
 * while the admin area (`.admin-canvas`) can switch back to a light palette.
 * Values live in src/app/globals.css.
 */
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: v("night"),
        surface: v("surface"),
        ink: v("ink"),
        blush: {
          DEFAULT: v("blush"),
          50: v("blush-50"),
        },
        brand: {
          DEFAULT: v("brand"),
          dark: v("brand-dark"),
          light: v("brand-light"),
        },
        accent: {
          DEFAULT: v("accent"),
          light: v("accent-light"),
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        fadeUp: "fadeUp .7s ease both",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
