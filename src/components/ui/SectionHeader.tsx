import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
  title: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  align = "left",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(align === "center" ? "text-center" : "text-left", className)}
      {...props}
    >
      <p className="text-sm font-semibold tracking-widest text-primary-light uppercase">
        {label}
      </p>
      <h2 className="mt-2 text-3xl font-bold text-text md:text-4xl">{title}</h2>
    </div>
  );
}
