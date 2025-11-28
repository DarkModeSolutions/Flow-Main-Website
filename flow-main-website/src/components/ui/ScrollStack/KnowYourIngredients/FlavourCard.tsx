"use client";

// src/components/KnowYourIngredients/FlavourCard.tsx
import React from "react";
import Image from "next/image";
import { ScrollStackItem } from "@/components/ui/ScrollStack/ScrollStack";
import { FlavourIcon } from "../icons/FlavourIcon";
import flowCardBgLime from "../public/flow-card-bg-lime.svg";

export const FlavourCard: React.FC = () => (
  <ScrollStackItem itemClassName="bg-[#050607] border border-[#dae249]/35 overflow-hidden text-[#F5F5F7]">
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
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#f5f5f7]">
        <FlavourIcon className="w-8 h-8 text-[#dae249]" />
        <span>Flavour &amp; pH Balance</span>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold tracking-wide">
          Clean Citrus Performance Profile
        </h2>
        <p className="mt-2 text-sm text-[#bfc5d0] max-w-md">
          Built to be sipped all day: bright citrus flavour, smooth acidity and
          zero added sugar load.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#dae249]/50">
            Citric + Malic acids
          </span>
          <p className="text-[#d9dde5]">
            Enhance taste and act in the Krebs cycle to support energy
            metabolism.
          </p>
        </div>
        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#93d6de]/50">
            Grapefruit powder
          </span>
          <p className="text-[#d9dde5]">
            Natural flavour with potential antioxidant polyphenols.
          </p>
        </div>
        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded-full bg-[#111111]/80 border border-[#f5f5f7]/30">
            Sucralose
          </span>
          <p className="text-[#d9dde5]">
            Non-caloric sweetener for taste without glycaemic impact.
          </p>
        </div>
      </div>

      <p className="mt-3 text-[10px] tracking-[0.25em] uppercase text-[#6f7b8f]">
        Formulated to stay light on the stomach in high-heat sessions.
      </p>
    </div>
  </ScrollStackItem>
);
