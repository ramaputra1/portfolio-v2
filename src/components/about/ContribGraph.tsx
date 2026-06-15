"use client";

import { useState, useRef } from "react";
import type { Contribution } from "@/lib/github";

const LEVEL_COLORS = [
  "rgba(255,255,255,0.06)",
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
] as const;

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const CELL = 9;
const GAP = 2;
const STEP = CELL + GAP;
const LEFT = 26;  // space for day labels
const TOP  = 16;  // space for month labels

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  });
}

interface TooltipState { text: string; x: number; y: number }

export function ContribGraph({ contributions }: { contributions: Contribution[] }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (contributions.length === 0) return null;

  const levelMap = new Map<string, { count: number; level: number }>();
  for (const c of contributions) levelMap.set(c.date, { count: c.count, level: c.level });

  // Today in LOCAL timezone — avoids UTC-offset showing tomorrow's date
  const localNow = new Date();
  const todayStr = [
    localNow.getFullYear(),
    String(localNow.getMonth() + 1).padStart(2, "0"),
    String(localNow.getDate()).padStart(2, "0"),
  ].join("-");

  // Extend grid to Saturday of current week so column count stays fixed;
  // future cells are built but filtered out during rendering
  const utcToday = new Date();
  utcToday.setUTCHours(0, 0, 0, 0);
  const last = new Date(utcToday);
  last.setUTCDate(last.getUTCDate() + (6 - last.getUTCDay()));

  // Start: 52 weeks back, rewound to Sunday
  const yearAgo = new Date(utcToday);
  yearAgo.setUTCDate(yearAgo.getUTCDate() - 364);
  const start = new Date(yearAgo);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const weeks: { date: string; count: number; level: number }[][] = [];
  const cur = new Date(start);
  while (cur <= last) {
    const week: typeof weeks[0] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().split("T")[0];
      const entry = levelMap.get(dateStr);
      week.push({ date: dateStr, count: entry?.count ?? 0, level: entry?.level ?? 0 });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    weeks.push(week);
  }

  // Month labels: first week where that month appears
  const monthLabels: { label: string; wi: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const m = new Date(week[0].date + "T00:00:00Z").getUTCMonth();
    if (m !== lastMonth) { monthLabels.push({ label: MONTHS[m], wi }); lastMonth = m; }
  });

  const svgW = LEFT + weeks.length * STEP - GAP;
  const svgH = TOP + 7 * STEP - GAP;

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ display: "block", overflow: "visible" }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Month labels */}
        {monthLabels.map(({ label, wi }) => (
          <text
            key={label + wi}
            x={LEFT + wi * STEP}
            y={TOP - 5}
            fontSize={8.5}
            fill="rgba(255,255,255,0.45)"
            fontFamily="inherit"
          >
            {label}
          </text>
        ))}

        {/* Day labels — Mon, Wed, Fri only */}
        {([1, 3, 5] as const).map((di, idx) => (
          <text
            key={di}
            x={LEFT - 4}
            y={TOP + di * STEP + CELL / 2}
            fontSize={8}
            fill="rgba(255,255,255,0.38)"
            textAnchor="end"
            dominantBaseline="middle"
            fontFamily="inherit"
          >
            {["Mon", "Wed", "Fri"][idx]}
          </text>
        ))}

        {/* Contribution cells — stop at today, no future squares */}
        {weeks.map((week, wi) =>
          week.map((day, di) =>
            day.date > todayStr ? null : (
            <rect
              key={day.date}
              x={LEFT + wi * STEP}
              y={TOP + di * STEP}
              width={CELL}
              height={CELL}
              rx={2}
              fill={LEVEL_COLORS[day.level as 0 | 1 | 2 | 3 | 4]}
              style={{ cursor: "default" }}
              onMouseEnter={(e) => {
                const box = containerRef.current?.getBoundingClientRect();
                if (!box) return;
                setTooltip({
                  text:
                    day.count > 0
                      ? `${day.count} contribution${day.count > 1 ? "s" : ""} on ${formatDate(day.date)}`
                      : `No contributions on ${formatDate(day.date)}`,
                  x: e.clientX - box.left,
                  y: e.clientY - box.top,
                });
              }}
            />
            )
          )
        )}
      </svg>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-white/10 bg-[rgba(10,14,30,0.95)] px-2.5 py-1.5 text-[11px] font-medium text-slate-200 shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y - 40,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
