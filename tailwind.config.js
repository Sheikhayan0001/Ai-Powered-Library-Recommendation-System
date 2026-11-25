/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#080808',
        'bg-card': '#151515',
        'accent': '#DC2626',
        'accent-hover': '#EF4444',
        'accent-light': '#B91C1C',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A3A3A3',
        'border-dark': '#2A2A2A',
        'bg-light': '#F7F7F8',
        'card-light': '#FFFFFF',
        'text-light': '#171717',
        'text-light-secondary': '#666666',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
