export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">

      {/* ========================= */}
      {/*        HERO SECTION       */}
      {/* ========================= */}
      <section className="mt-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
          Engineering, Cybersecurity, Automation & Applied Mathematics for{" "}
          <span className="text-sky-400">real-world systems.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300">
          Elevate360 Systems delivers{" "}
          <a
            href="/engineering-consulting"
            className="text-sky-400 underline hover:text-sky-300 transition"
          >
            engineering consulting for real-world systems
          </a>
          {" "}across secure software, cybersecurity hardening, workflow automation,
          applied mathematics, and infrastructure design. Every system is engineered
          for clarity, durability, and operational integrity — built to perform where
          most software breaks, with no hype, no noise, and no data selling.
        </p>

        {/* PRIMARY CTAs */}
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/engineering-consulting"
            className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition"
          >
            Engineering Consulting Services
          </a>

          <a
            href="#products"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold
              text-slate-300 hover:border-slate-500 hover:text-slate-50 transition"
          >
            Explore Platforms
          </a>

          <a
            href="/matchmetrics"
            className="rounded-full border border-sky-600 px-8 py-3 text-sm font-semibold
              text-sky-400 hover:bg-sky-600 hover:text-white transition"
          >
            MatchMetrics
          </a>
        </div>

        {/* SUMMARY GRID */}
        <div className="mt-14 grid max-w-xl grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Focus</p>
            <p className="font-medium text-slate-100">
              Engineering consulting, cybersecurity, automation systems
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Approach</p>
            <p className="font-medium text-slate-100">
              Privacy-first, local-first, no-hype delivery
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Clients</p>
            <p className="font-medium text-slate-100">
              Operators, founders, engineering teams
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Engagements</p>
            <p className="font-medium text-slate-100">
              Targeted builds, long-term systems engineering
            </p>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/*       SERVICES HUB        */}
      {/* ========================= */}
      <section className="mt-28" id="services">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Engineering Consulting Built for Operational Reality
        </h2>

        <p className="mt-4 max-w-2xl text-base text-slate-300">
          Our{" "}
          <a
            href="/engineering-consulting"
            className="text-sky-400 underline hover:text-sky-300 transition"
          >
            engineering consulting practice
          </a>
          {" "}supports teams operating in environments where reliability, security,
          and clarity matter more than demos or slide decks.
        </p>

        <div className="mt-8">
          <a
            href="/engineering-consulting"
            className="inline-block rounded-full border border-sky-600 px-6 py-3
              text-sm font-semibold text-sky-400 hover:bg-sky-600 hover:text-white transition"
          >
            View Engineering Consulting Details
          </a>
        </div>
      </section>

      {/* ========================= */}
      {/*         PLATFORMS         */}
      {/* ========================= */}
      <section id="products" className="mt-28">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Operational Platforms Built From the Field Up
        </h2>

        <p className="mt-4 max-w-2xl text-base text-slate-300">
          The Elevate360 ecosystem includes operational platforms engineered from
          scratch — no templates, no external dependencies, and no data harvesting.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-50">FieldPay™</h3>
            <p className="mt-3 text-xs text-slate-300">
              Rule-driven payroll and time logic for field teams with transparency,
              structure, and accuracy.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-50">Ledger360</h3>
            <p className="mt-3 text-xs text-slate-300">
              Local-first operational accounting with full data ownership and
              verifiable structure.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-50">MatchMetrics™</h3>
            <p className="mt-3 text-xs text-slate-300">
              Real-time alignment analytics scoring behavioral patterns, values,
              and long-term stability.
            </p>

            <a
              href="/matchmetrics"
              className="mt-4 inline-block rounded-full border border-sky-600 px-5 py-2
                text-xs font-semibold text-sky-400 hover:bg-sky-600 hover:text-white transition"
            >
              Explore MatchMetrics
            </a>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/*          CONTACT          */}
      {/* ========================= */}
      <section id="contact" className="mt-32 mb-20">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Start an Engineering Engagement
        </h2>

        <p className="mt-4 max-w-2xl text-base text-slate-300">
          If you need clarity, security, or operational reliability, reach out and
          we’ll define the fastest path to a durable solution.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="/engineering-consulting"
            className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition"
          >
            Engineering Consulting
          </a>

          <a
            href="mailto:contact@elevate360systems.com"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold
              text-slate-300 hover:border-slate-500 hover:text-slate-50 transition"
          >
            Contact Elevate360
          </a>
        </div>
      </section>

    </main>
  );
}
