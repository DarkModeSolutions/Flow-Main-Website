"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

const FlowButton = ({
  label,
  onClickHandler,
  children,
  className,
  submitType,
  redirectTo,
  isDisabled,
}: {
  label?: string;
  onClickHandler?: () => void;
  children?: React.ReactNode;
  className?: string;
  submitType?: boolean;
  redirectTo?: string;
  isDisabled?: boolean;
}) => {
  const router = useRouter();

  return (
    <Button
      disabled={isDisabled}
      type={submitType ? "submit" : "button"}
      onClick={redirectTo ? () => router.push(redirectTo) : onClickHandler}
      className={cn(
        "bg-[#24bfcf] rounded-md p-4 text-black w-full hover:bg-[#24bfcf] hover:opacity-90 transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-[0_8px_30px_rgba(36,191,207,0.18)] cursor-pointer disabled:cursor-not-allowed",
        className
      )}
    >
      {label}
      {children}
    </Button>
  );
};

export default FlowButton;
