import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1E2447",
        brass: "#C9B78C",
        canvas: "#F7F5F0",
      },
    },
  },
  plugins: [],
};

export default config;
