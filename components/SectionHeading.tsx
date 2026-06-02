import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const heading = tone === "dark" ? "text-cream" : "text-carbon";
  const sub = tone === "dark" ? "text-cream/70" : "text-steel";

  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-start",
        className
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-splash/10 px-3.5 py-1.5 text-sm font-semibold text-splash">
          <span className="h-1.5 w-1.5 rounded-full bg-splash" aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "text-balance text-3xl font-bold leading-tight sm:text-4xl md:text-[2.75rem]",
          heading
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={cn("text-pretty text-lg leading-relaxed", sub)}>{subtitle}</p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
