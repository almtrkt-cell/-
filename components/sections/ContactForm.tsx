"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isValidEmail, isValidSaudiMobile } from "@/lib/validation";
import { cn } from "@/lib/utils";

export interface ContactFormDict {
  name: { label: string; placeholder: string; error: string };
  email: { label: string; placeholder: string; error: string };
  phone: { label: string; placeholder: string; hint: string; error: string };
  company: { label: string; placeholder: string };
  service: { label: string; placeholder: string };
  message: { label: string; placeholder: string; error: string };
  submit: string;
  submitting: string;
  success: string;
  errorGeneric: string;
}

type FieldName = "name" | "email" | "phone" | "message";

interface ContactFormProps {
  form: ContactFormDict;
  services: string[];
}

const inputBase =
  "w-full rounded-xl border border-carbon/15 bg-white px-4 py-3 text-base text-carbon placeholder:text-steel/60 transition-colors focus-visible:outline-none focus-visible:border-splash focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30";

export function ContactForm({ form, services }: ContactFormProps) {
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = React.useState<Record<FieldName, string>>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const formRef = React.useRef<HTMLFormElement>(null);

  const validateField = React.useCallback(
    (field: FieldName, value: string): string => {
      switch (field) {
        case "name":
          return value.trim().length >= 2 ? "" : form.name.error;
        case "email":
          return isValidEmail(value) ? "" : form.email.error;
        case "phone":
          return isValidSaudiMobile(value) ? "" : form.phone.error;
        case "message":
          return value.trim().length >= 3 ? "" : form.message.error;
        default:
          return "";
      }
    },
    [form]
  );

  const handleChange = (field: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Clear an existing error as the user corrects it.
    if (field in errors && errors[field as FieldName]) {
      setErrors((e) => ({
        ...e,
        [field]: validateField(field as FieldName, value),
      }));
    }
  };

  const handleBlur = (field: FieldName) => {
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<FieldName, string> = {
      name: validateField("name", values.name),
      email: validateField("email", values.email),
      phone: validateField("phone", values.phone),
      message: validateField("message", values.message),
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      // Move focus to the first invalid field for keyboard/SR users.
      requestAnimationFrame(() => {
        const firstInvalid =
          formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
        firstInvalid?.focus();
      });
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      setValues({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex min-h-[20rem] flex-col items-center justify-center gap-4 rounded-2xl border border-splash/30 bg-splash/5 p-8 text-center"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-splash text-white">
          <Send className="size-6" aria-hidden="true" />
        </span>
        <p className="max-w-sm text-pretty text-lg font-medium text-carbon">
          {form.success}
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label={form.name.label}
          error={errors.name}
        >
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            dir="auto"
            placeholder={form.name.placeholder}
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputBase}
          />
        </Field>

        <Field id="email" label={form.email.label} error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            placeholder={form.email.placeholder}
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputBase}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="phone"
          label={form.phone.label}
          error={errors.phone}
          hintId="phone-hint"
          hint={form.phone.hint}
        >
          <div
            className={cn(
              "flex items-stretch overflow-hidden rounded-xl border border-carbon/15 bg-white transition-colors focus-within:border-splash focus-within:ring-2 focus-within:ring-ring",
              errors.phone && "border-destructive ring-2 ring-destructive/30"
            )}
            dir="ltr"
          >
            <span
              className="inline-flex items-center border-e border-carbon/10 bg-sand/50 px-3 text-sm font-medium text-steel"
              aria-hidden="true"
            >
              +966
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder={form.phone.placeholder}
              value={values.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={cn(
                "phone-hint",
                errors.phone && "phone-error"
              )}
              className="w-full bg-transparent px-3 py-3 text-base text-carbon placeholder:text-steel/60 focus-visible:outline-none"
            />
          </div>
        </Field>

        <Field id="company" label={form.company.label} optional>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            dir="auto"
            placeholder={form.company.placeholder}
            value={values.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className={inputBase}
          />
        </Field>
      </div>

      <Field id="service" label={form.service.label} optional>
        <select
          id="service"
          name="service"
          value={values.service}
          onChange={(e) => handleChange("service", e.target.value)}
          className={cn(inputBase, "appearance-none bg-white")}
        >
          <option value="">{form.service.placeholder}</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label={form.message.label} error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          dir="auto"
          placeholder={form.message.placeholder}
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(inputBase, "resize-y")}
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              {form.submitting}
            </>
          ) : (
            <>
              {form.submit}
              <Send className="size-5 rtl:-scale-x-100" aria-hidden="true" />
            </>
          )}
        </Button>

        {/* Live region for submit-level status. */}
        <p aria-live="polite" className="text-sm text-destructive">
          {status === "error" ? form.errorGeneric : ""}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  hintId,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  hintId?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-carbon">
        {label}
        {optional ? (
          <span className="ms-1 font-normal text-steel">·</span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-xs text-steel" dir="ltr">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default ContactForm;
