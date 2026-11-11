import React from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  [key: string]: any;
};

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      as: Component = "button",
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "font-medium transition-colors duration-200 rounded-lg font-body inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-theme-bg";

    const variantClasses: Record<string, string> = {
      primary:
        "bg-theme-accent text-theme-accent-contrast border border-theme-accent hover:bg-theme-accent-hover hover:border-theme-accent-hover",
      secondary:
        "bg-theme-subtle text-theme-text hover:border-theme-accent/70 border border-theme-border-strong",
      outline:
        "border border-theme-border-strong bg-transparent text-theme-text hover:border-theme-accent/70 hover:bg-theme-subtle",
    };

    const sizeClasses: Record<string, string> = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    };

    const variantClass = variantClasses[variant] || variantClasses.primary;
    const sizeClass = sizeClasses[size] || sizeClasses.md;

    return (
      <Component
        ref={ref}
        className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";
