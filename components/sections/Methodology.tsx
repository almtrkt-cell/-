import { Check, Cpu, Users } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

interface MethodologyProps {
  heading: string;
  subheading: string;
  ai: { title: string; points: string[] };
  human: { title: string; points: string[] };
}

function PointList({
  points,
  tone,
}: {
  points: string[];
  tone: "dark" | "light";
}) {
  const checkBg = tone === "dark" ? "bg-splash text-white" : "bg-carbon text-cream";
  const text = tone === "dark" ? "text-cream/80" : "text-carbon/80";
  return (
    <ul className="mt-6 flex flex-col gap-4">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-3">
          <span
            className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ${checkBg}`}
            aria-hidden="true"
          >
            <Check className="size-3.5" />
          </span>
          <span className={`text-pretty leading-relaxed ${text}`}>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export function Methodology({ heading, subheading, ai, human }: MethodologyProps) {
  return (
    <section id="method" className="scroll-mt-20 bg-sand/40 py-20 sm:py-28">
      <div className="container flex flex-col gap-12">
        <SectionHeading title={heading} subtitle={subheading} />

        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-3xl bg-carbon p-8 text-cream sm:p-10">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-splash/15 text-splash">
                <Cpu className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl font-bold">{ai.title}</h3>
              <PointList points={ai.points} tone="dark" />
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="h-full rounded-3xl border border-carbon/10 bg-white p-8 sm:p-10">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-splash/10 text-splash">
                <Users className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl font-bold text-carbon">{human.title}</h3>
              <PointList points={human.points} tone="light" />
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Methodology;
