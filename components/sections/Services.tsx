import * as React from "react";
import {
  Megaphone,
  Target,
  Cpu,
  Code,
  Smartphone,
  Palette,
  Clapperboard,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

type IconType = React.ComponentType<{ className?: string }>;

const ICONS: Record<string, IconType> = {
  "digital-marketing": Megaphone,
  "paid-ads": Target,
  "tech-systems": Cpu,
  "web-dev": Code,
  "app-dev": Smartphone,
  branding: Palette,
  media: Clapperboard,
};

interface ServicesProps {
  heading: string;
  subheading: string;
  items: { id: string; title: string; description: string }[];
}

export function Services({ heading, subheading, items }: ServicesProps) {
  return (
    <section id="services" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <div className="container flex flex-col gap-12">
        <SectionHeading title={heading} subtitle={subheading} />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, i) => {
            const Icon = ICONS[service.id] ?? Megaphone;
            return (
              <Reveal key={service.id} delay={(i % 3) * 0.06}>
                <li className="group h-full rounded-2xl border border-carbon/10 bg-white p-6 transition-transform duration-200 ease-wabel hover:-translate-y-1 hover:shadow-soft">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-splash/10 text-splash transition-colors group-hover:bg-splash group-hover:text-white">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-carbon">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-pretty leading-relaxed text-steel">
                    {service.description}
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Services;
