import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default async function HomePage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : "ar";
  const dict = await getDictionary(lang);

  return (
    <main className="container flex min-h-dvh flex-col items-center justify-center gap-8 py-24 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-sand px-4 py-1.5 text-sm font-medium text-carbon">
        <span className="h-2 w-2 rounded-full bg-splash" aria-hidden="true" />
        {dict.site.name}
      </span>
      <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight text-carbon sm:text-5xl md:text-6xl">
        {dict.hero.title}
      </h1>
      <p className="max-w-xl text-pretty text-lg text-steel">{dict.hero.subtitle}</p>
      <Button size="lg">{dict.hero.cta}</Button>
    </main>
  );
}
