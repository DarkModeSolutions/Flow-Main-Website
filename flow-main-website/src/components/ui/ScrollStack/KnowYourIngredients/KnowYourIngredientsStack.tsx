"use client";

import React from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ScrollStack from "@/components/ui/ScrollStack/ScrollStack";
import { ElectrolyteCard } from "./ElectrolyteCard";
import { EnergyCard } from "./EnergyCard";
import { FlavourCard } from "./FlavourCard";
import { AntioxidantCard } from "./AntioxidantCard";
import { SystemCard } from "./SystemCard";

interface KnowYourIngredientsStackProps {
  targetHeight?: number | null;
  className?: string;
}

export const KnowYourIngredientsStack: React.FC<KnowYourIngredientsStackProps> = ({
  targetHeight,
  className = "",
}) => {
  const resolvedHeight = targetHeight && targetHeight > 0 ? targetHeight : undefined;
  const styleWithVar = resolvedHeight
    ? ({
        "--stack-target-height": `${resolvedHeight}px`,
      } as React.CSSProperties)
    : undefined;

  return (
    <div
      className={`relative w-full flex items-center justify-center max-md:flex-col max-md:gap-10 md:min-h-[640px] md:h-[80vh] md:[height:var(--stack-target-height)] md:[min-height:var(--stack-target-height)] ${className}`.trim()}
      style={styleWithVar}
    >
      <ScrollReveal
        enableBlur
        baseOpacity={0}
        baseRotation={5}
        blurStrength={10}
        containerClassName="pointer-events-none md:absolute md:left-1/2 md:top-2 md:-translate-x-1/2 w-full max-w-[540px] text-center text-white z-[25] relative mb-6 md:mb-0"
        textClassName="tracking-widest uppercase text-white/80 text-3xl md:text-4xl"
        rotationEnd="top center"
        wordAnimationEnd="top center"
      >
        Know Your Ingredients
      </ScrollReveal>
      <ScrollStack
        itemDistance={200}
        itemStackDistance={0}
        baseScale={0.9}
        itemScale={0.05}
        blurAmount={0.6}
        expandOnScroll
        anchorHeight={resolvedHeight}
        className="h-full w-full"
      >
        <ElectrolyteCard />
        <EnergyCard />
        <FlavourCard />
        <AntioxidantCard />
        <SystemCard />
      </ScrollStack>
    </div>
  );
};

export default KnowYourIngredientsStack;
