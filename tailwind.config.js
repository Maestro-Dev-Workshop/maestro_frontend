/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",   // Scan Angular templates + components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui'],
        serif: ['Obadiah-Pro', 'ui-serif', 'Georgia']
      },
      colors: {
        "prussian-blue": {
          100: "#EFF2F4",
          150: "#E7EBEE",
          200: "#DFE5E8",
          250: "#CFD7DD",
          500: "#7F96A5",
          700: "#4F6E83",
          800: "#2F546C",
          900: "#002D4B"
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')
  ],
}
