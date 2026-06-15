import Image from "next/image";
import {
  GraduationCap,
  Briefcase,
  Code2,
  GitBranch,
  Layers,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui";
import { InfoCard } from "./InfoCard";
import { ContribGraph } from "./ContribGraph";
import { bio, education, experience, skills, techStack } from "@/data/skills";
import { getGitHubStats } from "@/lib/github";

export async function About() {
  const gh = await getGitHubStats();
  return (
    <div className="space-gradient relative overflow-hidden">
      {/* Stars — matching Hero aesthetic */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[
          "left-[5%] top-[8%] size-1 opacity-40",
          "left-[14%] top-[55%] size-0.5 opacity-30",
          "left-[28%] top-[18%] size-1 opacity-50",
          "left-[50%] top-[6%] size-0.5 opacity-30",
          "left-[62%] top-[72%] size-1 opacity-40",
          "left-[75%] top-[33%] size-1.5 opacity-20",
          "right-[8%] top-[12%] size-1 opacity-50",
          "right-[18%] top-[60%] size-0.5 opacity-40",
          "right-[32%] top-[88%] size-1 opacity-30",
          "right-[5%] bottom-[20%] size-1.5 opacity-20",
          "left-[40%] bottom-[15%] size-0.5 opacity-40",
          "left-[88%] top-[48%] size-1 opacity-30",
        ].map((cls) => (
          <span
            key={cls}
            className={`absolute rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.5)] ${cls}`}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-1 h-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,15,30,0.9) 0%, transparent 100%)",
        }}
      />
      <Section id="about">
        <SectionHeader label="ABOUT ME" title="Get to know me better" />

        {/* Profile photo + bio */}
        <div className="mt-12 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full ring-2 ring-border-light">
            <Image
              src="/images/profile.png"
              alt="Rama Putra"
              fill
              className="object-cover scale-125 translate-y-2.5"
              priority
            />
          </div>
          <p className="text-base leading-7 text-text-muted sm:pt-2">{bio}</p>
        </div>

        {/* Card grid */}
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Education */}
          <InfoCard
            color="#06b6d4"
            icon={<GraduationCap size={18} />}
            title="Education"
          >
            <p className="font-bold text-text">{education.primary}</p>
            <p>{education.secondary}</p>
            <p>{education.tertiary}</p>
          </InfoCard>

          {/* Experience */}
          <InfoCard
            color="#3b82f6"
            icon={<Briefcase size={18} />}
            title="Experience"
          >
            <p className="font-bold text-text">{experience.primary}</p>
            <p>{experience.secondary}</p>
            <p>{experience.tertiary}</p>
          </InfoCard>

          {/* Skills */}
          <InfoCard color="#22c55e" icon={<Code2 size={18} />} title="Skills">
            {skills.map((s) => (
              <p key={s}>{s}</p>
            ))}
          </InfoCard>

          {/* GitHub + Tech Stack — merged, full-width */}
          <InfoCard
            color="#a855f7"
            icon={<GitBranch size={18} />}
            title="GitHub Stats"
            href="https://github.com/ramaputra1"
            className="md:col-span-2 lg:col-span-3"
            bodyClassName="flex flex-col gap-4 sm:flex-row sm:items-start"
          >
            {/* Left: GitHub info + heatmap */}
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {/* Profile info */}
              <div className="text-sm">
                <p className="text-text-muted">@ramaputra1</p>
                <p className="mt-1 text-text-muted">
                  {gh.contributions.reduce((sum, c) => sum + c.count, 0)}{" "}
                  contributions in the last year
                </p>
              </div>
              {/* Contribution heatmap */}
              <ContribGraph contributions={gh.contributions} />
            </div>

            {/* Right: Tech Stack */}
            <div className="shrink-0 sm:w-80">
              <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-text">
                <Layers size={14} />
                Tech Stack
              </div>
              <div className="flex flex-wrap gap-3">
                {techStack.map(({ name, icon }) => (
                  <div
                    key={name}
                    title={name}
                    className="transition-transform hover:scale-110"
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </InfoCard>
        </div>
      </Section>
    </div>
  );
}
