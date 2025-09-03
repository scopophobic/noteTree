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
        // Custom dark mode with greenish tones
        dark: {
          bg: '#0f1419',        // Very dark with slight green tint
          'bg-secondary': '#1a2332', // Slightly lighter dark with green
          surface: '#1e2832',    // Surface color with green undertone
          'surface-hover': '#252e3a', // Hover state
          border: '#2a3441',     // Border color
          text: '#e6f2ff',       // Light text with slight blue-green
          'text-secondary': '#b8d4e3', // Secondary text
          'text-muted': '#8a9ba8', // Muted text
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
