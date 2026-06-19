import type { ComponentType } from "react";

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  type: string;  // e.g. "Web App" | "Design" | "Tool" — edit in src/data/projects.ts
  date: string;  // ISO "YYYY-MM-DD" — used for date sort
  liveUrl: string;
  githubUrl: string;
}

export interface TechItem {
  name: string;
  icon: string;
}

export interface InfoBlock {
  primary: string;
  secondary?: string;
  tertiary?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}
