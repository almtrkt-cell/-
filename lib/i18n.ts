export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const LOCALE_COOKIE = "NEXT_LOCALE";

type LocaleMeta = {
  dir: "rtl" | "ltr";
  htmlLang: string;
  /** Native name of the language, shown on the toggle. */
  label: string;
  /** Native name of the *other* language the toggle switches to. */
  switchLabel: string;
};

export const localeConfig: Record<Locale, LocaleMeta> = {
  ar: { dir: "rtl", htmlLang: "ar-SA", label: "العربية", switchLabel: "English" },
  en: { dir: "ltr", htmlLang: "en", label: "English", switchLabel: "العربية" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function getOppositeLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/**
 * Swap the locale segment of a pathname (e.g. /ar/services -> /en/services).
 * Falls back to the locale root when no segment is present.
 */
export function localizePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    segments[1] = target;
    return segments.join("/") || "/";
  }
  return `/${target}${pathname === "/" ? "" : pathname}`;
}

/* --- Client-side persistence (guarded so this file stays server-safe) --- */

export function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(LOCALE_COOKIE);
  return isLocale(stored) ? stored : null;
}

export function persistLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_COOKIE, locale);
  // One-year cookie so middleware can honor the choice on the bare "/" route.
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
