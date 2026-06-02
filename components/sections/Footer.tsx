import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { Locale } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  siteName: string;
  services: { id: string; title: string }[];
  dict: {
    tagline: string;
    servicesTitle: string;
    companyTitle: string;
    companyLinks: { label: string; href: string }[];
    social: { label: string; id: string; href: string }[];
    rights: string;
    madeIn: string;
  };
}

function SocialIcon({ id }: { id: string }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 18,
    height: 18,
    "aria-hidden": true as const,
    focusable: "false" as const,
  };
  switch (id) {
    case "x":
      return (
        <svg {...common} fill="currentColor">
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12L17.08 19.77Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common} fill="currentColor">
          <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.93a2.59 2.59 0 1 1-1.84-2.48V9.6a5.85 5.85 0 1 0 4.4 5.66V9.01a7.45 7.45 0 0 0 4.35 1.39V7.2a4.28 4.28 0 0 1-2.65-1.38Z" />
        </svg>
      );
    default:
      return null;
  }
}

export function Footer({ locale, siteName, services, dict }: FooterProps) {
  const year = new Date().getFullYear();
  const resolveHref = (href: string) =>
    href.startsWith("/") ? `/${locale}${href}` : href;

  return (
    <footer className="bg-carbon text-cream">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Logo variant="full" mode="dark" size={28} />
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-cream/70">
              {dict.tagline}
            </p>
            <ul className="mt-2 flex items-center gap-3">
              {dict.social.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:border-splash hover:bg-splash hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-splash focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
                  >
                    <SocialIcon id={social.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={dict.servicesTitle} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/50">
              {dict.servicesTitle}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {services.map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-sm text-cream/75 transition-colors hover:text-splash focus-visible:outline-none focus-visible:text-splash"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={dict.companyTitle} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/50">
              {dict.companyTitle}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {dict.companyLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={resolveHref(link.href)}
                      className="text-sm text-cream/75 transition-colors hover:text-splash focus-visible:outline-none focus-visible:text-splash"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-cream/75 transition-colors hover:text-splash focus-visible:outline-none focus-visible:text-splash"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/50">
              {siteName}
            </h2>
            <p className="text-sm leading-relaxed text-cream/70">
              {dict.madeIn}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-sm text-cream/55 sm:flex-row">
          <p>
            © <span className="tabular-nums">{year}</span> {siteName}. {dict.rights}
          </p>
          <p dir="ltr" className="tabular-nums">
            wabel.sa
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
