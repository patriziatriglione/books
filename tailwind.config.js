/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
    },
  },
  plugins: [],
  output: {
    css: {
      dir: './css',
      name: 'tailwind',
    },
  },
};

