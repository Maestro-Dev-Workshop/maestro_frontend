/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",   // Scan Angular templates + components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        "prussian-blue": {
          100: "#002D4B80",
          500: "#002D4B"
        }
      }
    },
  },
  plugins: [],
}
