// src/components/icons/EnergyIcon.tsx
import React from "react";

interface IconProps {
  className?: string;
}

export const EnergyIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 32 32"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="16"
      cy="16"
      r="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M16.5 8L12 16.2H15L14.3 24L20 14.8H17.1L16.5 8Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
