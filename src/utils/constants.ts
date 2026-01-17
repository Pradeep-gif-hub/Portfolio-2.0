export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

export const ANIMATION_EASE = {
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const COLORS = {
  primary: "#0a0a0a",
  secondary: "#1a1a1a",
  tertiary: "#2a2a2a",
  accent: "#3b82f6",
  accentDark: "#1e40af",
  accentLight: "#60a5fa",
} as const;
