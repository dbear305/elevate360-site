// app/page.tsx or pages/index.tsx

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* NAVBAR */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-600" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide text-slate-100">
                Elevate360 Systems
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Privacy-First Engineering Studio
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#services" className="hover:text-sky-400">
              Services
            </a>
            <a href="#products" className="hover:text-sky-400">
              Platforms
            </a>
            <a href="#about" className="hover:text-sky-400">
              About
            </a>
            <a href="#contact" className="hover:text-sky-400">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-slate-900 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              Engineering • Cybersecurity • Applied Mathematics
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
              Privacy-first engineering for{" "}
              <span className="text-sky-400">
                real-world systems.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Elevate360 Systems designs and builds secure, high-integrity
              software, automation, and analytics for operations, field teams,
              trading systems, and infrastructure. No templates, no data
              selling—just precise systems that work.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#services"
                className="rounded-full bg-sky-600 px-7 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition-colors"
              >
                View engineering services
              </a>
              <a
                href="#contact"
                className="rounded-full border border-slate-700 px-7 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:text-slate-50 transition-colors"
              >
                Talk to Elevate360
              </a>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-6 text-xs text-slate-300 sm:text-sm">
              <div>
                <dt className="text-slate-400">Focus</dt>
                <dd className="font-medium text-slate-100">
                  Systems engineering, cybersecurity, automation
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Approach</dt>
                <dd className="font-medium text-slate-100">
                  Privacy-first, local-first, no-hype delivery
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Clients</dt>
                <dd className="font-medium text-slate-100">
                  Operators, founders, technical teams
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Engagements</dt>
                <dd className="font-medium text-slate-100">
                  Targeted builds, long-term systems
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex-1">
            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl sm:mt-0 lg:ml-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Core domains
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-100">
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <span>
                    <span className="font-semibold">Engineering & Automation</span>{" "}
                    — custom backend systems, workflow engines, field-ready tooling.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>
                    <span className="font-semibold">Cybersecurity & Infrastructure</span>{" "}
                    — VPS deployment, WireGuard, hardening, fail2ban, encryption.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-violet-500" />
                  <span>
                    <span className="font-semibold">Analytics & Applied Mathematics</span>{" "}
                    — predictive models, trading engines, diagnostics, and forecasting.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-b border-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-50">
            Engineering services built for reality
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            Elevate360 Systems focuses on deep, multi-discipline work instead of
            surface-level consulting. Everything is designed, built, and hardened
            for real operations, not demo environments.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Software & Systems Engineering
              </h3>
              <p className="mt-3 text-xs text-slate-300">
                Custom backend services, automation pipelines, operational tools,
                and full-stack systems tuned for performance, clarity, and long-term
                maintainability.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Cybersecurity & Infrastructure
              </h3>
              <p className="mt-3 text-xs text-slate-300">
                VPS deployment, network hardening, WireGuard, SSH/iptables/fail2ban
                configuration, encryption layers, and secure remote access built to
                be resilient and predictable.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Analytics & Applied Mathematics
              </h3>
              <p className="mt-3 text-xs text-slate-300">
                Applied math engines, forecasting, diagnostics, risk analysis, and
                decision-support systems that turn raw signals into structured,
                actionable intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS / PLATFORMS */}
      <section id="products" className="border-b border-slate-900 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-50">
            Platforms in the Elevate360 ecosystem
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            Elevate360 Systems is not a slide deck—it’s a working ecosystem of
            tools, engines, and platforms designed to solve real problems across
            operations, finance, security, and decision-making.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                FieldPay™ — Payroll & Operations Engine
              </h3>
              <p className="mt-3 flex-1 text-xs text-slate-300">
                Rule-driven payroll and time logic for field teams and
                technicians—overtime, differentials, exceptions, and audits with
                zero guesswork and no data selling.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Ledger360 — Local-First Financial Logic
              </h3>
              <p className="mt-3 flex-1 text-xs text-slate-300">
                Privacy-first financial logic for income, expenses, and
                operational flows—designed to keep your records local, verifiable,
                and fully under your control.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Custom Trading Engines
              </h3>
              <p className="mt-3 flex-1 text-xs text-slate-300">
                Individually-built, proprietary trading engines with structured
                risk logic and disciplined automation. Every system is custom, no
                templates, no marketplace scripts.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Applied Mathematics Engine
              </h3>
              <p className="mt-3 flex-1 text-xs text-slate-300">
                A framework for modeling, optimization, diagnostics, and scenario
                analysis across technical, financial, and operational systems.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Predictive Maintenance Systems
              </h3>
              <p className="mt-3 flex-1 text-xs text-slate-300">
                Telemetry-driven insight for equipment, signals, and operations—
                forecasting failures, surfacing drift, and reducing downtime.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-sm font-semibold text-slate-50">
                Cybersecurity & Hardening Suite
              </h3>
              <p className="mt-3 flex-1 text-xs text-slate-300">
                Hardened deployment patterns for VPS, WireGuard, SSH, fail2ban,
                and layered defenses that prioritize privacy, stability, and
                control over your infrastructure.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-b border-slate-900 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-50">
            Built by an engineer who lives in the systems
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            Elevate360 Systems is operated by a hands-on engineer with real
            experience in field operations, mechanical and electrical work,
            software, security, and quantitative systems. The goal is simple:
            build tools that actually work in the environments where most
            software fails.
          </p>

          <div className="mt-10 grid gap-6 text-sm text-slate-200 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Philosophy
              </p>
              <p className="mt-3 text-xs text-slate-300">
                Privacy-first, no-hype, no data brokerage, and clear explanations
                instead of smoke and mirrors.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Style
              </p>
              <p className="mt-3 text-xs text-slate-300">
                Direct, technical, and grounded in real-world constraints—
                elevators, field teams, infrastructure, and production systems.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Fit
              </p>
              <p className="mt-3 text-xs text-slate-300">
                Best suited for founders, operators, and teams who care more
                about reliability and clarity than buzzwords.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Contact Elevate360 Systems
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base leading-relaxed">
          For engineering, cybersecurity, automation, consulting, or system
          design inquiries, reach out through any of the channels below. All
          communication is private, secure, and handled directly by
          Elevate360 Systems.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 text-slate-300 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-400">
              Business Phone
            </p>
            <a
              href="tel:+13052090418"
              className="text-lg font-medium text-slate-50 hover:text-sky-400 transition"
            >
              (305) 209-0418
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-400">
              General Inquiries
            </p>
            <a
              href="mailto:contact@elevate360systems.com"
              className="text-lg font-medium text-slate-50 hover:text-sky-400 transition"
            >
              contact@elevate360systems.com
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-400">Support</p>
            <a
              href="mailto:support@elevate360systems.com"
              className="text-lg font-medium text-slate-50 hover:text-sky-400 transition"
            >
              support@elevate360systems.com
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-400">
              Administrative
            </p>
            <a
              href="mailto:admin@elevate360systems.com"
              className="text-lg font-medium text-slate-50 hover:text-sky-400 transition"
            >
              admin@elevate360systems.com
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="mailto:contact@elevate360systems.com"
            className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition-colors"
          >
            Email Elevate360 Systems
          </a>

          <a
            href="#services"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-slate-50 transition-colors"
          >
            View engineering services
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Elevate360 Systems LLC. Privacy-first
            engineering & applied systems design.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:contact@elevate360systems.com"
              className="hover:text-sky-400"
            >
              contact@elevate360systems.com
            </a>
            <span className="hidden text-slate-600 sm:inline">•</span>
            <a href="tel:+13052090418" className="hover:text-sky-400">
              (305) 209-0418
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
