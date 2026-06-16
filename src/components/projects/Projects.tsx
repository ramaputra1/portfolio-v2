import { Section, SectionHeader } from "@/components/ui";
import { ProjectCarousel } from "./ProjectCarousel";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <div className="space-gradient relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-1 h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,15,30,0.85) 0%, transparent 100%)",
        }}
      />
      <Section id="projects">
        <SectionHeader label="PROJECTS" title="Things I've built" />
        <ProjectCarousel projects={projects} />
      </Section>
    </div>
  );
}
