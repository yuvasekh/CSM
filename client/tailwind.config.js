/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      "blue": "#0d416b",
      "miracle-blue": "#00aae7",
      "miracle-black": "#232527",
    },
    height: {
      "screen/90": "90vh",
      "screen/30": "30vh",
      "screen/40": "40vh",
    },
    width: {
      "screen/90": "90vw",
      "screen/80": "80vw",
    },

  },
  plugins: [],
}