import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverable = false,
}) => {
  return (
    <div
      className={`bg-bg-secondary border border-bg-tertiary rounded-lg p-6 ${
        hoverable
          ? "hover:border-accent-primary/50 hover:shadow-lg transition-smooth hover:bg-bg-secondary/80 cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
