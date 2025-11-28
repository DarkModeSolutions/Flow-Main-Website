// src/components/icons/ElectrolyteIcon.tsx
import React from "react";

interface IconProps {
  className?: string;
}

export const ElectrolyteIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 32 32"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* droplet */}
    <path
      d="M16 3C16 3 9 11 9 17.5C9 22.194 12.357 25.5 16 25.5C19.643 25.5 23 22.194 23 17.5C23 11 16 3 16 3Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* small highlight */}
    <path
      d="M13.2 10.5C12 12 11.2 13.7 11.2 15.3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    />
    {/* plus ion */}
    <circle cx="11" cy="22" r="2.2" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M11 20.9V23.1M9.9 22H12.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    {/* minus ion */}
    <circle cx="21" cy="20" r="2.2" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.9" />
    <path d="M19.9 20H22.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);
