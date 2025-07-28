/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#02537d',
        secondary: '#0184a9',
        accent: '#01bfc4',
        mint: '#a9e8db',
        pale: '#e0f7e6',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },

    },
  },
  plugins: [],
}
