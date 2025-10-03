import { Button } from "@/components/ui/button";
import React from "react";

const FlowButton = ({
  label,
  onClickHandler,
  children,
}: {
  label?: string;
  onClickHandler?: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <Button
      onClick={onClickHandler}
      className="bg-[#24bfcf] rounded-4xl p-4 text-black w-full hover:bg-[#24bfcf] hover:opacity-80 transition-opacity duration-200"
    >
      {label}
      {children}
    </Button>
  );
};

export default FlowButton;
