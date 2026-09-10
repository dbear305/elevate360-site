export type MeasurementNode = { id: string; name: string; origin: string };

export type NodeProbe = {
  nodeId: string;
  status: "available" | "unavailable";
  medianRttMs: number | null;
  samplesMs: number[];
  udpRelayConfigured: boolean | null;
  reason?: string;
};

export type NodeSelection = {
  mode: "auto" | "manual";
  selectedNodeId: string;
  selectedAt: string;
  probes: NodeProbe[];
};

export type NodeSelectionOptions = {
  fetch?: typeof fetch;
  /** Monotonic milliseconds; injectable for deterministic measurement tests. */
  now?: () => number;
  probeTimeoutMs?: number;
};

export class NodeSelectionError extends Error {
  readonly probes: NodeProbe[];

  constructor(message: string, probes: NodeProbe[]) {
    super(message);
    this.name = "NodeSelectionError";
    this.probes = probes;
  }
}

function abortError(): DOMException {
  return new DOMException("Measurement node selection was cancelled.", "AbortError");
}

function checkAborted(signal: AbortSignal): void {
  if (signal.aborted) throw abortError();
}

function validateNodes(nodes: MeasurementNode[]): void {
  if (!nodes.length || nodes.length > 8) throw new Error("Configure between 1 and 8 measurement nodes.");
  const ids = new Set<string>();
  for (const node of nodes) {
    if (!node.id || node.id.trim() !== node.id || node.id === "auto" || ids.has(node.id) || !node.name.trim()) {
      throw new Error("Measurement nodes require unique nonempty IDs and names; 'auto' is reserved.");
    }
    const url = new URL(node.origin);
    if (url.protocol !== "https:" || url.username || url.password || node.origin !== url.origin) {
      throw new Error("Measurement node URLs must be exact HTTPS origins without paths or credentials.");
    }
    ids.add(node.id);
  }
}

type HealthSample = { rttMs: number; udpRelayConfigured: boolean | null };

async function healthSample(
  node: MeasurementNode,
  signal: AbortSignal,
  fetcher: typeof fetch,
  now: () => number,
  timeoutMs: number,
): Promise<HealthSample> {
  checkAborted(signal);
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let onAbort = () => {};
  const interrupted = new Promise<never>((_, reject) => {
    onAbort = () => {
      controller.abort();
      reject(abortError());
    };
    signal.addEventListener("abort", onAbort, { once: true });
    timeout = setTimeout(() => {
      controller.abort();
      reject(new Error("Health request timed out."));
    }, timeoutMs);
  });
  const started = now();
  try {
    return await Promise.race([
      (async () => {
        const response = await fetcher(`${node.origin}/health`, {
          method: "GET",
          credentials: "omit",
          cache: "no-store",
          redirect: "error",
          signal: controller.signal,
        });
        if (!response.ok) {
          await response.body?.cancel();
          throw new Error("Health request was not accepted.");
        }
        // Bound body size as well as time. A healthy node returns a tiny JSON object.
        const reader = response.body?.getReader();
        if (!reader) throw new Error("Health response was empty.");
        const decoder = new TextDecoder();
        let body = "";
        let bytes = 0;
        try {
          while (true) {
            const part = await reader.read();
            if (part.done) break;
            bytes += part.value.byteLength;
            if (bytes > 4096) {
              await reader.cancel();
              throw new Error("Health response exceeded its size limit.");
            }
            body += decoder.decode(part.value, { stream: true });
          }
          body += decoder.decode();
        } finally {
          reader.releaseLock();
        }
        const health: unknown = JSON.parse(body);
        if (!health || typeof health !== "object" || !("status" in health) || health.status !== "ok"
          || !("protocol" in health) || health.protocol !== "nettruth-node.v1") {
          throw new Error("Health response used an incompatible protocol.");
        }
        const rttMs = now() - started;
        if (!Number.isFinite(rttMs) || rttMs < 0) throw new Error("Health timing was invalid.");
        return {
          rttMs,
          udpRelayConfigured: "udpRelayConfigured" in health && typeof health.udpRelayConfigured === "boolean"
            ? health.udpRelayConfigured : null,
        };
      })(),
      interrupted,
    ]);
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", onAbort);
    controller.abort();
  }
}

/** Select from owner-configured nodes using fresh browser HTTP timings, without geolocation. */
export async function selectMeasurementNode(
  nodes: MeasurementNode[],
  preference: string,
  signal: AbortSignal,
  options: NodeSelectionOptions = {},
): Promise<{ node: MeasurementNode; selection: NodeSelection }> {
  checkAborted(signal);
  validateNodes(nodes);
  const mode = preference === "auto" ? "auto" : "manual";
  const candidates = mode === "auto" ? nodes : nodes.filter(node => node.id === preference);
  if (!candidates.length) throw new Error("The selected measurement node is not configured.");
  const fetcher = options.fetch ?? globalThis.fetch;
  const now = options.now ?? (() => performance.now());
  const timeoutMs = options.probeTimeoutMs ?? 1500;
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1 || timeoutMs > 1500) {
    throw new Error("Health probe timeout must be between 1 and 1500 milliseconds.");
  }

  const probes = new Array<NodeProbe>(candidates.length);
  let next = 0;
  async function worker(): Promise<void> {
    while (next < candidates.length) {
      checkAborted(signal);
      const index = next++;
      const node = candidates[index];
      const samples: HealthSample[] = [];
      // First request warms DNS/TLS/connection state; it is never a selection sample.
      for (let attempt = 0; attempt < 4; attempt++) {
        checkAborted(signal);
        try {
          const sample = await healthSample(node, signal, fetcher, now, timeoutMs);
          checkAborted(signal);
          if (attempt > 0) samples.push(sample);
        } catch {
          checkAborted(signal);
        }
      }
      const values = samples.map(sample => sample.rttMs).sort((a, b) => a - b);
      const available = values.length >= 2;
      const udpValues = samples.map(sample => sample.udpRelayConfigured);
      probes[index] = {
        nodeId: node.id,
        status: available ? "available" : "unavailable",
        medianRttMs: available ? (values[Math.floor((values.length - 1) / 2)] + values[Math.floor(values.length / 2)]) / 2 : null,
        samplesMs: samples.map(sample => sample.rttMs),
        udpRelayConfigured: udpValues.length && udpValues.every(value => value === true) ? true
          : udpValues.some(value => value === false) ? false : null,
        ...(!available ? { reason: "Fewer than two valid health responses within the probe deadline." } : {}),
      };
    }
  }
  await Promise.all(Array.from({ length: Math.min(3, candidates.length) }, () => worker()));
  checkAborted(signal);
  let selectedIndex = -1;
  for (let i = 0; i < probes.length; i++) {
    if (probes[i].status === "available"
      && (selectedIndex < 0 || probes[i].medianRttMs! < probes[selectedIndex].medianRttMs!)) selectedIndex = i;
  }
  if (selectedIndex < 0) {
    throw new NodeSelectionError(mode === "manual"
      ? "The selected measurement node is unavailable. Choose another node or try again."
      : "No measurement node responded reliably. Check your connection and try again.", probes);
  }
  return {
    node: candidates[selectedIndex],
    selection: { mode, selectedNodeId: candidates[selectedIndex].id, selectedAt: new Date().toISOString(), probes },
  };
}
