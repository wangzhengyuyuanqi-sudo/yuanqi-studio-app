import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', '"PingFang SC"', '"Microsoft YaHei"', 'serif'],
        body: ['"Noto Serif SC"', '"PingFang SC"', '"Microsoft YaHei"', 'serif'],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'Menlo', 'monospace'],
        script: ['"Dancing Script"', 'cursive'],
        heading: ['"Playfair Display"', '"Noto Serif SC"', '"PingFang SC"', 'serif'],
      },
      colors: {
        noir: {
          DEFAULT: "#08080c",
          50: "#f5f4f0",
          100: "#e8e5dc",
          200: "#d1cdbc",
          300: "#b5af98",
          400: "#999174",
          500: "#7a7258",
          600: "#5c5540",
          700: "#3d382a",
          800: "#26231b",
          900: "#181610",
          950: "#0c0b08",
        },
        gold: {
          50: "#fdf8ed",
          100: "#faefd0",
          200: "#f5dd9c",
          300: "#efc968",
          400: "#e8b73e",
          500: "#d4a020",
          600: "#b58818",
          700: "#8f6915",
          800: "#6e4f14",
          900: "#4e3812",
          950: "#2e200a",
        },
        bronze: {
          400: "#cd7f32",
          500: "#a86c2a",
        },
        champagne: {
          300: "#f7e7ce",
          400: "#f0dbb6",
        },
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "0.9rem" }],
        "3xl": ["1.75rem", { lineHeight: "2.2rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.7rem" }],
        "5xl": ["3rem", { lineHeight: "1.15" }],
        "6xl": ["3.75rem", { lineHeight: "1.1" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.75rem",
      },
      boxShadow: {
        "neumorph": "6px 6px 14px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.025)",
        "neumorph-sm": "3px 3px 8px rgba(0,0,0,0.4), -2px -2px 6px rgba(255,255,255,0.02)",
        "neumorph-inset": "inset 3px 3px 8px rgba(0,0,0,0.45), inset -3px -3px 8px rgba(255,255,255,0.02)",
        "gold-glow": "0 0 40px rgba(212,160,32,0.15), 0 0 80px rgba(212,160,32,0.06)",
        "gold-glow-lg": "0 0 60px rgba(212,160,32,0.2), 0 0 120px rgba(212,160,32,0.08)",
        "gold-sm": "0 0 16px rgba(212,160,32,0.1)",
      },
      animation: {
        "reveal-up": "reveal-up 0.55s cubic-bezier(0.16,1,0.3,1) both",
        "reveal-fade": "reveal-fade 0.45s ease-out both",
        "slide-right": "slide-in-right 0.35s ease-out both",
        ambient: "ambient-glow 4s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "golden-shimmer": "golden-shimmer 3s ease-in-out infinite",
        "aurora-drift": "aurora-drift 20s ease-in-out infinite",
      },
      keyframes: {
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "reveal-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "ambient-glow": {
          "0%, 100%": { boxShadow: "0 0 30px rgba(212,160,32,0.06), 0 0 60px rgba(212,160,32,0.03)" },
          "50%": { boxShadow: "0 0 45px rgba(212,160,32,0.12), 0 0 80px rgba(212,160,32,0.06)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "golden-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "aurora-drift": {
          "0%": { opacity: "0.6", transform: "scale(1) translate(0, 0)" },
          "25%": { opacity: "0.9", transform: "scale(1.08) translate(1%, -0.5%)" },
          "50%": { opacity: "0.7", transform: "scale(1.02) translate(-0.5%, 1%)" },
          "75%": { opacity: "1", transform: "scale(1.06) translate(-1%, -0.2%)" },
          "100%": { opacity: "0.6", transform: "scale(1) translate(0, 0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
