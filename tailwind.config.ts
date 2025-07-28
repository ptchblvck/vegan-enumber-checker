// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // make sure this covers all used paths
  theme: {
    extend: {
      keyframes: {
        showRay: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        showRay: "showRay 0.4s ease forwards",
      },
    },
  },
  plugins: [],
  darkMode: "class", // enable dark mode support
};

export default config;
