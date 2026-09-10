import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./contact-form";
import { TrackedLink } from "./tracked-link";

const phoneDisplay = "786-312-7320";
const phoneHref = "tel:+17863127320";
const email = "contact@elevate360systems.com";
const emailHref =
  "mailto:contact@elevate360systems.com?subject=Elevate360%20Project%20Inquiry";

type CaseStudy = {
  client: string;
  industry: string;
  problem: string;
  work: string;
  result: string;
  metric: string;
  date: string;
};

// Add the first referenceable customer result here when it is approved.
// The section stays out of the rendered page until a real case study exists.
const caseStudies: CaseStudy[] = [];

const systemsWork = [
  "Secure infrastructure, network control, and observability",
  "Custom operational software and internal tools",
  "Workflow automation and data reconciliation",
  "Applied R&D for field and industrial systems",
];

const proofPoints = [
  {
    title: "Dedicated firewall appliance",
    description:
      "A real network control layer built on dedicated hardware, not a consumer router or generic plug-in device.",
  },
  {
    title: "Private WireGuard routing",
    description:
      "Critical traffic can be routed through controlled tunnel paths instead of shared consumer VPN infrastructure.",
  },
  {
    title: "Segmentation by device purpose",
    description:
      "Protected systems, workstations, and general devices can be separated so the whole environment is not treated the same.",
  },
  {
    title: "Tested under real load",
    description:
      "Traffic behavior is checked under active use with bufferbloat testing, latency review, and load-based tuning.",
  },
];

const builtSystems = [
  {
    title: "NetTruth QuickCheck",
    description:
      "A free browser test for download, upload, latency, jitter, delay under load, and UDP packet loss. See what the measurements suggest and export the evidence before changing your equipment or service.",
  },
  {
    title: "FieldPay",
    description:
      "Rules-driven pay validation for field operations. Models time, lunch, differentials, overscale, and supervisor overrides, then produces transparent calculations and export-ready records.",
  },
  {
    title: "Secure Infrastructure",
    description:
      "Dedicated firewall appliances, segmentation, private routing, access control, DNS policy, and traffic tuning, deployed and validated under real load.",
  },
];

const capabilities = [
  {
    title: "Secure Infrastructure",
    description:
      "Firewall architecture, segmentation, private routing, hardened edge deployments, and network observability.",
  },
  {
    title: "Custom Software Systems",
    description:
      "Operational applications, internal tools, dashboards, and backend systems built around a defined business outcome.",
  },
  {
    title: "Automation & Data Workflows",
    description:
      "Reliable workflows that replace repetitive manual processes and connect operational data, exports, and reporting.",
  },
  {
    title: "Diagnostics & Monitoring",
    description:
      "Measurement, monitoring, analytics, and alerting for systems that need measurable operational truth.",
  },
];

const deploymentOptions = [
  {
    title: "Network Diagnostic",
    price: "Starts at $750",
    description:
      "Review the current setup, identify bottlenecks, and determine whether the issue is ISP-side or inside the network.",
  },
  {
    title: "Secure Performance Network",
    description:
      "Full setup including firewall policy, segmentation, routing control, DNS behavior, and performance tuning.",
  },
  {
    title: "Custom Hardware Deployment",
    description:
      "Dedicated network appliance deployment for protected systems, private routing, and long-term network control.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Assess",
    description:
      "Define the operational problem, the current environment, the risk, and the outcome the system needs to produce.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Map the architecture, workflows, interfaces, controls, and constraints around the real operating conditions.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Implement, integrate, harden, and validate the system against the agreed scope and acceptance criteria.",
  },
  {
    step: "04",
    title: "Refine",
    description:
      "Measure performance under real use, resolve edge cases, document the system, and prepare a clean handoff.",
  },
];

const useCases = [
  {
    title: "Field & Industrial Operations",
    description:
      "Operational software, automation, condition monitoring, and diagnostics grounded in how field work actually happens.",
  },
  {
    title: "Infrastructure-Dependent Businesses",
    description:
      "Secure, observable networks and systems for operations that cannot afford unstable internal infrastructure.",
  },
  {
    title: "Small and Midsize Businesses",
    description:
      "Internal tools and workflows that replace manual handoffs, fragmented records, and avoidable operational friction.",
  },
];

export default function HomePage() {
  return (
    <main id="top" className="min-h-screen bg-[#020817] text-white">
      <a
        href="#content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020817]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Image
              src="/logo.png"
              alt="Elevate360 Systems logo"
              width={56}
              height={56}
              priority
              className="h-11 w-11 shrink-0 sm:h-14 sm:w-14"
            />

            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold tracking-tight text-white sm:text-lg">
                Elevate360 Systems
              </div>
              <div className="hidden truncate text-sm text-slate-400 sm:block">
                Secure infrastructure, software &amp; automation
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
            <a href="#proof" className="transition hover:text-white">
              Proof
            </a>
            <a href="#systems" className="transition hover:text-white">
              Systems
            </a>
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a href="#capabilities" className="transition hover:text-white">
              Capabilities
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>

          <TrackedLink
            href={phoneHref}
            eventName="Phone Click"
            eventLocation="header"
            className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 sm:px-5 sm:py-3"
          >
            <span className="sm:hidden">Call</span>
            <span className="hidden sm:inline">Call {phoneDisplay}</span>
          </TrackedLink>
        </div>
      </header>

      <div id="content">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_32%)]" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[1.15fr_0.85fr] md:py-28">
            <div>
              <div className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
                Infrastructure • Software • Automation
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
                Secure systems built for real operations.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Elevate360 Systems designs, builds, and deploys secure
                infrastructure, custom software, and automation around real
                operational problems.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <TrackedLink
                  href="#contact"
                  eventName="Project Inquiry"
                  eventLocation="hero"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Discuss a Project
                </TrackedLink>
                <TrackedLink
                  href="/systems/nettruth"
                  eventName="NetTruth Opened"
                  eventLocation="home-hero"
                  className="rounded-full border border-sky-300/40 bg-sky-300/10 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-300/20"
                >
                  Free Network Test
                </TrackedLink>
                <Link
                  href="/systems"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View Built Systems
                </Link>
              </div>

              <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-semibold text-white">
                    Infrastructure
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Hardened networks, controlled routing, segmentation, and
                    observability.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-semibold text-white">
                    Software
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Operational applications, internal tools, and backend
                    systems built around the work.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-semibold text-white">
                    Automation
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Reliable workflows, diagnostics, and monitoring that reduce
                    operational friction.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
                <h2 className="text-2xl font-semibold text-white">
                  What we build
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  We own the problem from architecture through deployment. The
                  work is scoped around a defined operational outcome, not a
                  generic stack or off-the-shelf template.
                </p>

                <ul className="mt-6 space-y-4">
                  {systemsWork.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-slate-200"
                    >
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-sky-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-5">
                  <p className="text-sm leading-7 text-slate-200">
                    Built by a licensed field mechanic who writes code, then
                    validated against real conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-20 border-t border-white/10 bg-[#061022]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Who builds it
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ten years fixing systems that aren&apos;t allowed to fail.
              </h2>

              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-400">
                <p>
                  Elevate360 Systems is run by Daniel Berriel IV, a licensed
                  elevator mechanic and third generation tradesman with over a
                  decade in the field. He holds Florida CET and CC licenses with
                  10,000+ verified hours on the job, and has spent the last
                  several years building networks, software, and diagnostics
                  tooling around the same standard the trade demands: the
                  system works, it&apos;s observable, and you can prove it.
                </p>

                <p>
                  That background is the point. Field operations, industrial
                  equipment, and infrastructure-dependent businesses don&apos;t
                  need a dev shop that learned the domain from a briefing call.
                  They need someone who has stood in the machine room.
                </p>

                <p className="font-medium text-slate-200">
                  Elevate360 Systems LLC is registered in SAM.gov for federal
                  contracting.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="proof"
          className="scroll-mt-20 border-t border-white/10 bg-[#020817]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Reference Deployment
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Our own reference environment, deployed and tested under real
                load.
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-400">
                Elevate360 operates its own hardened reference environment:
                dedicated firewall hardware, private routing, segmentation,
                access control, DNS policy, and traffic tuning.
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                The goal is simple: make the system secure, observable,
                consistent, and predictable under real operating conditions.
              </p>
            </div>

            {caseStudies.length > 0 ? (
              <div className="mt-12 space-y-6">
                {caseStudies.map((study) => (
                  <article
                    key={`${study.client}-${study.date}`}
                    className="rounded-3xl border border-sky-300/20 bg-sky-300/[0.07] p-7 sm:p-8"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {study.client}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {study.industry}
                        </p>
                      </div>
                      <time className="text-sm text-slate-400">
                        {study.date}
                      </time>
                    </div>

                    <dl className="mt-6 grid gap-5 md:grid-cols-3">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                          Problem
                        </dt>
                        <dd className="mt-2 text-sm leading-7 text-slate-300">
                          {study.problem}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                          Work
                        </dt>
                        <dd className="mt-2 text-sm leading-7 text-slate-300">
                          {study.work}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                          Result
                        </dt>
                        <dd className="mt-2 text-sm leading-7 text-slate-300">
                          {study.result}
                        </dd>
                        <dd className="mt-3 text-2xl font-semibold text-white">
                          {study.metric}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            ) : null}

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {proofPoints.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="systems"
          className="scroll-mt-20 border-t border-white/10 bg-[#061022]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Built Systems
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Systems built by Elevate360.
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-400">
                Selected software, analytics, and infrastructure developed
                in-house around real operational problems. Technical details are
                shared selectively when there is a qualified engineering,
                pilot, or licensing opportunity.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {builtSystems.map((system) => (
                <div
                  key={system.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {system.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {system.description}
                  </p>
                  {system.title === "NetTruth QuickCheck" && (
                    <Link href="/systems/nettruth" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-sky-200 underline underline-offset-4">
                      Run the free network test
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-start gap-5 rounded-3xl border border-sky-400/20 bg-sky-400/[0.08] p-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-3xl text-sm leading-7 text-slate-300">
                Run the live network test or explore system demonstrations, then discuss custom
                engineering, pilot, or licensing opportunities.
              </p>
              <Link
                href="/systems"
                className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                View Systems in Action
              </Link>
            </div>
          </div>
        </section>

        <section
          id="capabilities"
          className="scroll-mt-20 border-t border-white/10 bg-[#020817]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Capabilities
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Focused engineering around the operational problem.
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-400">
                Elevate360 combines infrastructure, software, automation, and
                diagnostics when the outcome depends on more than one layer.
                Each engagement starts with a defined problem and measurable
                result.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {capabilities.map((capability) => (
                <div
                  key={capability.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {capability.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {capability.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="options"
          className="border-t border-white/10 bg-[#061022]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Infrastructure Engagements
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                When infrastructure is the problem, we handle the control layer.
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-400">
                Infrastructure work is scoped around the actual environment,
                including instability, security, segmentation, latency
                behavior, private routing, and visibility.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {deploymentOptions.map((option) => (
                <div
                  key={option.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {option.title}
                  </h3>
                  {"price" in option ? (
                    <p className="mt-3 text-sm font-semibold text-sky-200">
                      {option.price}
                    </p>
                  ) : null}
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-sky-400/20 bg-sky-400/[0.08] p-7">
              <h3 className="text-xl font-semibold text-white">
                Hardware is part of the system, not a random parts list.
              </h3>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
                Elevate360 Systems can supply and configure dedicated firewall
                appliances and network edge hardware as part of the deployment.
                The value is the design, configuration, validation, and control
                layer built around the hardware.
              </p>
            </div>
          </div>
        </section>

        <section
          id="process"
          className="border-t border-white/10 bg-[#020817]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Process
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                From operational friction to a controlled system.
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-400">
                Every environment is different. The process keeps the work tied
                to the real problem, the acceptance criteria, and the conditions
                the finished system must handle.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {processSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="text-sm font-semibold tracking-[0.24em] text-sky-300">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="use-cases"
          className="border-t border-white/10 bg-[#061022]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Best Fit
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Built for operations where the system matters.
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-400">
                The strongest fit is a real operational problem with a clear
                owner, defined stakes, and a measurable target outcome.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {useCases.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="scroll-mt-20 border-t border-white/10 bg-[#020817]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.03] p-8 sm:p-10">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                  Qualified Projects
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Bring us a real operational problem.
                </h2>

                <p className="mt-4 text-lg leading-8 text-slate-400">
                  Tell us what is failing, slowing the business down, or still
                  being handled manually. Include the current environment,
                  target outcome, timeline, and budget range.
                </p>
              </div>

              <div className="mt-8 max-w-3xl rounded-3xl border border-sky-400/20 bg-sky-400/[0.08] p-6">
                <p className="text-lg font-semibold text-white">
                  Custom engineering engagements start at $5,000.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Focused diagnostics and component-level work are scoped
                  separately.
                </p>
              </div>

              <ContactForm />

              <div className="mt-8 flex flex-wrap gap-4">
                <TrackedLink
                  href={phoneHref}
                  eventName="Phone Click"
                  eventLocation="contact"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Call {phoneDisplay}
                </TrackedLink>

                <TrackedLink
                  href={emailHref}
                  eventName="Email Click"
                  eventLocation="contact"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Email {email}
                </TrackedLink>

                <a
                  href="#top"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Back to top
                </a>
              </div>

            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-white/10 bg-[#020817]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>© {new Date().getFullYear()} Elevate360 Systems LLC</p>
            <p className="mt-1">
              Elevate360 Systems LLC • Miami, FL • Florida CET #6445
            </p>
          </div>
          <p>Secure infrastructure, software &amp; automation</p>
        </div>
      </footer>
    </main>
  );
}
