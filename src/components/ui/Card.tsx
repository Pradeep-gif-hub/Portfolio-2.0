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
      className={`surface-card p-6 ${
        hoverable ? "card-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
