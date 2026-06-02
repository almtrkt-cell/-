import * as React from "react";
import { cn } from "@/lib/utils";

type LogoVariant = "full" | "mark" | "wordmark";
/** `mode` describes the background the logo sits on. */
type LogoMode = "light" | "dark";

interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: LogoVariant;
  mode?: LogoMode;
  /** Pixel height of the lockup; the mark scales to match. */
  size?: number;
  /** Decorative when the logo is wrapped by a labelled link. */
  decorative?: boolean;
}

const SPLASH = "#FF5436";

function Mark({
  ink,
  size,
  title,
}: {
  ink: string;
  size: number;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className="shrink-0"
    >
      {title ? <title>{title}</title> : null}
      {/* Faint rain streaks behind the mark. */}
      <path
        d="M11 4 L9 12 M29 4 L31 12"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* The W, drawn as a single zigzag "downpour" stroke. */}
      <path
        d="M4 9.5 L13 31 L20 17 L27 31 L36 9.5"
        fill="none"
        stroke={ink}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* The splash droplet. */}
      <circle cx="20" cy="9.2" r="2.7" fill={SPLASH} />
    </svg>
  );
}

export function Logo({
  variant = "full",
  mode = "light",
  size = 28,
  decorative = false,
  className,
  ...props
}: LogoProps) {
  const ink = mode === "dark" ? "#FAF6EF" : "#0A0A0A";
  const accessibleName = decorative ? undefined : "WABEL";

  const wordmark = (
    <span
      dir="ltr"
      className="font-en font-bold tracking-tight"
      style={{ color: ink, fontSize: size * 0.86, lineHeight: 1 }}
    >
      WABE<span style={{ color: SPLASH }}>L</span>
    </span>
  );

  if (variant === "mark") {
    return (
      <span
        className={cn("inline-flex items-center", className)}
        {...props}
      >
        <Mark ink={ink} size={size} title={accessibleName} />
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span
        className={cn("inline-flex items-center", className)}
        aria-label={accessibleName}
        role={decorative ? undefined : "img"}
        {...props}
      >
        {decorative ? (
          wordmark
        ) : (
          <span aria-hidden="true">{wordmark}</span>
        )}
      </span>
    );
  }

  // full lockup: mark + wordmark, forced LTR so the logo never mirrors in RTL.
  return (
    <span
      dir="ltr"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label={accessibleName}
      role={decorative ? undefined : "img"}
      {...props}
    >
      <Mark ink={ink} size={size} />
      <span aria-hidden={!decorative}>{wordmark}</span>
    </span>
  );
}

export default Logo;
