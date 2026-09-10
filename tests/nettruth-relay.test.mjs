import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectSelectedUdpRelay, measurePacketLoss } from '../src/lib/nettruth/packet-loss.ts';

function relayStats(overrides = {}) {
  return new Map([
    ['transport', { type: 'transport', selectedCandidatePairId: 'selected' }],
    ['selected', { type: 'candidate-pair', state: 'succeeded', nominated: false, localCandidateId: 'local', remoteCandidateId: 'remote' }],
    ['local', { type: 'local-candidate', candidateType: 'relay', protocol: 'udp', relayProtocol: 'udp', ...overrides }],
    ['remote', { type: 'remote-candidate', protocol: 'udp' }],
    ['old-pair', { type: 'candidate-pair', state: 'succeeded', nominated: true, localCandidateId: 'old-local', remoteCandidateId: 'remote' }],
    ['old-local', { type: 'local-candidate', candidateType: 'relay', protocol: 'udp', relayProtocol: 'tcp' }],
  ]);
}

test('selected UDP transport is independent of nomination flags and unrelated pair iteration order', () => {
  const stats = relayStats();
  assert.equal(inspectSelectedUdpRelay(stats), 'confirmed');
  assert.equal(inspectSelectedUdpRelay(new Map([...stats].reverse())), 'confirmed');
});

test('selected TCP or nonrelay path cannot be rescued by another healthy pair', () => {
  for (const invalid of [{ relayProtocol: 'tcp' }, { protocol: 'tcp' }, { candidateType: 'host' }]) {
    const stats = relayStats(invalid);
    stats.set('old-local', { type: 'local-candidate', candidateType: 'relay', protocol: 'udp', relayProtocol: 'udp' });
    assert.equal(inspectSelectedUdpRelay(stats), 'rejected');
  }
  const remoteTcp = relayStats();
  remoteTcp.set('remote', { type: 'remote-candidate', protocol: 'tcp' });
  assert.equal(inspectSelectedUdpRelay(remoteTcp), 'rejected');
});

test('missing or ambiguous selected transport evidence remains unverified', () => {
  assert.equal(inspectSelectedUdpRelay(new Map()), 'pending');
  const missing = relayStats();
  missing.delete('remote');
  assert.equal(inspectSelectedUdpRelay(missing), 'pending');
  const noProtocol = relayStats();
  noProtocol.set('remote', { type: 'remote-candidate' });
  assert.equal(inspectSelectedUdpRelay(noProtocol), 'pending');
  const ambiguous = relayStats();
  ambiguous.set('second-transport', { type: 'transport', selectedCandidatePairId: 'old-pair' });
  assert.equal(inspectSelectedUdpRelay(ambiguous), 'pending');
});

function fakePeers(t, snapshots) {
  const original = globalThis.RTCPeerConnection;
  const peers = [];
  let messages = 0;
  class Peer {
    iceGatheringState = 'complete';
    reads = 0;
    localDescription = {};
    incoming = { readyState: 'open', close() {} };
    constructor() { peers.push(this); }
    createDataChannel() {
      return { readyState: 'open', bufferedAmount: 0, close() {}, send(data) {
        messages++;
        queueMicrotask(() => peers[1].incoming.onmessage({ data }));
      } };
    }
    async createOffer() { return {}; }
    async createAnswer() { return {}; }
    async setLocalDescription() {}
    async setRemoteDescription() { this.ondatachannel?.({ channel: this.incoming }); }
    async getStats() { return snapshots(this.reads++); }
    close() {}
  }
  globalThis.RTCPeerConnection = Peer;
  t.after(() => { if (original === undefined) delete globalThis.RTCPeerConnection; else globalThis.RTCPeerConnection = original; });
  return { peers, messages: () => messages };
}

const credentials = { urls: 'turn:relay.example:3478?transport=udp', username: 'test', credential: 'test' };

test('loss messages start only after both peers expose verified selected UDP paths', async t => {
  const fake = fakePeers(t, reads => reads === 0 ? new Map() : relayStats());
  const result = await measurePacketLoss(credentials, new AbortController().signal, 3);
  assert.equal(result.status, 'measured');
  assert.equal(result.sent, 3);
  assert.equal(result.received, 3);
  assert.ok(fake.peers.every(peer => peer.reads >= 2));
});

test('permanently missing stats time out without fabricating packet loss', async t => {
  const fake = fakePeers(t, () => new Map());
  const result = await measurePacketLoss(credentials, new AbortController().signal, 3);
  assert.equal(result.status, 'unavailable');
  assert.equal(result.percent, null);
  assert.equal(fake.messages(), 0);
  assert.match(result.reason, /selected UDP relay details/);
});

test('abort during path verification sends no measurement messages', async t => {
  const fake = fakePeers(t, () => new Map());
  await assert.rejects(measurePacketLoss(credentials, AbortSignal.timeout(20), 3), { name: 'TimeoutError' });
  assert.equal(fake.messages(), 0);
});
