"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch } from "lucide-react";
import { TechTag, IconLink } from "@/components/ui";
import type { Project } from "@/types";

const ACCENT = "#6366f1";

const TAG_ICONS: Record<string, string> = {
  HTML: "/icons/html5.svg",
  CSS: "/icons/css_old.svg",
  Javascript: "/icons/javascript.svg",
  JavaScript: "/icons/javascript.svg",
  TypeScript: "/icons/typescript.svg",
  "Tailwind CSS": "/icons/tailwindcss.svg",
  React: "/icons/react.svg",
  "Next.js": "/icons/nextjs.svg",
  "Node.js": "/icons/nodejs.svg",
  Python: "/icons/python.svg",
  Docker: "/icons/docker.svg",
  MySQL: "/icons/mysql-icon-light.svg",
  Java: "/icons/java.svg",
  "C#": "/icons/csharp.svg",
  ".NET": "/icons/dotnet.svg",
  MongoDB: "/icons/mongodb.svg",
};

function TagItem({ tag }: { tag: string }) {
  const icon = TAG_ICONS[tag];
  if (icon) {
    return (
      <div title={tag} className="flex items-center justify-center">
        <Image
          src={icon}
          alt={tag}
          width={20}
          height={20}
          className="size-5 object-contain"
        />
      </div>
    );
  }
  return <TechTag>{tag}</TechTag>;
}

export function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  const hasLive = project.liveUrl !== "#";
  const hasGithub = project.githubUrl !== "#";

  return (
    <motion.div
      className="flex flex-col overflow-hidden rounded-xl"
      style={{
        backgroundColor: "var(--color-bg-elevated)",
        border: `1px solid ${hovered ? `${ACCENT}70` : "var(--color-border)"}`,
        boxShadow: hovered
          ? `0 22px 44px -12px ${ACCENT}38, 0 0 0 1px ${ACCENT}22, inset 0 1px 0 ${ACCENT}18`
          : "0 2px 8px rgba(0,0,0,0.15)",
        transformPerspective: 800,
        transition: "border-color 0.35s ease, box-shadow 0.35s ease",
      }}
      whileHover={{ y: -4, rotateX: 1.5, rotateY: -1, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Screenshot */}
      <div className="relative aspect-video w-full overflow-hidden bg-bg-hover">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(10,15,30,0.65) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3
          className="text-lg font-semibold text-text transition-colors duration-300"
          style={{ color: hovered ? ACCENT : undefined }}
        >
          {project.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-text-muted">
          {project.description}
        </p>

        {/* Tech icons */}
        <div className="flex flex-wrap items-center gap-3">
          {project.tags.map((tag) => (
            <TagItem key={tag} tag={tag} />
          ))}
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
    </motion.div>
  );
}
