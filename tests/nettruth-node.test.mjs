import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createHmac } from 'node:crypto';
import { createMeasurementServer } from '../services/nettruth-node/server.mjs';
const origin = 'https://www.elevate360systems.com';
async function withServer(options, fn) {
  const server = createMeasurementServer({ origins: [origin], ...options });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, init = {}) => fetch(base + path, { ...init, headers: { Origin: origin, ...init.headers } });
  try { await fn(request); } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}
async function session(request, mode = 'quick') {
  const r = await request('/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode }) });
  assert.equal(r.status, 201); return r.json();
}
test('node streams byte-exact uncached downloads and counts actual upload bytes', async () => {
  await withServer({}, async request => {
    const s = await session(request);
    const down = await request(`/__down?token=${s.token}&bytes=1000000`);
    assert.equal(down.status, 200);
    assert.equal(down.headers.get('timing-allow-origin'), origin);
    assert.equal(down.headers.get('cache-control'), 'no-store, no-transform');
    assert.equal(down.headers.get('content-encoding'), null);
    assert.equal((await down.arrayBuffer()).byteLength, 1000000);
    const latency = await request(`/__down?token=${s.token}&bytes=0`);
    assert.equal((await latency.arrayBuffer()).byteLength, 0);
    const up = await request(`/__up?token=${s.token}`, { method: 'POST', body: 'x'.repeat(123456) });
    assert.equal(up.status, 200); assert.equal((await up.json()).received, 123456);
    assert.equal(up.headers.get('server-timing'), 'cfRequestDuration;dur=0');
  });
});
test('rejects arbitrary origins, invalid sessions, methods, paths and payload sizes', async () => {
  await withServer({}, async request => {
    assert.equal((await request('/health', { headers: { Origin: 'https://attacker.example' } })).status, 403);
    assert.equal((await request('/__down?bytes=12')).status, 401);
    const s = await session(request);
    for (const bytes of ['-1', 'NaN', '99999999999', '1.5', '']) assert.equal((await request(`/__down?token=${s.token}&bytes=${bytes}`)).status, 400);
    assert.equal((await request(`/__up?token=${s.token}`)).status, 405);
    assert.equal((await request('/proxy?url=http://127.0.0.1')).status, 404);
  });
});
test('hourly quotas stop traffic; session expiry is enforced', async () => {
  let current = Date.now();
  await withServer({ hourlyByteLimit: 100, now: () => current }, async request => {
    const s = await session(request);
    await (await request(`/__down?token=${s.token}&bytes=80`)).arrayBuffer();
    assert.equal((await request(`/__down?token=${s.token}&bytes=30`)).status, 429);
    current += 240001;
    assert.equal((await request(`/__down?token=${s.token}&bytes=0`)).status, 401);
  });
});
test('session limits do not trust forwarded client headers by default', async () => {
  await withServer({}, async request => {
    for (let i = 0; i < 6; i++) await session(request);
    const response = await request('/session', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Real-IP': '203.0.113.7' }, body: '{"mode":"quick"}' });
    assert.equal(response.status, 429);
  });
});
test('TURN credentials are short-lived HMACs; secret is never returned', async () => {
  const secret = 'test-only-never-a-production-secret';
  await withServer({ turnHost: 'relay.example.com:3478', turnSecret: secret }, async request => {
    const s = await session(request);
    assert.equal(s.relay.urls, 'turn:relay.example.com:3478?transport=udp');
    assert.equal(s.relay.credential, createHmac('sha1', secret).update(s.relay.username).digest('base64'));
    assert.ok(Number(s.relay.username.split(':')[0]) * 1000 - Date.now() <= 240000);
    assert.ok(!JSON.stringify(s).includes(secret));
  });
});
test('concurrent session requests cannot bypass the client quota', async () => {
  await withServer({}, async request => {
    const responses = await Promise.all(Array.from({ length: 12 }, () => request('/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"mode":"quick"}' })));
    assert.equal(responses.filter(r => r.status === 201).length, 6);
    assert.equal(responses.filter(r => r.status === 429).length, 6);
  });
});
