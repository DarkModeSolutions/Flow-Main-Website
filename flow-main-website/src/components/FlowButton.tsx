import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

const FlowButton = ({
  label,
  onClickHandler,
  children,
  className,
}: {
  label?: string;
  onClickHandler?: () => void;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Button
      onClick={onClickHandler}
      className={cn(
        "bg-[#24bfcf] rounded-4xl p-4 text-black w-full hover:bg-[#24bfcf] hover:opacity-80 transition-opacity duration-200 cursor-pointer",
        className
      )}
    >
      {label}
      {children}
    </Button>
  );
};

export default FlowButton;
