import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm, type ContactFormDict } from "@/components/sections/ContactForm";

interface ContactProps {
  heading: string;
  subheading: string;
  form: ContactFormDict;
  services: string[];
}

export function Contact({ heading, subheading, form, services }: ContactProps) {
  return (
    <section id="contact" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          <SectionHeading
            title={heading}
            subtitle={subheading}
            align="start"
            className="lg:sticky lg:top-24"
          />
          <div className="rounded-3xl border border-carbon/10 bg-sand/30 p-6 sm:p-8">
            <ContactForm form={form} services={services} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
