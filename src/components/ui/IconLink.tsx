import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon: ReactNode;
  label: string;
  external?: boolean;
}

export function IconLink({
  href,
  icon,
  label,
  external = false,
  className,
  ...props
}: IconLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap text-text-muted transition-colors hover:text-text",
        className,
      )}
      {...props}
      target={external ? "_blank" : props.target}
      rel={external ? "noopener noreferrer" : props.rel}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
