import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";

interface HeroProps {
  locale: Locale;
  dict: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    secondaryCta: string;
  };
}

export function Hero({ locale, dict }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Decorative splash glow + falling "rain" streaks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0"
      >
        <div className="absolute inset-x-0 -top-32 mx-auto h-72 w-72 rounded-full bg-splash/20 blur-3xl sm:h-96 sm:w-96" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.07]"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="rain"
              width="34"
              height="34"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(18)"
            >
              <line x1="0" y1="0" x2="0" y2="18" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rain)" />
        </svg>
      </div>

      <div className="container relative z-10 flex flex-col items-center gap-7 py-20 text-center sm:py-28 md:py-32">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-carbon/10 bg-white/60 px-4 py-1.5 text-sm font-semibold text-carbon">
            <Sparkles className="size-4 text-splash" aria-hidden="true" />
            {dict.badge}
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[1.1] text-carbon sm:text-5xl md:text-6xl lg:text-7xl">
            {dict.title}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-steel sm:text-xl">
            {dict.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
            <Button asChild size="lg">
              <a href="#contact">
                {dict.cta}
                <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={`/${locale}/audit`}>{dict.secondaryCta}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;
