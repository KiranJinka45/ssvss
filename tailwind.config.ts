import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FAF7F2",
          surface: "#F2ECE1",
          card: "#FFFFFF",
        },
        maroon: {
          50: "#FDF2F4",
          100: "#FCE7EB",
          600: "#801B30",
          700: "#6B1728",
          DEFAULT: "#5C1624", // Deep Temple Maroon / Kumkum
          900: "#3D0E18",
        },
        gold: {
          50: "#FBF8EE",
          100: "#F6F0D8",
          400: "#D4B04C",
          DEFAULT: "#C59B27", // Antique Temple Gold
          600: "#A8811A",
          700: "#886712",
        },
        loom: {
          charcoal: "#1C1917",
          bronze: "#57534E",
          stone: "#78716C",
          border: "#E7E0D3",
        },
        silk: {
          emerald: "#166534",
          emeraldBg: "#F0FDF4",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(92, 22, 36, 0.08)",
        goldGlow: "0 4px 20px -2px rgba(197, 155, 39, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
