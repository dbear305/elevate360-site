// src/app/page.tsx
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 lg:pt-16">
        {/* HEADER */}
        <header className="mb-16 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight">
              Elevate360 Systems<span className="align-super text-[0.55em]">™</span>
            </div>
            <div className="mt-1 text-[0.7rem] uppercase tracking-[0.25em] text-slate-400">
              Predicting tomorrow, today.
            </div>
          </div>
          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#platforms" className="hover:text-slate-50">
              Platforms
            </a>
            <a href="#built" className="hover:text-slate-50">
              Built &amp; Running
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
              Built from experience.
              <br className="hidden sm:block" />
              Engineered with discipline.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Elevate360 Systems<span className="align-super text-[0.55em]">™</span> is a
              privacy-first engineering studio focused on real-world operations,
              applied mathematics, and practical systems thinking. I don&apos;t
              do hype—I build systems that are transparent, understandable, and
              grounded in the physics and constraints of reality.
            </p>
            <p className="mt-3 max-w-xl text-sm text-slate-400">
              Predicting tomorrow, today.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#services"
                className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
              >
                View consulting services
              </a>
              <a
                href="#built"
                className="rounded-full border border-slate-600 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-900"
              >
                See what&apos;s already built
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
                  Telemetry and status you don&apos;t have to guess about.
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4">
                <div className="text-xs text-slate-400">Financial Flows</div>
                <div className="mt-2 text-sm font-semibold text-slate-50">
                  Trading and ledger behavior with a clear paper trail.
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
                  Local-first where it makes sense. Your data stays your data.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORMS */}
        <section id="platforms" className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            The Elevate360 Systems<span className="align-super text-[0.55em]">™</span> platform
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            A focused set of tools built on real field experience—each solving a
            specific operational problem instead of trying to be everything at
            once.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-base font-semibold text-slate-50">
                Elevate360 Core Systems
                <span className="align-super text-[0.55em]">™</span>
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Real-time operational insight and fault awareness for elevators
                and infrastructure—shaped by someone who&apos;s actually been
                on the call when things are down.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-base font-semibold text-slate-50">
                FieldPay<span className="align-super text-[0.55em]">™</span>
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                A wage and rules engine for field teams and complex agreements.
                Designed so the math matches the contract and the checks match
                the hours.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-base font-semibold text-slate-50">
                Elevate360 Analytics
                <span className="align-super text-[0.55em]">™</span>
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                A disciplined analytics approach for markets and operations,
                centered on measurable performance and clearly defined risk
                instead of predictions without receipts.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-base font-semibold text-slate-50">
                Elevate360 Ledger
                <span className="align-super text-[0.55em]">™</span>
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                An internal ledger concept focused on traceability and
                simplicity—so you can understand what moved, when, and why,
                without digging through three different systems.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:col-span-2">
              <h3 className="text-base font-semibold text-slate-50">
                MatchMetrics<span className="align-super text-[0.55em]">™</span> (R&amp;D)
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                An experimental, privacy-focused mobile concept aimed at helping
                people make better relationship and dating decisions without
                handing all of their data to a third party. It&apos;s still in
                development, and that&apos;s intentional.
              </p>
            </article>
          </div>
        </section>

        {/* BUILT & RUNNING */}
        <section id="built" className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            What&apos;s actually running today
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            This is not a roadmap slide. These are real systems and experiments
            that have been built, run, and refined—some in active daily use,
            some in controlled R&amp;D.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <h3 className="text-sm font-semibold text-slate-50">
                Structured trading &amp; analytics stack
              </h3>
              <p className="mt-1">
                A disciplined framework for testing and running trading logic
                with clear metrics and risk awareness. No magic buttons—just
                structured decision support.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <h3 className="text-sm font-semibold text-slate-50">
                FieldPay<span className="align-super text-[0.55em]">™</span> rules &amp; wage modeling
              </h3>
              <p className="mt-1">
                A working rules model for complex field pay situations,
                including different rates, conditions, and job types—built to
                mirror how work actually happens.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <h3 className="text-sm font-semibold text-slate-50">
                Secure, segmented infrastructure
              </h3>
              <p className="mt-1">
                A hardened environment for running tools and experiments with
                careful separation between personal systems, trading systems,
                and operational systems.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <h3 className="text-sm font-semibold text-slate-50">
                Internal logging &amp; audit trails
              </h3>
              <p className="mt-1">
                A habit and framework of logging key events, decisions, and
                changes, so it&apos;s possible to understand what the system did
                later without guessing.
              </p>
            </div>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            How Elevate360 Systems builds
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            The approach is simple: stay honest, keep things observable, and
            respect the people who have to live with the system once it goes
            live.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Privacy-first by default
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                No data selling, no surprise integrations. Designs lean toward
                local processing and minimal data sharing wherever possible.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                No hype. No lies.
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                If something works, there are logs and metrics. If something is
                still experimental, it&apos;s called that openly. No inflated
                claims.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Built to be understood
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Clear interfaces, clear KPIs, and a focus on explaining
                decisions instead of hiding them behind a model nobody can
                reason about.
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
            These engagements are for teams that want a serious engineer to look
            at their systems, tell the truth, and give a concrete technical path
            forward. Pricing shown is a typical range; larger or more complex
            systems are scoped individually.
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
                Typical engagement: $800–$1,500
              </p>
              <p className="mt-2 text-sm text-slate-300">
                A focused 60–90 minute working session where we walk through
                your current setup, look at signals and failure modes, and
                identify what&apos;s actually causing pain.
              </p>
              <ul className="mt-3 flex-1 space-y-1.5 text-sm text-slate-300">
                <li>• Field payroll &amp; wage model issues</li>
                <li>• System behavior that doesn&apos;t match expectations</li>
                <li>• Gaps in logging, visibility, or metrics</li>
                <li>• General &quot;I don&apos;t trust this&quot; situations</li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                You leave with a clear list of issues, immediate fixes, and
                suggested next steps.
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
                Typical engagement: $1,500–$3,000
              </p>
              <p className="mt-2 text-sm text-slate-300">
                A deeper design engagement for teams that are ready to move from
                &quot;we hacked this together&quot; to &quot;this is a real,
                documented system.&quot; We map what you have and design what
                you actually need.
              </p>
              <ul className="mt-3 flex-1 space-y-1.5 text-sm text-slate-300">
                <li>• Operational and data-flow mapping</li>
                <li>• Security and reliability considerations</li>
                <li>• Interfaces and handoffs between systems</li>
                <li>• A clear, written blueprint you can execute on</li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                You receive a design that respects both technical reality and
                how your people actually work.
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
                Typical engagement: $4,500–$10,000
              </p>
              <p className="mt-2 text-sm text-slate-300">
                A strategic multi-session engagement for organizations that want
                a clear, honest plan for the next 12–24 months of their systems
                and infrastructure.
              </p>
              <ul className="mt-3 flex-1 space-y-1.5 text-sm text-slate-300">
                <li>• End-to-end architecture review</li>
                <li>• Risk, failure modes, and trade-offs</li>
                <li>• Phased implementation roadmap with priorities</li>
                <li>• Build vs. buy recommendations, grounded in reality</li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                The outcome is a roadmap you can put in front of leadership,
                engineering, and operations without having to translate it.
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
              engineering and data.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              The intent isn&apos;t to be the flashiest system in the room. It&apos;s
              to be the one that still makes sense a year later when you&apos;re
              trying to understand what happened.
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
              Field mechanic turned systems engineer and builder. Over a focused
              sprint, Daniel shipped multiple working platforms, internal tools,
              and experimental systems—while keeping a strict focus on
              traceability, safety, and respect for the people in the loop.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              The approach is quiet on purpose: build, observe, refine, and let
              the systems speak for themselves.
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="mb-16 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 p-8 sm:p-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            See if Elevate360 Systems is a fit
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
              href="mailto:danielberriel@elevate360systems.com"
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
            <div>
              © {new Date().getFullYear()} Elevate360 Systems LLC. All rights
              reserved.
            </div>
            <div className="flex flex-col items-start gap-1 text-[0.7rem] sm:flex-row sm:items-center sm:gap-4">
              <span>
                Elevate360 Systems<span className="align-super text-[0.55em]">™</span>, FieldPay
                <span className="align-super text-[0.55em]">™</span>, MatchMetrics
                <span className="align-super text-[0.55em]">™</span>, and related marks are trademarks of
                Elevate360 Systems LLC.
              </span>
              <span>Predicting tomorrow, today.</span>
              <span>Privacy-first engineering. No hype. No lies.</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
