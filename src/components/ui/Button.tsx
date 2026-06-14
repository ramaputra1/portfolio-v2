import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "filled" | "outline";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

type ButtonAsAnchorProps = ButtonBaseProps & {
  href: string;
  download?: AnchorHTMLAttributes<HTMLAnchorElement>["download"];
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type ButtonAsButtonProps = ButtonBaseProps & {
  href?: undefined;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type ButtonProps = ButtonAsAnchorProps | ButtonAsButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  filled: "bg-white text-slate-900 hover:bg-slate-300",
  outline:
    "border border-slate-600 text-white hover:border-white hover:bg-white/5",
};

export function Button(props: ButtonProps) {
  const { variant = "filled", icon, children, className } = props;
  const buttonClassName = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
    variantClasses[variant],
    className,
  );

  if (typeof props.href === "string") {
    return (
      <a
        href={props.href}
        download={props.download}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        aria-label={props["aria-label"]}
        className={buttonClassName}
      >
        <span>{children}</span>
        {icon}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={props["aria-label"]}
      className={buttonClassName}
    >
      <span>{children}</span>
      {icon}
    </button>
  );
}
