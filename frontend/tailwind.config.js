/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        lgm: '1070px',
        lgl: '1140px',
      },
      colors: {
        strongYellow: '#FFC700',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        mono: ['Inter', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
