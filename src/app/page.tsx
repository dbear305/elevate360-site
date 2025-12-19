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
          </a>{" "}
          across secure software, cybersecurity hardening, workflow automation,
          applied mathematics, and infrastructure design. Every system is built
          for clarity, durability, and operational integrity — with no hype, no
          noise, and no data selling.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/engineering-consulting"
            className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition"
          >
            Engineering Consulting
          </a>

          <a
            href="#platforms"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold
              text-slate-300 hover:border-slate-500 hover:text-slate-50 transition"
          >
            Explore Platforms
          </a>
        </div>

        <div className="mt-14 grid max-w-xl grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Focus</p>
            <p className="font-medium text-slate-100">
              Engineering, cybersecurity, automation systems
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
      {/*        SERVICES           */}
      {/* ========================= */}
      <section className="mt-28" id="services">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Engineering Consulting Built for Operational Reality
        </h2>

        <p className="mt-4 max-w-2xl text-base text-slate-300">
          We work with teams operating in environments where reliability,
          security, and clarity matter more than demos or slide decks. Our
          consulting engagements focus on systems that must perform under real
          constraints.
        </p>

        <div className="mt-8">
          <a
            href="/engineering-consulting"
            className="inline-block rounded-full border border-sky-600 px-6 py-3
              text-sm font-semibold text-sky-400 hover:bg-sky-600 hover:text-white transition"
          >
            View Engineering Consulting
          </a>
        </div>
      </section>

      {/* ========================= */}
      {/*        PLATFORMS          */}
      {/* ========================= */}
      <section id="platforms" className="mt-28">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Operational Platforms
        </h2>

        <p className="mt-4 max-w-2xl text-base text-slate-300">
          In addition to consulting, Elevate360 builds internal platforms that
          solve recurring operational problems with transparency and discipline.
          These tools are designed from the field up — not as generic SaaS.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-sm font-semibold text-slate-50">FieldPay™</h3>
            <p className="mt-3 text-xs text-slate-300">
              Vendor-agnostic payroll logic for field operations. Technician-visible
              pay previews, supervisor review and override, and audit-ready
              breakdowns that prevent payroll disputes before they happen.
            </p>

            <a
              href="/fieldpay"
              className="mt-4 inline-block rounded-full border border-sky-600 px-5 py-2
                text-xs font-semibold text-sky-400 hover:bg-sky-600 hover:text-white transition"
            >
              Explore FieldPay
            </a>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-sm font-semibold text-slate-50">MatchMetrics™</h3>
            <p className="mt-3 text-xs text-slate-300">
              Advisory-only analytics for decision clarity across relationships,
              teams, and work. Privacy-first, non-diagnostic, and human-controlled
              by design.
            </p>

            <a
              href="/matchmetrics"
              className="mt-4 inline-block rounded-full border border-sky-600 px-5 py-2
                text-xs font-semibold text-sky-400 hover:bg-sky-600 hover:text-white transition"
            >
              Explore MatchMetrics
            </a>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            <h3 className="text-sm font-semibold text-slate-50">Additional Platforms</h3>
            <p className="mt-3 text-xs text-slate-400">
              Additional operational tooling and analytics platforms are developed
              internally and introduced selectively through consulting engagements.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/*   START AN ENGAGEMENT     */}
      {/* ========================= */}
      <section className="mt-28 rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
          A Simple Way to Start
        </h2>

        <p className="mt-4 max-w-3xl text-base text-slate-300">
          Most engagements begin with a short monthly engagement. This provides
          priority access, rapid response, and hands-on engineering support
          without a long-term commitment.
        </p>

        <p className="mt-3 max-w-3xl text-sm text-slate-400">
          This is typically how teams validate FieldPay and determine whether a
          larger engagement makes sense.
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
            href="/fieldpay"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold
              text-slate-300 hover:border-slate-500 hover:text-slate-50 transition"
          >
            Learn About FieldPay
          </a>
        </div>
      </section>

      {/* ========================= */}
      {/*        CONTACT            */}
      {/* ========================= */}
      <section id="contact" className="mt-32 mb-20">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Start a Conversation
        </h2>

        <p className="mt-4 max-w-2xl text-base text-slate-300">
          If you’re dealing with fragile systems, unclear payroll logic, or
          operational tooling that no longer scales, reach out. We’ll assess the
          problem and determine whether an engineering engagement or platform
          pilot makes sense.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="mailto:contact@elevate360systems.com"
            className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition"
          >
            Contact Elevate360
          </a>

          <a
            href="/fieldpay"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold
              text-slate-300 hover:border-slate-500 hover:text-slate-50 transition"
          >
            View FieldPay
          </a>
        </div>
      </section>

    </main>
  );
}
