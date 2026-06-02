import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

interface ProcessProps {
  heading: string;
  subheading: string;
  steps: { number: string; title: string; description: string }[];
}

export function Process({ heading, subheading, steps }: ProcessProps) {
  return (
    <section id="process" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <div className="container flex flex-col gap-12">
        <SectionHeading title={heading} subtitle={subheading} />

        <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={(i % 5) * 0.06}>
              <li className="relative flex h-full flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-splash tabular-nums">
                    {step.number}
                  </span>
                  <span
                    className="h-px flex-1 bg-gradient-to-r from-splash/40 to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg font-bold text-carbon">{step.title}</h3>
                <p className="text-pretty text-sm leading-relaxed text-steel">
                  {step.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Process;
