"use client";

// src/components/KnowYourIngredients/FlavourCard.tsx
import React from "react";
import Image from "next/image";
import { ScrollStackItem } from "@/components/ui/ScrollStack/ScrollStack";
import { FlavourIcon } from "../icons/FlavourIcon";
import flowCardBgLime from "../public/flow-card-bg-lime.svg";

export const FlavourCard: React.FC = () => (
  <ScrollStackItem
    previewColor="#dae249"
    itemClassName="bg-[#050607] border border-[#dae249]/35 overflow-hidden text-[#F5F5F7]"
  >
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Image
        src={flowCardBgLime}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>

    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#f5f5f7]">
        <FlavourIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#dae249]" />
        <span>Flavour &amp; pH Balance</span>
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
          Clean Citrus Performance Profile
        </h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#bfc5d0] max-w-md">
          Built to be sipped all day: bright citrus flavour, smooth acidity and
          zero added sugar load.
        </p>
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-[9px] sm:text-[10px] md:text-[11px]">
        <div className="space-y-0.5 sm:space-y-1">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#dae249]/50 text-[8px] sm:text-[10px] md:text-[11px]">
            Citric + Malic acids
          </span>
          <p className="text-[#d9dde5] text-[9px] sm:text-xs">
            Enhance taste and act in the Krebs cycle to support energy
            metabolism.
          </p>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#93d6de]/50 text-[8px] sm:text-[10px] md:text-[11px]">
            Grapefruit powder
          </span>
          <p className="text-[#d9dde5] text-[9px] sm:text-xs">
            Natural flavour with potential antioxidant polyphenols.
          </p>
        </div>
        <div className="space-y-0.5 sm:space-y-1 max-sm:col-span-2">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#f5f5f7]/30 text-[8px] sm:text-[10px] md:text-[11px]">
            Sucralose
          </span>
          <p className="text-[#d9dde5] text-[9px] sm:text-xs">
            Non-caloric sweetener for taste without glycaemic impact.
          </p>
        </div>
      </div>

      <p className="mt-2 sm:mt-3 text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#6f7b8f]">
        Formulated to stay light on the stomach in high-heat sessions.
      </p>
    </div>
  </ScrollStackItem>
);
