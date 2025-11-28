"use client";

import React, {
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion } from "motion/react";

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
}) => (
  <div
    className={`scroll-stack-card relative w-full h-[24rem] md:h-[26rem] xl:h-[28rem] my-0 p-10 md:p-12 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.18)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: "hidden",
      transformStyle: "preserve-3d",
    }}
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
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const activeSlotRef = useRef<HTMLDivElement | null>(null);
  const [collapsedTop, setCollapsedTop] = useState<number | null>(null);
  const lastTransformsRef = useRef(new Map<number, any>());
  const isUpdatingRef = useRef(false);

  const itemsArray = useMemo(() => React.Children.toArray(children), [children]);
  const totalItems = itemsArray.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);
  const wheelDeltaRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!isLocalStack) return;
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    },
    [isLocalStack]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!isLocalStack) return;
      if (touchStartYRef.current == null) return;

      const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - currentY;

      if (Math.abs(delta) >= 40) {
        stepTo(delta > 0 ? 1 : -1);
        touchStartYRef.current = currentY;
      }

      event.preventDefault();
    },
    [isLocalStack, stepTo]
  );

  const handleTouchEnd = useCallback(() => {
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

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

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
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? (document.querySelector(".scroll-stack-end") as HTMLElement | null)
      : (scrollerRef.current?.querySelector(".scroll-stack-end") as HTMLElement | null);

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
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
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
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
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
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
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : "";

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
        : (scrollerRef.current?.querySelectorAll(".scroll-stack-card") ?? [])
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
      ;(card.style as any).webkitTransform = "translateZ(0)";
      card.style.perspective = "1000px";
      ;(card.style as any).webkitPerspective = "1000px";
    });

    setupLenis();

    updateCardTransforms();

    // ensure collapsedTop is initialized to place previews below the active slot
    const updateCollapsedTop = () => {
      const scroller = scrollerRef.current;
      if (!scroller || !activeSlotRef.current) return;
      const scrollerRect = scroller.getBoundingClientRect();
      const slotRect = activeSlotRef.current.getBoundingClientRect();
      const topPx = slotRect.bottom - scrollerRect.top;
      setCollapsedTop(Math.max(12, Math.round(topPx)));
    };

    updateCollapsedTop();
    window.addEventListener("resize", updateCollapsedTop);

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
      window.removeEventListener("resize", updateCollapsedTop);
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

  // Recalculate collapsedTop whenever activeIndex changes to keep previews anchored
  useEffect(() => {
    const recalc = () => {
      const scroller = scrollerRef.current;
      if (!scroller || !activeSlotRef.current) return;
      const scrollerRect = scroller.getBoundingClientRect();
      const slotRect = activeSlotRef.current.getBoundingClientRect();
      const topPx = slotRect.bottom - scrollerRect.top;
      setCollapsedTop(Math.max(12, Math.round(topPx)));
    };

    // measure on next frame to allow DOM updates
    const id = requestAnimationFrame(recalc);
    return () => cancelAnimationFrame(id);
  }, [activeIndex]);

  const innerClassName = useWindowScroll
    ? "scroll-stack-inner pt-[20vh] px-10 pb-[50rem] min-h-screen"
    : "scroll-stack-inner relative w-full h-full px-6 md:px-8 py-16";

  const cardVariants = useMemo(() => ({
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
  }), []);

  const overflowClass = isLocalStack ? "overflow-hidden" : "overflow-y-auto";

  const wheelHandler = isLocalStack ? handleWheel : undefined;
  const touchStartHandler = isLocalStack ? handleTouchStart : undefined;
  const touchMoveHandler = isLocalStack ? handleTouchMove : undefined;
  const touchEndHandler = isLocalStack ? handleTouchEnd : undefined;
  const keyDownHandler = isLocalStack ? handleKeyDown : undefined;

  return (
    <div
      className={`relative w-full h-full ${overflowClass} overflow-x-visible ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        willChange: "scroll-position",
      }}
      onWheel={wheelHandler}
      onTouchStart={touchStartHandler}
      onTouchMove={touchMoveHandler}
      onTouchEnd={touchEndHandler}
      onKeyDown={keyDownHandler}
      tabIndex={isLocalStack ? 0 : undefined}
    >
      <div className={innerClassName} ref={innerRef}>
        {isLocalStack ? (
          <div className="relative h-full w-full">
            <AnimatePresence initial={false} custom={transitionDirection} mode="popLayout">
              {itemsArray.length > 0 && (
                <motion.div
                  ref={(el) => { activeSlotRef.current = el as HTMLDivElement | null; }}
                  key={activeIndex}
                  custom={transitionDirection}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute left-0 right-0 flex justify-center"
                  style={{ pointerEvents: "none", zIndex: 10, top: '0' }}
                >
                  <div className="pointer-events-auto w-full" style={{ marginTop: '6.75rem' }}>
                    {itemsArray[activeIndex]}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div
              className="pointer-events-none absolute inset-x-0"
              style={{ zIndex: 1, top: collapsedTop !== null ? `${collapsedTop}px` : undefined }}
            >
              {itemsArray.map((item, index) => {
                if (index <= activeIndex) return null;

                const depth = index - activeIndex;
                const scale = Math.max(0.8, 1 - depth * 0.07);
                const translateY = depth * 18;
                const opacity = Math.max(0.2, 0.42 - depth * 0.07);
                const blur = Math.max(0, depth * 2.5);

                return (
                  <div
                    key={`collapsed-${index}`}
                    className="absolute inset-x-6 md:inset-x-8 lg:inset-x-10"
                    style={{
                      transform: `translateY(${translateY}px) scale(${scale})`,
                      transformOrigin: "top center",
                      opacity,
                      filter: blur ? `blur(${blur}px)` : undefined,
                      transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease",
                    }}
                  >
                    <div className="pointer-events-none" aria-hidden="true">
                      {item}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          children
        )}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
