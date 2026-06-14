import Image from "next/image";
import {
  GraduationCap,
  Briefcase,
  Code2,
  Award,
  GitBranch,
  Layers,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui";
import { InfoCard } from "./InfoCard";
import {
  bio,
  education,
  experience,
  skills,
  certificates,
  githubStats,
  techStack,
} from "@/data/skills";

export function About() {
  return (
    <div className="space-gradient relative">
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
          <InfoCard icon={<GraduationCap size={18} />} title="Education">
            <p className="font-bold text-text">{education.primary}</p>
            <p>{education.secondary}</p>
            <p>{education.tertiary}</p>
          </InfoCard>

          {/* Experience */}
          <InfoCard icon={<Briefcase size={18} />} title="Experience">
            <p className="font-bold text-text">{experience.primary}</p>
            <p>{experience.secondary}</p>
            <p>{experience.tertiary}</p>
          </InfoCard>

          {/* Skills */}
          <InfoCard icon={<Code2 size={18} />} title="Skills">
            {skills.map((s) => (
              <p key={s}>{s}</p>
            ))}
          </InfoCard>

          {/* Certificates */}
          <InfoCard icon={<Award size={18} />} title="Certificates">
            {certificates.map((c) => (
              <p key={c}>{c}</p>
            ))}
          </InfoCard>

          {/* GitHub Stats */}
          <InfoCard icon={<GitBranch size={18} />} title="GitHub Stats">
            {githubStats.map((g) => (
              <p key={g}>{g}</p>
            ))}
          </InfoCard>

          {/* Tech Stack */}
          <InfoCard icon={<Layers size={18} />} title="Tech Stack">
            <div className="flex flex-wrap gap-3 pt-1">
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
          </InfoCard>
        </div>
      </Section>
    </div>
  );
}
