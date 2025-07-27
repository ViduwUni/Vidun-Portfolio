/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        Makna: ["Makna", "sans-serif"],
        Usama: ["Usama", "sans-serif"],
        HoneyBear: ["HoneyBear", "sans-serif"],
        Madane: ["Madane", "sans-serif"],
        SingleDay: ["SingleDay", "sans-serif"]
      },
      colors: {
        'my-dark': '#292929',
        'my-mid-dark': '#616161',
        'my-white': '#ffffff'
      }
    },
  },
  plugins: [],
};
