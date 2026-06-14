import type { ReactNode } from "react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}

export function InfoCard({ icon, title, children, className }: InfoCardProps) {
  return (
    <Card className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2">
        <span className="text-primary-light">{icon}</span>
        <h3 className="font-bold text-text">{title}</h3>
      </div>
      <div className="space-y-1 text-sm text-text-muted">{children}</div>
    </Card>
  );
}
