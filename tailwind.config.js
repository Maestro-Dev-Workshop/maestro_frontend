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
          100: "#002D4B80",
          300: "#002D4BB0",
          400: "#002D4BD0",
          500: "#002D4B"
        }
      }
    },
  },
  plugins: [],
}
