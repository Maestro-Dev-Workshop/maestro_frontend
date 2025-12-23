/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
          '50': '#F2F5F8',    // Replaces Old 100
          '100': '#E8ECF1',   // Replaces Old 150
          '200': '#E0E5EA',   // New, visually close to Old 200
          '300': '#C6D2DD',   // Replaces Old 250
          '400': '#7591A5',   // Replaces Old 500
          '500': '#4F6E83',   // Replaces Old 700
          '600': '#3C586D',   // New shade (unused)
          '700': '#2B4459',   // Replaces Old 800
          '800': '#2F546C',   // New shade (unused)
          '900': '#002D4B',   // Original darkest color
        },
        page: 'var(--bg-page)',
        card: 'var(--bg-card)',
        hover: 'var(--bg-hover)',
        element: 'var(--bg-element)',
        'element-hover': 'var(--bg-element-hover)',
        
        text: 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-alt': 'var(--text-alt)',
        border: 'var(--border-default)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')
  ],
}
