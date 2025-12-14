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
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#dae249]">
        <EnergyIcon className="w-8 h-8 text-[#93d6de]" />
        <span>Energy &amp; Glycogen</span>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold tracking-wide">
          Dual-Phase Energy System
        </h2>
        <p className="mt-2 text-sm text-[#bfc5d0] max-w-md">
          A fast–slow carbohydrate combo that restores glycogen and keeps
          energy steady through long sessions.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-6 text-xs">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#93d6de]">
              D-Glucose
            </span>
            <span className="text-[11px] text-[#6f7b8f]">18 g</span>
          </div>
          <p className="text-[#d9dde5]">
            Rapid fuel that also drives sodium + water absorption via SGLT
            transporters for faster rehydration.
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#93d6de]">
              Dextrin
            </span>
            <span className="text-[11px] text-[#6f7b8f]">2 g</span>
          </div>
          <p className="text-[#d9dde5]">
            Slow-digesting carb that smooths out energy release and supports
            glycogen restoration.
          </p>
        </div>
      </div>

      <ul className="mt-3 text-xs text-[#bfc5d0] space-y-1">
        <li>• No heavy sugar spike, no mid-workout crash.</li>
        <li>• Tuned for both sprints and long-duration efforts.</li>
      </ul>
    </div>
  </ScrollStackItem>
);
