// src/components/icons/FlavourIcon.tsx
import React from "react";

interface IconProps {
  className?: string;
}

export const FlavourIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 32 32"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* outer slice */}
    <circle
      cx="16"
      cy="16"
      r="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    {/* inner rim */}
    <circle
      cx="16"
      cy="16"
      r="6.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      opacity="0.7"
    />
    {/* segments */}
    <path
      d="M16 9.5V16M16 16L20.6 11.4M16 16L11.4 11.4M16 16L11.4 20.6M16 16L20.6 20.6"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  </svg>
);
