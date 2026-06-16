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
      className="space-gradient relative min-h-svh overflow-hidden sm:pt-16"
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

      {/* Full-bleed globe — anchored bottom-right, behind everything */}
      <Globe />

      {/* Bottom dissolve */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[30vh]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(10,15,30,0.75) 100%)",
        }}
      />

      {/* Mobile-only dark scrim — globe bleeds fully behind text on small screens */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] sm:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,13,25,0.82) 0%, rgba(8,13,25,0.70) 60%, rgba(8,13,25,0.20) 100%)",
        }}
      />

      {/* Left-column text content */}
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl items-start px-4 py-10 sm:px-6 sm:py-14 md:items-center md:py-20">
        {/* Desktop scrim so text stays readable over the globe */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-2/3 sm:block md:w-2/3"
          style={{
            background:
              "radial-gradient(ellipse at 0% 50%, rgba(10,15,30,0.55) 0%, transparent 70%)",
          }}
        />

        {/* pointer-events-auto only on the actual text/buttons column */}
        <div className="pointer-events-auto relative flex max-w-[34rem] min-w-0 flex-col items-start pt-8 sm:pt-10 md:-translate-x-4 md:pt-0 lg:-translate-x-8">
          <h1 className="text-4xl font-bold tracking-normal sm:text-5xl md:text-7xl">
            <span
              className="shimmer-text bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #c7d2fe, #a5b4fc, #818cf8, #c7d2fe)",
              }}
            >
              Rama Putra
            </span>
          </h1>
          <p
            className="shimmer-text mt-2 max-w-full bg-clip-text text-3xl font-bold tracking-normal text-balance text-transparent sm:text-5xl md:text-5xl"
            style={{
              backgroundImage: "linear-gradient(90deg,  #6366f1)",
              filter: "drop-shadow(0 0 18px rgba(99,102,241,0.45))",
            }}
          >
            Enterprise Full Stack Developer
          </p>
          <p className="mt-6 max-w-md text-base leading-7 text-text sm:text-lg">
            Build a full-stack Software and Automated solutions. Experienced in
            Enterprise Systems serving 3,500+ users. Turn ideas to reality
            through code.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="#contact" className="w-full sm:w-auto font-medium">
              Contact Me
            </Button>
            <Button
              href="#projects"
              variant="outline"
              className="w-full sm:w-auto font-medium"
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
                icon={<Icon size={label === "Email" ? 23 : 18} />}
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
