"use client";

import { track } from "@vercel/analytics";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { addInquiryMetadata, isPipelineTest } from "@/lib/lead-attribution";
import { trackAcceptedInquiry } from "@/lib/google-ads";
import { classifyProviderFailure, FormSubmissionError, safeSubmissionDiagnostic } from "@/lib/form-submit";

type SubmitState = "idle" | "submitting" | "success" | "error";

const formEndpoint =
  "https://formsubmit.co/ajax/contact@elevate360systems.com";

export function ContactForm({ intent = "project" }: { intent?: "project" | "diagnostic" }) {
  const isDiagnostic = intent === "diagnostic";
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [testDiagnostic, setTestDiagnostic] = useState<string | null>(null);
  const inquiryId = useRef<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = String(formData.get("website") ?? "").trim();

    if (honeypot) {
      form.reset();
      setSubmitState("success");
      return;
    }

    setSubmitState("submitting");
    setTestDiagnostic(null);
    const isTest = isPipelineTest();
    const currentInquiryId = inquiryId.current ??= crypto.randomUUID();
    addInquiryMetadata(formData, currentInquiryId, isTest);
    const subject = isDiagnostic ? "NetTruth paid diagnostic scope request" : "New Elevate360 project inquiry";
    formData.set("_subject", `${isTest ? "[INTERNAL TEST - NOT A LEAD] " : ""}${subject}`);
    formData.set("inquiry_type", intent);
    formData.set("_template", "table");
    formData.set("_captcha", "false");
    formData.set("_replyto", String(formData.get("email") ?? ""));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        body: formData,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        throw new FormSubmissionError("http_error", response.status, classifyProviderFailure(result));
      }
      let result: unknown;
      try {
        result = await response.json();
      } catch (error) {
        if (error instanceof SyntaxError) throw new FormSubmissionError("invalid_json", response.status);
        throw error;
      }
      if (!result || typeof result !== "object" || !("success" in result) ||
          (result.success !== true && result.success !== "true")) {
        throw new FormSubmissionError("provider_rejected", response.status, classifyProviderFailure(result));
      }

      if (!isTest) {
        trackAcceptedInquiry({ ok: response.ok, result }, currentInquiryId, isTest);
        track("Contact Form Submitted", {
          budget: String(formData.get("budget") || "Not provided"),
          inquiryType: intent,
        });
      }
      form.reset();
      inquiryId.current = null;
      setSubmitState("success");
    } catch (error) {
      if (!isTest) track("Contact Form Failed", { inquiryType: intent });
      if (isTest) setTestDiagnostic(safeSubmissionDiagnostic(error));
      setSubmitState("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={isDiagnostic ? "Request a paid network diagnostic scope" : "Project inquiry"}
      className="relative mt-10 grid max-w-4xl gap-5 rounded-3xl border border-white/10 bg-[#020817]/60 p-6 sm:grid-cols-2 sm:p-8"
    >
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="text-sm font-medium text-slate-200">
        Name
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-sky-300"
        />
      </label>

      <label className="text-sm font-medium text-slate-200">
        Company
        <input
          type="text"
          name="company"
          required={isDiagnostic}
          autoComplete="organization"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-sky-300"
        />
      </label>

      <label className="text-sm font-medium text-slate-200">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-sky-300"
        />
      </label>

      <label className="text-sm font-medium text-slate-200">
        Budget range
        <select
          name="budget"
          defaultValue=""
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#081224] px-4 py-3 text-white outline-none focus:border-sky-300"
        >
          <option value="">Select a range</option>
          <option value="$750–$2,499">$750–$2,499</option>
          <option value="$2,500–$4,999">$2,500–$4,999</option>
          <option value="$5,000–$9,999">$5,000–$9,999</option>
          <option value="$10,000–$24,999">$10,000–$24,999</option>
          <option value="$25,000+">$25,000+</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </label>

      {isDiagnostic && <>
        <label className="text-sm font-medium text-slate-200">
          Business location (city and state)
          <input type="text" name="business_location" required maxLength={160}
            placeholder="Miami, FL"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-sky-300" />
        </label>
        <label className="text-sm font-medium text-slate-200">
          When does the problem happen?
          <input type="text" name="problem_timing" required maxLength={240}
            placeholder="During calls, each afternoon, under load…"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-sky-300" />
        </label>
      </>}

      <label className="text-sm font-medium text-slate-200 sm:col-span-2">
        {isDiagnostic ? "What is failing, and how does it affect the business?" : "What would you like to build or fix?"}
        <textarea
          name="message"
          required
          rows={5}
          maxLength={5000}
          aria-describedby={isDiagnostic ? "diagnostic-privacy" : undefined}
          className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-sky-300"
        />
      </label>

      {isDiagnostic && <>
        <p id="diagnostic-privacy" className="text-sm leading-6 text-slate-400 sm:col-span-2">
          Include the affected devices, connection type, and what you have tried.
          Keep passwords, keys, customer data, and configuration files out of this form.
          Your NetTruth results are not attached automatically. Keep your JSON export;
          we can agree how to share relevant evidence after scoping.
        </p>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-200 sm:col-span-2">
          <input type="checkbox" name="paid_scope_acknowledged" value="yes" required
            className="mt-1 h-5 w-5 shrink-0 accent-sky-300" />
          <span>I understand that diagnostics start at $750. This is a scope request;
            work begins only after we agree the written scope, price, and payment terms.</span>
        </label>
      </>}

      <p className="text-sm leading-6 text-slate-400 sm:col-span-2">
        FormSubmit delivers your details and campaign source to Elevate360.
        Google Ads measures accepted requests without advertising cookies;
        your name, email, and message are not sent to Google.
      </p>

      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="min-h-12 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-wait disabled:opacity-70"
        >
          {submitState === "submitting"
            ? "Sending..."
            : isDiagnostic ? "Request diagnostic scope" : "Send Project Details"}
        </button>

        <p aria-live="polite" className="text-sm leading-6">
          {submitState === "success" ? (
            <span className="text-emerald-200">
              {isDiagnostic
                ? "Scope request sent. We'll follow up by email. No appointment or payment has been made."
                : "Project details sent. We'll follow up by email."}
            </span>
          ) : null}
          {submitState === "error" ? (
            <span className="text-rose-200">
              The form could not send. <a href="tel:+17863127320" className="underline underline-offset-4">Call 786-312-7320</a>{" "}
              or <a href="mailto:contact@elevate360systems.com" className="underline underline-offset-4">email contact@elevate360systems.com</a>.
              {testDiagnostic && <span className="mt-2 block text-xs">Internal QA: {testDiagnostic}</span>}
            </span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
