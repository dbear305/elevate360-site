import type { MeasurementNode, NodeSelection } from "./node-selection";

export type TestMode = "quick" | "extended";
export type TestPhase = "selecting" | "connecting" | "latency" | "download" | "upload" | "packetLoss" | "complete";
export type TestStatus = "running" | "complete" | "partial" | "cancelled" | "error";
export type Finding = { id: string; tone: "good" | "warn" | "info"; title: string; evidence: string; action: string };
export type BandwidthSample = { mbps: number; durationMs: number; bytes: number };
export type LossResult = { status: "measured" | "unavailable"; sent: number; received: number; lost: number; percent: number | null; reason?: string; transport: "UDP relay"; sampleWindowMs: number };
export type CheckReport = {
  schema: "nettruth.quickcheck.v1";
  id: string;
  startedAt: string;
  finishedAt?: string;
  mode: TestMode;
  status: TestStatus;
  endpoint: { name: string; origin: string; provider: "cloudflare-reference" | "nettruth-node" };
  selection?: NodeSelection;
  connection: "Unknown" | "Ethernet" | "Wi-Fi" | "Cellular";
  samples: { idle: number[]; downloadLatency: number[]; uploadLatency: number[]; download: BandwidthSample[]; upload: BandwidthSample[] };
  loss: LossResult;
  errors: string[];
  caveats: string[];
  secureContext: boolean;
  elapsedMs: number;
};
export type EndpointConfig = { nodeOrigin: string | null; nodeName: string };
export type FleetConfig = { nodes: MeasurementNode[] };
export type LocalCheck = { id: string; status: "pass" | "warn" | "unknown"; title: string; evidence: string; action: string };
export type LocalReport = { schema: "nettruth.windows-posture.v1"; collectedAt: string; checks: LocalCheck[] };

export const finite = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0;
export const numbers = (values: unknown[]) => values.filter(finite);
export function percentile(values: number[], p: number): number | null {
  const sorted = numbers(values).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const i = Math.max(0, Math.min(1, p)) * (sorted.length - 1);
  return sorted[Math.floor(i)] + (sorted[Math.ceil(i)] - sorted[Math.floor(i)]) * (i % 1);
}
export function jitter(values: number[]): number | null {
  const clean = numbers(values);
  return clean.length < 2 ? null : clean.slice(1).reduce((sum, n, i) => sum + Math.abs(n - clean[i]), 0) / (clean.length - 1);
}
export function metrics(r: CheckReport) {
  const idle = percentile(r.samples.idle, .5);
  const down = percentile(r.samples.downloadLatency, .5);
  const up = percentile(r.samples.uploadLatency, .5);
  const loaded = [down, up].filter(finite);
  return {
    idle, down, up, jitter: jitter(r.samples.idle), p95: percentile(r.samples.idle, .95),
    download: percentile(r.samples.download.filter(s => s.durationMs >= 10).map(s => s.mbps), .9),
    upload: percentile(r.samples.upload.filter(s => s.durationMs >= 10).map(s => s.mbps), .9),
    increase: idle !== null && loaded.length ? Math.max(0, Math.max(...loaded) - idle) : null,
  };
}
export const format = (n: number | null, places = 1) => n === null ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: places, minimumFractionDigits: places });

export function findings(r: CheckReport): Finding[] {
  const m = metrics(r);
  const out: Finding[] = [];
  if (r.status !== "complete") out.push({ id: "partial", tone: "info", title: "This result is incomplete", evidence: `Test status: ${r.status}. Missing measurements are not treated as passes.`, action: "Keep this tab visible and rerun when the connection is quiet." });
  const enoughLoaded = r.samples.downloadLatency.length >= 5 && r.samples.uploadLatency.length >= 5 && r.samples.idle.length >= 10;
  if (enoughLoaded && m.increase !== null) out.push(m.increase > 40
    ? { id: "load", tone: "warn", title: "Responsiveness drops under load", evidence: `The higher loaded median is ${format(m.increase)} ms above idle. This is consistent with queueing on this tested path; it does not locate the bottleneck.`, action: "Repeat over Ethernet with other traffic paused. Compare again with router queue management enabled before buying more bandwidth." }
    : { id: "load", tone: "good", title: "Load added little delay in this run", evidence: `Loaded median increased by ${format(m.increase)} ms on the tested path.`, action: "Save this as a comparison point. A single run cannot establish long-term reliability." });
  else out.push({ id: "load", tone: "info", title: "More loaded samples are needed", evidence: `${r.samples.downloadLatency.length} download and ${r.samples.uploadLatency.length} upload latency samples. Short transfers may not load a fast connection long enough.`, action: "Use the extended test. Missing loaded samples cannot establish that bufferbloat is absent." });
  if (r.samples.idle.length >= 10 && m.jitter !== null && m.jitter > 10) out.push({ id: "jitter", tone: "warn", title: "Idle response times vary", evidence: `Mean consecutive RTT variation is ${format(m.jitter)} ms across ${r.samples.idle.length} samples.`, action: "Compare Ethernet and Wi-Fi on the same device and endpoint. Repeat at the time calls or games usually suffer." });
  if (r.loss.status === "measured") out.push({ id: "loss", tone: r.loss.lost ? "warn" : "good", title: r.loss.lost ? "UDP messages did not all arrive" : "No UDP messages lost in this sample", evidence: `${r.loss.lost} of ${r.loss.sent} messages were not received before the deadline (${format(r.loss.percent, 2)}%). This measures a relay path, not every destination.`, action: r.loss.lost ? "Repeat over Ethernet. Persistent loss warrants a path investigation; this run does not prove ISP fault." : "A zero-loss sample does not guarantee a loss-free connection. Repeat during the problem period." });
  else out.push({ id: "loss", tone: "info", title: "Packet loss was not measured", evidence: r.loss.reason || "A UDP relay was unavailable.", action: "HTTP request failures are not a substitute for a packet-loss measurement." });
  if (!r.secureContext) out.push({ id: "https", tone: "warn", title: "This page is not in a secure browser context", evidence: "The browser did not report a secure context.", action: "Open the HTTPS version before running or sharing a test." });
  return out;
}

export function evaluateUseCases(r: CheckReport) {
  const m = metrics(r);
  const full = r.status === "complete" && r.samples.idle.length >= 10 && r.loss.status === "measured" && r.samples.uploadLatency.length >= 5 && r.samples.downloadLatency.length >= 5;
  return [
    { name: "Video calls", detail: "Two-way calls", condition: m.download !== null && m.download >= 10 && m.upload !== null && m.upload >= 5 && m.idle !== null && m.idle < 100 && m.jitter !== null && m.jitter < 20 && r.loss.percent !== null && r.loss.percent < 1 && m.increase !== null && m.increase < 60 },
    { name: "Online gaming", detail: "Responsive input", condition: m.idle !== null && m.idle < 60 && m.jitter !== null && m.jitter < 10 && r.loss.percent !== null && r.loss.percent < 1 && m.increase !== null && m.increase < 40 },
    { name: "4K streaming", detail: "One video stream", condition: m.download !== null && m.download >= 30 && r.loss.percent !== null && r.loss.percent < 2 },
  ].map(c => ({ ...c, verdict: !full ? "Incomplete evidence" : c.condition ? "Likely suitable" : "Review findings" }));
}

const localIds = new Set(["firewall-domain", "firewall-private", "firewall-public", "defender", "smb1", "rdp-nla", "adapter-errors"]);
export function parseLocalReport(value: unknown): LocalReport {
  if (!value || typeof value !== "object") throw new Error("Choose a NetTruth Windows posture JSON report.");
  const r = value as Partial<LocalReport>;
  if (r.schema !== "nettruth.windows-posture.v1" || typeof r.collectedAt !== "string" || !Number.isFinite(Date.parse(r.collectedAt)) || !Array.isArray(r.checks) || !r.checks.length || r.checks.length > 12) throw new Error("This file does not match the NetTruth Windows report format.");
  const seen = new Set<string>();
  const checks = r.checks.map((c: LocalCheck) => {
    if (!c || !localIds.has(c.id) || seen.has(c.id) || !["pass", "warn", "unknown"].includes(c.status) || [c.title, c.evidence, c.action].some(t => typeof t !== "string" || t.length > 1200)) throw new Error("The report contains an invalid or repeated check.");
    seen.add(c.id);
    return { id: c.id, status: c.status, title: c.title, evidence: c.evidence, action: c.action };
  });
  return { schema: "nettruth.windows-posture.v1", collectedAt: r.collectedAt, checks };
}
