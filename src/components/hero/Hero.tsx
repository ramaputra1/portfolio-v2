import { ArrowRight } from "lucide-react";
import { socials } from "@/data/social";
import { Button, IconLink } from "@/components/ui";
import { Globe } from "./Globe";

const stars = [
  "left-[9%] top-[18%] size-1 opacity-50",
  "left-[18%] top-[72%] size-0.5 opacity-40",
  "left-[32%] top-[24%] size-1 opacity-30",
  "left-[42%] top-[84%] size-1.5 opacity-20",
  "right-[44%] top-[14%] size-0.5 opacity-50",
  "right-[26%] top-[28%] size-1 opacity-40",
  "right-[11%] top-[68%] size-0.5 opacity-50",
  "right-[6%] top-[18%] size-1.5 opacity-20",
  "left-[7%] bottom-[13%] size-1 opacity-30",
  "right-[36%] bottom-[9%] size-1 opacity-30",
];

export function Hero() {
  return (
    <section
      id="home"
      className="space-gradient relative min-h-screen overflow-hidden pt-16"
    >
      {/* Stars */}
      <div aria-hidden="true" className="absolute inset-0">
        {stars.map((star) => (
          <span
            key={star}
            className={`absolute rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.5)] ${star}`}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-44 bg-linear-to-b from-transparent via-bg/65 to-bg"
      />

      {/* Full-bleed globe — anchored bottom-right, behind everything */}
      <Globe />

      {/* Left-column text content */}
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-6 py-14 md:py-20">
        {/* Subtle scrim so text stays readable over the globe */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-2/3"
          style={{
            background:
              "radial-gradient(ellipse at 0% 50%, rgba(10,15,30,0.55) 0%, transparent 70%)",
          }}
        />

        {/* pointer-events-auto only on the actual text/buttons column */}
        <div className="pointer-events-auto relative flex flex-col items-start md:-translate-x-4 lg:-translate-x-8">
          <h1 className="text-5xl font-bold tracking-normal text-text md:text-7xl">
            Rama Putra
          </h1>
          <p className="mt-2 bg-linear-to-r from-primary to-primary-light bg-clip-text text-5xl font-bold tracking-normal text-transparent md:text-6xl">
            Full Stack Developer
          </p>
          <p className="mt-6 max-w-md text-base leading-7 text-text-muted sm:text-lg">
            I build scalable web applications, design intuitive user
            experiences, and solve problems with clean code.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact" icon={<ArrowRight size={16} />}>
              Contact Me
            </Button>
            <Button
              href="#projects"
              variant="outline"
              icon={<ArrowRight size={16} />}
            >
              View Projects
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <IconLink
                key={label}
                href={href}
                label={label}
                icon={<Icon size={18} />}
                external={href.startsWith("https://")}
                className="text-sm font-medium"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
