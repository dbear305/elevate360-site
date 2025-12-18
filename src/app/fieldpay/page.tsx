import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "FieldPay™ — Configurable Payroll Logic for Field Operations | Elevate360 Systems",
  description:
    "FieldPay is a vendor-agnostic, rules-driven payroll logic engine for field operations. Technician-visible pay preview, supervisor review + override loop, and audit-ready breakdowns for real-world pay rules.",
  metadataBase: new URL("https://www.elevate360systems.com"),
  alternates: {
    canonical: "https://www.elevate360systems.com/fieldpay",
  },
  openGraph: {
    title: "FieldPay™ — No-Surprise Payroll Logic",
    description:
      "Vendor-agnostic payroll rules engine with a closed-loop tech ↔ supervisor workflow. Transparent calculations, explicit overrides, audit-ready breakdowns.",
    url: "https://www.elevate360systems.com/fieldpay",
    siteName: "Elevate360 Systems™",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "FieldPay™ — Configurable Payroll Logic",
    description:
      "Transparent payroll logic for field ops: pay preview, supervisor review, explicit overrides, audit-ready breakdowns.",
  },
};

export default function FieldPayPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      {/* HERO */}
      <section className="mt-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
          FieldPay<span className="align-super text-[0.55em]">™</span>{" "}
          <span className="text-sky-400">No-surprise payroll logic</span> for field operations.
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300">
          FieldPay is a vendor-agnostic, rules-driven payroll logic engine built for real-world field
          environments where time, pay, and supervisor judgment intersect. It does not try to replace your
          payroll vendor. It makes your payroll logic{" "}
          <span className="text-slate-100 font-medium">correct, transparent, and defensible</span>{" "}
          before money ever moves.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="mailto:contact@elevate360systems.com?subject=FieldPay%20Pilot%20Request"
            className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition"
          >
            Discuss a FieldPay Pilot
          </a>
          <a
            href="/engineering-consulting"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-slate-50 transition"
          >
            Engineering Consulting
          </a>
        </div>

        {/* PROOF / SCREENSHOT (optional) */}
        <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-slate-50">Technician ↔ Supervisor closed-loop workflow</h2>
          <p className="mt-3 text-sm text-slate-300 max-w-3xl">
            FieldPay prevents payroll disputes by aligning expectations before approval. Technicians see a pay
            preview before submission. Supervisors can review and override transparently. Overrides force
            recalculation. Both sides see the same breakdown.
          </p>

          {/* If you want a screenshot: put it in /public/fieldpay-preview.png and uncomment below */}
          {/*
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
            <Image
              src="/fieldpay-preview.png"
              alt="FieldPay technician and supervisor views"
              width={1400}
              height={800}
              className="w-full h-auto"
              priority={false}
            />
          </div>
          */}
        </div>
      </section>

      {/* WHAT IT SOLVES */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Payroll problems are usually invisible logic problems
        </h2>

        <p className="mt-4 max-w-3xl text-base text-slate-300">
          Most disputes come from surprise. Techs submit time without seeing the downstream outcome. Supervisors
          correct entries later. Payroll systems apply opaque rules. Checks change without a clean explanation.
          FieldPay removes surprise by making the logic visible, reviewable, and consistent.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold text-slate-50">Technician view</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-2">
              <li>Enter start, end, lunch, job, and work type</li>
              <li>See computed hours (after lunch)</li>
              <li>See pay preview before submission</li>
              <li>Submit with full visibility into the result</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold text-slate-50">Supervisor view</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-2">
              <li>Review submitted entries with full context</li>
              <li>Apply overrides explicitly when needed</li>
              <li>Overrides trigger forced recalculation</li>
              <li>Approve with a defensible breakdown</li>
            </ul>
          </div>
        </div>
      </section>

      {/* VENDOR-AGNOSTIC */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">Vendor-agnostic by design</h2>
        <p className="mt-4 max-w-3xl text-base text-slate-300">
          FieldPay does not assume a specific payroll provider, processor, or accounting stack. It models your
          rules explicitly and produces deterministic outputs that can be reconciled and exported.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-semibold text-slate-50">Policy-agnostic</h3>
            <p className="mt-3 text-sm text-slate-300">
              Your work types, schedules, differentials, holidays, callbacks, overscale, and special cases can be
              modeled cleanly.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-semibold text-slate-50">Deterministic</h3>
            <p className="mt-3 text-sm text-slate-300">
              Same inputs produce the same outputs. Every number can be traced back to a rule, a segment, and a
              multiplier.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-semibold text-slate-50">Audit-ready</h3>
            <p className="mt-3 text-sm text-slate-300">
              Pay codes, hours, multipliers, and gross breakdowns are visible. Overrides are explicit and
              explainable.
            </p>
          </div>
        </div>
      </section>

      {/* DELIVERY MODEL */}
      <section className="mt-20 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50">How FieldPay is delivered</h2>
        <p className="mt-3 text-sm text-slate-300 max-w-3xl">
          FieldPay is currently offered through consulting and pilot engagements. We translate your rules into
          explicit logic, run parallel validation against your existing payroll outputs, and harden edge cases.
          The goal is simple: correct payroll logic that everyone can see and trust.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="mailto:contact@elevate360systems.com?subject=FieldPay%20Pilot%20Request"
            className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition"
          >
            Start a FieldPay Discussion
          </a>
          <a
            href="/#contact"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-slate-50 transition"
          >
            Contact Elevate360
          </a>
        </div>
      </section>
    </main>
  );
}
