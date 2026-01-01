"use client";

import Lenis from "lenis";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";


export interface ScrollStackItemProps {
  itemClassName?: string;
  previewColor?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
  previewColor,
}) => (
  <div
    className={`scroll-stack-card relative w-full h-[60vh] sm:h-[22rem] md:h-[26rem] xl:h-[28rem] my-0 p-6 sm:p-8 md:p-10 lg:p-12 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.18)] box-border origin-top will-change-transform max-md:touch-pan-y ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: "hidden",
      transformStyle: "preserve-3d",
    }}
    data-preview-color={previewColor ?? undefined}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number; // kept for API parity (not directly used)
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
  expandOnScroll?: boolean; // new: cards grow instead of shrink
  anchorHeight?: number | null;
  showMobileIndicator?: boolean;
}

interface _TransformData {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
  expandOnScroll = false,
  anchorHeight,
  showMobileIndicator = false,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, { translateY: number; scale: number; rotation: number; blur: number }>());
  const isUpdatingRef = useRef(false);

  // Detect if we're on mobile (for responsive scroll behavior)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  type StackElement = React.ReactElement<ScrollStackItemProps>;
  const itemsArray = useMemo(
    () => React.Children.toArray(children).filter(Boolean) as StackElement[],
    [children]
  );
  const totalItems = itemsArray.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);
  const wheelDeltaRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isTransitioningRef = useRef(false);
  const isLocalStack = !useWindowScroll;

  const stepTo = useCallback(
    (direction: number) => {
      if (!isLocalStack || totalItems <= 1) return;
      if (isTransitioningRef.current) return;

      setActiveIndex((prev) => {
        const next = Math.max(0, Math.min(totalItems - 1, prev + direction));
        if (next === prev) {
          return prev;
        }

        setTransitionDirection(direction > 0 ? 1 : -1);

        isTransitioningRef.current = true;
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
        transitionTimeoutRef.current = setTimeout(() => {
          isTransitioningRef.current = false;
        }, 480);

        return next;
      });
    },
    [isLocalStack, totalItems]
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (!isLocalStack) return;
      event.preventDefault();
      event.stopPropagation();

      wheelDeltaRef.current += event.deltaY;
      if (Math.abs(wheelDeltaRef.current) >= 60) {
        const direction = wheelDeltaRef.current > 0 ? 1 : -1;
        wheelDeltaRef.current = 0;
        stepTo(direction);
      }
    },
    [isLocalStack, stepTo]
  );

  const _handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!isLocalStack) return;
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    },
    [isLocalStack]
  );

  const _handleTouchMove = useCallback(
    (_event: React.TouchEvent<HTMLDivElement>) => {
      if (!isLocalStack) return;
      // Step Id: 222 - User requested disabling scroll feature on mobile view
      // We only allow touch interactions (like simple taps) but disable the swipe-to-navigate logic here
      // to prevents conflicts with natural page scrolling.
      // if (touchStartYRef.current == null) return;

      // const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
      // const delta = touchStartYRef.current - currentY;

      // if (Math.abs(delta) >= 40) {
      //   stepTo(delta > 0 ? 1 : -1);
      //   touchStartYRef.current = currentY;
      // }

      // event.preventDefault();
    },
    [isLocalStack]
  );

  const _handleTouchEnd = useCallback(() => {
    if (!isLocalStack) return;
    touchStartYRef.current = null;
    wheelDeltaRef.current = 0;
  }, [isLocalStack]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isLocalStack) return;
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        stepTo(1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        stepTo(-1);
      }
    },
    [isLocalStack, stepTo]
  );

  useEffect(() => {
    setActiveIndex(0);
    wheelDeltaRef.current = 0;
    touchStartYRef.current = null;
    isTransitioningRef.current = false;
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  }, [totalItems]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number) => {
      if (scrollTop < start) return 0;
      if (scrollTop > end) return 1;
      return (scrollTop - start) / (end - start);
    },
    []
  );

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number) => {
      if (typeof value === "string" && value.includes("%")) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return parseFloat(value as string);
    },
    []
  );

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement,
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller,
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const scrollData = getScrollData();

    if (!useWindowScroll) {
      isUpdatingRef.current = false;
      return;
    }

    const { scrollTop, containerHeight } = scrollData;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(
      scaleEndPosition,
      containerHeight
    );

    const endElement = useWindowScroll
      ? (document.querySelector(".scroll-stack-end") as HTMLElement | null)
      : (scrollerRef.current?.querySelector(
          ".scroll-stack-end"
        ) as HTMLElement | null);

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(
        scrollTop,
        triggerStart,
        triggerEnd
      );
      let scale: number;
      if (expandOnScroll) {
        const cardBase = Math.max(0.4, baseScale - i * itemScale); // slightly smaller deeper cards
        scale = cardBase + scaleProgress * (1 - cardBase); // grows toward 1
      } else {
        const targetScale = baseScale + i * itemScale;
        scale = 1 - scaleProgress * (1 - targetScale); // original shrink behavior
      }
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart =
            jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }
        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY =
          scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter =
          newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : "";

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    expandOnScroll,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });

      lenis.on("scroll", handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector(".scroll-stack-inner") as HTMLElement,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientation: "vertical",
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });

      lenis.on("scroll", handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll(".scroll-stack-card")
        : scrollerRef.current?.querySelectorAll(".scroll-stack-card") ?? []
    ) as HTMLElement[];
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (useWindowScroll && i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      } else {
        card.style.marginBottom = "0px";
      }
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translateZ(0)";
      (
        card.style as CSSStyleDeclaration & { webkitTransform?: string }
      ).webkitTransform = "translateZ(0)";
      card.style.perspective = "1000px";
      (
        card.style as CSSStyleDeclaration & { webkitPerspective?: string }
      ).webkitPerspective = "1000px";
    });

    setupLenis();

    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
  ]);

  const innerClassName = useWindowScroll
    ? "scroll-stack-inner pt-[20vh] px-10 pb-[50rem] min-h-screen"
    : "scroll-stack-inner relative w-full h-full px-0 md:px-8 py-0 md:py-4";

  const cardVariants = useMemo(
    () => ({
      initial: () => ({
        y: -96,
        opacity: 0,
        scale: 0.94,
        filter: "blur(14px)",
      }),
      animate: {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.52,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      },
      exit: () => ({
        y: 96,
        opacity: 0,
        scale: 0.96,
        filter: "blur(14px)",
        transition: {
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      }),
    }),
    []
  );

  // On mobile (localStack), we don't want to block natural page scrolling, so no overflow-hidden
  // Also don't attach wheel/touch handlers to allow natural scroll.
  // On desktop, we enable wheel handlers for scroll-through navigation
  const overflowClass = isLocalStack ? (isMobile ? "overflow-visible" : "overflow-hidden") : "overflow-y-auto";

  // Enable wheel handlers on desktop only, disable on mobile for natural scrolling
  const wheelHandler = isLocalStack && !isMobile ? handleWheel : undefined;
  const touchStartHandler = undefined; // Disabled for natural touch scrolling
  const touchMoveHandler = undefined;
  const touchEndHandler = undefined;
  const keyDownHandler = isLocalStack ? handleKeyDown : undefined;

  const fallbackPreviewColor = "#24bbc7";
  const withAlpha = useCallback((color: string, alphaHex: string) => {
    if (!color || !color.startsWith("#")) return color;
    if (color.length === 7) {
      return `${color}${alphaHex}`;
    }
    return color;
  }, []);

  const getPreviewColor = useCallback(
    (element?: StackElement) =>
      (element?.props?.previewColor as string | undefined) ??
      fallbackPreviewColor,
    []
  );

  const anchorStyle =
    anchorHeight && anchorHeight > 0
      ? ({
        "--stack-anchor-height": `${anchorHeight}px`,
      } as React.CSSProperties)
      : undefined;

  return (
    <div
      className={`relative w-full h-full ${overflowClass} overflow-x-visible md:h-(--stack-anchor-height) md:min-h-(--stack-anchor-height) ${className}`.trim()}
      ref={scrollerRef}
      style={{
        // Allow natural touch scrolling on mobile, prevent on desktop
        touchAction: isMobile ? 'pan-y' : 'none',
        WebkitOverflowScrolling: isMobile ? undefined : 'touch',
        scrollBehavior: 'smooth',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        ...anchorStyle,
      }}
      onWheel={wheelHandler}
      onTouchStart={touchStartHandler}
      onTouchMove={touchMoveHandler}
      onTouchEnd={touchEndHandler}
      onKeyDown={keyDownHandler}
      tabIndex={isLocalStack && !isMobile ? 0 : undefined}
    >
      <div className={innerClassName} ref={innerRef} style={{ touchAction: isMobile ? 'pan-y' : undefined }}>
        {isLocalStack ? (
          isMobile ? (
            // Mobile layout - normal flow, no absolute positioning, allows natural scrolling
            <div className="relative w-full touch-pan-y">
              <AnimatePresence
              initial={false}
              custom={transitionDirection}
              mode="popLayout"
            >
                {itemsArray.length > 0 && (
                  <motion.div
                    key={activeIndex}
                    custom={transitionDirection}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex justify-center w-full px-1 touch-pan-y"
                  >
                    <div className="w-full touch-pan-y">
                      {itemsArray[activeIndex]}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Preview bars */}
              <div className="w-full px-2 mt-2">
                <div className="flex flex-col gap-1" aria-hidden="true">
                  {itemsArray.map((item, index) => {
                    if (index <= activeIndex) return null;

                    const depth = index - activeIndex;
                    const widthPercent = Math.max(0.58, 1 - depth * 0.08);
                    const translateX = depth * 6;
                    const opacity = Math.max(0.25, 0.95 - depth * 0.18);
                    const barColor = getPreviewColor(item);
                    const gradient = `linear-gradient(110deg, ${barColor} 0%, ${withAlpha(
                      barColor,
                      "E0"
                    )} 55%, ${withAlpha(barColor, "2a")} 100%)`;
                    const glow = `0 0 18px ${withAlpha(barColor, "44")}`;

                    return (
                      <div
                        key={`preview-${index}`}
                        className="h-1.5 rounded-full transition-all duration-500 ease-out origin-left"
                        style={{
                          width: `${widthPercent * 100}%`,
                          transform: `translateX(${translateX}px)`,
                          backgroundImage: gradient,
                          boxShadow: glow,
                          opacity,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              {/* Mobile navigation arrows */}
              {showMobileIndicator && (
                <div className="flex justify-between items-center px-4 mt-4">
                  {/* Left arrow button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      stepTo(-1);
                    }}
                    disabled={activeIndex === 0}
                    className={`flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all active:scale-95 ${activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20'}`}
                    aria-label="Previous card"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                  {/* Card indicator */}
                  <span className="text-white/60 text-sm">{activeIndex + 1} / {totalItems}</span>
                  {/* Right arrow button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      stepTo(1);
                    }}
                    disabled={activeIndex >= totalItems - 1}
                    className={`flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all active:scale-95 ${activeIndex >= totalItems - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20'}`}
                    aria-label="Next card"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Desktop layout - absolute positioning for scroll-through effect
            <div className="relative h-full w-full">
              <AnimatePresence initial={false} custom={transitionDirection} mode="popLayout">
                {itemsArray.length > 0 && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
                    <motion.div
                      key={activeIndex}
                      custom={transitionDirection}
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="flex justify-center"
                      style={{ zIndex: 10 }}
                    >
                      <div className="pointer-events-auto w-full">
                        {itemsArray[activeIndex]}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-8 lg:bottom-10 px-8"
                style={{ zIndex: 1 }}
              >
                <div className="flex flex-col gap-2" aria-hidden="true">
                  {itemsArray.map((item, index) => {
                    if (index <= activeIndex) return null;

                    const depth = index - activeIndex;
                    const widthPercent = Math.max(0.58, 1 - depth * 0.08);
                    const translateX = depth * 6;
                    const opacity = Math.max(0.25, 0.95 - depth * 0.18);
                    const barColor = getPreviewColor(item);
                    const gradient = `linear-gradient(110deg, ${barColor} 0%, ${withAlpha(
                      barColor,
                      "E0"
                    )} 55%, ${withAlpha(barColor, "2a")} 100%)`;
                    const glow = `0 0 18px ${withAlpha(barColor, "44")}`;

                    return (
                      <div
                        key={`preview-${index}`}
                        className="h-2 rounded-full transition-all duration-500 ease-out origin-left"
                        style={{
                          width: `${widthPercent * 100}%`,
                          transform: `translateX(${translateX}px)`,
                          backgroundImage: gradient,
                          boxShadow: glow,
                          opacity,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )
        ) : (
          children
        )}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
