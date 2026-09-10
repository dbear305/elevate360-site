import test from 'node:test';
import assert from 'node:assert/strict';
import { selectMeasurementNode, NodeSelectionError } from '../src/lib/nettruth/node-selection.ts';

const nodes = [
  { id: 'new-york', name: 'New York', origin: 'https://ny.example' },
  { id: 'dallas', name: 'Dallas', origin: 'https://tx.example' },
  { id: 'west', name: 'West', origin: 'https://west.example' },
];
const health = () => Response.json({ status: 'ok', protocol: 'nettruth-node.v1', udpRelayConfigured: true });
const signal = () => new AbortController().signal;

function delayedHealth(delays) {
  const calls = new Map();
  const fetch = async (url, init) => {
    assert.equal(init.method, 'GET');
    assert.equal(init.credentials, 'omit');
    assert.equal(init.cache, 'no-store');
    assert.equal(init.redirect, 'error');
    const count = (calls.get(url) || 0) + 1;
    calls.set(url, count);
    const value = delays[new URL(url).hostname];
    await new Promise(resolve => setTimeout(resolve, Array.isArray(value) ? value[count - 1] : value));
    return health();
  };
  return { fetch, calls };
}

test('auto selects lowest median after excluding warmup, repeats selection freshly, and records bounded evidence', async () => {
  const mock = delayedHealth({ 'ny.example': 35, 'tx.example': [70, 2, 2, 2], 'west.example': 20 });
  const result = await selectMeasurementNode(nodes, 'auto', signal(), { fetch: mock.fetch });
  assert.equal(result.node.id, 'dallas');
  assert.equal(result.selection.mode, 'auto');
  assert.equal(result.selection.selectedNodeId, 'dallas');
  assert.ok(Number.isFinite(Date.parse(result.selection.selectedAt)));
  assert.deepEqual(result.selection.probes.map(probe => probe.nodeId), nodes.map(node => node.id));
  assert.ok(result.selection.probes.every(probe => probe.status === 'available' && probe.samplesMs.length === 3 && probe.udpRelayConfigured === true));
  assert.equal([...mock.calls.values()].reduce((a, b) => a + b, 0), 12);
  const reversed = delayedHealth({ 'ny.example': 1, 'tx.example': 40, 'west.example': 20 });
  assert.equal((await selectMeasurementNode(nodes, 'auto', signal(), { fetch: reversed.fetch })).node.id, 'new-york');
});

test('failed nodes are excluded; ties use configured order and a warmup cannot qualify a node', async () => {
  let dallasCalls = 0;
  const result = await selectMeasurementNode(nodes, 'auto', signal(), {
    now: () => 10,
    fetch: async url => {
      if (url.includes('ny.example')) return new Response(null, { status: 503 });
      if (url.includes('tx.example') && ++dallasCalls > 2) throw new Error('offline');
      return health();
    },
  });
  assert.equal(result.node.id, 'west');
  assert.equal(result.selection.probes[1].samplesMs.length, 1);
  assert.equal(result.selection.probes[1].medianRttMs, null);
  const tied = await selectMeasurementNode(nodes, 'auto', signal(), { now: () => 10, fetch: async () => health() });
  assert.equal(tied.node.id, 'new-york');
});

test('manual selection probes only requested node and never silently falls back', async () => {
  const requested = [];
  const manual = await selectMeasurementNode(nodes, 'west', signal(), {
    fetch: async url => { requested.push(url); return health(); },
  });
  assert.equal(manual.node.id, 'west');
  assert.equal(manual.selection.mode, 'manual');
  assert.deepEqual(requested, Array(4).fill('https://west.example/health'));
  requested.length = 0;
  await assert.rejects(selectMeasurementNode(nodes, 'west', signal(), {
    fetch: async url => { requested.push(url); throw new Error('unreachable'); },
  }), error => error instanceof NodeSelectionError && /selected measurement node is unavailable/.test(error.message)
    && error.probes.length === 1 && error.probes[0].nodeId === 'west');
  assert.deepEqual(requested, Array(4).fill('https://west.example/health'));
});

test('all-unavailable returns failure evidence without a fabricated selection', async () => {
  await assert.rejects(selectMeasurementNode(nodes, 'auto', signal(), {
    fetch: async () => { throw new Error('network failure'); },
  }), error => {
    assert.ok(error instanceof NodeSelectionError);
    assert.match(error.message, /No measurement node responded reliably/);
    assert.equal(error.probes.length, 3);
    assert.ok(error.probes.every(probe => probe.status === 'unavailable' && probe.medianRttMs === null && probe.samplesMs.length === 0));
    return true;
  });
});

test('cancellation aborts all outstanding probes without starting additional work', async () => {
  const controller = new AbortController();
  const childSignals = [];
  const running = selectMeasurementNode(nodes, 'auto', controller.signal, {
    fetch: async (_, init) => { childSignals.push(init.signal); return new Promise(() => {}); },
  });
  assert.equal(childSignals.length, 3);
  controller.abort();
  await assert.rejects(running, { name: 'AbortError' });
  assert.ok(childSignals.every(child => child.aborted));
  await assert.rejects(selectMeasurementNode(nodes, 'auto', controller.signal, {
    fetch: async () => { assert.fail('Already cancelled selection must not fetch'); },
  }), { name: 'AbortError' });
});

test('malformed, oversized, and incompatible health responses never become valid latency samples', async () => {
  const invalid = [
    () => new Response('invalid-json'),
    () => Response.json({ status: 'ok', protocol: 'other.v1' }),
    () => Response.json({ status: 'error', protocol: 'nettruth-node.v1' }),
    () => Response.json(null),
    () => new Response('x'.repeat(4097)),
  ];
  for (const response of invalid) {
    await assert.rejects(selectMeasurementNode([nodes[0]], 'auto', signal(), { fetch: async () => response() }),
      error => error instanceof NodeSelectionError && error.probes[0].samplesMs.length === 0);
  }
});

test('a response body that stalls is covered by the request deadline', async () => {
  const childSignals = [];
  let calls = 0;
  await assert.rejects(selectMeasurementNode([nodes[0]], 'auto', signal(), {
    probeTimeoutMs: 5,
    fetch: async (_, init) => {
      calls++;
      childSignals.push(init.signal);
      return new Response(new ReadableStream({
        start(controller) { init.signal.addEventListener('abort', () => controller.error(new DOMException('Aborted', 'AbortError')), { once: true }); },
      }));
    },
  }), NodeSelectionError);
  assert.equal(calls, 4);
  assert.ok(childSignals.every(child => child.aborted));
});

test('at most three nodes probe concurrently and configuration is bounded to eight nodes', async () => {
  const many = Array.from({ length: 8 }, (_, index) => ({ id: `n${index}`, name: `Node ${index}`, origin: `https://n${index}.example` }));
  let active = 0;
  let maximum = 0;
  let count = 0;
  const result = await selectMeasurementNode(many, 'auto', signal(), {
    fetch: async () => {
      count++;
      active++;
      maximum = Math.max(maximum, active);
      await new Promise(resolve => setTimeout(resolve, 1));
      active--;
      return health();
    },
  });
  assert.equal(maximum, 3);
  assert.equal(count, 32);
  assert.equal(result.selection.probes.length, 8);
  await assert.rejects(selectMeasurementNode([...many, { id: 'n8', name: 'Nine', origin: 'https://n8.example' }], 'auto', signal()), /between 1 and 8/);
});

test('only configured exact HTTPS origins and valid unique IDs can be probed', async () => {
  for (const origin of ['http://ny.example', 'https://user:password@ny.example', 'https://ny.example/path', 'https://ny.example?token=secret', 'https://ny.example/', 'https://ny.example#fragment']) {
    await assert.rejects(selectMeasurementNode([{ ...nodes[0], origin }], 'auto', signal()), /exact HTTPS origins/);
  }
  await assert.rejects(selectMeasurementNode([], 'auto', signal()), /between 1 and 8/);
  await assert.rejects(selectMeasurementNode([nodes[0], nodes[0]], 'auto', signal()), /unique/);
  await assert.rejects(selectMeasurementNode([{ ...nodes[0], id: 'auto' }], 'auto', signal()), /reserved/);
  await assert.rejects(selectMeasurementNode(nodes, 'not-configured', signal()), /not configured/);
});
