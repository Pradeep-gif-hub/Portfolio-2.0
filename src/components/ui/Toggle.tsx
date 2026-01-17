import React, { useState } from "react";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  onChange,
  disabled = false,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onChange?.(newState);
  };

  return (
    <button
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleChange}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
        isChecked ? "bg-accent-primary" : "bg-bg-tertiary"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          isChecked ? "translate-x-5" : "translate-x-0.5"
        } mt-0.5`}
      />
    </button>
  );
};
