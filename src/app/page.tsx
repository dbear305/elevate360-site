export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">

      {/* ========================= */}
      {/*        HERO SECTION       */}
      {/* ========================= */}
      <section className="mt-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
          Privacy-first engineering for{" "}
          <span className="text-sky-400">real-world systems.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300">
          Elevate360 Systems is a privacy-first engineering studio specializing in
          secure software, automation, applied mathematics, cybersecurity, and
          infrastructure. We build precise, high-integrity systems that work in the
          environments where most software breaks — with no hype, no noise, and no
          data selling. 
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#services"
            className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition">
            View Consulting Services
          </a>
          
          <a
            href="#products"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold 
              text-slate-300 hover:border-slate-500 hover:text-slate-50 transition">
            Explore Platforms
          </a>

          <a
            href="/matchmetrics"
            className="rounded-full px-8 py-3 text-sm font-semibold 
              border border-sky-600 text-sky-400 hover:bg-sky-600 hover:text-white transition">
            MatchMetrics
          </a>
        </div>

        <div className="mt-14 grid max-w-xl grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Focus</p>
            <p className="font-medium text-slate-100">
              Systems engineering, cybersecurity, automation
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
              Operators, founders, technical teams
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Engagements</p>
            <p className="font-medium text-slate-100">
              Targeted builds, long-term systems
            </p>
          </div>
        </div>
      </section>


      {/* ========================= */}
      {/*       CORE DOMAINS        */}
      {/* ========================= */}
      <section className="mt-28" id="services">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Engineering Services Built for Reality
        </h2>

        <p className="mt-4 max-w-2xl text-base text-slate-300">
          Every system we build is designed for durability, clarity, and 
          operational correctness — not demos or marketing slides. 
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="text-sm font-semibold text-slate-50">Software & Systems Engineering</h3>
            <p className="mt-3 text-xs text-slate-300">
              Custom backend systems, automation pipelines, operational tools, and 
              full-stack engineering with an emphasis on clarity and maintainability.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="text-sm font-semibold text-slate-50">Cybersecurity & Infrastructure</h3>
            <p className="mt-3 text-xs text-slate-300">
              Hardened deployments, WireGuard, SSH/iptables/fail2ban, encryption 
              layers, VPS optimization, and resilient environments.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="text-sm font-semibold text-slate-50">Applied Mathematics & Analytics</h3>
            <p className="mt-3 text-xs text-slate-300">
              Predictive modeling, scenario analysis, optimization, trading engines,
              and quantitative diagnostics.
            </p>
          </div>
        </div>
      </section>


      {/* ========================= */}
      {/*         PLATFORMS         */}
      {/* ========================= */}
      <section id="products" className="mt-28">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Platforms in the Elevate360 Ecosystem
        </h2>

        <p className="mt-4 max-w-2xl text-base text-slate-300">
          These platforms are engineered from scratch — no templates, no external
          dependencies, and no data harvesting.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          {/* FieldPay */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-50">FieldPay™</h3>
            <p className="mt-3 text-xs text-slate-300">
              Rule-driven payroll and time logic for field teams — transparent, 
              structured, and built for accuracy.
            </p>
          </div>

          {/* Ledger360 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-50">Ledger360</h3>
            <p className="mt-3 text-xs text-slate-300">
              Local-first operational accounting with full data ownership and 
              verifiable structure.
            </p>
          </div>

          {/* Trading Bot */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-50">Custom Trading Engines</h3>
            <p className="mt-3 text-xs text-slate-300">
              Proprietary trading engines engineered for multi-frame analysis, 
              discipline, and risk control.
            </p>
          </div>

          {/* MatchMetrics */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-50">MatchMetrics™</h3>
            <p className="mt-3 text-xs text-slate-300">
              A real-time relationship analytics engine scoring alignment, values, 
              behavioral markers, and long-term stability.
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
      {/*           ABOUT           */}
      {/* ========================= */}
      <section id="about" className="mt-28">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Built by an engineer who lives in the systems
        </h2>

        <p className="mt-4 max-w-2xl text-base text-slate-300">
          Elevate360 Systems is operated by an engineer with hands-on experience in 
          mechanical systems, electrical systems, field operations, software, 
          cybersecurity, and quantitative modeling. The philosophy is simple:
          build systems that withstand reality — not demos.
        </p>

        <div className="mt-10 grid gap-6 text-sm text-slate-200 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Philosophy
            </p>
            <p className="mt-3 text-xs text-slate-300">
              No hype. No noise. No data brokerage. Just engineering grounded in 
              physics, constraints, and clarity.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Style
            </p>
            <p className="mt-3 text-xs text-slate-300">
              Direct, disciplined, field-tested systems thinking. 
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Fit
            </p>
            <p className="mt-3 text-xs text-slate-300">
              For founders and operators who value transparency, durability, 
              and long-term reliability.
            </p>
          </div>
        </div>
      </section>


      {/* ========================= */}
      {/*          CONTACT          */}
      {/* ========================= */}
      <section id="contact" className="mt-32 mb-20">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">
          Contact Elevate360 Systems
        </h2>

        <p className="mt-4 max-w-2xl text-base text-slate-300">
          For engineering, cybersecurity, automation, consulting, or system design
          inquiries, reach out directly.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 text-slate-300 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-400">Business Phone</p>
            <a
              href="tel:+13052090418"
              className="text-lg font-medium text-slate-50 hover:text-sky-400 transition">
              (305) 209-0418
            </a>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-400">Email</p>
            <a
              href="mailto:contact@elevate360systems.com"
              className="text-lg font-medium text-slate-50 hover:text-sky-400 transition">
              contact@elevate360systems.com
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="mailto:contact@elevate360systems.com"
            className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition">
            Email Elevate360
          </a>

          <a
            href="#services"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold 
            text-slate-300 hover:border-slate-500 hover:text-slate-50 transition">
            View Services
          </a>

          <a
            href="/matchmetrics"
            className="rounded-full border border-sky-600 px-8 py-3 text-sm font-semibold 
            text-sky-400 hover:bg-sky-600 hover:text-white transition">
            MatchMetrics
          </a>
        </div>
      </section>

    </main>
  );
}
