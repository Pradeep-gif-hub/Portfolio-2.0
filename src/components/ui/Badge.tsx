import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "dark";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variantClasses = {
    default: "bg-theme-subtle text-theme-muted border border-theme-border",
    accent: "bg-theme-accent-soft text-theme-accent",
    dark: "bg-theme-subtle text-theme-muted border border-theme-border",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
