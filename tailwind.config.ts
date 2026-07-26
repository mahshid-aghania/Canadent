import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#eef2fb",
          100: "#d5dff5",
          200: "#afc3ec",
          300: "#7f9fdf",
          400: "#5379cf",
          500: "#2f57bf",
          600: "#1b3a8a",
          700: "#152e6e",
          800: "#0f2150",
          900: "#0a1638",
          950: "#060d22",
        },
        gold: {
          50:  "#fdf9ee",
          100: "#f8efd0",
          200: "#f0dc9d",
          300: "#e8c765",
          400: "#dfb23a",
          500: "#c9921e",
          600: "#a87219",
          700: "#885517",
          800: "#6e4118",
          900: "#5c3617",
          DEFAULT: "#c9a84c",
          light: "#e8c765",
          dark:  "#a87219",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        heading: ["'Playfair Display'", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
