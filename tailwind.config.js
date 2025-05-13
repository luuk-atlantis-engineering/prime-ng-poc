/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom colors here that match your PrimeNG theme
        'surface-ground': 'var(--surface-ground)',
        'surface-card': 'var(--surface-card)',
        'surface-border': 'var(--surface-border)',
        'text-color': 'var(--text-color)',
        'text-color-secondary': 'var(--text-color-secondary)',
      },
      boxShadow: {
        'card': 'var(--card-shadow)',
      },
    },
  },
  plugins: [],
  // Important: This ensures Tailwind doesn't override PrimeNG styles
  corePlugins: {
    preflight: false,
  },
} 