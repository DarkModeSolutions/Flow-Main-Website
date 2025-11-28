"use client";

import FlowButton from "@/components/FlowButton";
import ScrollFloat from "@/components/ui/ScrollFloat";
import VariableProximity from "@/components/ui/VariableProximity";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "600", "800"],
  display: "swap",
});
import KnowYourIngredientsStack from "@/components/ui/ScrollStack/KnowYourIngredients/KnowYourIngredientsStack";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useRef } from "react";

type RoundedVideoProps = {
  src: string;
  fallback?: ReactNode;
  containerClassName?: string;
  videoClassName?: string;
  disableDefaultSizing?: boolean;
  sourceType?: string;
};

const RoundedVideo = ({
  src,
  fallback,
  containerClassName,
  videoClassName,
  disableDefaultSizing = false,
  sourceType = "video/mp4",
}: RoundedVideoProps) => {
  const baseContainerClass =
    "rounded-[28px] overflow-hidden bg-black/80 backdrop-blur-sm";
  const defaultSizingClass =
    "w-full max-w-5xl mx-auto shadow-lg h-[240px] md:h-[380px] lg:h-[440px]";
  const baseVideoClass = "w-full h-full object-cover";

  return (
    <div
      className={cn(
        baseContainerClass,
        disableDefaultSizing ? null : defaultSizingClass,
        containerClassName
      )}
    >
      <video
        className={cn(baseVideoClass, videoClassName)}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={src} type={sourceType} />
        {fallback ?? (
          <p>Your browser does not support the video tag.</p>
        )}
      </video>
    </div>
  );
};

const MainPage = () => {
  const headingContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full">
      <div
        ref={headingContainerRef}
        className="w-full px-4 mt-4 md:mt-6 flex flex-col items-center gap-3 mb-6 md:mb-8"
      >
        <div className="text-center text-white">
          <ScrollFloat
            containerClassName="hidden md:block"
            textClassName="md:text-[6vw] lg:text-[4vw] leading-[0.9]"
            charClassName="font-extralight text-white/60"
            wordClassNames={{ 2: "text-[#24bfcf] font-black" }}
            animationDuration={0.6}
            ease="power2.out"
            triggerOnMount
          >
            <VariableProximity
              label="Find your Flow"
              // Keep subtle axis changes to avoid layout shifts and preserve size
              fromFontVariationSettings="'wdth' 100, 'opsz' 36"
              toFontVariationSettings="'wdth' 115, 'opsz' 48"
              containerRef={headingContainerRef}
              // Apply per-letter classes to match existing formatting
              wordClassNames={{
                0: "font-extralight text-white/60",
                1: "font-extralight text-white/60",
                2: `${manrope.className} flow-gradient`,
              }}
            />
          </ScrollFloat>
          <p className="md:hidden text-2xl font-semibold">
            Find your <span className="text-[#24bfcf]">Flow</span>
          </p>
        </div>
      </div>
      <div className="w-full px-4 mt-20 md:mt-28">
        <RoundedVideo
          src="/assets/videos/ingredients video.mp4"
          containerClassName="-translate-y-10 md:-translate-y-12 h-[260px] md:h-[410px] lg:h-[480px]"
        />
      </div>
      <div className="md:w-[20%] w-[70%] mx-auto mt-6 md:mt-12">
        <FlowButton label="Buy Now" redirectTo="/shop" />
      </div>
      <div className="w-full px-4 mt-24 md:mt-32 md:px-0 md:pl-10">
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10 md:-ml-[10px]">
          <div className="md:w-1/2 w-full md:-ml-[60px] lg:-ml-[80px] xl:-ml-[96px]">
            <RoundedVideo
              src="/assets/videos/carousel animation.mp4"
              disableDefaultSizing
              containerClassName="w-full shadow-lg mx-0 md:max-w-3xl h-[70vh] max-h-[70vh]"
              videoClassName="object-cover object-left h-full"
              fallback={
                <p>Your browser does not support MOV videos. Please convert to MP4.</p>
              }
            />
          </div>
          <div className="md:w-1/2 w-full md:-ml-4 lg:-ml-6">
            <KnowYourIngredientsStack />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
