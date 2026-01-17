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
      "font-medium transition-smooth rounded-lg font-body font-semibold";

    const variantClasses: Record<string, string> = {
      primary:
        "bg-accent-primary text-dark-950 hover:bg-accent-dark active:scale-95 shadow-lg shadow-accent-primary/20",
      secondary:
        "bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-600",
      outline:
        "border-2 border-accent-primary/60 text-accent-primary hover:bg-accent-primary/10 hover:border-accent-primary",
    };

    const sizeClasses: Record<string, string> = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-6 py-3 text-lg",
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
