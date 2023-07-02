/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#2979FF",
        accent: "#FF9100",
        primary: "#0e0e5e",
        description: "#21262C",
      },
      screens: {
        xl: "1200px",
      },
    },
  },
  plugins: [],
}
