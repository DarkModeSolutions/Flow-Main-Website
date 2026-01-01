"use client";

// src/components/KnowYourIngredients/ElectrolyteCard.tsx
import React from "react";
import Image from "next/image";
import { ScrollStackItem } from "@/components/ui/ScrollStack/ScrollStack";
import { ElectrolyteIcon } from "../icons/ElectrolyteIcon";
import flowCardBgBlue from "../public/flow-card-bg-blue.svg";

export const ElectrolyteCard: React.FC = () => (
  <ScrollStackItem
    previewColor="#24bbc7"
    itemClassName="bg-[#050607] border border-[#24bbc7]/40 overflow-hidden text-[#F5F5F7]"
  >
    {/* Background */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Image
        src={flowCardBgBlue}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#93d6de]">
        <ElectrolyteIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#24bbc7]" />
        <span>Electrolyte Balance</span>
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
          Electrolyte Balance &amp; Osmoregulation
        </h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#bfc5d0] max-w-md">
          A precise blend of sodium, potassium, magnesium and calcium to keep
          fluid levels stable, muscles firing and nerves responsive.
        </p>
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs">
        <div className="space-y-0.5 sm:space-y-1">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#24bbc7]/40 text-[9px] sm:text-[10px] md:text-[11px]">
            NaCl · 1320 mg
          </span>
          <p className="text-[#d9dde5] text-[9px] sm:text-xs">
            Primary extracellular ion for fluid balance and nerve transmission.
          </p>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#dae249]/40 text-[9px] sm:text-[10px] md:text-[11px]">
            KCl · 408 mg
          </span>
          <p className="text-[#d9dde5] text-[9px] sm:text-xs">
            Supports cardiac rhythm and neuromuscular activity.
          </p>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#93d6de]/40 text-[9px] sm:text-[10px] md:text-[11px]">
            Mg lactate · 120 mg
          </span>
          <p className="text-[#d9dde5] text-[9px] sm:text-xs">
            Cofactor in 300+ reactions; helps prevent cramps and fatigue.
          </p>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#f5f5f7]/25 text-[9px] sm:text-[10px] md:text-[11px]">
            Ca carbonate · 20 mg
          </span>
          <p className="text-[#d9dde5] text-[9px] sm:text-xs">
            Stabilises membranes and aids muscle contraction.
          </p>
        </div>
      </div>

      <p className="mt-2 sm:mt-3 text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#6f7b8f]">
        + Trisodium citrate buffers lactic acid for smoother endurance.
      </p>
    </div>
  </ScrollStackItem>
);
