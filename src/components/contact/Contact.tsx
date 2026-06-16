"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const REPO_URL = "https://github.com/ramaputra1/portfolio-v2";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui";
import {
  GitHubIcon,
  LinkedInIcon,
  EmailIcon,
} from "@/components/ui/BrandIcons";
import { socials, contactEmail } from "@/data/social";

const githubHref = socials.find((s) => s.label === "GitHub")?.href ?? "#";
const linkedInHref = socials.find((s) => s.label === "LinkedIn")?.href ?? "#";
const email = contactEmail.replace(/^@/, "");

const cards = [
  {
    icon: <EmailIcon size={22} />,
    label: "Send Email",
    sub: email,
    href: `mailto:${email}`,
    primary: true,
  },
  {
    icon: <LinkedInIcon size={22} />,
    label: "LinkedIn",
    sub: "Connect with me",
    href: linkedInHref,
    primary: false,
  },
  {
    icon: <GitHubIcon size={22} />,
    label: "GitHub",
    sub: "Check out my work",
    href: githubHref,
    primary: false,
  },
];

function Robot() {
  const headRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [starred, setStarred] = useState(false);
  const [showThank, setShowThank] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headRef.current || !containerRef.current) return;
      const svg = containerRef.current.querySelector("svg");
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const scaleX = r.width / 200;
      const scaleY = r.height / 220;
      const cx = r.left + 100 * scaleX;
      const cy = r.top + 95 * scaleY;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const clamped = Math.max(
        -22,
        Math.min(22, angle > 90 || angle < -90 ? 0 : angle * 0.4),
      );
      headRef.current.style.transform = `rotate(${clamped}deg)`;
      headRef.current.style.transformOrigin = "100px 112px";
      if (eyesRef.current) {
        eyesRef.current.style.transform = `translate(${Math.max(-3, Math.min(3, dx * 0.015))}px, ${Math.max(-2, Math.min(2, dy * 0.015))}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute bottom-16 left-4 hidden lg:block xl:left-10"
    >
      <svg
        viewBox="0 0 200 220"
        width="160"
        height="176"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          <linearGradient id="cBodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e2d5a" />
            <stop offset="100%" stopColor="#0d1b3e" />
          </linearGradient>
          <linearGradient id="cHeadGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#253070" />
            <stop offset="100%" stopColor="#111e4a" />
          </linearGradient>
          <linearGradient id="cGlowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <filter id="cGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cSoftGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse
          cx="100"
          cy="218"
          rx="55"
          ry="7"
          fill="url(#cGlowGrad)"
          opacity="0.4"
        />
        <g>
          <rect
            x="52"
            y="128"
            width="96"
            height="82"
            rx="10"
            fill="url(#cBodyGrad)"
            stroke="#3b4fd0"
            strokeWidth="1.2"
          />
          <rect
            x="70"
            y="140"
            width="60"
            height="38"
            rx="6"
            fill="#0a1230"
            stroke="#4a5ce0"
            strokeWidth="0.8"
            opacity="0.9"
          />
          <circle
            cx="82"
            cy="152"
            r="5"
            fill="#6366f1"
            filter="url(#cGlow)"
            opacity="0.9"
          />
          <circle
            cx="100"
            cy="152"
            r="5"
            fill="#22d3ee"
            filter="url(#cGlow)"
            opacity="0.9"
          />
          <circle
            cx="118"
            cy="152"
            r="5"
            fill="#a855f7"
            filter="url(#cGlow)"
            opacity="0.9"
          />
          <line
            x1="70"
            y1="163"
            x2="130"
            y2="163"
            stroke="#4a5ce0"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <rect
            x="77"
            y="167"
            width="46"
            height="6"
            rx="3"
            fill="#1a2860"
            stroke="#4a5ce0"
            strokeWidth="0.6"
          />
          <rect
            x="28"
            y="132"
            width="22"
            height="62"
            rx="8"
            fill="url(#cBodyGrad)"
            stroke="#3b4fd0"
            strokeWidth="1.2"
          />
          <rect
            x="32"
            y="148"
            width="14"
            height="4"
            rx="2"
            fill="#4a5ce0"
            opacity="0.6"
          />
          <rect
            x="32"
            y="156"
            width="14"
            height="4"
            rx="2"
            fill="#4a5ce0"
            opacity="0.4"
          />
          <rect
            x="150"
            y="132"
            width="22"
            height="62"
            rx="8"
            fill="url(#cBodyGrad)"
            stroke="#3b4fd0"
            strokeWidth="1.2"
          />
          <rect
            x="154"
            y="148"
            width="14"
            height="4"
            rx="2"
            fill="#4a5ce0"
            opacity="0.6"
          />
          <rect
            x="154"
            y="156"
            width="14"
            height="4"
            rx="2"
            fill="#4a5ce0"
            opacity="0.4"
          />
          <circle
            cx="52"
            cy="138"
            r="4"
            fill="#1e2d5a"
            stroke="#6366f1"
            strokeWidth="1"
          />
          <circle
            cx="148"
            cy="138"
            r="4"
            fill="#1e2d5a"
            stroke="#6366f1"
            strokeWidth="1"
          />
        </g>
        <rect
          x="88"
          y="116"
          width="24"
          height="16"
          rx="4"
          fill="#161f4a"
          stroke="#3b4fd0"
          strokeWidth="1"
        />
        <line
          x1="94"
          y1="116"
          x2="94"
          y2="132"
          stroke="#4a5ce0"
          strokeWidth="0.6"
          opacity="0.5"
        />
        <line
          x1="106"
          y1="116"
          x2="106"
          y2="132"
          stroke="#4a5ce0"
          strokeWidth="0.6"
          opacity="0.5"
        />
        <g ref={headRef} style={{ transition: "transform 0.12s ease-out" }}>
          <line
            x1="100"
            y1="52"
            x2="100"
            y2="68"
            stroke="#6366f1"
            strokeWidth="1.5"
          />
          <circle
            cx="100"
            cy="48"
            r="5"
            fill="#6366f1"
            filter="url(#cSoftGlow)"
            opacity="0.95"
          />
          <circle cx="100" cy="48" r="2.5" fill="#a5b4fc" />
          <rect
            x="62"
            y="68"
            width="76"
            height="52"
            rx="14"
            fill="url(#cHeadGrad)"
            stroke="#4a5ce0"
            strokeWidth="1.4"
          />
          <rect
            x="70"
            y="78"
            width="60"
            height="26"
            rx="8"
            fill="#060e28"
            stroke="#6366f1"
            strokeWidth="0.9"
          />
          <g ref={eyesRef} style={{ transition: "transform 0.08s ease-out" }}>
            <circle cx="86" cy="91" r="8" fill="#0d1a3a" />
            <circle cx="86" cy="91" r="5.5" fill="#6366f1" opacity="0.3" />
            <circle cx="86" cy="91" r="4" fill="#818cf8" filter="url(#cGlow)" />
            <circle cx="86" cy="91" r="2" fill="#e0e7ff" />
            <circle cx="114" cy="91" r="8" fill="#0d1a3a" />
            <circle cx="114" cy="91" r="5.5" fill="#6366f1" opacity="0.3" />
            <circle
              cx="114"
              cy="91"
              r="4"
              fill="#818cf8"
              filter="url(#cGlow)"
            />
            <circle cx="114" cy="91" r="2" fill="#e0e7ff" />
          </g>
          <rect
            x="80"
            y="108"
            width="40"
            height="6"
            rx="3"
            fill="#0a1230"
            stroke="#4a5ce0"
            strokeWidth="0.7"
          />
          {[84, 91, 98, 105, 112].map((x) => (
            <line
              key={x}
              x1={x}
              y1="108"
              x2={x}
              y2="114"
              stroke="#6366f1"
              strokeWidth="1"
              opacity="0.6"
            />
          ))}
          <circle
            cx="62"
            cy="90"
            r="4"
            fill="#161f4a"
            stroke="#6366f1"
            strokeWidth="0.8"
          />
          <circle cx="62" cy="90" r="1.5" fill="#6366f1" opacity="0.7" />
          <circle
            cx="138"
            cy="90"
            r="4"
            fill="#161f4a"
            stroke="#6366f1"
            strokeWidth="0.8"
          />
          <circle cx="138" cy="90" r="1.5" fill="#6366f1" opacity="0.7" />
        </g>
      </svg>

      {/* Chat bubble — floats beside the head (head renders at ~top:44px in 160px-tall SVG) */}
      <div
        className="absolute animate-[fadeSlideIn_0.6s_ease_0.8s_both]"
        style={{
          left: "140px",
          top: "25px",
          width: "170px",
          background: "rgba(19,25,60,0.92)",
          border: "1px solid rgba(99,102,241,0.5)",
          borderRadius: "14px 14px 14px 2px",
          boxShadow: "0 4px 20px rgba(99,102,241,0.15)",
          padding: "8px 12px",
        }}
      >
        <p className="text-[11px] leading-5 text-slate-300">
          <span className="font-semibold text-indigo-300">Jarvis,</span> make
          sure this guy has a great day.
        </p>
        {/* Tail pointing left toward head */}
        <span
          className="absolute -left-1.75 top-3"
          style={{
            width: 0,
            height: 0,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderRight: "6px solid rgba(19,25,60,0.92)",
          }}
        />
      </div>

      {/* Star button below the bubble */}
      <div
        className="absolute flex flex-col items-start gap-1.5 animate-[fadeSlideIn_0.6s_ease_1s_both]"
        style={{ left: "160px", top: "100px", width: "170px" }}
      >
        {showThank && (
          <p className="text-xs font-semibold text-yellow-300 animate-[fadeSlideIn_0.3s_ease_both]">
            Thank you twin! 🌟
          </p>
        )}
        <button
          onClick={() => {
            window.open(REPO_URL, "_blank", "noopener,noreferrer");
            setStarred(true);
            setShowThank(true);
            setTimeout(() => setShowThank(false), 3000);
          }}
          className="pointer-events-auto flex cursor-pointer items-center gap-2 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]"
          style={{ color: starred ? "#fde68a" : "#a5b4fc" }}
          onMouseEnter={(e) => {
            if (!starred)
              (e.currentTarget as HTMLElement).style.color = "#fde68a";
          }}
          onMouseLeave={(e) => {
            if (!starred)
              (e.currentTarget as HTMLElement).style.color = "#a5b4fc";
          }}
        >
          <Star
            size={16}
            fill={starred ? "#fde68a" : "none"}
            stroke={starred ? "#fde68a" : "currentColor"}
          />
          {starred ? "Starred!" : "Star Me!"}
        </button>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="space-gradient relative overflow-hidden">
      <Robot />
      <Section id="contact">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          {/* Left — text */}
          <div>
            <SectionHeader
              label="LET'S CONNECT"
              title="Let's Build Some Wonderful Things Together"
            />
            <p className="mt-4 max-w-sm text-sm leading-7 text-text-muted">
              I&apos;m always open to collaborations, internships,
              opportunities, or even hot chocolate ☕
            </p>
          </div>

          {/* Right — cards */}
          <div className="flex flex-col gap-4">
            {cards.map(({ icon, label, sub, href, primary }) => (
              <a
                key={label}
                href={href}
                target={primary ? undefined : "_blank"}
                rel={primary ? undefined : "noopener noreferrer"}
                className="group flex items-center gap-4 rounded-xl border p-5 transition-all duration-300"
                style={
                  primary
                    ? {
                        background: "rgba(19,25,60,0.92)",
                        border: "1px solid rgba(99,102,241,0.5)",
                        boxShadow: "0 4px 20px rgba(99,102,241,0.15)",
                      }
                    : {
                        background: "var(--color-bg-elevated)",
                        border: "1px solid var(--color-border)",
                      }
                }
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (primary) {
                    el.style.borderColor = "rgba(99,102,241,0.8)";
                    el.style.background = "rgba(25,32,75,0.97)";
                    el.style.boxShadow =
                      "0 8px 32px rgba(99,102,241,0.35), 0 0 0 1px rgba(99,102,241,0.2)";
                  } else {
                    el.style.borderColor = "var(--color-border-light)";
                    el.style.background = "var(--color-bg-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (primary) {
                    el.style.borderColor = "rgba(99,102,241,0.5)";
                    el.style.background = "rgba(19,25,60,0.92)";
                    el.style.boxShadow = "0 4px 20px rgba(99,102,241,0.15)";
                  } else {
                    el.style.borderColor = "var(--color-border)";
                    el.style.background = "var(--color-bg-elevated)";
                  }
                }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    color: "#a5b4fc",
                  }}
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-semibold ${primary ? "text-indigo-200" : "text-text"}`}
                  >
                    {label}
                  </p>
                  <p
                    className={`mt-0.5 truncate text-sm ${primary ? "text-slate-400" : "text-text-muted"}`}
                  >
                    {sub}
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{
                    color: primary
                      ? "rgba(255,255,255,0.7)"
                      : "var(--color-text-muted)",
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 sm:px-12">
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm text-text-dim">
              © 2026 Rama Putra. All rights reserved.
            </p>
            <p className="text-sm text-text-dim">Built with Cinta ❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
}
