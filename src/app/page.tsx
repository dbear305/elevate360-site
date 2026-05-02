import Link from "next/link";

const phoneDisplay = "786-898-9058";
const phoneHref = "tel:+17868989058";
const email = "contact@elevate360systems.com";
const emailHref = "mailto:contact@elevate360systems.com";

const controls = [
  "Traffic shaping and bufferbloat reduction",
  "Internal routing and device prioritization",
  "Secure segmentation between critical and general-use devices",
  "Tunnel-based remote access and controlled ingress paths",
  "Network visibility, logging, and policy enforcement"
];

const proofPoints = [
  {
    title: "Dedicated firewall appliance",
    description:
      "A real network control layer built on dedicated hardware, not a consumer router or generic plug-in device."
  },
  {
    title: "Private WireGuard routing",
    description:
      "Critical traffic can be routed through controlled tunnel paths instead of shared consumer VPN infrastructure."
  },
  {
    title: "Segmentation by device purpose",
    description:
      "Protected systems, workstations, and general devices can be separated so the whole environment is not treated the same."
  },
  {
    title: "Tested under real load",
    description:
      "Traffic behavior is checked under active use with bufferbloat testing, latency review, and load-based tuning."
  }
];

const services = [
  {
    title: "Network Security Architecture",
    description:
      "Firewall deployments, access control, segmentation, and hardened edge configurations built for real-world environments."
  },
  {
    title: "Low-Latency Network Optimization",
    description:
      "Traffic shaping, queue management, and internal network tuning designed to reduce jitter and improve predictability under load."
  },
  {
    title: "Private Routing & WireGuard Tunnels",
    description:
      "Dedicated tunnel architecture with controlled routing paths, locked-down access, and secure private connectivity."
  },
  {
    title: "Custom Firewall Appliance Builds",
    description:
      "Purpose-built firewall and network edge systems using multi-port hardware configured around the actual environment."
  }
];

const deploymentOptions = [
  {
    title: "Network Diagnostic",
    description:
      "Review the current setup, identify bottlenecks, and determine whether the issue is ISP-side or inside the network."
  },
  {
    title: "Secure Performance Network",
    description:
      "Full setup including firewall policy, segmentation, routing control, DNS behavior, and performance tuning."
  },
  {
    title: "Custom Hardware Deployment",
    description:
      "Dedicated network appliance deployment for protected systems, private routing, and long-term network control."
  }
];

const ispHandles = [
  "Service line and internet delivery",
  "Gateway or modem installation",
  "Provider-side outages and line issues",
  "Basic connectivity troubleshooting"
];

const elevateHandles = [
  "Firewall rules and internal network policy",
  "WireGuard routing and secure tunnel paths",
  "Device segmentation and protected traffic lanes",
  "Latency behavior, queue control, and bufferbloat reduction"
];

const processSteps = [
  {
    step: "01",
    title: "Assess",
    description:
      "Identify where instability, exposure, or performance problems exist inside the environment."
  },
  {
    step: "02",
    title: "Design",
    description:
      "Define the control layer around the real use case, including routing, segmentation, access, and hardware needs."
  },
  {
    step: "03",
    title: "Deploy",
    description:
      "Install, configure, harden, and validate the system so the network is controlled and predictable."
  },
  {
    step: "04",
    title: "Refine",
    description:
      "Test under real use and adjust traffic behavior, rules, and routing until the setup performs correctly."
  }
];

const useCases = [
  {
    title: "Traders",
    description:
      "Controlled internal network behavior for latency-sensitive workflows, secure routing, and protected workstations."
  },
  {
    title: "Gamers",
    description:
      "Reduced local congestion, improved traffic behavior, and cleaner performance when multiple devices compete for bandwidth."
  },
  {
    title: "Remote Professionals",
    description:
      "Segmented home-office environments built for privacy, uptime, secure access, and dependable daily use."
  },
  {
    title: "Small Businesses",
    description:
      "Custom network systems that improve internal security posture, traffic control, and operational visibility."
  }
];

export default function HomePage() {
  return (
    <main id="top" className="min-h-screen bg-[#020817] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020817]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-4">
            <img
              src="/logo.png"
              alt="Elevate360 Systems"
              className="h-12 w-auto shrink-0 sm:h-14"
            />

            <div className="min-w-0 leading-tight">
              <div className="truncate text-base font-semibold tracking-tight text-white sm:text-lg">
                Elevate360 Systems
              </div>
              <div className="truncate text-sm text-slate-400">
                Network security &amp; performance engineering
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#proof" className="transition hover:text-white">
              Proof
            </a>
            <a href="#services" className="transition hover:text-white">
              Services
            </a>
            <a href="#options" className="transition hover:text-white">
              Options
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>

          <a
            href={phoneHref}
            className="hidden rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 md:inline-flex"
          >
            Call {phoneDisplay}
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_32%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[1.15fr_0.85fr] md:py-28">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
              Everything after the ISP
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
              Secure, low-latency network systems built for real environments.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Elevate360 Systems designs and deploys controlled network
              environments for clients who need performance, segmentation,
              secure routing, and full visibility inside their own
              infrastructure.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Start a Consultation
              </a>
              <a
                href="#proof"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Proof
              </a>
            </div>

            <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold text-white">Security</div>
                <p className="mt-2 text-sm text-slate-400">
                  Hardened edge deployments, tunnel-based access, and segmented
                  environments.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold text-white">Control</div>
                <p className="mt-2 text-sm text-slate-400">
                  Routing decisions, traffic policy, device prioritization, and
                  policy enforcement.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold text-white">Stability</div>
                <p className="mt-2 text-sm text-slate-400">
                  Internal network optimization for better latency behavior and
                  more predictable performance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
              <h2 className="text-2xl font-semibold text-white">
                What we control
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                We do not control the ISP. We control everything after it: the
                structure, behavior, security, and stability of the environment
                inside the network.
              </p>

              <ul className="mt-6 space-y-4">
                {controls.map((item) => (
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
                  Built on real deployments including private WireGuard routing,
                  controlled access paths, and segmented network design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="border-t border-white/10 bg-[#020817]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Live System Proof
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Built, deployed, and tested under real load.
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-400">
                Elevate360 Systems is built from real infrastructure work. The
                same control layer offered to clients has been deployed in a live
                environment using a dedicated firewall appliance, private
                WireGuard routing, segmentation, NAT rules, DNS control, and
                traffic tuning under load.
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                The goal is simple: control everything after the ISP so the
                network behaves securely, consistently, and predictably.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#061022]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
              Where We Fit
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your ISP delivers the connection. We control what happens after it.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-400">
              Internet providers handle the line, gateway, and service delivery.
              We focus on the internal environment: routing, segmentation,
              firewall policy, traffic behavior, secure access, and device-level
              control.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
              <h3 className="text-xl font-semibold text-white">
                What the ISP handles
              </h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-400">
                {ispHandles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-sky-400/20 bg-sky-400/[0.08] p-7">
              <h3 className="text-xl font-semibold text-white">
                What Elevate360 controls
              </h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                {elevateHandles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="border-t border-white/10 bg-[#020817]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
              Services
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              A focused offering built around control, security, and performance.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-400">
              This is not broad, generic IT support. This is targeted
              infrastructure work for clients who need controlled internal
              network behavior and a higher level of security architecture.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
              >
                <h3 className="text-xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="options" className="border-t border-white/10 bg-[#061022]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
              Deployment Options
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Built around your environment, not a generic template.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-400">
              Every deployment is scoped around the actual problem:
              instability, security, segmentation, low-latency behavior, or
              private routing.
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
              The value is not just the box. The value is the design,
              configuration, testing, and control layer built around it.
            </p>
          </div>
        </div>
      </section>

      <section id="process" className="border-t border-white/10 bg-[#020817]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
              Process
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              From network chaos to a controlled system.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-400">
              Every environment is different, but the goal stays the same:
              build a secure, stable, observable internal network that behaves
              correctly under real-world conditions.
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

      <section id="use-cases" className="border-t border-white/10 bg-[#061022]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
              Use Cases
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Built for clients who actually feel the difference.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-400">
              The value is not just speed. The value is controlled behavior,
              consistency, security, and less internal instability when the
              network is under load.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

      <section id="contact" className="border-t border-white/10 bg-[#020817]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.03] p-8 sm:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Contact
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Build a network environment you can actually control.
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-400">
                If you need a secure, segmented, performance-focused network
                environment, Elevate360 Systems can help design and deploy the
                right control layer for your use case.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={phoneHref}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                {phoneDisplay}
              </a>

              <a
                href={emailHref}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {email}
              </a>

              <a
                href="#top"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to top
              </a>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Elevate360 Systems LLC • Miami, FL
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#020817]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Elevate360 Systems LLC</p>
          <p>Network security &amp; performance engineering</p>
        </div>
      </footer>
    </main>
  );
}