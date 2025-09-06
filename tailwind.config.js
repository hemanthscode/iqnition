/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./assets/js/**/*.js",
    "./assets/js/modules/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'purple': {
          50: '#f3f4f6',
          500: '#a855f7',
          600: '#9333ea'
        },
        'indigo': {
          100: '#e0e7ff',
          600: '#4f46e5',
          700: '#4338ca'
        }
      }
    },
  },
  plugins: [],
}
