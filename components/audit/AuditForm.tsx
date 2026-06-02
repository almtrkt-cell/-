"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isValidEmail, isValidHttpUrl } from "@/lib/validation";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const AUDIT_STORAGE_KEY = "wabel:audit";

interface AuditFormDict {
  form: {
    urlLabel: string;
    urlPlaceholder: string;
    urlError: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailHint: string;
    emailError: string;
    submit: string;
    submitting: string;
    consent: string;
  };
  loading: { title: string; steps: string[] };
  errors: { rate_limited: string; generic: string };
}

const inputBase =
  "w-full rounded-xl border border-carbon/15 bg-white px-4 py-3 text-base text-carbon placeholder:text-steel/60 transition-colors focus-visible:outline-none focus-visible:border-splash focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive";

export function AuditForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: AuditFormDict;
}) {
  const router = useRouter();
  const [url, setUrl] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState<{ url?: string; email?: string }>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [serverError, setServerError] = React.useState("");

  // Cycle the loading messages while the request is in flight.
  React.useEffect(() => {
    if (!submitting) return;
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % dict.loading.steps.length);
    }, 2200);
    return () => clearInterval(id);
  }, [submitting, dict.loading.steps.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { url?: string; email?: string } = {};
    if (!isValidHttpUrl(url)) nextErrors.url = dict.form.urlError;
    if (!isValidEmail(email)) nextErrors.email = dict.form.emailError;
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setStepIndex(0);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.error === "rate_limited") setServerError(dict.errors.rate_limited);
        else setServerError(data?.message || dict.errors.generic);
        setSubmitting(false);
        return;
      }
      window.sessionStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(data.audit));
      router.push(`/${locale}/audit/results`);
    } catch {
      setServerError(dict.errors.generic);
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[22rem] flex-col items-center justify-center gap-6 rounded-3xl border border-carbon/10 bg-white p-10 text-center"
      >
        <span className="relative inline-flex size-16 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-splash/15" />
          <Sparkles className="size-7 text-splash motion-safe:animate-pulse" aria-hidden="true" />
        </span>
        <p className="text-xl font-bold text-carbon">{dict.loading.title}</p>
        <p className="flex items-center gap-2 text-steel">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {dict.loading.steps[stepIndex]}…
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-3xl border border-carbon/10 bg-white p-6 shadow-soft sm:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="audit-url" className="text-sm font-medium text-carbon">
          {dict.form.urlLabel}
        </label>
        <div className="flex items-stretch overflow-hidden rounded-xl border border-carbon/15 bg-white transition-colors focus-within:border-splash focus-within:ring-2 focus-within:ring-ring">
          <span
            className="inline-flex items-center border-e border-carbon/10 bg-sand/50 px-3 text-steel"
            aria-hidden="true"
          >
            <Globe className="size-4" />
          </span>
          <input
            id="audit-url"
            name="url"
            type="url"
            inputMode="url"
            dir="ltr"
            autoComplete="url"
            placeholder={dict.form.urlPlaceholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-invalid={errors.url ? true : undefined}
            aria-describedby={errors.url ? "audit-url-error" : undefined}
            className="w-full bg-transparent px-3 py-3 text-base text-carbon placeholder:text-steel/60 focus-visible:outline-none"
          />
        </div>
        {errors.url ? (
          <p id="audit-url-error" className="text-sm text-destructive">
            {errors.url}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="audit-email" className="text-sm font-medium text-carbon">
          {dict.form.emailLabel}
        </label>
        <input
          id="audit-email"
          name="email"
          type="email"
          inputMode="email"
          dir="ltr"
          autoComplete="email"
          placeholder={dict.form.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={
            errors.email ? "audit-email-error" : "audit-email-hint"
          }
          className={cn(inputBase)}
        />
        {errors.email ? (
          <p id="audit-email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        ) : (
          <p id="audit-email-hint" className="text-xs text-steel">
            {dict.form.emailHint}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full">
        <Sparkles className="size-5" aria-hidden="true" />
        {dict.form.submit}
      </Button>

      {serverError ? (
        <p role="alert" className="text-center text-sm text-destructive">
          {serverError}
        </p>
      ) : null}

      <p className="text-center text-xs text-steel">{dict.form.consent}</p>
    </form>
  );
}

export default AuditForm;
