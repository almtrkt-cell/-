import "server-only";
import type { Locale } from "./i18n";

// Server-only dictionary loaders. Content lives in /content/{ar,en}.
const dictionaries = {
  ar: () => import("@/content/ar/common.json").then((m) => m.default),
  en: () => import("@/content/en/common.json").then((m) => m.default),
} as const;

// The English dictionary is the canonical shape; Arabic mirrors it 1:1.
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = dictionaries[locale] ?? dictionaries.ar;
  return load() as Promise<Dictionary>;
}
