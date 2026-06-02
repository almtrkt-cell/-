import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, localeConfig, isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : "ar";
  const dict = await getDictionary(lang);
  return {
    title: {
      default: `${dict.site.name} — ${dict.site.tagline}`,
      template: `%s · ${dict.site.name}`,
    },
    description: dict.site.description,
  };
}

export default function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  if (!isLocale(params.lang)) notFound();
  const cfg = localeConfig[params.lang];
  const skipLabel =
    params.lang === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content";

  return (
    <html
      lang={cfg.htmlLang}
      dir={cfg.dir}
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-3 focus:rounded-lg focus:bg-carbon focus:px-4 focus:py-2 focus:text-cream focus:outline-none focus:ring-2 focus:ring-splash"
        >
          {skipLabel}
        </a>
        {children}
      </body>
    </html>
  );
}
