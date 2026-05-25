/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Erste Premier palette
        "ep-navy": "#0a1e3f",
        "ep-blue": "#143a73",
        "ep-blue-light": "#1e5fb8",
        "ep-gold": "#c9a96e",
        "ep-sapphire": "#1e6dd4",
        "ep-slate": "#1c2536",
        "ep-slate-light": "#2a364d",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium:
          "0 10px 40px -10px rgba(10, 30, 63, 0.35), 0 2px 6px -2px rgba(10, 30, 63, 0.15)",
        "premium-hover":
          "0 20px 60px -15px rgba(10, 30, 63, 0.45), 0 4px 10px -2px rgba(10, 30, 63, 0.2)",
      },
      backgroundImage: {
        "ep-gradient": "linear-gradient(135deg, #0a1e3f 0%, #143a73 100%)",
        "ep-radial":
          "radial-gradient(ellipse at top, rgba(201,169,110,0.08), transparent 60%)",
      },
    },
  },
  plugins: [],
};
