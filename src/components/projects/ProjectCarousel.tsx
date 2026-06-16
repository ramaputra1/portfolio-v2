"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";

const PER_PAGE = 6;

type StatusFilter = "live" | "github" | "private" | null;

const STATUS_CHIPS: { value: StatusFilter; label: string; dot: string }[] = [
  { value: "live", label: "Live", dot: "bg-green-400" },
  { value: "github", label: "GitHub", dot: "bg-blue-400" },
  { value: "private", label: "Private", dot: "bg-red-400" },
];

function matchStatus(
  p: { liveUrl: string; githubUrl: string },
  filter: StatusFilter,
) {
  if (filter === "live") return p.liveUrl !== "#";
  if (filter === "github") return p.githubUrl !== "#";
  if (filter === "private") return p.liveUrl === "#" && p.githubUrl === "#";
  return true;
}

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [page, setPage] = useState(0);
  const [sortLatest, setSortLatest] = useState(true);
  const [status, setStatus] = useState<StatusFilter>(null);

  const filtered = useMemo(() => {
    return [...projects]
      .filter((p) => matchStatus(p, status))
      .sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return sortLatest ? db - da : da - db;
      });
  }, [projects, status, sortLatest]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const current = filtered.slice(
    safePage * PER_PAGE,
    (safePage + 1) * PER_PAGE,
  );

  const resetPage = () => setPage(0);
  const canPrev = safePage > 0;
  const canNext = safePage < totalPages - 1;

  const ArrowBtn = ({
    onClick,
    disabled,
    children,
  }: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors",
        disabled
          ? "cursor-not-allowed opacity-25"
          : "text-text-muted hover:border-border-light hover:bg-bg-hover hover:text-text",
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* By Date toggle */}
        <button
          onClick={() => {
            setSortLatest((v) => !v);
            resetPage();
          }}
          className="flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-border-light hover:text-text"
        >
          <ArrowUpDown size={13} />
          By Date: {sortLatest ? "Latest" : "Earliest"}
        </button>

        <span className="text-border">|</span>

        {/* Status chips — single select, click active to deselect */}
        {STATUS_CHIPS.map(({ value, label, dot }) => {
          const active = status === value;
          return (
            <button
              key={value}
              onClick={() => {
                setStatus(active ? null : value);
                resetPage();
              }}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-primary-light"
                  : "border-border bg-bg-elevated text-text-muted hover:border-border-light hover:text-text",
              )}
            >
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full",
                  active ? dot : "bg-text-muted",
                )}
              />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Grid + side arrows ── */}
      <div className="flex items-center gap-3">
        <ArrowBtn
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={!canPrev}
        >
          <ChevronLeft size={20} />
        </ArrowBtn>

        <div className="flex-1">
          {current.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {current.map((project) => (
                <ProjectCard
                  key={project.title + project.date}
                  project={project}
                />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-text-muted">
              No projects match this filter.
            </p>
          )}
        </div>

        <ArrowBtn
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={!canNext}
        >
          <ChevronRight size={20} />
        </ArrowBtn>
      </div>

      {/* ── Dot pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                i === safePage
                  ? "w-6 bg-primary"
                  : "w-2 bg-border hover:bg-border-light",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
