/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--color-border-default)",
        background: "var(--color-bg-canvas)",
        foreground: "var(--color-text-primary)",
      },
    },
  },
  plugins: [],
};
