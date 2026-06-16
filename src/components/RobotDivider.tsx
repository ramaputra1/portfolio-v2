"use client";

import { useEffect, useRef } from "react";

export function RobotDivider() {
  const headRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headRef.current || !containerRef.current) return;

      const svg = containerRef.current.querySelector("svg");
      if (!svg) return;
      const svgRect = svg.getBoundingClientRect();

      // Head center in screen coords (pivot point is neck — SVG y=112)
      const scaleX = svgRect.width / 200;
      const scaleY = svgRect.height / 220;
      const headCX = svgRect.left + 100 * scaleX;
      const headCY = svgRect.top  + 95  * scaleY;

      const dx = e.clientX - headCX;
      const dy = e.clientY - headCY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Clamp: only allow looking left/right ±25° and up/down ±15°
      const clampedAngle = Math.max(-25, Math.min(25, angle > 90 || angle < -90 ? 0 : angle * 0.4));

      headRef.current.style.transform = `rotate(${clampedAngle}deg)`;
      headRef.current.style.transformOrigin = "100px 112px";

      // Pupils follow cursor (smaller range)
      if (eyesRef.current) {
        const ex = Math.max(-3, Math.min(3, dx * 0.015));
        const ey = Math.max(-2, Math.min(2, dy * 0.015));
        eyesRef.current.style.transform = `translate(${ex}px, ${ey}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="space-gradient pointer-events-none relative z-10 hidden items-end justify-start pl-8 sm:flex sm:pl-16"
      style={{ marginTop: "-2px", marginBottom: "-2px" }}
    >
      <svg
        viewBox="0 0 200 220"
        width="160"
        height="176"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e2d5a" />
            <stop offset="100%" stopColor="#0d1b3e" />
          </linearGradient>
          <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#253070" />
            <stop offset="100%" stopColor="#111e4a" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softglow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Bottom glow pool ── */}
        <ellipse cx="100" cy="218" rx="60" ry="8" fill="url(#glowGrad)" opacity="0.5" />

        {/* ── Body ── */}
        <g>
          {/* Torso */}
          <rect x="52" y="128" width="96" height="82" rx="10" fill="url(#bodyGrad)" stroke="#3b4fd0" strokeWidth="1.2" />

          {/* Chest panel */}
          <rect x="70" y="140" width="60" height="38" rx="6" fill="#0a1230" stroke="#4a5ce0" strokeWidth="0.8" opacity="0.9" />

          {/* Chest lights */}
          <circle cx="82" cy="152" r="5" fill="#6366f1" filter="url(#glow)" opacity="0.9" />
          <circle cx="100" cy="152" r="5" fill="#22d3ee" filter="url(#glow)" opacity="0.9" />
          <circle cx="118" cy="152" r="5" fill="#a855f7" filter="url(#glow)" opacity="0.9" />

          {/* Chest line */}
          <line x1="70" y1="163" x2="130" y2="163" stroke="#4a5ce0" strokeWidth="0.8" opacity="0.6" />
          <rect x="77" y="167" width="46" height="6" rx="3" fill="#1a2860" stroke="#4a5ce0" strokeWidth="0.6" />

          {/* Left arm */}
          <rect x="28" y="132" width="22" height="62" rx="8" fill="url(#bodyGrad)" stroke="#3b4fd0" strokeWidth="1.2" />
          <rect x="32" y="148" width="14" height="4" rx="2" fill="#4a5ce0" opacity="0.6" />
          <rect x="32" y="156" width="14" height="4" rx="2" fill="#4a5ce0" opacity="0.4" />

          {/* Right arm */}
          <rect x="150" y="132" width="22" height="62" rx="8" fill="url(#bodyGrad)" stroke="#3b4fd0" strokeWidth="1.2" />
          <rect x="154" y="148" width="14" height="4" rx="2" fill="#4a5ce0" opacity="0.6" />
          <rect x="154" y="156" width="14" height="4" rx="2" fill="#4a5ce0" opacity="0.4" />

          {/* Shoulder bolts */}
          <circle cx="52" cy="138" r="4" fill="#1e2d5a" stroke="#6366f1" strokeWidth="1" />
          <circle cx="148" cy="138" r="4" fill="#1e2d5a" stroke="#6366f1" strokeWidth="1" />
        </g>

        {/* ── Neck ── */}
        <rect x="88" y="116" width="24" height="16" rx="4" fill="#161f4a" stroke="#3b4fd0" strokeWidth="1" />
        <line x1="94" y1="116" x2="94" y2="132" stroke="#4a5ce0" strokeWidth="0.6" opacity="0.5" />
        <line x1="106" y1="116" x2="106" y2="132" stroke="#4a5ce0" strokeWidth="0.6" opacity="0.5" />

        {/* ── HEAD (rotates) ── */}
        <g ref={headRef} style={{ transition: "transform 0.12s ease-out" }}>
          {/* Antenna */}
          <line x1="100" y1="52" x2="100" y2="68" stroke="#6366f1" strokeWidth="1.5" />
          <circle cx="100" cy="48" r="5" fill="#6366f1" filter="url(#softglow)" opacity="0.95" />
          <circle cx="100" cy="48" r="2.5" fill="#a5b4fc" />

          {/* Head shell */}
          <rect x="62" y="68" width="76" height="52" rx="14" fill="url(#headGrad)" stroke="#4a5ce0" strokeWidth="1.4" />

          {/* Visor / eye panel */}
          <rect x="70" y="78" width="60" height="26" rx="8" fill="#060e28" stroke="#6366f1" strokeWidth="0.9" />

          {/* Eyes (pupils move) */}
          <g ref={eyesRef} style={{ transition: "transform 0.08s ease-out" }}>
            {/* Left eye */}
            <circle cx="86" cy="91" r="8" fill="#0d1a3a" />
            <circle cx="86" cy="91" r="5.5" fill="#6366f1" opacity="0.3" />
            <circle cx="86" cy="91" r="4" fill="#818cf8" filter="url(#glow)" />
            <circle cx="86" cy="91" r="2" fill="#e0e7ff" />
            {/* Right eye */}
            <circle cx="114" cy="91" r="8" fill="#0d1a3a" />
            <circle cx="114" cy="91" r="5.5" fill="#6366f1" opacity="0.3" />
            <circle cx="114" cy="91" r="4" fill="#818cf8" filter="url(#glow)" />
            <circle cx="114" cy="91" r="2" fill="#e0e7ff" />
          </g>

          {/* Mouth / speaker */}
          <rect x="80" y="108" width="40" height="6" rx="3" fill="#0a1230" stroke="#4a5ce0" strokeWidth="0.7" />
          {[84, 91, 98, 105, 112].map((x) => (
            <line key={x} x1={x} y1="108" x2={x} y2="114" stroke="#6366f1" strokeWidth="1" opacity="0.6" />
          ))}

          {/* Head side details */}
          <circle cx="62" cy="90" r="4" fill="#161f4a" stroke="#6366f1" strokeWidth="0.8" />
          <circle cx="62" cy="90" r="1.5" fill="#6366f1" opacity="0.7" />
          <circle cx="138" cy="90" r="4" fill="#161f4a" stroke="#6366f1" strokeWidth="0.8" />
          <circle cx="138" cy="90" r="1.5" fill="#6366f1" opacity="0.7" />
        </g>
      </svg>

      {/* Chat bubble — to the right of robot */}
      <div
        className="relative mb-16 ml-3 max-w-55 animate-[fadeSlideIn_0.6s_ease_0.8s_both]"
        style={{
          background: "rgba(19,25,60,0.92)",
          border: "1px solid rgba(99,102,241,0.5)",
          borderRadius: "14px 14px 14px 2px",
          boxShadow: "0 4px 24px rgba(99,102,241,0.18), 0 0 0 1px rgba(99,102,241,0.1)",
          padding: "10px 14px",
        }}
      >
        <p className="text-xs leading-5 text-slate-300">
          <span className="font-semibold text-indigo-300">Jarvis,</span> make sure this guy has a great day.
        </p>
        {/* Tail pointing left toward robot */}
        <span
          className="absolute -left-1.75 bottom-3"
          style={{
            width: 0,
            height: 0,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderRight: "7px solid rgba(19,25,60,0.92)",
          }}
        />
      </div>
    </div>
  );
}
