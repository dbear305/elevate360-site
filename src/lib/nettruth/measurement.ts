import type { BandwidthPoint, MeasurementConfig, Results } from "@cloudflare/speedtest";
import { numbers, type CheckReport, type EndpointConfig, type TestMode, type TestPhase } from "./model";
import { measurePacketLoss, unavailableLoss, type RelayCredentials } from "./packet-loss";

export function measurementPlan(mode: TestMode): MeasurementConfig[] {
  const sizes = mode === "extended" ? [100000, 1000000, 5000000, 15000000, 25000000] : [100000, 1000000, 5000000, 15000000];
  const rounds = (type: "download" | "upload"): MeasurementConfig[] => sizes.map(bytes => ({ type, bytes, count: bytes === 25000000 ? 4 : bytes === 15000000 ? 2 : 3 }));
  return [{ type: "latency", numPackets: mode === "extended" ? 40 : 25 }, ...rounds("download"), ...rounds("upload")];
}

export function initialReport(mode: TestMode, config: EndpointConfig, connection: CheckReport["connection"]): CheckReport {
  return {
    schema: "nettruth.quickcheck.v1", id: crypto.randomUUID(), startedAt: new Date().toISOString(), mode, status: "running", connection,
    endpoint: { name: config.nodeOrigin ? config.nodeName : "Cloudflare reference edge", origin: config.nodeOrigin || "https://speed.cloudflare.com", provider: config.nodeOrigin ? "nettruth-node" : "cloudflare-reference" },
    samples: { idle: [], downloadLatency: [], uploadLatency: [], download: [], upload: [] },
    loss: unavailableLoss("No operator-owned UDP relay is connected to this deployment."), errors: [],
    caveats: ["A browser test measures this device to this endpoint. It cannot identify a failing network hop or certify line speed.", "HTTP RTT includes browser scheduling and endpoint behavior. Jitter is mean absolute variation between consecutive RTTs.", "Throughput uses the 90th percentile of eligible HTTP samples, not a sustained multi-stream line-rate measurement.", "Security posture checks are separate and require an optional local report."],
    secureContext: window.isSecureContext, elapsedMs: 0,
  };
}

type Progress = { report: CheckReport; phase: TestPhase; progress: number };
export async function runMeasurement(report: CheckReport, config: EndpointConfig, signal: AbortSignal, onProgress: (p: Progress) => void): Promise<CheckReport> {
  const start = performance.now();
  let phase: TestPhase = "connecting";
  let progress = 0;
  let relay: RelayCredentials | undefined;
  let engine: import("@cloudflare/speedtest").default | undefined;
  const publish = () => onProgress({ report: structuredClone({ ...report, elapsedMs: performance.now() - start }), phase, progress });
  const stopEngine = () => engine?.pause();
  signal.addEventListener("abort", stopEngine, { once: true });
  try {
    signal.throwIfAborted();
    publish();
    let downloadApiUrl = "https://speed.cloudflare.com/__down";
    let uploadApiUrl = "https://speed.cloudflare.com/__up";
    if (config.nodeOrigin) {
      const response = await fetch(`${config.nodeOrigin}/session`, { method: "POST", credentials: "omit", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: report.mode }), signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]), cache: "no-store" });
      if (!response.ok) throw new Error(response.status === 429 ? "This test node is busy. Wait a few minutes before trying again." : "The measurement node could not start a session.");
      const session = await response.json();
      if (typeof session.token !== "string" || !/^[a-f0-9]{48}$/.test(session.token)) throw new Error("The measurement node returned an invalid session.");
      downloadApiUrl = `${config.nodeOrigin}/__down?token=${session.token}`;
      uploadApiUrl = `${config.nodeOrigin}/__up?token=${session.token}`;
      if (session.relay && typeof session.relay.urls === "string" && typeof session.relay.username === "string" && typeof session.relay.credential === "string") relay = session.relay;
    }
    signal.throwIfAborted();
    const { default: SpeedTest } = await import("@cloudflare/speedtest");
    signal.throwIfAborted();
    const plan = measurementPlan(report.mode);
    engine = new SpeedTest({ autoStart: false, downloadApiUrl, uploadApiUrl, measurements: plan,
      logMeasurementApiUrl: null, logAimApiUrl: null, includeCredentials: false,
      estimatedServerTime: 0, bandwidthFinishRequestDuration: 1500, bandwidthAbortRequestDuration: 15000,
      bandwidthMinRequestDuration: 10, loadedRequestMinDuration: 250, loadedLatencyThrottle: 200, loadedLatencyMaxPoints: 100,
    });
    const samples = (points: BandwidthPoint[]) => points.filter(p => Number.isFinite(p.bps) && p.bps >= 0 && Number.isFinite(p.duration) && p.duration >= 0).map(p => ({ mbps: p.bps / 1e6, durationMs: p.duration, bytes: p.bytes }));
    const snapshot = (results: Results) => {
      report.samples = { idle: numbers(results.getUnloadedLatencyPoints()), downloadLatency: numbers(results.getDownLoadedLatencyPoints()), uploadLatency: numbers(results.getUpLoadedLatencyPoints()), download: samples(results.getDownloadBandwidthPoints()), upload: samples(results.getUploadBandwidthPoints()) };
      publish();
    };
    await new Promise<void>((resolve, reject) => {
      const abort = () => { engine?.pause(); reject(signal.reason); };
      signal.addEventListener("abort", abort, { once: true });
      engine!.onPhaseChange = event => { phase = event.measurement.type as TestPhase; progress = 5 + event.measurementId / plan.length * 75; publish(); };
      engine!.onResultsChange = () => snapshot(engine!.results);
      engine!.onError = error => { if (!report.errors.includes(error)) report.errors.push(String(error).slice(0,300).replace(/token=[a-f0-9]+/gi, "token=[redacted]")); };
      engine!.onFinish = results => { signal.removeEventListener("abort", abort); snapshot(results); resolve(); };
      engine!.play();
    });
    signal.throwIfAborted();
    phase = "packetLoss"; progress = 85; publish();
    if (relay) report.loss = await measurePacketLoss(relay, signal, report.mode === "extended" ? 1000 : 600);
    report.status = report.errors.length || report.samples.idle.length < 10 || !report.samples.download.length || !report.samples.upload.length ? "partial" : "complete";
    phase = "complete"; progress = 100;
  } catch (error) {
    report.status = signal.aborted ? "cancelled" : "error";
    if (!signal.aborted) report.errors.push(error instanceof Error ? error.message : "The test could not finish.");
  } finally {
    engine?.pause();
    signal.removeEventListener("abort", stopEngine);
    report.elapsedMs = performance.now() - start;
    report.finishedAt = new Date().toISOString();
    publish();
  }
  return structuredClone(report);
}
