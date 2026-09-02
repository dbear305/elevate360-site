import type { Metadata } from "next";
import Link from "next/link";
import { SystemFooter } from "../system-footer";
import { SystemHeader } from "../system-header";
import { NetTruthDemo } from "./nettruth-demo";

export const metadata: Metadata = {
  title: "NetTruth Analyzer Demonstration",
  description:
    "Explore a sanitized NetTruth Analyzer playback showing how network evidence is isolated across the endpoint, gateway, DNS, tunnel, WAN, and external path.",
  alternates: {
    canonical: "/systems/nettruth",
  },
  openGraph: {
    title: "NetTruth Analyzer | Elevate360 Systems",
    description:
      "One network. One truth. Explore a sanitized path-aware network diagnostic demonstration.",
    url: "/systems/nettruth",
  },
};

const measuredLayers = [
  "Endpoint, adapter, IP, and route context",
  "LAN gateway identity, latency, and loss",
  "DNS resolution and timing",
  "TCP and TLS connection stages",
  "WAN egress, ASN, and VPN/WireGuard state",
  "External latency, jitter, loss, and optional throughput",
];

export default function NetTruthPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <a
        href="#nettruth-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to demonstration
      </a>

      <SystemHeader />

      <div id="nettruth-content">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white"
            >
              <span aria-hidden="true">←</span>
              All built systems
            </Link>

            <div className="mt-9 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                  Elevate360 Systems LLC
                </p>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                  NetTruth Analyzer
                </h1>
                <p className="mt-4 text-xl font-medium text-sky-200">
                  One Network. One Truth.
                </p>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                  A local-first, path-aware network diagnostic and evidence
                  engine built to isolate where connection behavior changes,
                  preserve the measurements, and explain the conclusion.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  What this public page proves
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  NetTruth can separate local, controlled-edge, name-resolution,
                  transport, tunnel, and upstream conditions into an
                  explainable diagnostic record. The demonstration below uses
                  synthetic data and does not execute against a visitor&apos;s
                  device or network.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#020817]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
            <NetTruthDemo />
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#061022]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 sm:py-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                Measured Layers
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                One evidence chain across the connection path.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">
                NetTruth is not a packet sniffer, endpoint inventory product,
                traffic-policy optimizer, or carrier bandwidth certificate. It
                is a repeatable diagnostic engine built to measure connection
                stages and preserve what the evidence supports.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {measuredLayers.map((layer) => (
                <li
                  key={layer}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-300" />
                  <span>{layer}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#020817]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-emerald-300/20 bg-emerald-300/[0.07] p-7 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                  Demonstrated publicly
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                  <li>Sanitized path and metric visualization</li>
                  <li>Layer-by-layer fault isolation</li>
                  <li>Explainability and diagnostic evidence</li>
                  <li>Report and history capabilities</li>
                </ul>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Protected implementation
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-400">
                  <li>No source code, credentials, or customer information</li>
                  <li>No internal thresholds or proprietary diagnostic logic</li>
                  <li>No real IP addresses, endpoints, or network topology</li>
                  <li>No testing is performed against the visitor</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[30px] border border-sky-300/20 bg-sky-300/[0.08] p-7 sm:flex-row sm:items-center sm:p-9">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                  Network Truth Audit
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Stop guessing which layer is failing.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                  Use measured evidence to determine whether the limiting layer
                  is inside the network, at the controlled edge, or upstream.
                </p>
              </div>
              <a
                href="mailto:contact@elevate360systems.com?subject=Network%20Truth%20Audit"
                className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200"
              >
                Request an Audit
              </a>
            </div>
          </div>
        </section>
      </div>

      <SystemFooter />
    </main>
  );
}
