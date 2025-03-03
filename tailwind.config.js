/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "#15563B",
        ring: "#1E7B54",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#15563B",
          foreground: "#E2F8EF",
          100: "#E2F8EF",
          200: "#BDEFDA",
          300: "#98E6C6",
          400: "#73DDB1",
          500: "#4ED49C",
          600: "#30C587",
          700: "#27A06E",
          800: "#1E7B54",
          900: "#15563B",
        },
        secondary: {
          DEFAULT: "#243B53",
          foreground: "#F0F4F8",
          100: "#F0F4F8",
          200: "#D9E2EC",
          300: "#BCCCDC",
          400: "#9FB3C8",
          500: "#829AB1",
          600: "#627D98",
          700: "#486581",
          800: "#334E68",
          900: "#243B53",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#27A06E",
          foreground: "#E2F8EF",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
