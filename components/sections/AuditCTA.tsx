import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";

interface AuditCTAProps {
  locale: Locale;
  badge: string;
  heading: string;
  subheading: string;
  bullets: string[];
  cta: string;
  note: string;
}

export function AuditCTA({
  locale,
  badge,
  heading,
  subheading,
  bullets,
  cta,
  note,
}: AuditCTAProps) {
  return (
    <section id="audit-cta" className="bg-cream py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-carbon px-6 py-14 text-cream sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-splash/20 blur-3xl"
            />
            <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-splash/15 px-3.5 py-1.5 text-sm font-semibold text-splash">
                {badge}
              </span>
              <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl md:text-[2.75rem]">
                {heading}
              </h2>
              <p className="text-pretty text-lg leading-relaxed text-cream/75">
                {subheading}
              </p>

              <ul className="grid w-full gap-3 text-start sm:grid-cols-2">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 size-5 shrink-0 text-splash"
                      aria-hidden="true"
                    />
                    <span className="text-pretty leading-relaxed text-cream/85">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>

              <Button asChild size="lg" className="mt-2">
                <Link href={`/${locale}/audit`}>
                  {cta}
                  <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
                </Link>
              </Button>
              <p className="text-sm text-cream/60">{note}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default AuditCTA;
