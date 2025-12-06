// src/app/page.tsx
"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">

      {/* Header / Navigation */}
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
            <a href="#platforms" className="hover:text-slate-50">
              Platforms
            </a>

            <a href="/matchmetrics" className="hover:text-slate-50">
              MatchMetrics
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-50 md:text-6xl">
          Built from experience. <br /> Engineered with discipline.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          Elevate360 Systems<span className="align-super text-[0.55em]">™</span> is
          a privacy-first engineering studio focused on real-world operations,
          applied mathematics, and practical systems thinking. I don&apos;t do
          hype I build systems that are transparent, understandable, and grounded
          in the physics and constraints of reality.
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
            See what&apos;s already built
          </a>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-slate-50">
          The Elevate360 Systems<span className="align-super text-[0.55em]">™</span>{" "}
          platform
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
          A focused set of tools built on real field experience each solving a
          specific operational problem instead of trying to be everything at once.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <PlatformCard
            title="Elevate360 Core Systems™"
            desc="Real-time operational insight and fault awareness for elevators and infrastructure shaped by someone who's actually been on the call when things go down."
          />

          <PlatformCard
            title="FieldPay™"
            desc="A wage and rules engine for field teams and complex agreements designed so the math matches the contract and the checks match the hours."
          />

          <PlatformCard
            title="Elevate360 Analytics™"
            desc="A disciplined analytics approach centered on measurable performance and clearly defined risk instead of predictions without receipts."
          />

          <PlatformCard
            title="Elevate360 Ledger™"
            desc="A traceable, transparent internal ledger concept so you can understand what moved, when, and why without digging through three systems."
          />

          <PlatformCard
            title="MatchMetrics™ (R&D)"
            desc="A privacy-first advisory engine designed to surface compatibility, alignment, and friction across multiple verticals all without sending sensitive data to a third party."
          />
        </div>
      </section>

      {/* Built & Running */}
      <section id="built" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-slate-50">
          What&apos;s actually running today
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-slate-300">
          These aren't roadmap slides. These are real systems and experiments
          that have been built, run, and refined some in active daily use, some
          in controlled R&D.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <PlatformCard
            title="Structured trading & analytics stack"
            desc="A disciplined testing framework with clear metrics and risk awareness. No magic buttons just structured decision support."
          />
          <PlatformCard
            title="FieldPay™ wage & rules modeling"
            desc="Models real-world field pay situations including rates, conditions, job types, and contract rules built to mirror how work actually happens."
          />
          <PlatformCard
            title="Secure, segmented infrastructure"
            desc="A hardened environment for tools and experiments, separating personal systems, trading systems, and operational systems."
          />
          <PlatformCard
            title="Internal logging & audit trails"
            desc="A habit and framework of logging key decisions and changes so the system makes sense later without guessing."
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-slate-50">
          Work with Elevate360 Systems
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-slate-300">
          These engagements are for teams that want a serious engineer to examine their systems,
          tell the truth, and give a concrete path forward.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ServiceCard
            title="Systems Diagnostic & Triage"
            range="$800–$1,500"
            points={[
              "60–90 minute working session",
              "Identify failure modes & what’s actually causing pain",
              "Immediate fixes & suggested next steps"
            ]}
          />
          <ServiceCard
            title="Blueprint & Design Session"
            range="$1,500–$3,000"
            points={[
              "Operational & data-flow mapping",
              "Security & reliability considerations",
              "A clear written blueprint you can execute on"
            ]}
          />
          <ServiceCard
            title="Architecture & Roadmap"
            range="$4,500–$10,000"
            points={[
              "12–24 month roadmap",
              "Trade-offs & risk modeling",
              "Build vs. buy recommendations"
            ]}
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-slate-50">Built from the field up</h2>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
          Elevate360 Systems LLC is an independent engineering studio grounded in thousands of hours of field experience wiring 480V motors, troubleshooting controllers, and running routes under pressure combined with software engineering and data.
        </p>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
          The intent isn&apos;t to be the flashiest system in the room. It&apos;s to be the one that still makes sense a year later when you&apos;re trying to understand what happened.
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-slate-50">
          See if Elevate360 Systems is a fit
        </h2>

        <p className="mt-4 max-w-xl text-sm text-slate-300">
          If you're running elevators, field teams, trading flows, or complex operations and you're tired of software that looks good in a demo but falls apart in the real world, let's talk.
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

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Elevate360 Systems LLC. Privacy-first engineering.
        No hype. No lies.
      </footer>
    </main>
  );
}

/* Reusable Cards */
function PlatformCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
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
