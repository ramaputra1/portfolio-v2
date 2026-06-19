import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TechTagProps extends ComponentPropsWithoutRef<"span"> {
  children: ReactNode;
}

export function TechTag({ className, children, ...props }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-border px-3 py-1 text-xs text-text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
