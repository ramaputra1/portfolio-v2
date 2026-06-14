"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, motionValue, animate, type MotionValue } from "framer-motion";

const GlobeInner = dynamic(() => import("./GlobeInner"), {
  ssr: false,
  loading: () => null,
});

const LETTERS = "Hello World".split("");
const REPEL_RADIUS = 90;   // px — how far the cursor triggers movement
const REPEL_STRENGTH = 32; // px — max displacement

const SPRING_BACK = { type: "spring", stiffness: 50, damping: 18, mass: 0.9 } as const;

function HelloWorldRipple({ opacity }: { opacity: number }) {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // motionValue is a plain function (not a hook) — safe in useState lazy init
  const [mv] = useState<{ x: MotionValue<number>; y: MotionValue<number> }[]>(() =>
    LETTERS.map(() => ({ x: motionValue(0), y: motionValue(0) })),
  );

  const springBack = (i: number) => {
    animate(mv[i].x, 0, SPRING_BACK);
    animate(mv[i].y, 0, SPRING_BACK);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    letterRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        mv[i].x.set((-dx / dist) * force);
        mv[i].y.set((-dy / dist) * force);
      } else {
        springBack(i);
      }
    });
  };

  const handleMouseLeave = () => {
    LETTERS.forEach((_, i) => springBack(i));
  };

  return (
    <div
      className="hero-hello pointer-events-auto absolute left-[72%] top-[20%] z-2 -translate-x-1/2 -translate-y-1/2 -rotate-3 cursor-default select-none"
      style={{
        fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
        opacity,
        transition: "opacity 3s ease",
        padding: "1.5rem",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {LETTERS.map((letter, i) => (
        <motion.span
          key={i}
          ref={(el) => {
            letterRefs.current[i] = el;
          }}
          style={{ display: "inline-block", whiteSpace: "pre", x: mv[i].x, y: mv[i].y }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}

export function Globe() {
  const globeHitAreaRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [gradientOpacity, setGradientOpacity] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [globeOpacity, setGlobeOpacity] = useState(0);

  useEffect(() => {
    const onResize = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = (e?: MediaQueryListEvent) =>
      setReducedMotion(e ? e.matches : mq.matches);
    onMotion();
    mq.addEventListener("change", onMotion);
    return () => mq.removeEventListener("change", onMotion);
  }, []);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const progress = Math.min(
          1,
          window.scrollY / (window.innerHeight * 0.1),
        );
        setGradientOpacity(progress);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const hitArea = globeHitAreaRef.current;
    if (!hitArea) return;

    const canvases = new Set<HTMLCanvasElement>();
    const allowBrowserContextMenu = (event: Event) => {
      event.stopImmediatePropagation();
    };
    const attachCanvasListeners = () => {
      hitArea.querySelectorAll("canvas").forEach((canvas) => {
        if (canvases.has(canvas)) return;
        canvas.addEventListener("contextmenu", allowBrowserContextMenu, true);
        canvases.add(canvas);
      });
    };

    attachCanvasListeners();

    const observer = new MutationObserver(attachCanvasListeners);
    observer.observe(hitArea, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      canvases.forEach((canvas) => {
        canvas.removeEventListener("contextmenu", allowBrowserContextMenu, true);
      });
    };
  }, [size.w]);

  useEffect(() => {
    if (size.w === 0) return;
    const id = setTimeout(() => setGlobeOpacity(1), 30);
    return () => clearTimeout(id);
  }, [size.w]);

  const canvasW = size.w * 1.5;
  const canvasH = size.h * 1.3;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      {size.w > 0 && (
        <div
          ref={globeHitAreaRef}
          className="pointer-events-auto absolute left-0 top-0"
          style={{
            width: canvasW,
            height: canvasH,
            opacity: globeOpacity,
            transition: "opacity 3s ease",
          }}
        >
          <GlobeInner
            width={canvasW}
            height={canvasH}
            reducedMotion={reducedMotion}
          />
        </div>
      )}

      {size.w > 0 && <HelloWorldRipple opacity={globeOpacity} />}

      {/* Scroll dissolve into next section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #0a0f1e 100%)",
          opacity: gradientOpacity,
          transition: "opacity 0.05s linear",
        }}
      />
    </div>
  );
}
