"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, GitBranch } from "lucide-react";
import { IconLink, TechTag } from "@/components/ui";
import type { Project } from "@/types";

const ACCENT = "#6366f1";

const TAG_ICONS: Record<string, string> = {
  "HTML":         "/icons/html5.svg",
  "CSS":          "/icons/css_old.svg",
  "Javascript":   "/icons/javascript.svg",
  "JavaScript":   "/icons/javascript.svg",
  "TypeScript":   "/icons/typescript.svg",
  "Tailwind CSS": "/icons/tailwindcss.svg",
  "React":        "/icons/react.svg",
  "Next.js":      "/icons/nextjs.svg",
  "Node.js":      "/icons/nodejs.svg",
  "Python":       "/icons/python.svg",
  "Docker":       "/icons/docker.svg",
  "MySQL":        "/icons/mysql-icon-light.svg",
  "Java":         "/icons/java.svg",
  "C#":           "/icons/csharp.svg",
  ".NET":         "/icons/dotnet.svg",
  "MongoDB":      "/icons/mongodb.svg",
};

interface Props {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (project) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  const hasLive   = project?.liveUrl   !== "#";
  const hasGithub = project?.githubUrl !== "#";

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.93, y: 24  }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl"
              style={{
                backgroundColor: "var(--color-bg-elevated)",
                border: `1px solid ${ACCENT}50`,
                boxShadow: `0 32px 64px -16px ${ACCENT}40, 0 0 0 1px ${ACCENT}20`,
                maxHeight: "90vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/70 transition-colors hover:bg-black/70 hover:text-white"
              >
                <X size={16} />
              </button>

              {/* Image */}
              <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-bg-hover">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to bottom, transparent 50%, rgba(10,15,30,0.7) 100%)",
                  }}
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-4 overflow-y-auto p-6">
                {/* Title + type badge */}
                <h2 className="text-xl font-bold" style={{ color: ACCENT }}>
                  {project.title}
                </h2>

                {/* Full description */}
                <p className="text-sm leading-7 text-text-muted">
                  {project.description}
                </p>

                {/* Tech icons */}
                <div className="flex flex-wrap items-center gap-3">
                  {project.tags.map((tag) => {
                    const icon = TAG_ICONS[tag];
                    return icon ? (
                      <div key={tag} title={tag} className="flex items-center justify-center">
                        <Image src={icon} alt={tag} width={22} height={22} className="size-5 object-contain" />
                      </div>
                    ) : (
                      <TechTag key={tag}>{tag}</TechTag>
                    );
                  })}
                </div>

                {/* Links */}
                <div className="flex items-center gap-5 border-t border-border pt-3">
                  {hasLive && (
                    <IconLink
                      href={project.liveUrl}
                      label="Live Demo"
                      icon={<ExternalLink size={14} />}
                      external
                      className="text-sm"
                    />
                  )}
                  {hasGithub && (
                    <IconLink
                      href={project.githubUrl}
                      label="GitHub"
                      icon={<GitBranch size={14} />}
                      external
                      className="text-sm"
                    />
                  )}
                  {!hasLive && !hasGithub && (
                    <span className="text-xs italic text-text-muted">Coming soon</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
