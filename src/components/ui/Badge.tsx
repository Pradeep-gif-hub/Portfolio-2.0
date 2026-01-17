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
    default: "bg-bg-tertiary text-text-secondary",
    accent: "bg-accent-primary/10 text-accent-primary",
    dark: "bg-bg-secondary text-text-primary border border-bg-tertiary",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-smooth ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
