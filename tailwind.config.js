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
          100: "#002D4B10",
          150: "#002D4B18",
          200: "#002D4B20",
          250: "#002D4B30",
          500: "#002D4B80",
          700: "#002D4BB0",
          800: "#002D4BD0",
          900: "#002D4B"
        }
      }
    },
  },
  plugins: [],
}
