/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        // New color palette
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627a98",
          600: "#4a5f7f",
          700: "#344e66",
          800: "#1e3a5f",
          900: "#0f2744",
          950: "#071529",
        },
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Neutral surfaces - warm off-white
        surface: "#faf8f5",
        "surface-light": "#ffffff",
        "surface-dark": "#f5f2ed",
        card: "#ffffff",
        "card-hover": "#faf8f5",
        // Legacy colors for transition
        brand: "#22c55e", // Green as primary
        sidebar: "#1e3a5f", // Navy dark
        "sidebar-active": "#344e66", // Navy medium
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
};
