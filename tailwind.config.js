/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: { 700: '#006f6a', 800: '#005a56', 900: '#004542' }
      }
    }
  },
  plugins: []
}
