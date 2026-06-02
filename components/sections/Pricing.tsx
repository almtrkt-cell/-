import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

interface Tier {
  id: string;
  name: string;
  price: number;
  priceSuffix: string;
  description: string;
  features: string[];
}

interface PricingProps {
  locale: Locale;
  heading: string;
  subheading: string;
  currency: string;
  period: string;
  popularLabel: string;
  ctaLabel: string;
  tiers: Tier[];
}

export function Pricing({
  locale,
  heading,
  subheading,
  currency,
  period,
  popularLabel,
  ctaLabel,
  tiers,
}: PricingProps) {
  const numberFormat = new Intl.NumberFormat(
    locale === "ar" ? "ar-SA" : "en-US",
    {
      numberingSystem: locale === "ar" ? "arab" : "latn",
      maximumFractionDigits: 0,
    }
  );

  return (
    <section id="pricing" className="scroll-mt-20 bg-sand/40 py-20 sm:py-28">
      <div className="container flex flex-col gap-12">
        <SectionHeading title={heading} subtitle={subheading} />

        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => {
            const popular = tier.id === "flood";
            return (
              <Reveal key={tier.id} delay={i * 0.08}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl p-8 sm:p-9",
                    popular
                      ? "bg-carbon text-cream shadow-soft ring-2 ring-splash"
                      : "border border-carbon/10 bg-white text-carbon"
                  )}
                >
                  {popular ? (
                    <span className="absolute -top-3 start-8 inline-flex items-center rounded-full bg-splash px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      {popularLabel}
                    </span>
                  ) : null}

                  <h3
                    className={cn(
                      "text-xl font-bold",
                      popular ? "text-cream" : "text-carbon"
                    )}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      popular ? "text-cream/70" : "text-steel"
                    )}
                  >
                    {tier.description}
                  </p>

                  <div className="mt-6 flex items-end gap-1.5">
                    <span className="text-4xl font-bold tabular-nums sm:text-5xl">
                      {numberFormat.format(tier.price)}
                      {tier.priceSuffix}
                    </span>
                    <span
                      className={cn(
                        "pb-1.5 text-sm",
                        popular ? "text-cream/70" : "text-steel"
                      )}
                    >
                      {currency} {period}
                    </span>
                  </div>

                  <ul className="mt-8 flex flex-1 flex-col gap-3.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          className={cn(
                            "mt-0.5 size-5 shrink-0",
                            popular ? "text-splash" : "text-splash"
                          )}
                          aria-hidden="true"
                        />
                        <span
                          className={cn(
                            "text-pretty leading-relaxed",
                            popular ? "text-cream/85" : "text-carbon/80"
                          )}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant={popular ? "default" : "outline"}
                    className="mt-8 w-full"
                  >
                    <a href="#contact">{ctaLabel}</a>
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
