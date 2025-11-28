"use client";

// src/components/KnowYourIngredients/AntioxidantCard.tsx
import React from "react";
import Image from "next/image";
import { ScrollStackItem } from "@/components/ui/ScrollStack/ScrollStack";
import { AntioxidantIcon } from "../icons/AntioxidantIcon";
import flowCardBgMixed from "../public/flow-card-bg-mixed.svg";

export const AntioxidantCard: React.FC = () => (
  <ScrollStackItem itemClassName="bg-[#050607] border border-[#24bbc7]/35 overflow-hidden text-[#F5F5F7]">
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
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#93d6de]">
        <AntioxidantIcon className="w-8 h-8 text-[#24bbc7]" />
        <span>Antioxidant Shield</span>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold tracking-wide">
          Antioxidant &amp; Cellular Protection
        </h2>
        <p className="mt-2 text-sm text-[#bfc5d0] max-w-md">
          High-impact vitamins that neutralise exercise-induced free radicals
          and support immune resilience.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-[1.1fr_0.9fr] gap-6 text-xs">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#dae249]">
              Vitamin C
            </span>
            <span className="text-[11px] text-[#6f7b8f]">500 mg</span>
          </div>
          <p className="text-[#d9dde5]">
            Water-soluble antioxidant that supports immune function and improves
            iron absorption.
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#93d6de]">
              Vitamin E
            </span>
            <span className="text-[11px] text-[#6f7b8f]">8 mg</span>
          </div>
          <p className="text-[#d9dde5]">
            Lipid-phase antioxidant that protects cell membranes from oxidative
            damage.
          </p>
        </div>
      </div>

      <ul className="mt-3 text-xs text-[#bfc5d0] space-y-1">
        <li>• Helps reduce post-workout oxidative stress.</li>
        <li>• Supports faster bounce-back between training days.</li>
      </ul>
    </div>
  </ScrollStackItem>
);
