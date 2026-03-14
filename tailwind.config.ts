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
        parchment: "#FFFDF8",
        cream: "#FAF8F4",
        envelope: "#F0E8D8",
        ink: "#3C3830",
      },
    },
  },
  plugins: [],
};

export default config;
