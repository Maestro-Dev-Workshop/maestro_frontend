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
        
        // Surfaces
        "bg-page": "var(--bg-page)",
        "bg-hover": "var(--bg-hover)",
        "bg-card": "var(--bg-card)",
        "bg-banner": "var(--bg-banner)",
        "bg-card-hover": "var(--bg-card-hover)",
        "bg-element": "var(--bg-element)",
        "bg-element-hover": "var(--bg-element-hover)",
        "bg-alt": "var(--bg-alt)",
        "bg-alt-hover": "var(--bg-alt-hover)",
        "bg-button": "var(--bg-button)",
        "bg-button-hover": "var(--bg-button-hover)",

        // Text
        "text-primary": "var(--text-primary)",
        "text-primary-hover": "var(--text-primary-hover)",
        "text-secondary": "var(--text-secondary)",
        "text-alt": "var(--text-alt)",
        "text-alt-hover": "var(--text-alt-hover)",

        // Overhaul
        "surface-tint": "var(--surface-tint)",

        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",

        secondary: "var(--secondary)",
        "on-secondary": "var(--on-secondary)",
        "secondary-container": "var(--secondary-container)",
        "on-secondary-container": "var(--on-secondary-container)",
        "secondary-main": "var(--secondary-main)",

        background: "var(--background)",
        "on-background": "var(--on-background)",

        surface: "var(--surface)",
        "on-surface": "var(--on-surface)",
        "surface-variant": "var(--surface-variant)",
        "on-surface-variant": "var(--on-surface-variant)",

        "inverse-surface": "var(--inverse-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",

        "surface-dim": "var(--surface-dim)",
        "surface-bright": "var(--surface-bright)",

        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",

        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        shadow: "var(--shadow)",

        "primary-dimmer": "var(--primary-dimmer)",
        "primary-dim": "var(--primary-dim)",
        "primary-bright": "var(--primary-bright)",
        "primary-brighter": "var(--primary-brighter)",

        "primary-dimmer-stable": "var(--primary-dimmer-stable)",
        "primary-dim-stable": "var(--primary-dim-stable)",
        "primary-bright-stable": "var(--primary-bright-stable)",
        "primary-brighter-stable": "var(--primary-brighter-stable)",

        tertiary: "var(--tertiary)",
        "on-tertiary": "var(--on-tertiary)",
        "tertiary-container": "var(--tertiary-container)",
        "on-tertiary-container": "var(--on-tertiary-container)",

        error: "var(--error)",
        "on-error": "var(--on-error)",
        "error-container": "var(--error-container)",
        "on-error-container": "var(--on-error-container)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')
  ],
}
