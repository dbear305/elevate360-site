// src/app/page.tsx
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 lg:pt-16">
        {/* HEADER */}
        <header className="mb-16 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">
            Elevate360 Systems
          </div>
          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#platforms" className="hover:text-slate-50">
              Platforms
            </a>
            <a href="#services" className="hover:text-slate-50">
              Services
            </a>
            <a href="#about" className="hover:text-slate-50">
              About
            </a>
            <a href="#contact" className="hover:text-slate-50">
              Contact
            </a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mb-20 grid gap-10 lg:grid-cols-[2fr,1.3fr] lg:items-center">
          <div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
              Real-world systems.
              <br className="hidden sm:block" />
              Real-time intelligence.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Elevate360 Systems builds privacy-first platforms for elevators,
              field teams, and financial operations—designed by someone who
              spent nearly a decade in the field. Our tools bring clarity,
              automation, and measurable performance to the systems that keep
              your business moving.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#services"
                className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
              >
                View consulting services
              </a>
              <a
                href="#platforms"
                className="rounded-full border border-slate-600 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-900"
              >
                Explore platforms
              </a>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative h-64 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl lg:h-80">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Operational Intelligence
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4">
                <div className="text-xs text-slate-400">
                  Elevators &amp; Field Ops
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-50">
                  Telemetry, routes, and downtime in one place.
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4">
                <div className="text-xs text-slate-400">Financial Flows</div>
                <div className="mt-2 text-sm font-semibold text-slate-50">
                  Trading, ledger, and risk—fully instrumented.
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4">
                <div className="text-xs text-slate-400">Field Payroll</div>
                <div className="mt-2 text-sm font-semibold text-slate-50">
                  Rules-accurate wage models for real crews.
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4">
                <div className="text-xs text-slate-400">Privacy-First</div>
                <div className="mt-2 text-sm font-semibold text-slate-50">
                  Your data stays your data. No hype. No leaks.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORMS */}
        <section id="platforms" className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            The Elevate360 Systems platform
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            A set of focused tools built on real field experience—each solving a
            specific operational problem instead of trying to be everything at
            once.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-base font-semibold text-slate-50">
                Elevate360 Core Systems
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Real-time telemetry, fault diagnostics, and predictive
                maintenance logic for elevators and infrastructure—built from
                the perspective of an actual mechanic.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-base font-semibold text-slate-50">FieldPay™</h3>
              <p className="mt-2 text-sm text-slate-300">
                A precision wage and rules engine for field teams, union scales,
                overtime structures, shift work, and job-based accounting.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-base font-semibold text-slate-50">
                Elevate360 Analytics
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Quant-grade analytics and trading architecture focused on
                discipline, KPIs, risk awareness, and fully logged execution—
                not gambling.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-base font-semibold text-slate-50">
                Elevate360 Ledger
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                A clean internal ledger designed around how your operation
                actually runs, not how generic accounting software expects it to
                run.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:col-span-2">
              <h3 className="text-base font-semibold text-slate-50">
                MatchMetrics (R&amp;D)
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                A privacy-first dating advisor that runs on user-defined
                heuristics instead of data harvesting—showing how the same
                engineering discipline applies to human systems.
              </p>
            </article>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            How Elevate360 builds
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Every platform and engagement is built on a few non-negotiable
            principles.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Privacy-first by design
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                No data brokering, no surprise integrations, no hidden
                analytics. Your operational and financial data stays under your
                control.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                No hype. No lies.
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                No 1000x promises. Just systems that can be measured, logged,
                and audited. If something doesn&apos;t work, it gets fixed—not
                marketed.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Built to be understood
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Clear interfaces, clear logs, clear KPIs. If a mechanic, a
                supervisor, or a CFO can&apos;t understand it, it doesn&apos;t
                ship.
              </p>
            </div>
          </div>
        </section>

               {/* SERVICES */}
        <section id="services" className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Work with Elevate360 Systems
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            This is not generic “consulting.” These engagements are for teams
            that want a serious engineer to look at their systems, tell the
            truth, and give a concrete technical path forward.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Service 1 */}
            <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
                Diagnostic
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-50">
                Systems Diagnostic &amp; Triage
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                Starting at $600
              </p>
              <p className="mt-2 text-sm text-slate-300">
                A focused 60–90 minute working session where we pull your
                systems apart, look at the real signals, and identify what&apos;s
                actually breaking under load.
              </p>
              <ul className="mt-3 flex-1 space-y-1.5 text-sm text-slate-300">
                <li>• Field payroll &amp; wage model issues</li>
                <li>• VPN / WireGuard / VPS configuration sanity check</li>
                <li>• Trading bot behavior &amp; risk diagnostics</li>
                <li>• Telemetry / logging that doesn&apos;t add up</li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                You leave with a clear list of issues, immediate fixes, and
                next steps. No fluff.
              </p>
            </article>

            {/* Service 2 */}
            <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
                Blueprint
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-50">
                Systems Blueprint &amp; Design Session
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                Starting at $1,800
              </p>
              <p className="mt-2 text-sm text-slate-300">
                A deep design engagement for teams that are ready to move from
                “we hacked this together” to “this is a real, documented
                system.” We map what you have and design what you actually need.
              </p>
              <ul className="mt-3 flex-1 space-y-1.5 text-sm text-slate-300">
                <li>• Telemetry &amp; observability architectures</li>
                <li>• Secure VPN / WireGuard / network layout</li>
                <li>• FieldPay / payroll / rules engine design</li>
                <li>• Trading infrastructure and risk frameworks</li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                You receive a written blueprint with diagrams and clear
                implementation steps—whether you execute internally or bring
                Elevate360 back to build it.
              </p>
            </article>

            {/* Service 3 */}
            <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
                Roadmap
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-50">
                Architecture &amp; Roadmap Intensive
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                Starting at $4,500
              </p>
              <p className="mt-2 text-sm text-slate-300">
                A strategic multi-session engagement for organizations that want
                a clear, honest, technically sound plan for the next 12–24
                months of their infrastructure and systems.
              </p>
              <ul className="mt-3 flex-1 space-y-1.5 text-sm text-slate-300">
                <li>• End-to-end architecture review</li>
                <li>• Security, networking, and reliability posture</li>
                <li>• Phased implementation roadmap with priorities</li>
                <li>• Build vs. buy recommendations, with trade-offs</li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                This is the engagement for when you&apos;re done guessing and
                want a real engineer to define how your systems should evolve.
              </p>
            </article>
          </div>
        </section>

        {/* ABOUT / FOUNDER */}
        <section
          id="about"
          className="mb-20 grid gap-10 lg:grid-cols-[1.4fr,1fr]"
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Built from the field up
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Elevate360 Systems LLC is an independent engineering studio
              focused on real-world operations: elevators, field teams, and
              financial flows. The work is grounded in thousands of hours of
              field experience—wiring 480V motors, troubleshooting controllers,
              and running routes under pressure—combined with software
              engineering and data science.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              That perspective shapes everything: tools must be understandable,
              observable, and actually useful at 2am on a call, not just
              impressive in a 2pm demo.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
              Founder
            </div>
            <h3 className="mt-3 text-base font-semibold text-slate-50">
              Daniel Berriel
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Field mechanic turned systems engineer and builder. Over the last
              100 days, Daniel has shipped multiple working platforms:
              predictive-maintenance tooling, a field-pay rules engine,
              quant-grade trading architecture, an internal ledger, and more.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Elevate360 exists to bring that same level of rigor and honesty to
              the organizations that actually keep infrastructure running.
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="mb-16 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 p-8 sm:p-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            See if Elevate360 is a fit
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-200">
            If you&apos;re running elevators, field teams, or complex financial
            flows and you&apos;re tired of software that looks good in a demo
            but falls apart in the real world, let&apos;s talk. The first step
            is a straightforward conversation about what you&apos;re trying to
            achieve and what&apos;s getting in the way.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="mailto:contact@elevate360systems.com"
              className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
            >
              Email Elevate360 Systems
            </a>
            <a
              href="#services"
              className="rounded-full border border-slate-400 px-6 py-2.5 text-sm font-semibold text-slate-50 transition hover:border-slate-200 hover:bg-slate-900"
            >
              Review service options
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-800 pt-6 text-xs text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Elevate360 Systems LLC.</div>
            <div className="flex gap-4">
              <span>Privacy-first engineering.</span>
              <span>No hype. No lies.</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
