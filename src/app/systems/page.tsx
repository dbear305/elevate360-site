import type { Metadata } from "next";
import Link from "next/link";
import { SystemFooter } from "./system-footer";
import { SystemHeader } from "./system-header";

export const metadata: Metadata = {
  title: "Built Systems",
  description:
    "Explore field-pay validation, operational software, and secure infrastructure built by Elevate360.",
  alternates: {
    canonical: "/systems",
  },
  openGraph: {
    title: "Built Systems | Elevate360 Systems",
    description:
      "Explore field-pay validation, operational software, and secure infrastructure built by Elevate360.",
    url: "/systems",
    siteName: "Elevate360 Systems",
    images: [
      {
        url: "/opgraph.png",
        width: 1200,
        height: 630,
        alt: "Elevate360 Systems",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Built Systems | Elevate360 Systems",
    description:
      "Explore field-pay validation, operational software, and secure infrastructure built by Elevate360.",
    images: ["/opgraph.png"],
  },
};

export default function SystemsPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <a
        href="#systems-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to systems
      </a>

      <SystemHeader />

      <div id="systems-content">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.16),transparent_34%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Built Systems
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Systems built around the work.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                See how Elevate360 turns operational inputs into measured
                evidence, deterministic calculations, controlled workflows,
                and auditable results. The FieldPay preview below uses
                synthetic data; technical details are shared for qualified
                engineering and licensing discussions.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Operational software
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Secure infrastructure
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Synthetic preview data
              </span>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#061022]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
            <div className="max-w-3xl">
              <article
                id="fieldpay"
                className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7 sm:p-8"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Field operations
                </span>
                <h2 className="mt-5 text-2xl font-semibold text-white">
                  FieldPay
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Rules-driven pay validation with technician earnings
                  previews, supervisor review, deterministic recalculation,
                  discrepancy detection, and audit-ready breakdowns.
                </p>
                <div className="mt-7 rounded-2xl border border-white/10 bg-[#020817]/60 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Recorded shift</span>
                    <span className="font-medium text-white">10.5 hours</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Rules applied</span>
                    <span className="font-medium text-sky-200">5</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Review state</span>
                    <span className="font-medium text-amber-200">
                      Discrepancy surfaced
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#020817]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Additional Systems
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                Technical depth is shared selectively.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                These systems are available for qualified engineering, pilot,
                or licensing discussions. Public proof is limited to what can
                be shown without exposing user data or proprietary logic.
              </p>
            </div>

            <div className="mt-10 max-w-2xl">
              <Link
                href="/#proof"
                className="block rounded-3xl border border-white/10 bg-white/[0.035] p-6 hover:border-sky-300/30 hover:bg-white/[0.06]"
              >
                <h3 className="text-xl font-semibold text-white">
                  Secure Infrastructure
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Firewall appliances, segmentation, private routing, access
                  control, DNS policy, and deployment validation.
                </p>
                <p className="mt-5 text-sm font-semibold text-sky-200">
                  View the reference deployment
                </p>
              </Link>
            </div>

            <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[30px] border border-sky-300/20 bg-sky-300/[0.08] p-7 sm:flex-row sm:items-center sm:p-9">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Have a real operational problem?
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                  Bring the environment, the failure, and the measurable result
                  the system needs to produce.
                </p>
              </div>
              <a
                href="mailto:contact@elevate360systems.com?subject=Elevate360%20Systems%20Opportunity"
                className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200"
              >
                Discuss an Opportunity
              </a>
            </div>
          </div>
        </section>
      </div>

      <SystemFooter />
    </main>
  );
}
