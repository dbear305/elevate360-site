"use client";

import { useState } from "react";

type Tone = "healthy" | "watch" | "critical" | "neutral";

type Scenario = {
  id: "baseline" | "local" | "upstream";
  label: string;
  shortLabel: string;
  verdict: string;
  verdictTone: Tone;
  summary: string;
  confidence: string;
  path: Array<{ label: string; detail: string; tone: Tone }>;
  metrics: Array<{
    label: string;
    value: string;
    detail: string;
    bar: number;
    tone: Tone;
  }>;
  evidence: string[];
};

const scenarios: Scenario[] = [
  {
    id: "baseline",
    label: "Healthy baseline",
    shortLabel: "Baseline",
    verdict: "Controlled path is operating normally",
    verdictTone: "healthy",
    summary:
      "The endpoint, local gateway, name resolution, transport handshake, and external path all remain inside the synthetic baseline.",
    confidence: "High confidence",
    path: [
      { label: "Endpoint", detail: "Adapter verified", tone: "healthy" },
      { label: "LAN gateway", detail: "1.8 ms", tone: "healthy" },
      { label: "DNS", detail: "23 ms", tone: "healthy" },
      { label: "WAN path", detail: "27 ms", tone: "healthy" },
      { label: "Service", detail: "TLS 74 ms", tone: "healthy" },
    ],
    metrics: [
      {
        label: "Gateway latency",
        value: "1.8 ms",
        detail: "Local edge response",
        bar: 12,
        tone: "healthy",
      },
      {
        label: "Packet loss",
        value: "0.0%",
        detail: "Controlled and external path",
        bar: 2,
        tone: "healthy",
      },
      {
        label: "DNS timing",
        value: "23 ms",
        detail: "Resolution complete",
        bar: 24,
        tone: "healthy",
      },
      {
        label: "External jitter",
        value: "2.1 ms",
        detail: "Stable arrival variance",
        bar: 14,
        tone: "healthy",
      },
      {
        label: "TLS handshake",
        value: "74 ms",
        detail: "Transport and negotiation",
        bar: 37,
        tone: "healthy",
      },
      {
        label: "Observed throughput",
        value: "934 / 43 Mbps",
        detail: "Optional controlled test",
        bar: 92,
        tone: "healthy",
      },
    ],
    evidence: [
      "Endpoint adapter and route context remained stable throughout the observation window.",
      "Gateway latency and loss stayed inside the local baseline.",
      "DNS, TCP, and TLS timing showed no isolated delay stage.",
      "External jitter and packet loss did not indicate upstream impairment.",
    ],
  },
  {
    id: "local",
    label: "Local bottleneck",
    shortLabel: "Local issue",
    verdict: "The limiting layer is inside the controlled network",
    verdictTone: "critical",
    summary:
      "Gateway latency and loss degrade before traffic reaches the WAN. External symptoms are downstream effects of a local congestion event.",
    confidence: "High confidence",
    path: [
      { label: "Endpoint", detail: "Adapter verified", tone: "healthy" },
      { label: "LAN gateway", detail: "41 ms / 3.2%", tone: "critical" },
      { label: "DNS", detail: "118 ms", tone: "watch" },
      { label: "WAN path", detail: "76 ms", tone: "watch" },
      { label: "Service", detail: "TLS 246 ms", tone: "watch" },
    ],
    metrics: [
      {
        label: "Gateway latency",
        value: "41 ms",
        detail: "Degradation begins locally",
        bar: 82,
        tone: "critical",
      },
      {
        label: "Packet loss",
        value: "3.2%",
        detail: "Present before WAN exit",
        bar: 68,
        tone: "critical",
      },
      {
        label: "DNS timing",
        value: "118 ms",
        detail: "Delayed behind local queue",
        bar: 63,
        tone: "watch",
      },
      {
        label: "External jitter",
        value: "29 ms",
        detail: "Local instability propagates",
        bar: 71,
        tone: "watch",
      },
      {
        label: "TLS handshake",
        value: "246 ms",
        detail: "Not the first failing stage",
        bar: 79,
        tone: "watch",
      },
      {
        label: "Observed throughput",
        value: "286 / 18 Mbps",
        detail: "Throughput collapses under load",
        bar: 31,
        tone: "critical",
      },
    ],
    evidence: [
      "The first measurable degradation appears between the endpoint and controlled gateway.",
      "Loss is already present before the traffic reaches the public egress path.",
      "DNS and TLS delays increase only after the local queue becomes unstable.",
      "The evidence does not support assigning primary fault to the ISP in this scenario.",
    ],
  },
  {
    id: "upstream",
    label: "Upstream impairment",
    shortLabel: "Upstream issue",
    verdict: "The controlled edge is healthy; impairment begins upstream",
    verdictTone: "watch",
    summary:
      "The endpoint, gateway, and DNS path remain stable. Latency, jitter, and loss rise only after public egress, isolating the problem beyond the controlled edge.",
    confidence: "Strong evidence",
    path: [
      { label: "Endpoint", detail: "Adapter verified", tone: "healthy" },
      { label: "LAN gateway", detail: "1.6 ms", tone: "healthy" },
      { label: "DNS", detail: "21 ms", tone: "healthy" },
      { label: "WAN path", detail: "96 ms / 1.7%", tone: "critical" },
      { label: "Service", detail: "TLS 191 ms", tone: "watch" },
    ],
    metrics: [
      {
        label: "Gateway latency",
        value: "1.6 ms",
        detail: "Controlled edge remains stable",
        bar: 11,
        tone: "healthy",
      },
      {
        label: "Packet loss",
        value: "1.7%",
        detail: "Begins beyond public egress",
        bar: 49,
        tone: "critical",
      },
      {
        label: "DNS timing",
        value: "21 ms",
        detail: "Resolution remains normal",
        bar: 22,
        tone: "healthy",
      },
      {
        label: "External jitter",
        value: "31 ms",
        detail: "Upstream variance detected",
        bar: 76,
        tone: "critical",
      },
      {
        label: "TLS handshake",
        value: "191 ms",
        detail: "Affected after upstream delay",
        bar: 67,
        tone: "watch",
      },
      {
        label: "Observed throughput",
        value: "412 / 39 Mbps",
        detail: "Reduced beyond controlled edge",
        bar: 46,
        tone: "watch",
      },
    ],
    evidence: [
      "Endpoint and local-gateway behavior remain aligned with the healthy baseline.",
      "Name resolution completes without an isolated DNS delay.",
      "Latency, jitter, and loss increase only after public egress.",
      "The evidence supports escalation with a redacted path report instead of changing the internal network first.",
    ],
  },
];

const toneClasses: Record<Tone, string> = {
  healthy: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  watch: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  critical: "border-rose-300/25 bg-rose-300/10 text-rose-200",
  neutral: "border-white/10 bg-white/5 text-slate-300",
};

const dotClasses: Record<Tone, string> = {
  healthy: "bg-emerald-300",
  watch: "bg-amber-300",
  critical: "bg-rose-300",
  neutral: "bg-slate-400",
};

const barClasses: Record<Tone, string> = {
  healthy: "bg-emerald-300",
  watch: "bg-amber-300",
  critical: "bg-rose-300",
  neutral: "bg-slate-400",
};

export function NetTruthDemo() {
  const [scenarioId, setScenarioId] =
    useState<Scenario["id"]>("baseline");
  const scenario =
    scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#061022] shadow-2xl shadow-black/30">
      <div className="border-b border-white/10 bg-[#020817]/80 p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                Sanitized playback
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Synthetic evidence set NT-DEMO-0042
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Select a network condition
            </h2>
          </div>

          <div
            role="group"
            aria-label="Select a synthetic network condition"
            className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5"
          >
            {scenarios.map((item) => {
              const selected = item.id === scenarioId;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setScenarioId(item.id)}
                  className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    selected
                      ? "bg-white text-slate-950"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="border-b border-white/10 p-5 sm:p-7 xl:border-b-0 xl:border-r">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Diagnostic verdict
              </p>
              <h3 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight text-white sm:text-3xl">
                {scenario.verdict}
              </h3>
            </div>
            <span
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${toneClasses[scenario.verdictTone]}`}
            >
              {scenario.confidence}
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
            {scenario.summary}
          </p>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Observed path
              </p>
              <p className="text-xs text-slate-500">Left to right</p>
            </div>
            <ol className="mt-4 grid gap-3 sm:grid-cols-5">
              {scenario.path.map((step, index) => (
                <li
                  key={step.label}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${dotClasses[step.tone]}`}
                    />
                    <span className="text-[10px] font-semibold text-slate-600">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">
                    {step.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {scenario.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-[#020817]/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {metric.detail}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-white">
                    {metric.value}
                  </p>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ${barClasses[metric.tone]}`}
                    style={{ width: `${metric.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Explainability log
          </p>
          <h3 className="mt-3 text-xl font-semibold text-white">
            Why NetTruth reached this verdict
          </h3>

          <ol className="mt-6 space-y-4">
            {scenario.evidence.map((entry, index) => (
              <li
                key={entry}
                className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-sky-300/20 bg-sky-300/10 text-xs font-semibold text-sky-200">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-slate-300">{entry}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#020817]/70 p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Report state
              </span>
              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Evidence complete
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              The production engine can preserve history, baselines, diagnostic
              logs, and privacy-redacted JSON or HTML evidence reports.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
