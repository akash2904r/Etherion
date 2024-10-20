/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          1: "#101010",
          2: "#363636",
          3: "#181818",
          4: "#111111",
          5: "#bbbbbb",
          6: "#151515"
        },
        blue: {
          1: "#70b0ff"
        }
      },
      fontFamily: {
        poppins: ["Poppins", "san-serif"]
      }
    },
  },
  plugins: [],
}

