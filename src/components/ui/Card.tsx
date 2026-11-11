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
      className={`bg-theme-surface border border-theme-border rounded-[10px] p-6 shadow-card ${
        hoverable ? "card-hover cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
