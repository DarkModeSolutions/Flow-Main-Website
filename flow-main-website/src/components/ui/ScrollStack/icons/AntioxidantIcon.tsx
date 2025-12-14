"use client";
// src/components/icons/AntioxidantIcon.tsx
import React from "react";

interface IconProps {
	className?: string;
}

export const AntioxidantIcon: React.FC<IconProps> = ({ className = "" }) => (
	<svg
		viewBox="0 0 32 32"
		className={className}
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.4"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		{/* shield outline */}
		<path d="M16 4L8 7.5V15.5C8 21 11.5 25.8 16 28C20.5 25.8 24 21 24 15.5V7.5L16 4Z" />
		{/* center spark */}
		<path d="M16 11.5L14.2 16H18L16.2 20.5" />
		{/* small reactive dots */}
		<circle cx="12.5" cy="13.5" r="1" />
		<circle cx="19.5" cy="14" r="1" />
		<circle cx="16" cy="22" r="1" />
	</svg>
);

export default AntioxidantIcon;
