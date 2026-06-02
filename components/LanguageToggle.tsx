"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  type Locale,
  getOppositeLocale,
  localeConfig,
  localizePath,
  persistLocale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Localized "switch to <other language>" labels for the accessible name.
const SWITCH_ARIA: Record<Locale, string> = {
  en: "Switch to English",
  ar: "التبديل إلى العربية",
};

interface LanguageToggleProps {
  locale: Locale;
  className?: string;
}

export function LanguageToggle({ locale, className }: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const target = getOppositeLocale(locale);

  const switchLanguage = React.useCallback(() => {
    persistLocale(target);
    router.push(localizePath(pathname || `/${locale}`, target));
  }, [router, pathname, target, locale]);

  return (
    <motion.button
      type="button"
      onClick={switchLanguage}
      aria-label={SWITCH_ARIA[target]}
      lang={target}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-carbon/15 bg-transparent px-3.5 py-2 text-sm font-medium text-carbon",
        "transition-colors duration-200 ease-wabel hover:bg-sand",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "[touch-action:manipulation] [-webkit-tap-highlight-color:transparent]",
        className
      )}
    >
      <Globe className="size-4 shrink-0" aria-hidden="true" />
      <span dir={localeConfig[target].dir}>{localeConfig[target].label}</span>
    </motion.button>
  );
}

export default LanguageToggle;
