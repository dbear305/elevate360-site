import type { LossResult } from "./model";

export type RelayCredentials = { urls: string; username: string; credential: string };
export const unavailableLoss = (reason: string): LossResult => ({ status: "unavailable", sent: 0, received: 0, lost: 0, percent: null, reason, transport: "UDP relay", sampleWindowMs: 0 });

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
    // Require relay candidates and UDP on the selected transport. No TCP fallback.
    for (const peer of [sender, receiver]) {
      const stats = await peer.getStats();
      let valid = false;
      stats.forEach(s => {
        if (s.type !== "candidate-pair" || s.state !== "succeeded" || !s.nominated) return;
        const candidate = stats.get(s.localCandidateId);
        const remote = stats.get(s.remoteCandidateId);
        valid = candidate?.candidateType === "relay" && candidate?.protocol === "udp" && (!candidate.relayProtocol || candidate.relayProtocol === "udp") && remote?.protocol === "udp";
      });
      if (!valid) throw new Error("The browser did not confirm a UDP relay path.");
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
