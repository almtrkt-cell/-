import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { AuditResults } from "@/components/audit/AuditResults";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : "ar";
  const dict = await getDictionary(lang);
  return {
    title: dict.auditTool.results.eyebrow,
    // Results are user-specific and client-rendered — keep them out of the index.
    robots: { index: false, follow: true },
  };
}

export default async function AuditResultsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : "ar";
  const dict = await getDictionary(lang);

  return (
    <>
      <Header locale={lang} nav={dict.nav} />
      <main id="main" className="bg-cream">
        <AuditResults
          locale={lang}
          results={dict.auditTool.results}
          empty={dict.auditTool.empty}
        />
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
