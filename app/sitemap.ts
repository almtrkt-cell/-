import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/audit", priority: 0.8 },
  ];

  return paths.flatMap(({ path, priority }) => {
    const languages = {
      ar: `${siteUrl}/ar${path}`,
      en: `${siteUrl}/en${path}`,
      "x-default": `${siteUrl}/ar${path}`,
    };
    return (["ar", "en"] as const).map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
