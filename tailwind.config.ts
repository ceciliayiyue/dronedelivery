import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: "#0AAD0A",
        kale: "#003D29",
        honeydew: "#C5EF96",
        cantaloupe: "#FFBB6F",
        cashmere: "#FAF1E5",
        collard: "#4B4E27",
        sesame: "#EECE7B",
      },
      boxShadow: {
        card: "0 20px 45px rgba(0, 61, 41, 0.08)",
      },
      fontFamily: {
        sans: ["Aptos", "SF Pro Display", "Segoe UI", "sans-serif"],
        display: ["Iowan Old Style", "Palatino", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
