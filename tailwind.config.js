/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: ['Poppins', 'sans-serif']
    },
    gridTemplateColumns: {
      '80/20' : '80% 18%',
    }
  },
  plugins: [],
}