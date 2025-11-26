"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

// function RadioGroupItem({
//   className,
//   ...props
// }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
//   return (
//     <RadioGroupPrimitive.Item
//       data-slot="radio-group-item"
//       className={cn(
//         "border-input text-[#24bfcf] focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       {...props}
//     >
//       <RadioGroupPrimitive.Indicator
//         data-slot="radio-group-indicator"
//         className="relative flex items-center justify-center"
//       >
//         <CircleIcon className="fill-[#24bfcf] absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
//       </RadioGroupPrimitive.Indicator>
//     </RadioGroupPrimitive.Item>
//   );
// }

type RadioGroupItemProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> & {
  flowRadio?: boolean;
};

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ flowRadio, className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    data-slot="radio-group-item"
    className={cn(
      `border-input ${
        flowRadio ? "text-[#24bfcf]" : "text-primary"
      } focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50`,
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator
      data-slot="radio-group-indicator"
      className="relative flex items-center justify-center"
    >
      <CircleIcon
        className={`${
          flowRadio ? "fill-[#24bfcf]" : "fill-primary"
        } absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2`}
      />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
