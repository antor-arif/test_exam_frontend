/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem', // 10px
      },
    },
  },
  plugins: [],
};
