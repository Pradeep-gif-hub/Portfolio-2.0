import React from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  id,
  className = "",
}) => {
  return (
    <section
      id={id}
      className={`section relative scroll-mt-20 ${className}`}
    >
      <div className="w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
};
