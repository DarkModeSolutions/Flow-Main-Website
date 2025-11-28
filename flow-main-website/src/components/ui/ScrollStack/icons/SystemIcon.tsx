// src/components/icons/SystemIcon.tsx
import React from "react";

interface IconProps {
  className?: string;
}

export const SystemIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 32 32"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* central node */}
    <circle cx="16" cy="16" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    {/* outer nodes */}
    <circle cx="9.5" cy="13" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="22.5" cy="13" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="12" cy="22" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="20" cy="22" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    {/* links */}
    <path
      d="M11 13.5L14.5 15.3M21 13.5L17.5 15.3M12.7 21.3L15 17.8M19.3 21.3L17 17.8"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  </svg>
);
