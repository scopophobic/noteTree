import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",    // if using app router
    "./pages/**/*.{ts,tsx}",  // if using pages directory
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Enhanced dark mode with beautiful greenish tones
        dark: {
          bg: '#0d1117',        // Rich dark base (GitHub-inspired)
          'bg-secondary': '#161b22', // Slightly lighter background
          surface: '#21262d',    // Card/surface background
          'surface-hover': '#30363d', // Hover states
          'surface-active': '#373e47', // Active/pressed states
          border: '#30363d',     // Subtle borders
          'border-hover': '#444c56', // Hover borders
          text: '#f0f6fc',       // Primary text (high contrast)
          'text-secondary': '#7d8590', // Secondary text
          'text-muted': '#656d76', // Muted text
          accent: '#238636',     // Green accent color
          'accent-hover': '#2ea043', // Hover green
          'accent-muted': '#1a7f37', // Muted green
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
