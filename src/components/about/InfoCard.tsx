"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  color?: string;
  href?: string;
  headerRight?: ReactNode;
}

export function InfoCard({
  icon,
  title,
  children,
  className,
  bodyClassName,
  color = "#3b82f6",
  href,
  headerRight,
}: InfoCardProps) {
  const [hovered, setHovered] = useState(false);

  const Tag = href ? motion.a : motion.div;

  return (
    <Tag
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "flex flex-col gap-3 rounded-xl p-5",
        href && "cursor-pointer",
        className,
      )}
      style={{
        backgroundColor: "var(--color-bg-elevated)",
        border: `1px solid ${hovered ? `${color}70` : "var(--color-border)"}`,
        boxShadow: hovered
          ? `0 22px 44px -12px ${color}38, 0 0 0 1px ${color}22, inset 0 1px 0 ${color}18`
          : "0 2px 8px rgba(0,0,0,0.15)",
        transformPerspective: 700,
        transition: "border-color 0.35s ease, box-shadow 0.35s ease",
      }}
      whileHover={{ y: -1, rotateX: 0.5, rotateY: -0.3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div className="flex items-center gap-2">
        <span
          style={{
            color: hovered ? color : "var(--color-primary-light)",
            transition: "color 0.35s ease",
            filter: hovered ? `drop-shadow(0 0 6px ${color}80)` : "none",
          }}
        >
          {icon}
        </span>
        <h3
          className="font-bold text-text"
          style={{
            color: hovered ? color : undefined,
            transition: "color 0.35s ease",
          }}
        >
          {title}
        </h3>
        {headerRight && <div>{headerRight}</div>}
      </div>
      <div className={cn("space-y-1 text-sm text-text-muted", bodyClassName)}>
        {children}
      </div>
    </Tag>
  );
}
