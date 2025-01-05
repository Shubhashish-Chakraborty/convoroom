/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          1: "#030711",
          2: "#00040e",
          3: "#0e1014",
          4: "#7d7f84"
        }
      }
    },
  },
  plugins: [],
}