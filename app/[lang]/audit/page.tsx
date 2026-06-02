import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { AuditForm } from "@/components/audit/AuditForm";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : "ar";
  const dict = await getDictionary(lang);
  return {
    title: dict.auditTool.title,
    description: dict.auditTool.subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}/audit`,
      languages: {
        ar: `${siteUrl}/ar/audit`,
        en: `${siteUrl}/en/audit`,
        "x-default": `${siteUrl}/ar/audit`,
      },
    },
  };
}

export default async function AuditPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : "ar";
  const dict = await getDictionary(lang);
  const t = dict.auditTool;

  return (
    <>
      <Header locale={lang} nav={dict.nav} />
      <main id="main" className="bg-cream">
        <section className="container grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-splash/10 px-3.5 py-1.5 text-sm font-semibold text-splash">
              <span className="h-1.5 w-1.5 rounded-full bg-splash" aria-hidden="true" />
              {t.badge}
            </span>
            <h1 className="text-balance text-3xl font-bold leading-tight text-carbon sm:text-4xl md:text-5xl">
              {t.title}
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-steel">
              {t.subtitle}
            </p>
            <ul className="flex flex-col gap-3">
              {dict.audit.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-splash" aria-hidden="true" />
                  <span className="text-pretty leading-relaxed text-carbon/80">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <AuditForm
            locale={lang}
            dict={{ form: t.form, loading: t.loading, errors: t.errors }}
          />
        </section>
      </main>
      <Footer
        locale={lang}
        siteName={dict.site.name}
        services={dict.services.items}
        dict={dict.footer}
      />
    </>
  );
}
