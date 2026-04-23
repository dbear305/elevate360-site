import Link from "next/link";

const services = [
  {
    title: "Network Security Architecture",
    description:
      "Firewall deployments, segmentation, access control, and hardened edge configurations built for real-world environments."
  },
  {
    title: "Low-Latency Network Optimization",
    description:
      "Traffic shaping, queue management, and internal network tuning designed to reduce jitter, stabilize performance, and improve predictability under load."
  },
  {
    title: "Private Routing & WireGuard Tunnels",
    description:
      "Dedicated VPS tunnel design and secure remote access architecture using controlled routing instead of shared consumer VPN infrastructure."
  },
  {
    title: "Custom Firewall Appliance Builds",
    description:
      "Purpose-built hardware deployments using high-quality components for secure, stable, upgradeable network control."
  }
];

const controls = [
  "Traffic shaping and bufferbloat reduction",
  "Internal routing and device prioritization",
  "Secure segmentation between critical and general-use devices",
  "Tunnel-based remote access and controlled ingress paths",
  "Network visibility, logging, and policy enforcement"
];

const useCases = [
  {
    title: "Traders",
    description:
      "Stabilized internal network conditions for latency-sensitive workflows, secure routing, and controlled device environments."
  },
  {
    title: "Gamers",
    description:
      "Reduced local congestion, better queue behavior, and cleaner performance when multiple devices compete for bandwidth."
  },
  {
    title: "Remote Professionals",
    description:
      "Secure, segmented home-office environments built for uptime, privacy, and dependable remote access."
  },
  {
    title: "Small Businesses",
    description:
      "Custom network edge systems that improve internal security posture, traffic control, and operational visibility."
  }
];

const processSteps = [
  {
    step: "01",
    title: "Assess the environment",
    description:
      "Identify the pain points inside the network, which devices matter most, and where performance or security is breaking down."
  },
  {
    step: "02",
    title: "Design the control layer",
    description:
      "Define segmentation, traffic policy, remote access, and hardware requirements around the actual use case."
  },
  {
    step: "03",
    title: "Deploy and harden",
    description:
      "Install, configure, lock down, and validate the system so the environment is controlled, secure, and predictable."
  },
  {
    step: "04",
    title: "Test and refine",
    description:
      "Verify behavior under real conditions and tune the environment around how it actually performs in use."
  }
];

const proofPoints = [
  {
    title: "Private tunnel architecture",
    description:
      "WireGuard based private routing with controlled ingress, rebuilt and validated under real production conditions."
  },
  {
    title: "Zero exposure access paths",
    description:
      "No public SSH exposure, hardened access control, and locked down remote entry designed around a zero trust mindset."
  },
  {
    title: "Segmentation and stability tuning",
    description:
      "Critical devices separated from general traffic with queue and routing adjustments built for predictable behavior under load."
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
            <a href="#services" className="transition hover:text-white">
              Services
            </a>
            <a href="#process" className="transition hover:text-white">
              Process
            </a>
            <a href="#use-cases" className="transition hover:text-white">
              Use Cases
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>

          <a
            href="tel:+17868989058"
            className="hidden rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 md:inline-flex"
          >
            Call 786-898-9058
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_32%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[1.2fr_0.8fr] md:py-28">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
              Everything after the ISP
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
              Secure, low-latency network systems built for real environments.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Elevate360 Systems designs and deploys controlled network environments
              for clients who need performance, segmentation, secure routing, and
              full visibility inside their own infrastructure.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Start a Consultation
              </a>
              <a
                href="#services"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Services
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
                  Internal network optimization for better latency behavior and more
                  predictable performance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
              <h2 className="text-2xl font-semibold text-white">What we control</h2>

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
                  zero exposure access paths, and segmented network design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#020817]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
              Proven Infrastructure
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Built on real systems, not theory.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-400">
              The same architecture behind this offering has already been built,
              broken, rebuilt, hardened, and tuned under real-world conditions.
              This includes private tunnel routing, segmentation, locked down
              access paths, and network behavior tuned for performance-sensitive
              environments.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {proofPoints.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="border-t border-white/10 bg-[#061022]">
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
              Every environment is different, but the goal stays the same: build
              a secure, stable, observable internal network that behaves
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
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
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
                href="tel:+17868989058"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                786-898-9058
              </a>

              <a
                href="mailto:contact@elevate360systems.com"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                contact@elevate360systems.com
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
    </main>
  );
}