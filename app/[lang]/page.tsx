import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { Services } from "@/components/sections/Services";
import { Methodology } from "@/components/sections/Methodology";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/Pricing";
import { AuditCTA } from "@/components/sections/AuditCTA";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default async function HomePage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : "ar";
  const dict = await getDictionary(lang);
  const serviceTitles = dict.services.items.map((s) => s.title);

  return (
    <>
      <Header locale={lang} nav={dict.nav} />
      <main id="main">
        <Hero locale={lang} dict={dict.hero} />
        <StatsBar items={dict.stats.items} />
        <Services
          heading={dict.services.heading}
          subheading={dict.services.subheading}
          items={dict.services.items}
        />
        <Methodology
          heading={dict.methodology.heading}
          subheading={dict.methodology.subheading}
          ai={dict.methodology.ai}
          human={dict.methodology.human}
        />
        <Process
          heading={dict.process.heading}
          subheading={dict.process.subheading}
          steps={dict.process.steps}
        />
        <Pricing
          locale={lang}
          heading={dict.pricing.heading}
          subheading={dict.pricing.subheading}
          currency={dict.pricing.currency}
          period={dict.pricing.period}
          popularLabel={dict.pricing.popularLabel}
          ctaLabel={dict.pricing.ctaLabel}
          tiers={dict.pricing.tiers}
        />
        <AuditCTA
          locale={lang}
          badge={dict.audit.badge}
          heading={dict.audit.heading}
          subheading={dict.audit.subheading}
          bullets={dict.audit.bullets}
          cta={dict.audit.cta}
          note={dict.audit.note}
        />
        <Contact
          heading={dict.contact.heading}
          subheading={dict.contact.subheading}
          form={dict.contact.form}
          services={serviceTitles}
        />
        <Footer
          locale={lang}
          siteName={dict.site.name}
          services={dict.services.items}
          dict={dict.footer}
        />
      </main>
    </>
  );
}
