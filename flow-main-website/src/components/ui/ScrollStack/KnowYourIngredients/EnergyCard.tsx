"use client";

// src/components/KnowYourIngredients/EnergyCard.tsx
import React from "react";
import Image from "next/image";
import { ScrollStackItem } from "@/components/ui/ScrollStack/ScrollStack";
import { EnergyIcon } from "../icons/EnergyIcon";
import flowCardBgBlue from "../public/flow-card-bg-blue.svg";

export const EnergyCard: React.FC = () => (
  <ScrollStackItem
    previewColor="#93d6de"
    itemClassName="bg-[#050607] border border-[#93d6de]/40 overflow-hidden text-[#F5F5F7]"
  >
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Image
        src={flowCardBgBlue}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>

    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#dae249]">
        <EnergyIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#93d6de]" />
        <span>Energy &amp; Glycogen</span>
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
          Dual-Phase Energy System
        </h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#bfc5d0] max-w-md">
          A fast–slow carbohydrate combo that restores glycogen and keeps
          energy steady through long sessions.
        </p>
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-[10px] sm:text-xs">
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#93d6de]">
              D-Glucose
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] text-[#6f7b8f]">18 g</span>
          </div>
          <p className="text-[#d9dde5] text-[9px] sm:text-xs">
            Rapid fuel that also drives sodium + water absorption via SGLT
            transporters for faster rehydration.
          </p>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#93d6de]">
              Dextrin
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] text-[#6f7b8f]">2 g</span>
          </div>
          <p className="text-[#d9dde5] text-[9px] sm:text-xs">
            Slow-digesting carb that smooths out energy release and supports
            glycogen restoration.
          </p>
        </div>
      </div>

      <ul className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-[#bfc5d0] space-y-0.5 sm:space-y-1">
        <li>• No heavy sugar spike, no mid-workout crash.</li>
        <li>• Tuned for both sprints and long-duration efforts.</li>
      </ul>
    </div>
  </ScrollStackItem>
);
