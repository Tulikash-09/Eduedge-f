/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Raleway", "sans-serif"],
      },
      colors: {
        brand:   "#5B7FFF",
        sidebar: "#0D1220",
        "sidebar-active": "#1E3260",
        surface:  "#131926",
        card:     "#1E2535",
        "card-hover": "#253047",
      },
    },
  },
  plugins: [],
};
