import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#1a202c", // Example color values
        primary: "#007bff", // Blue
        secondary: "#ff9900", // Orange
        accent: "#795548", // Brown
        success: "#4caf50", // Green
        buttons: "#f58c0e"
      },
    },
  },
  plugins: [],
};

export default config;
