"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
              E360
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-100">
                Elevate360 Systems<span className="align-super text-[0.55em]">™</span>
              </span>

              <span className="text-[0.65rem] tracking-wide text-slate-400">
                PREDICTING TOMORROW, TODAY.
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden gap-8 text-sm text-slate-300 md:flex">
            <a href="#platforms" className="hover:text-slate-50">Platforms</a>
            <a href="/matchmetrics" className="hover:text-slate-50">MatchMetrics</a>
            <a href="#built" className="hover:text-slate-50">Built & Running</a>
            <a href="#services" className="hover:text-slate-50">Services</a>
            <a href="#about" className="hover:text-slate-50">About</a>
            <a href="#contact" className="hover:text-slate-50">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-50 md:text-6xl">
          Built from experience. <br /> Engineered with discipline.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          Elevate360 Systems<span className="align-super text-[0.55em]">™</span> is a privacy-first engineering studio focused on real-world operations, applied mathematics, and practical systems thinking. I do not do hype. I build systems that are transparent, understandable, and grounded in physics and reality.
        </p>

        <p className="mt-4 text-sm text-slate-400">Predicting tomorrow, today.</p>

        <div className="mt-10 flex gap-4">
          <a
            href="#services"
            className="rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-500"
          >
            View consulting services
          </a>

          <a
            href="#platforms"
            className="rounded-full border border-slate-700 px-6 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-slate-50"
          >
            See what's already built
          </a>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-slate-50">
          The Elevate360 Systems<span className="align-super text-[0.55em]">™</span> platform
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
          A focused set of tools built on real field experience, each solving a specific operational problem instead of trying to be everything at once.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <PlatformCard
            title="Elevate360 Core Systems™"
            desc="Real-time operational insight and fault awareness for elevators and infrastructure shaped by someone who has actually been on the call when things go down."
          />
          <PlatformCard
            title="FieldPay™"
            desc="A wage and rules engine designed so the math matches the contract and the checks match the hours worked."
          />
          <PlatformCard
            title="Elevate360 Analytics™"
            desc="A disciplined analytics approach centered on measurable performance and clearly defined risk instead of predictions."
          />
          <PlatformCard
            title="Elevate360 Ledger™"
            desc="A transparent internal ledger concept so you can understand what moved, when, and why."
          />
          <PlatformCard
            title="MatchMetrics™ (R&D)"
            desc="A privacy-first advisor surfacing compatibility, alignment, and friction — without needing to send sensitive data."
          />
        </div>
      </section>

      {/* Built & Running */}
      <section id="built" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-slate-50">
          What’s actually running today
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-slate-300">
          These are real systems and experiments — some in daily use, some in R&D — all refined over time.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <PlatformCard
            title="Structured trading & analytics stack"
            desc="Clear metrics, risk awareness, and disciplined testing. No magic buttons."
          />
          <PlatformCard
            title="FieldPay™ wage & rules modeling"
            desc="Models real-world field pay situations with accuracy and transparency."
          />
          <PlatformCard
            title="Secure, segmented infrastructure"
            desc="A hardened environment separating personal, trading, and operational systems."
          />
          <PlatformCard
            title="Internal logging & audit trails"
            desc="A habit of logging decisions so the system always makes sense later."
          />
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-slate-50">
          Work with Elevate360 Systems
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-slate-300">
          These engagements are for teams that want technical truth, clarity, and a solid plan of action.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ServiceCard
            title="Systems Diagnostic & Triage"
            range="$800–$1,500"
            points={[
              "60–90 minute working session",
              "Identify failure modes",
              "Immediate fixes and next steps",
            ]}
          />
          <ServiceCard
            title="Blueprint & Design Session"
            range="$1,500–$3,000"
            points={[
              "Operational & data-flow mapping",
              "Security & reliability considerations",
              "A clear written blueprint",
            ]}
          />
          <ServiceCard
            title="Architecture & Roadmap"
            range="$4,500–$10,000"
            points={[
              "12–24 month roadmap",
              "Risk modeling",
              "Build vs. buy analysis",
            ]}
          />
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-slate-50">
          Built from the field up
        </h2>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
          Elevate360 Systems LLC is grounded in thousands of hours wiring 480V motors, troubleshooting controllers, and running routes under pressure — combined with software engineering and data.
        </p>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
          The intent isn’t to be the flashiest. It's to be the system that still makes sense a year later when things go wrong.
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-slate-50">
          See if Elevate360 Systems is a fit
        </h2>

        <p className="mt-4 max-w-xl text-sm text-slate-300">
          If you're running elevators, field teams, trading flows, or complex operations and want clarity instead of confusion — reach out.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="mailto:DanielBerriel@elevate360systems.com"
            className="rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-500"
          >
            Email Elevate360 Systems
          </a>

          <a
            href="#services"
            className="rounded-full border border-slate-700 px-6 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-slate-50"
          >
            Review service options
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Elevate360 Systems LLC. Privacy-first engineering. No hype. No lies.
      </footer>
    </main>
  );
}

function PlatformCard({ title, desc }: { title: string; desc: string }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{desc}</p>
    </article>
  );
}

function ServiceCard({
  title,
  range,
  points,
}: {
  title: string;
  range: string;
  points: string[];
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{range}</p>

      <ul className="mt-3 space-y-1 text-sm text-slate-300">
        {points.map((p, i) => (
          <li key={i}>• {p}</li>
        ))}
      </ul>
    </article>
  );
}
