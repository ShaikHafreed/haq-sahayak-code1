import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sans)", "var(--font-noto-telugu)", "var(--font-noto-tamil)", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0F5257", // deep teal
          dark: "#0A3D41",
        },
        accent: {
          DEFAULT: "#C8763A", // warm accent
        },
        status: {
          likely: "#2E7D32",
          check: "#B7791F",
          notEligible: "#6B7280",
          paused: "#9CA3AF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
