"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GlobeInner = dynamic(() => import("./GlobeInner"), {
  ssr: false,
  loading: () => null,
});

export function Globe() {
  // Both initialise to zero/false — identical on server and client.
  // The effects update them after hydration.
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [gradientOpacity, setGradientOpacity] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const onResize = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    onResize(); // initial read — inside a callback, not bare in the effect body
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = (e?: MediaQueryListEvent) =>
      setReducedMotion(e ? e.matches : mq.matches);
    onMotion(); // initial read
    mq.addEventListener("change", onMotion);
    return () => mq.removeEventListener("change", onMotion);
  }, []);

  // Scroll-linked gradient dissolve
  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const progress = Math.min(
          1,
          window.scrollY / (window.innerHeight * 0.8)
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

  // Canvas is 1.5× wide and 1.3× tall, anchored top-left.
  // The hero section's overflow-hidden clips the right/bottom bleed.
  // Globe sphere center lands at ~75 % from left and ~65 % from top —
  // the bottom-right-corner feel the user wants.
  const canvasW = size.w * 1.5;
  const canvasH = size.h * 1.3;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      {size.w > 0 && (
        <div
          className="pointer-events-auto absolute left-0 top-0"
          style={{ width: canvasW, height: canvasH }}
        >
          <GlobeInner
            width={canvasW}
            height={canvasH}
            reducedMotion={reducedMotion}
          />
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
  );
}
