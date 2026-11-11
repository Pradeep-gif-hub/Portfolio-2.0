import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#FAFAF8",
          100: "#ECEBE7",
          200: "#E6E4DF",
          300: "#C8C7C2",
          400: "#9A9C98",
          500: "#5C5C5C",
          600: "#3E423F",
          700: "#2A2D2B",
          800: "#1D211F",
          900: "#161918",
          950: "#0F1110",
        },
        light: {
          bg: "#FAFAF8",
          surface: "#FFFFFF",
          border: "#E6E4DF",
        },
        neon: {
          blue: "#1F3A34",
          pink: "#5C5C5C",
          purple: "#5C5C5C",
          green: "#1F3A34",
          yellow: "#5C5C5C",
          orange: "#5C5C5C",
        },
        bg: {
          primary: "rgb(var(--bg-rgb) / <alpha-value>)",
          secondary: "rgb(var(--surface-rgb) / <alpha-value>)",
          tertiary: "rgb(var(--border-rgb) / <alpha-value>)",
        },
        accent: {
          primary: "#1F3A34",
          dark: "#2E5249",
          light: "#8FB5A5",
        },
        theme: {
          bg: "rgb(var(--bg-rgb) / <alpha-value>)",
          surface: "rgb(var(--surface-rgb) / <alpha-value>)",
          subtle: "rgb(var(--surface-soft-rgb) / <alpha-value>)",
          text: "rgb(var(--text-rgb) / <alpha-value>)",
          muted: "rgb(var(--text-muted-rgb) / <alpha-value>)",
          border: "rgb(var(--border-rgb) / <alpha-value>)",
          "border-strong": "rgb(var(--border-strong-rgb) / <alpha-value>)",
          accent: "rgb(var(--accent-rgb) / <alpha-value>)",
          "accent-hover": "rgb(var(--accent-hover-rgb) / <alpha-value>)",
          "accent-soft": "rgb(var(--accent-soft-rgb) / <alpha-value>)",
          "accent-contrast": "rgb(var(--accent-contrast-rgb) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--text-rgb) / <alpha-value>)",
          secondary: "rgb(var(--text-muted-rgb) / <alpha-value>)",
          tertiary: "rgb(var(--text-muted-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.6rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.75rem", { lineHeight: "2.15rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["2.75rem", { lineHeight: "1.15" }],
      },
      spacing: {
        section: "3rem",
        "section-desktop": "4.5rem",
      },
      maxWidth: {
        container: "1000px",
      },
      boxShadow: {
        card: "inset 0 1px 0 var(--card-inset), 0 0 0 1px var(--outline-glow-soft)",
        "card-hover": "0 8px 24px var(--outline-glow)",
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-out",
        slideUp: "slideUp 0.25s ease-out",
        slideDown: "slideDown 0.25s ease-out",
        slideLeft: "slideLeft 0.25s ease-out",
        slideRight: "slideRight 0.25s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(12px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-12px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
