"use client";

// src/components/KnowYourIngredients/SystemCard.tsx
import React from "react";
import Image from "next/image";
import { ScrollStackItem } from "@/components/ui/ScrollStack/ScrollStack";
import { SystemIcon } from "../icons/SystemIcon";
import flowCardBgMixed from "../public/flow-card-bg-mixed.svg";

export const SystemCard: React.FC = () => (
  <ScrollStackItem
    previewColor="#24bbc7"
    itemClassName="bg-[#050607] border border-[#24bbc7]/25 overflow-hidden text-[#F5F5F7]"
  >
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Image
        src={flowCardBgMixed}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>

    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#f5f5f7]">
        <SystemIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#24bbc7]" />
        <span>System Advantage</span>
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
          B-Vitamin Matrix &amp; Formula Advantages
        </h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#bfc5d0] max-w-md">
          Metabolic support, cognitive clarity and a balanced osmolyte profile
          designed for real-world performance.
        </p>
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4 flex flex-wrap gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] md:text-[11px]">
        <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#93d6de]/40">
          B1 · B2 · B3 · B5 · B6
        </span>
        <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#dae249]/40">
          Folic acid · 200 μg
        </span>
        <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#f5f5f7]/30">
          Vitamin A (Retinyl acetate)
        </span>
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs text-[#d9dde5]">
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#93d6de]">
            Metabolic Support
          </h3>
          <p className="text-[9px] sm:text-xs">
            Coenzymes in energy metabolism and neurotransmitter synthesis to
            keep the brain sharp while you push.
          </p>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#93d6de]">
            System Strengths
          </h3>
          <ul className="space-y-0.5 sm:space-y-1 text-[9px] sm:text-xs">
            <li>• Balanced osmolytes for stable hydration.</li>
            <li>• Buffered acids to fight exercise-induced acidosis.</li>
            <li className="max-sm:hidden">• Micronutrient support for longer training blocks.</li>
          </ul>
        </div>
      </div>

      <p className="mt-2 sm:mt-3 text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#6f7b8f]">
        Built for athletes, shift workers and anyone training in real-world heat.
      </p>
    </div>
  </ScrollStackItem>
);
