import test from 'node:test';
import assert from 'node:assert/strict';
import { metrics, findings, percentile, jitter, parseLocalReport, useCases } from '../src/lib/nettruth/model.ts';
const fixture = () => ({
  schema: 'nettruth.quickcheck.v1', id: 'test', startedAt: '2026-09-10T10:00:00Z', status: 'complete', mode: 'quick', connection: 'Ethernet', elapsedMs: 12000,
  endpoint: { name: 'Test only', origin: 'https://measurement.example', provider: 'nettruth-node' },
  samples: { idle: [10, 12, 10, 12, 10, 12, 10, 12, 10, 12], downloadLatency: [80, 90, 100, 110, 120], uploadLatency: [20, 25, 30, 35, 40], download: [{ mbps: 100, durationMs: 1000, bytes: 12500000 }, { mbps: 999999, durationMs: 1, bytes: 1000 }], upload: [{ mbps: 20, durationMs: 1000, bytes: 2500000 }] },
  loss: { status: 'unavailable', sent: 0, received: 0, lost: 0, percent: null, transport: 'UDP relay', sampleWindowMs: 0 }, secureContext: true, errors: [], caveats: [],
});
test('quantiles and consecutive jitter preserve measurement units and do not mutate samples', () => {
  const values = [10, 30, 20, 40];
  assert.equal(percentile(values, .5), 25);
  assert.equal(percentile(values, .95), 38.5);
  assert.equal(jitter(values), 50 / 3);
  assert.deepEqual(values, [10,30,20,40]);
  assert.equal(percentile([], .5), null);
  assert.equal(jitter([10]), null);
  assert.equal(percentile([NaN, Infinity, -3], .5), null);
});
test('short transfer samples do not inflate throughput; loaded increase uses higher median', () => {
  const m = metrics(fixture());
  assert.equal(m.download, 100);
  assert.equal(m.idle, 11);
  assert.equal(m.down, 100);
  assert.equal(m.up, 30);
  assert.equal(m.increase, 89);
});
test('missing UDP coverage cannot become zero loss or a positive use-case verdict', () => {
  const r = fixture();
  assert.equal(r.loss.percent, null);
  assert.ok(findings(r).some(f => f.id === 'loss' && f.tone === 'info'));
  assert.ok(useCases(r).every(c => c.verdict === 'Incomplete evidence'));
});
test('insufficient loaded samples do not establish a healthy loaded path', () => {
  const r = fixture(); r.samples.downloadLatency = [10]; r.samples.uploadLatency = [10];
  const f = findings(r).find(f => f.id === 'load');
  assert.equal(f?.tone, 'info');
});
test('real measured loss is surfaced; partial results remain incomplete', () => {
  const r = fixture();
  r.loss = { status: 'measured', sent: 1000, received: 980, lost: 20, percent: 2, transport: 'UDP relay', sampleWindowMs: 8000 };
  assert.equal(findings(r).find(f => f.id === 'loss')?.tone, 'warn');
  r.status = 'cancelled';
  assert.ok(useCases(r).every(c => c.verdict === 'Incomplete evidence'));
});
test('local imports reject wrong schemas, unknown IDs, duplicate IDs, and oversized evidence', () => {
  const r = { schema: 'nettruth.windows-posture.v1', collectedAt: '2026-09-10T10:00:00Z', checks: [{ id: 'defender', status: 'unknown', title: 'Not available', evidence: 'No access', action: 'Ask admin' }] };
  assert.equal(parseLocalReport(r).checks[0].status, 'unknown');
  assert.throws(() => parseLocalReport({ ...r, schema: 'something-else' }));
  assert.throws(() => parseLocalReport({ ...r, checks: [...r.checks, ...r.checks] }));
  assert.throws(() => parseLocalReport({ ...r, checks: [{ ...r.checks[0], id: 'admin-html' }] }));
  assert.throws(() => parseLocalReport({ ...r, checks: [{ ...r.checks[0], evidence: 'x'.repeat(1201) }] }));
  const parsed = parseLocalReport({ ...r, secret: 'discard me', checks: [{ ...r.checks[0], secret: 'discard' }] });
  assert.ok(!JSON.stringify(parsed).includes('discard'));
});
