"use client";

import React from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ScrollStack from "@/components/ui/ScrollStack/ScrollStack";
import { ElectrolyteCard } from "./ElectrolyteCard";
import { EnergyCard } from "./EnergyCard";
import { FlavourCard } from "./FlavourCard";
import { AntioxidantCard } from "./AntioxidantCard";
import { SystemCard } from "./SystemCard";

export const KnowYourIngredientsStack: React.FC = () => (
  <div className="relative w-full h-[80vh] min-h-[640px] flex items-center justify-center">
    <ScrollReveal
      enableBlur
      baseOpacity={0}
      baseRotation={5}
      blurStrength={10}
      containerClassName="pointer-events-none absolute left-1/2 top-2 md:top-3 -translate-x-1/2 w-full max-w-[540px] text-center text-white z-[25]"
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
      className="h-full"
    >
      <ElectrolyteCard />
      <EnergyCard />
      <FlavourCard />
      <AntioxidantCard />
      <SystemCard />
    </ScrollStack>
  </div>
);

export default KnowYourIngredientsStack;
