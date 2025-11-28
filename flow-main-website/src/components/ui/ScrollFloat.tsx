"use client";

import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type WordClassMap = Record<number, string | undefined>;

type ScrollFloatProps = {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  charClassName?: string;
  wordClassNames?: WordClassMap;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  triggerOnMount?: boolean;
};

const defaultFromVars = {
  willChange: "opacity, transform",
  opacity: 0,
  yPercent: 120,
  scaleY: 2.3,
  scaleX: 0.7,
  transformOrigin: "50% 0%",
};

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  charClassName = "",
  wordClassNames,
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
  triggerOnMount = false,
}: ScrollFloatProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const content = useMemo(() => {
    // If children is a string, split into per-character spans; otherwise, render children directly.
    if (typeof children !== "string") return children;

    const words = children.split(" ");
    const spans: ReactNode[] = [];

    words.forEach((word, wordIndex) => {
      const wordClass = wordClassNames?.[wordIndex];
      Array.from(word).forEach((char, charIndex) => {
        spans.push(
          <span
            key={`${wordIndex}-${charIndex}`}
            className={cn(
              "inline-block scroll-float-char",
              charClassName,
              wordClass
            )}
          >
            {char}
          </span>
        );
      });

      if (wordIndex < words.length - 1) {
        spans.push(
          <span key={`space-${wordIndex}`} className="inline-block">
            &nbsp;
          </span>
        );
      }
    });

    return spans;
  }, [children, charClassName, wordClassNames]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current ?? undefined;

    const ctx = gsap.context(() => {
      const charElements = el.querySelectorAll<HTMLElement>(
        ".scroll-float-char"
      );

      if (!charElements.length) return;

      const toVars = {
        duration: animationDuration,
        ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger,
      };

      if (triggerOnMount) {
        gsap.fromTo(charElements, defaultFromVars, toVars);
        return;
      }

      gsap.fromTo(charElements, defaultFromVars, {
        ...toVars,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
    triggerOnMount,
  ]);

  return (
    <h2
      ref={containerRef}
      className={cn("my-5 overflow-hidden", containerClassName)}
    >
      <span className={cn("inline-block", textClassName)}>{content}</span>
    </h2>
  );
};

export default ScrollFloat;