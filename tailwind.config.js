/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#1A1714",
          dark: "#0D0B0A",
          light: "#2A1713",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F7E7CE",
          dark: "#AA820A",
          muted: "#C5A059",
        },
        ivory: {
          DEFAULT: "#FDFBF7",
          warm: "#FAF3EA",
        },
        "haldi-coral": "#FF6F61",
        "sangeet-powderBlue": "#B0E0E6",
        "reception-lilac": "#C8A2C8",
      },
      letterSpacing: {
        regal: "0.35em",
        luxury: "0.25em",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

