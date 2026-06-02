import { Reveal } from "@/components/Reveal";

interface StatsBarProps {
  items: { value: string; label: string }[];
}

export function StatsBar({ items }: StatsBarProps) {
  return (
    <section className="bg-carbon text-cream">
      <div className="container grid gap-10 py-14 sm:grid-cols-3 sm:py-16">
        {items.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-5xl font-bold leading-none text-splash tabular-nums sm:text-6xl">
                {stat.value}
              </span>
              <span className="max-w-[16rem] text-pretty text-sm leading-relaxed text-cream/70">
                {stat.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default StatsBar;
