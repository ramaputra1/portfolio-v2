import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  hover?: boolean;
  children: ReactNode;
}

export function Card({ hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg-elevated p-5",
        hover && "transition-all hover:border-border-light hover:bg-bg-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
