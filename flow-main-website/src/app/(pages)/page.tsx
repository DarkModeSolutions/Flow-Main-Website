"use client";
import FlowButton from "@/components/FlowButton";
import KnowYourIngredientsStack from "@/components/ui/ScrollStack/KnowYourIngredients/KnowYourIngredientsStack";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { forwardRef, useEffect, useRef, useState } from "react";

type RoundedVideoProps = {
  src: string;
  portraitSrc?: string; // New: mobile/portrait video source
  fallback?: ReactNode;
  containerClassName?: string;
  videoClassName?: string;
  disableDefaultSizing?: boolean;
  sourceType?: string;
};

const RoundedVideo = forwardRef<HTMLDivElement, RoundedVideoProps>(
  (
    {
      src,
      portraitSrc,
      fallback,
      containerClassName,
      videoClassName,
      disableDefaultSizing = false,
      sourceType = "video/mp4",
    },
    ref
  ) => {
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
        ref={ref}
      >
        {/* Portrait video for mobile */}
        {portraitSrc && (
          <video
            className={cn(baseVideoClass, "md:hidden", videoClassName)}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={portraitSrc} type={sourceType} />
            {fallback ?? <p>Your browser does not support the video tag.</p>}
          </video>
        )}
        {/* Landscape video for desktop (or only video if no portrait) */}
        <video
          className={cn(
            baseVideoClass,
            portraitSrc ? "hidden md:block" : "",
            videoClassName
          )}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={src} type={sourceType} />
          {fallback ?? <p>Your browser does not support the video tag.</p>}
        </video>
      </div>
    );
  }
);
RoundedVideo.displayName = "RoundedVideo";

const MainPage = () => {
  const headingContainerRef = useRef<HTMLDivElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [videoHeight, setVideoHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!videoContainerRef.current) return;

    const node = videoContainerRef.current;
    const updateSize = () => {
      setVideoHeight(node.getBoundingClientRect().height);
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full">
      <div
        ref={headingContainerRef}
        className="w-full px-4 mt-4 md:mt-6 flex flex-col items-center gap-3 mb-6 md:mb-8"
      >
        <div className="text-center text-white">
          {/*
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
          */}
        </div>
      </div>
      <div className="w-full px-4 mt-20 md:mt-28">
        <RoundedVideo
          src="/assets/videos/ingredients video.mp4"
          containerClassName="-translate-y-10 md:-translate-y-12 max-md:h-[60vh] h-[260px] md:h-[410px] lg:h-[480px]"
        />
      </div>
      <div className="md:w-[20%] w-[70%] mx-auto mt-6 md:mt-12">
        <FlowButton
          label="Buy Now"
          redirectTo="/shop"
          className="w-56! md:w-64! mx-auto px-6 py-3 text-xl font-bold flex items-center justify-center"
        />
      </div>
      <div className="w-full mt-24 md:mt-32 md:px-0 md:pl-10">
        {/* Mobile layout - stacked vertically with more spacing */}
        <div className="md:hidden flex flex-col w-full items-center touch-pan-y">
          {/* Know Your Ingredients section - pushed down so it's below the fold */}
          <div className="w-full px-0 mt-0 touch-pan-y">
            <KnowYourIngredientsStack targetHeight={null} />
          </div>
          {/* Second video - centered */}
          <div className="w-full px-4 mt-12 flex justify-center">
            <RoundedVideo
              src="/assets/videos/carousel animation.mp4"
              disableDefaultSizing
              containerClassName="w-full shadow-lg max-w-sm h-[50vh] rounded-[28px]"
              videoClassName="object-cover object-center h-full"
              fallback={
                <p>
                  Your browser does not support MOV videos. Please convert to
                  MP4.
                </p>
              }
            />
          </div>
        </div>
        {/* Desktop layout - side by side */}
        <div className="hidden md:flex md:flex-row md:items-center gap-10 md:-ml-2.5">
          <div className="md:w-1/2 w-full md:-ml-[60px] lg:-ml-20 xl:-ml-24">
            <RoundedVideo
              src="/assets/videos/carousel animation.mp4"
              disableDefaultSizing
              containerClassName="w-full shadow-lg mx-0 md:max-w-3xl h-[70vh] max-h-[70vh]"
              ref={videoContainerRef}
              videoClassName="object-cover object-left h-full"
              fallback={
                <p>
                  Your browser does not support MOV videos. Please convert to
                  MP4.
                </p>
              }
            />
          </div>
          <div className="md:w-1/2 w-full md:-ml-4 lg:-ml-6">
            <KnowYourIngredientsStack targetHeight={videoHeight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
