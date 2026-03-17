/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#030304',
        success: '#13BD56',
        action: '#20B2E0',
        alert: '#F14237',
        warn: '#FFD116'
      },
      fontFamily: {
        title: ['Rajdhani', 'sans-serif'],
        body: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
