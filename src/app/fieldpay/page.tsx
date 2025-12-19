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
      "Vendor-agnostic payroll rules engine with a closed-loop technician–supervisor workflow. Transparent calculations, explicit overrides, audit-ready breakdowns.",
    url: "https://www.elevate360systems.com/fieldpay",
    siteName: "Elevate360 Systems™",
    type: "article",
    images: [
      {
        url: "https://www.elevate360systems.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "FieldPay™ by Elevate360 Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FieldPay™ — Configurable Payroll Logic",
    description:
      "Transparent payroll logic for field operations with technician-visible previews and supervisor approval.",
    images: ["https://www.elevate360systems.com/og.jpg"],
  },
};

export default function FieldPayPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}
      <section className="mt-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
          FieldPay<span className="align-super text-[0.55em]">™</span>{" "}
          <span className="text-sky-400">No-surprise payroll logic</span> for field operations.
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300">
          FieldPay is a vendor-agnostic, rules-driven payroll logic engine built for
          real-world field environments where time, pay, and supervisor judgment intersect.
          It does not replace your payroll vendor. It makes payroll logic{" "}
          <span className="text-slate-100 font-medium">
            correct, transparent, and defensible
          </span>{" "}
          before money ever moves.
        </p>

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

        <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-slate-50">
            Technician ↔ Supervisor closed-loop workflow
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            FieldPay prevents payroll disputes by aligning expectations before approval.
            Technicians see a pay preview before submission. Supervisors review and override
            transparently. Overrides force recalculation. Both sides see the same breakdown.
          </p>
        </div>
      </section>

      {/* ========================= */}
      {/* WHAT IT SOLVES */}
      {/* ========================= */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Payroll problems are usually invisible logic problems
        </h2>

        <p className="mt-4 max-w-3xl text-base text-slate-300">
          Most disputes come from surprise. Technicians submit time without seeing the
          downstream outcome. Supervisors correct entries later. Payroll systems apply
          opaque rules. Checks change without explanation. FieldPay removes surprise by
          making logic visible and reviewable.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold text-slate-50">Technician view</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Enter start, end, lunch, job, and work type</li>
              <li>See computed hours after lunch</li>
              <li>See pay preview before submission</li>
              <li>Submit with full visibility</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold text-slate-50">Supervisor view</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Review submissions with context</li>
              <li>Apply overrides explicitly</li>
              <li>Overrides trigger recalculation</li>
              <li>Approve with defensible output</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* VENDOR-AGNOSTIC */}
      {/* ========================= */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Vendor-agnostic by design
        </h2>

        <p className="mt-4 max-w-3xl text-base text-slate-300">
          FieldPay does not assume a specific payroll provider, processor, or accounting
          stack. Your rules are modeled explicitly and produce deterministic outputs.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-semibold text-slate-50">Policy-agnostic</h3>
            <p className="mt-3 text-sm text-slate-300">
              Work types, schedules, holidays, callbacks, and overscale are modeled cleanly.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-semibold text-slate-50">Deterministic</h3>
            <p className="mt-3 text-sm text-slate-300">
              Same inputs always produce the same outputs.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-semibold text-slate-50">Audit-ready</h3>
            <p className="mt-3 text-sm text-slate-300">
              Pay codes, multipliers, and overrides are explicit and reviewable.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* STRIPE ENGAGEMENT CTA */}
      {/* ========================= */}
      <section className="mt-24 rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
          Start with a Monthly Engagement
        </h2>

        <p className="mt-4 max-w-3xl text-base text-slate-300">
          FieldPay pilots and operational audits are delivered through a short monthly
          engagement. This provides priority access, rapid response, and hands-on
          implementation without a long-term commitment.
        </p>

        <p className="mt-3 max-w-3xl text-sm text-slate-400">
          Most teams start here before expanding into a larger engagement.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="https://buy.stripe.com/eVqaEY2I9fKx5ZE8ta8so02"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition"
          >
            Start Monthly Engagement — $1,195
          </a>

          <a
            href="mailto:contact@elevate360systems.com"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-slate-50 transition"
          >
            Discuss a Larger Engagement
          </a>
        </div>
      </section>
    </main>
  );
}
