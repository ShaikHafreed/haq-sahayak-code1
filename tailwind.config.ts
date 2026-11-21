import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-telugu)", "var(--font-noto-tamil)", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0B5D4B", // deep teal
          dark: "#0A3D41",
        },
        accent: {
          DEFAULT: "#C8763A", // warm accent
        },
        status: {
          likely: "#2E7D32",
          check: "#B7791F",
          notEligible: "#6B685D",
          paused: "#9CA3AF",
        },
        navy: "#14304F",
        marigold: "#E8A317",
        "marigold-soft": "#F2C65A",
        "marigold-tint": "#FAEFD2",
        "marigold-deep": "#7A4D08",
        cream: "#EFE8D6",
        grid: "#E3DAC2",
        ink: "#1B1A17",
        "ink-2": "#4A483F",
        "ink-3": "#6B685D",
        rule: "#D9D4C7",
        sage: "#E3EFE8",
        "sage-2": "#DCE9E0",
        paper: "#F6F3EC",
        strip: "#DCE5F0",
        "blue-tint": "#DCE5F0",
        teal: "#0B5D4B",
        "teal-dark": "#08463A",
        "teal-deeper": "#063A30",
      },
    },
  },
  plugins: [],
};

export default config;
