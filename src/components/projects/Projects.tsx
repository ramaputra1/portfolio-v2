import { Section, SectionHeader } from "@/components/ui";
import { ProjectCarousel } from "./ProjectCarousel";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <div className="space-gradient relative overflow-hidden">
      {/* Stars */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[
          "left-[3%] top-[5%] size-1 opacity-40",
          "left-[12%] top-[40%] size-0.5 opacity-30",
          "left-[22%] top-[15%] size-1 opacity-50",
          "left-[38%] top-[70%] size-0.5 opacity-35",
          "left-[55%] top-[8%] size-1 opacity-30",
          "left-[68%] top-[55%] size-1.5 opacity-20",
          "left-[80%] top-[25%] size-1 opacity-45",
          "left-[90%] top-[78%] size-0.5 opacity-30",
          "right-[6%] top-[10%] size-1 opacity-50",
          "right-[20%] top-[62%] size-0.5 opacity-40",
          "right-[35%] top-[88%] size-1 opacity-25",
          "left-[47%] top-[33%] size-0.5 opacity-40",
          "left-[74%] top-[90%] size-1 opacity-30",
          "right-[12%] top-[45%] size-1.5 opacity-20",
        ].map((cls) => (
          <span
            key={cls}
            className={`absolute rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.5)] ${cls}`}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-1 h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,15,30,0.85) 0%, transparent 100%)",
        }}
      />
      <Section id="projects">
        <SectionHeader label="PROJECTS" title="Things I Have Built" />
        <ProjectCarousel projects={projects} />
      </Section>
    </div>
  );
}
