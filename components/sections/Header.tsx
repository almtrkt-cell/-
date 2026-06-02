"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

interface HeaderProps {
  locale: Locale;
  nav: {
    services: string;
    method: string;
    process: string;
    pricing: string;
    contact: string;
    audit: string;
    cta: string;
    menu: string;
    close: string;
  };
}

const SECTION_LINKS = [
  { key: "services", href: "#services" },
  { key: "method", href: "#method" },
  { key: "process", href: "#process" },
  { key: "pricing", href: "#pricing" },
  { key: "contact", href: "#contact" },
] as const;

export function Header({ locale, nav }: HeaderProps) {
  const [open, setOpen] = React.useState(false);

  // Close on Escape and lock body scroll while the mobile menu is open.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-carbon/10 bg-cream/85 backdrop-blur supports-[backdrop-filter]:bg-cream/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          aria-label="WABEL"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <Logo variant="full" decorative size={26} />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {SECTION_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-carbon/80 transition-colors hover:bg-sand hover:text-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {nav[link.key]}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageToggle locale={locale} />
          <Button asChild size="sm">
            <a href="#contact">{nav.cta}</a>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle locale={locale} />
          <button
            type="button"
            aria-label={open ? nav.close : nav.menu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-carbon/15 text-carbon transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream [touch-action:manipulation]"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-carbon/10 bg-cream lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="container flex flex-col gap-1 py-4"
          >
            {SECTION_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-carbon hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {nav[link.key]}
              </a>
            ))}
            <a
              href="/audit"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-splash hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {nav.audit}
            </a>
            <Button asChild className="mt-2 w-full">
              <a href="#contact" onClick={() => setOpen(false)}>
                {nav.cta}
              </a>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
