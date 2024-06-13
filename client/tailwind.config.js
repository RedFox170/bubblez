/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "gray-500": "#d1d5db", // Beispiel für eine benutzerdefinierte Graufarbe
      },
      fontFamily: {
        sans: ["Roboto", "Open Sans", "sans-serif"],
      },
    },
    screens: {
      mobile: "375px", // Mindestbreite für mobile Geräte
      tablet: "641px",
      desktop: "768px",
      largeDesktop: "1536px",
    },
  },
  plugins: [],
};
