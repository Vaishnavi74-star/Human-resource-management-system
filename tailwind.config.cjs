// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3730a3", // indigo-800
        background: "#f5f5f5", // neutral-50
        success: "#059669", // emerald-600
        warning: "#f59e0b", // amber-500
        error: "#dc2626", // red-600
        info: "#2563eb", // blue-500
        "card-bg": "#ffffff",
        "text-primary": "#1f2937" // charcoal-900
      },
      borderRadius: {
        DEFAULT: "0.5rem"
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: []
};
