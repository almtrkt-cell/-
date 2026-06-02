"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, FileSearch, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuditResult, Impact } from "@/lib/audit";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { AUDIT_STORAGE_KEY } from "@/components/audit/AuditForm";

interface ResultsDict {
  eyebrow: string;
  overallLabel: string;
  outOf: string;
  auditedLabel: string;
  categoriesTitle: string;
  categories: { seo: string; brandClarity: string; cta: string; mobile: string };
  strengthsTitle: string;
  recommendationsTitle: string;
  impact: Record<Impact, string>;
  signalsTitle: string;
  signals: {
    title: string;
    description: string;
    headings: string;
    words: string;
    images: string;
    viewport: string;
    https: string;
    present: string;
    missing: string;
    yes: string;
    no: string;
  };
  newAudit: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

interface EmptyDict {
  title: string;
  subtitle: string;
  cta: string;
}

interface AuditResultsProps {
  locale: Locale;
  results: ResultsDict;
  empty: EmptyDict;
}

function scoreTone(score: number): { text: string; bar: string; ring: string } {
  if (score >= 80)
    return { text: "text-emerald-600", bar: "bg-emerald-500", ring: "ring-emerald-500/30" };
  if (score >= 55)
    return { text: "text-splash", bar: "bg-splash", ring: "ring-splash/30" };
  return { text: "text-destructive", bar: "bg-destructive", ring: "ring-destructive/30" };
}

export function AuditResults({ locale, results, empty }: AuditResultsProps) {
  const [audit, setAudit] = React.useState<AuditResult | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) setAudit(JSON.parse(raw) as AuditResult);
    } catch {
      setAudit(null);
    }
    setLoaded(true);
  }, []);

  const numberFormat = React.useMemo(
    () =>
      new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
        numberingSystem: locale === "ar" ? "arab" : "latn",
        maximumFractionDigits: 0,
      }),
    [locale]
  );
  const fmt = (n: number) => numberFormat.format(n);

  const formattedDate = React.useMemo(() => {
    if (!audit) return "";
    try {
      return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
        dateStyle: "medium",
        calendar: "gregory",
      }).format(new Date(audit.fetchedAt));
    } catch {
      return "";
    }
  }, [audit, locale]);

  if (!loaded) {
    return <div className="container py-24" aria-hidden="true" />;
  }

  if (!audit) {
    return (
      <div className="container flex flex-col items-center gap-5 py-24 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-sand text-carbon">
          <FileSearch className="size-7" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold text-carbon">{empty.title}</h1>
        <p className="max-w-md text-steel">{empty.subtitle}</p>
        <Button asChild size="lg">
          <Link href={`/${locale}/audit`}>{empty.cta}</Link>
        </Button>
      </div>
    );
  }

  const categories: { key: keyof ResultsDict["categories"]; data: { score: number; analysis: string } }[] = [
    { key: "seo", data: audit.seo },
    { key: "brandClarity", data: audit.brandClarity },
    { key: "cta", data: audit.cta },
    { key: "mobile", data: audit.mobile },
  ];

  const overallTone = scoreTone(audit.overallScore);

  const signalRows: { label: string; value: string }[] = [
    {
      label: results.signals.title,
      value: audit.signals.title ? results.signals.present : results.signals.missing,
    },
    {
      label: results.signals.description,
      value: audit.signals.description ? results.signals.present : results.signals.missing,
    },
    { label: results.signals.headings, value: fmt(audit.signals.headingCount) },
    { label: results.signals.words, value: fmt(audit.signals.wordCount) },
    { label: results.signals.images, value: fmt(audit.signals.imageCount) },
    {
      label: results.signals.viewport,
      value: audit.signals.hasViewport ? results.signals.yes : results.signals.no,
    },
    {
      label: results.signals.https,
      value: audit.signals.isHttps ? results.signals.yes : results.signals.no,
    },
  ];

  return (
    <div className="container flex max-w-4xl flex-col gap-12 py-16 sm:py-20">
      {/* Header + overall score */}
      <header className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-splash/10 px-3.5 py-1.5 text-sm font-semibold text-splash">
          <Gauge className="size-4" aria-hidden="true" />
          {results.eyebrow}
        </span>
        <div className="flex flex-col gap-6 rounded-3xl bg-carbon p-8 text-cream sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-balance text-2xl font-bold sm:text-3xl">
              {audit.headline}
            </h1>
            <p className="text-pretty leading-relaxed text-cream/75">{audit.summary}</p>
            <p className="text-sm text-cream/50">
              {results.auditedLabel}:{" "}
              <span dir="ltr" className="break-all text-cream/70">
                {audit.url}
              </span>
              {formattedDate ? ` · ${formattedDate}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div
              className={cn(
                "flex size-28 items-center justify-center rounded-full bg-cream/5 ring-4",
                overallTone.ring
              )}
            >
              <span className={cn("text-4xl font-bold tabular-nums", overallTone.text)}>
                {fmt(audit.overallScore)}
              </span>
            </div>
            <span className="text-xs text-cream/50">
              {results.overallLabel} {results.outOf}
            </span>
          </div>
        </div>
      </header>

      {/* Scorecard */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-bold text-carbon">{results.categoriesTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map(({ key, data }) => {
            const tone = scoreTone(data.score);
            return (
              <div
                key={key}
                className="flex flex-col gap-3 rounded-2xl border border-carbon/10 bg-white p-6"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-carbon">
                    {results.categories[key]}
                  </h3>
                  <span className={cn("text-2xl font-bold tabular-nums", tone.text)}>
                    {fmt(data.score)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sand">
                  <div
                    className={cn("h-full rounded-full", tone.bar)}
                    style={{ width: `${data.score}%` }}
                    role="progressbar"
                    aria-valuenow={data.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={results.categories[key]}
                  />
                </div>
                <p className="text-pretty text-sm leading-relaxed text-steel">
                  {data.analysis}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Strengths */}
      {audit.strengths.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-carbon">{results.strengthsTitle}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {audit.strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl bg-sand/40 p-4"
              >
                <Check className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span className="text-pretty leading-relaxed text-carbon/80">{s}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Recommendations */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-carbon">{results.recommendationsTitle}</h2>
        <ol className="flex flex-col gap-4">
          {audit.recommendations.map((rec, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-2xl border border-carbon/10 bg-white p-6"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-splash/10 text-base font-bold text-splash tabular-nums">
                {fmt(i + 1)}
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-carbon">{rec.title}</h3>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      rec.impact === "high"
                        ? "bg-splash/10 text-splash"
                        : rec.impact === "medium"
                          ? "bg-sand text-carbon/70"
                          : "bg-carbon/5 text-steel"
                    )}
                  >
                    {results.impact[rec.impact]}
                  </span>
                </div>
                <p className="text-pretty leading-relaxed text-steel">{rec.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Signals */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-carbon">{results.signalsTitle}</h2>
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-carbon/10 bg-carbon/10 sm:grid-cols-2">
          {signalRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 bg-white px-5 py-3.5"
            >
              <dt className="text-sm text-steel">{row.label}</dt>
              <dd className="text-sm font-medium text-carbon tabular-nums">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA back to contact */}
      <section className="relative overflow-hidden rounded-3xl bg-splash px-6 py-12 text-center sm:px-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
            {results.ctaTitle}
          </h2>
          <p className="text-pretty text-white/90">{results.ctaSubtitle}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href={`/${locale}#contact`}>
                {results.ctaButton}
                <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/15"
            >
              <Link href={`/${locale}/audit`}>{results.newAudit}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuditResults;
