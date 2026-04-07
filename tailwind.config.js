/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        ink: {
          DEFAULT: "#0A0A0A",
          50: "#F5F5F3",
          100: "#E8E8E3",
          200: "#C9C9BF",
          300: "#9C9C8E",
          400: "#6E6E5E",
          500: "#4A4A3A",
          600: "#2E2E22",
          700: "#1A1A12",
          800: "#0F0F0A",
          900: "#0A0A06",
        },
        amber: {
          DEFAULT: "#E8A020",
          light: "#F2B93B",
          dark: "#C47A10",
        },
        surface: {
          DEFAULT: "#F8F6F0",
          card: "#FDFCF8",
          dark: "#111108",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        shimmer: "shimmer 1.5s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
