/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: '#c2410c',
        brandSoft: '#fde8d7',
        canvas: '#f7f1e8',
        ink: '#1c1917',
        accent: '#dc2626',
      },
    },
  },
  plugins: [],
};