"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  motionValue,
  animate,
  type MotionValue,
  type AnimationPlaybackControls,
} from "framer-motion";

const GlobeInner = dynamic(() => import("./GlobeInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="rounded-full"
        style={{
          width: "min(50vw, 400px)",
          height: "min(50vw, 400px)",
          background:
            "radial-gradient(circle at 35% 35%, rgba(59,130,246,0.15), rgba(10,15,30,0.4) 70%)",
          animation: "pulse 2s ease-in-out infinite",
        }}
      />
    </div>
  ),
});

const LETTERS = "Hello World".split("");


const REPEL_RADIUS = 140; // px — wider zone = more sensitive
const REPEL_STRENGTH = 22; // px — hard ceiling on vertical displacement

// Fast spring: letter smoothly chases the cursor target
const SPRING_FORWARD = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.5,
} as const;
// Slow spring: letter drifts lazily back to rest when cursor leaves
const SPRING_BACK = {
  type: "spring",
  stiffness: 38,
  damping: 14,
  mass: 1.2,
} as const;

function HelloWorldRipple({
  opacity,
  isCompact,
}: {
  opacity: number;
  isCompact: boolean;
}) {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isMounted = useRef(false);
  const animRef = useRef<(AnimationPlaybackControls | null)[]>(
    LETTERS.map(() => null),
  );


  // motionValue is a plain function (not a hook) — safe in useState lazy init
  const [mv] = useState<{ x: MotionValue<number>; y: MotionValue<number> }[]>(
    () => LETTERS.map(() => ({ x: motionValue(0), y: motionValue(0) })),
  );

  useEffect(() => {
    isMounted.current = true;
    const anims = animRef.current;
    return () => {
      isMounted.current = false;
      anims.forEach((ctrl) => ctrl?.stop());
      mv.forEach(({ x, y }) => {
        x.set(0);
        y.set(0);
      });
    };
  }, [mv]);

  const springBack = (i: number) => {
    if (!isMounted.current) return;
    const entry = mv[i];
    if (!entry || typeof entry.y?.set !== "function") return;
    animRef.current[i]?.stop();
    animRef.current[i] = animate(entry.y, 0, SPRING_BACK);
    entry.x.set(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isCompact) return;
    for (let i = 0; i < LETTERS.length; i++) {
      const el = letterRefs.current[i];
      const entry = mv[i];
      if (!el || typeof entry?.y?.set !== "function") continue;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_RADIUS && dist > 0) {
        const raw = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        const target = Math.max(
          -REPEL_STRENGTH,
          Math.min(REPEL_STRENGTH, (-dy / dist) * raw),
        );
        // Cancel previous animation and spring toward the new target
        animRef.current[i]?.stop();
        animRef.current[i] = animate(entry.y, target, SPRING_FORWARD);
        entry.x.set(0);
      } else {
        springBack(i);
      }
    }
  };

  const handleMouseLeave = () => {
    if (isCompact) return;
    for (let i = 0; i < LETTERS.length; i++) springBack(i);
  };

  return (
    <div
      className="hero-hello pointer-events-auto absolute right-3 top-[4.25rem] z-3 -rotate-3 cursor-default select-none whitespace-nowrap sm:left-[72%] sm:right-auto sm:top-[28%] sm:-translate-x-1/2 sm:-translate-y-1/2 lg:top-[20%]"
      style={{
        fontSize: isCompact
          ? "clamp(0.95rem, 4.5vw, 1.2rem)"
          : "clamp(2rem, 4.5vw, 3.8rem)",
        opacity,
        color: "#a5b4fc",
        filter: "drop-shadow(0 0 18px rgba(99,102,241,0.5))",
        transition: "opacity 3s ease",
        padding: isCompact ? "0.45rem" : "1.5rem",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {isCompact
        ? "Hello World"
        : LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                // Pass the MotionValue directly — never fall back to a raw number
                // (passing 0 to FM v12's x/y style prop causes an internal .x read error)
                x: mv[i]?.x,
                y: mv[i]?.y,
              }}
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
  const [hasDragged, setHasDragged] = useState(false);

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
        canvas.removeEventListener(
          "contextmenu",
          allowBrowserContextMenu,
          true,
        );
      });
    };
  }, [size.w]);

  useEffect(() => {
    if (size.w === 0) return;
    const id = setTimeout(() => setGlobeOpacity(1), 30);
    return () => clearTimeout(id);
  }, [size.w]);

  useEffect(() => {
    const el = globeHitAreaRef.current;
    if (!el) return;
    let down = false;
    const onDown = () => { down = true; };
    const onMove = () => { if (down) setHasDragged(true); };
    const onUp = () => { down = false; };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [size.w]);

  const isCompact = size.w > 0 && size.w < 640;
  const isTablet = size.w >= 640 && size.w < 1024;
  const canvasW = size.w * (isCompact ? 1.35 : isTablet ? 1.42 : 1.5);
  const canvasH = size.h * (isCompact ? 1.08 : isTablet ? 1.18 : 1.3);

  return (
    <>
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

      {/* Drag hint — visible until user drags, hidden forever after */}
      {size.w > 0 && !isCompact && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: "66%",
            top: "52%",
            transform: "translate(-50%, -50%)",
            opacity: hasDragged ? 0 : globeOpacity,
            transition: "opacity 0.7s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* Pulse ring */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.35)",
              animation: "drag-hint-pulse 2.4s ease-in-out infinite",
            }}
          />
          {/* Label */}
          <span
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textShadow: "0 1px 6px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            Drag to rotate
          </span>
        </div>
      )}

      {/* Scroll dissolve into next section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #0a0f1e 100%)",
          opacity: gradientOpacity,
          transition: "opacity 0.05s linear",
        }}
      />
    </div>

    {/* HelloWorldRipple outside z-0 wrapper so it sits above the mobile dark scrim (z-[2]) */}
    {size.w > 0 && (
      <HelloWorldRipple opacity={globeOpacity} isCompact={isCompact} />
    )}
    </>
  );
}
