/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
