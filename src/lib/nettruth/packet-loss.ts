import type { LossResult } from "./model";

export type RelayCredentials = { urls: string; username: string; credential: string };
export const unavailableLoss = (reason: string): LossResult => ({ status: "unavailable", sent: 0, received: 0, lost: 0, percent: null, reason, transport: "UDP relay", sampleWindowMs: 0 });

// Resolve the transport's selected pair, not every previously nominated pair.
// https://www.w3.org/TR/webrtc-stats/#dom-rtctransportstats-selectedcandidatepairid
export function inspectSelectedUdpRelay(stats: RTCStatsReport): "confirmed" | "pending" | "rejected" {
  const selected = new Set<string>();
  stats.forEach(stat => {
    if (stat.type === "transport" && typeof stat.selectedCandidatePairId === "string") selected.add(stat.selectedCandidatePairId);
  });
  if (selected.size !== 1) return "pending";
  const pair = stats.get([...selected][0]);
  if (!pair || pair.type !== "candidate-pair" || pair.state !== "succeeded") return "pending";
  const local = stats.get(pair.localCandidateId);
  const remote = stats.get(pair.remoteCandidateId);
  if (!local || !remote) return "pending";
  if ((local.candidateType && local.candidateType !== "relay") ||
      (local.protocol && local.protocol !== "udp") ||
      (remote.protocol && remote.protocol !== "udp") ||
      (local.relayProtocol && local.relayProtocol !== "udp")) return "rejected";
  return local.candidateType === "relay" && local.protocol === "udp" && remote.protocol === "udp" ? "confirmed" : "pending";
}

export async function measurePacketLoss(credentials: RelayCredentials, signal: AbortSignal, count = 600): Promise<LossResult> {
  if (typeof RTCPeerConnection === "undefined") return unavailableLoss("WebRTC is unavailable in this browser.");
  if (!/^turn:[a-z0-9.-]+:\d+\?transport=udp$/i.test(credentials.urls)) return unavailableLoss("The relay must explicitly support UDP.");
  const config: RTCConfiguration = { iceTransportPolicy: "relay", iceServers: [credentials] };
  const sender = new RTCPeerConnection(config);
  const receiver = new RTCPeerConnection(config);
  const channel = sender.createDataChannel("nettruth-loss-v1", { ordered: false, maxRetransmits: 0 });
  const arrived = new Set<number>();
  let sent = 0;
  let receivingChannel: RTCDataChannel | undefined;
  const close = () => { channel.close(); receivingChannel?.close(); sender.close(); receiver.close(); };
  signal.addEventListener("abort", close, { once: true });
  const delay = (ms: number) => new Promise<void>((resolve, reject) => {
    signal.throwIfAborted();
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, ms);
    signal.addEventListener("abort", abort, { once: true });
  });
  const waitFor = async (condition: () => boolean, timeout = 10000) => {
    const start = performance.now();
    while (!condition()) {
      signal.throwIfAborted();
      if (performance.now() - start > timeout) throw new Error("UDP relay connection timed out. A firewall, relay, or browser restriction may be responsible.");
      await delay(40);
    }
  };
  try {
    signal.throwIfAborted();
    receiver.ondatachannel = event => {
      receivingChannel = event.channel;
      receivingChannel.onmessage = event => {
        const n = Number(String(event.data).split(":")[0]);
        if (Number.isInteger(n) && n >= 0 && n < sent) arrived.add(n);
      };
    };
    await sender.setLocalDescription(await sender.createOffer());
    await waitFor(() => sender.iceGatheringState === "complete");
    await receiver.setRemoteDescription(sender.localDescription!);
    await receiver.setLocalDescription(await receiver.createAnswer());
    await waitFor(() => receiver.iceGatheringState === "complete");
    await sender.setRemoteDescription(receiver.localDescription!);
    await waitFor(() => channel.readyState === "open" && receivingChannel?.readyState === "open");
    // A browser may expose the open channel before complete transport stats.
    // Retry missing metadata briefly, but never accept an unverified/TCP path.
    for (const peer of [sender, receiver]) {
      const deadline = performance.now() + 2000;
      while (true) {
        signal.throwIfAborted();
        const path = inspectSelectedUdpRelay(await peer.getStats());
        if (path === "confirmed") break;
        if (path === "rejected") throw new Error("The selected connection was not confirmed as a UDP-only relay path.");
        if (performance.now() >= deadline) throw new Error("The browser did not expose complete selected UDP relay details. Packet loss was not measured.");
        await delay(50);
      }
    }
    const start = performance.now();
    for (let i = 0; i < count; i++) {
      signal.throwIfAborted();
      if (channel.readyState !== "open" || channel.bufferedAmount > 64 * 1024) throw new Error("The local send buffer or relay connection interrupted the loss measurement.");
      channel.send(`${i}:${"x".repeat(60)}`);
      sent++;
      await delay(5);
    }
    const deadline = performance.now() + 3000;
    while (arrived.size < sent && performance.now() < deadline) await delay(25);
    const lost = sent - arrived.size;
    return { status: "measured", sent, received: arrived.size, lost, percent: 100 * lost / sent, transport: "UDP relay", sampleWindowMs: performance.now() - start };
  } catch (error) {
    signal.throwIfAborted();
    return unavailableLoss(error instanceof Error ? error.message : "UDP relay measurement failed.");
  } finally {
    signal.removeEventListener("abort", close);
    close();
  }
}
