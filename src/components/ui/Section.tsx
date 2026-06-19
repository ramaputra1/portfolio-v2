import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
}

export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24", className)}
      {...props}
    >
      {children}
    </section>
  );
}
