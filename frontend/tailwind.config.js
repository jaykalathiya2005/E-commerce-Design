/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // primary: {
        //   DEFAULT: "#7ba2bf",
        //   light: "#c6d9e1",
        //   dark: "#5f8ebf",
        // },
        primary: {
          DEFAULT: "#547792",
          light: "#94b4c1",
          dark: "#213448",
        },
        // secondary: {
        //   DEFAULT: "#10B981",
        //   light: "#34D399",
        //   dark: "#059669",
        // },
      },
    },
  },
  plugins: [
    // Add plugin for scrollbar hiding
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
}