import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { locales, localeConfig, isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { siteUrl, socialLinks } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6EF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : "ar";
  const dict = await getDictionary(lang);
  const title = `${dict.site.name} — ${dict.site.tagline}`;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${dict.site.name}` },
    description: dict.site.description,
    applicationName: "WABEL",
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.ico" },
    openGraph: {
      type: "website",
      siteName: dict.site.name,
      title,
      description: dict.site.description,
      url: `${siteUrl}/${lang}`,
      locale: lang === "ar" ? "ar_SA" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dict.site.description,
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const cfg = localeConfig[lang];
  const dict = await getDictionary(lang);
  const skipLabel = lang === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "WABEL",
        alternateName: "وابل",
        url: siteUrl,
        logo: `${siteUrl}/favicon.ico`,
        description: dict.site.description,
        areaServed: { "@type": "Country", name: "Saudi Arabia" },
        sameAs: socialLinks,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "WABEL",
        inLanguage: ["ar-SA", "en"],
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
