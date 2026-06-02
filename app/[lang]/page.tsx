import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";

export default async function HomePage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : "ar";
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-dvh">
      <header className="container flex items-center justify-between py-5">
        <Logo variant="full" mode="light" size={28} />
        <LanguageToggle locale={lang} />
      </header>

      <main className="container flex flex-col items-center justify-center gap-8 py-20 text-center sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full bg-sand px-4 py-1.5 text-sm font-medium text-carbon">
          <span className="h-2 w-2 rounded-full bg-splash" aria-hidden="true" />
          {dict.site.name}
        </span>
        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight text-carbon sm:text-5xl md:text-6xl">
          {dict.hero.title}
        </h1>
        <p className="max-w-xl text-pretty text-lg text-steel">
          {dict.hero.subtitle}
        </p>
        <Button size="lg">{dict.hero.cta}</Button>

        {/* Phase 2 verification: logo variants in both light and dark contexts. */}
        <section className="mt-12 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-cream p-8 shadow-soft">
            <Logo variant="mark" mode="light" size={44} />
            <Logo variant="wordmark" mode="light" size={26} />
          </div>
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-carbon p-8">
            <Logo variant="mark" mode="dark" size={44} />
            <Logo variant="wordmark" mode="dark" size={26} />
          </div>
        </section>
      </main>
    </div>
  );
}
