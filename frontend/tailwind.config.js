/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        strongYellow: '#FFC700',
      },
      fontFamily: {
        mont: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'serif'],
      },
    },
  },
  plugins: [],
};
