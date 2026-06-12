import type { LucideIcon } from "lucide-react";

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
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
  icon: LucideIcon;
}
