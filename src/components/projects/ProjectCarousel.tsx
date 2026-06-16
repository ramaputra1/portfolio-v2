"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

const PER_PAGE_MOBILE = 3;
const PER_PAGE_DESKTOP = 6;

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

function Dots({
  total,
  active,
  onPageClick,
}: {
  total: number;
  active: number;
  onPageClick: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageClick(i)}
          className={cn(
            "h-1.5 rounded-full transition-all duration-200",
            i === active
              ? "w-5 bg-primary"
              : "w-1.5 bg-border hover:bg-border-light",
          )}
        />
      ))}
    </div>
  );
}

function ArrowBtn({
  onClick,
  disabled,
  children,
  size = "md",
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-border transition-colors",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        disabled
          ? "cursor-not-allowed opacity-25"
          : "text-text-muted hover:border-border-light hover:bg-bg-hover hover:text-text",
      )}
    >
      {children}
    </button>
  );
}

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [page, setPage] = useState(0);
  const [sortLatest, setSortLatest] = useState(true);
  const [status, setStatus] = useState<StatusFilter>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Mobile uses a smaller per-page; handled via two separate paginations
  // We use window to detect, but SSR-safe via CSS-only split layout
  const filtered = useMemo(() => {
    return [...projects]
      .filter((p) => matchStatus(p, status))
      .sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return sortLatest ? db - da : da - db;
      });
  }, [projects, status, sortLatest]);

  // Desktop pagination (6/page)
  const totalPagesD = Math.max(
    1,
    Math.ceil(filtered.length / PER_PAGE_DESKTOP),
  );
  const safePageD = Math.min(page, totalPagesD - 1);
  const currentD = filtered.slice(
    safePageD * PER_PAGE_DESKTOP,
    (safePageD + 1) * PER_PAGE_DESKTOP,
  );

  // Mobile pagination (3/page)
  const totalPagesM = Math.max(1, Math.ceil(filtered.length / PER_PAGE_MOBILE));
  const safePageM = Math.min(page, totalPagesM - 1);
  const currentM = filtered.slice(
    safePageM * PER_PAGE_MOBILE,
    (safePageM + 1) * PER_PAGE_MOBILE,
  );

  const resetPage = () => setPage(0);

  return (
    <>
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />

      <div className="mt-6 flex flex-col gap-5">
        {/* ── Filter bar ── */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSortLatest((v) => !v);
              resetPage();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-light hover:text-text"
          >
            <ArrowUpDown size={12} />
            <span className="hidden sm:inline">By Date: </span>
            {sortLatest ? "Latest" : "Earliest"}
          </button>

          <span className="text-border">|</span>

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
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
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

        {/* ── MOBILE layout (< sm): grid + bottom nav ── */}
        <div className="flex flex-col gap-4 sm:hidden">
          {currentM.length > 0 ? (
            <div className="grid gap-4">
              {currentM.map((project) => (
                <ProjectCard
                  key={project.title + project.date}
                  project={project}
                  onOpen={setActiveProject}
                />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-text-muted">
              No projects match this filter.
            </p>
          )}

          {totalPagesM > 1 && (
            <div className="flex items-center justify-center gap-3 pt-1">
              <ArrowBtn
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePageM === 0}
              >
                <ChevronLeft size={16} />
              </ArrowBtn>
              <Dots
                total={totalPagesM}
                active={safePageM}
                onPageClick={setPage}
              />
              <ArrowBtn
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPagesM - 1, p + 1))}
                disabled={safePageM === totalPagesM - 1}
              >
                <ChevronRight size={16} />
              </ArrowBtn>
            </div>
          )}
        </div>

        {/* ── DESKTOP layout (≥ sm): side arrows + grid ── */}
        <div className="hidden sm:flex sm:flex-col sm:gap-5">
          <div className="flex items-center gap-3">
            <ArrowBtn
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePageD === 0}
            >
              <ChevronLeft size={20} />
            </ArrowBtn>

            <div className="flex-1">
              {currentD.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {currentD.map((project) => (
                    <ProjectCard
                      key={project.title + project.date}
                      project={project}
                      onOpen={setActiveProject}
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
              onClick={() => setPage((p) => Math.min(totalPagesD - 1, p + 1))}
              disabled={safePageD === totalPagesD - 1}
            >
              <ChevronRight size={20} />
            </ArrowBtn>
          </div>

          {totalPagesD > 1 && (
            <div className="flex justify-center">
              <Dots
                total={totalPagesD}
                active={safePageD}
                onPageClick={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
