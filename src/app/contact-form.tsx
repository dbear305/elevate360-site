"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";
import type { FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

const formEndpoint =
  "https://formsubmit.co/ajax/contact@elevate360systems.com";

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

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
    formData.set("_subject", "New Elevate360 project inquiry");
    formData.set("_template", "table");
    formData.set("_captcha", "false");
    formData.set("_replyto", String(formData.get("email") ?? ""));

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      track("Contact Form Submitted", {
        budget: String(formData.get("budget") || "Not provided"),
      });
      form.reset();
      setSubmitState("success");
    } catch {
      track("Contact Form Failed");
      setSubmitState("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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

      <label className="text-sm font-medium text-slate-200 sm:col-span-2">
        What&apos;s broken?
        <textarea
          name="message"
          required
          rows={5}
          className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-sky-300"
        />
      </label>

      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="min-h-12 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-wait disabled:opacity-70"
        >
          {submitState === "submitting"
            ? "Sending..."
            : "Send Project Details"}
        </button>

        <p aria-live="polite" className="text-sm leading-6">
          {submitState === "success" ? (
            <span className="text-emerald-200">
              Project details sent. We&apos;ll follow up by email.
            </span>
          ) : null}
          {submitState === "error" ? (
            <span className="text-rose-200">
              The form could not send. Call 786-312-7320 or email
              contact@elevate360systems.com.
            </span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
