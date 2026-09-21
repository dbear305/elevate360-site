import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createHmac } from 'node:crypto';
import { createMeasurementServer } from '../services/nettruth-node/server.mjs';
const origin = 'https://www.elevate360systems.com';
async function withServer(options, fn) {
  const server = createMeasurementServer({ origins: [origin], requireVerification: false, ...options });
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

const verificationSecret = 'test-only-private-verification-secret';
const validVerification = { success: true, hostname: new URL(origin).hostname, action: 'nettruth' };
const verifiedOptions = { requireVerification: true, turnstileSecret: verificationSecret };
const verifyReply = (body = validVerification) => new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
const verifiedSession = (request, token = 'challenge-token', init = {}) => request('/session', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...init.headers },
  body: JSON.stringify({ mode: 'quick', turnstileToken: token }),
});
function latch() {
  let release;
  const promise = new Promise(resolve => { release = resolve; });
  return { promise, release };
}

test('verification is required by default; missing configuration fails closed without credentials', async () => {
  let calls = 0;
  await withServer({ requireVerification: undefined, verifyFetch: async () => { calls++; return verifyReply(); } }, async request => {
    const health = await (await request('/health')).json();
    assert.equal(health.verificationRequired, true);
    const response = await verifiedSession(request);
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.code, 'verification_unavailable');
    assert.equal(body.token, undefined);
    assert.equal(body.relay, undefined);
    assert.equal(calls, 0);
    assert.equal((await request('/__down?bytes=0')).status, 401);
  });
  await withServer({}, async request => {
    assert.equal((await (await request('/health')).json()).verificationRequired, false);
    assert.equal((await session(request)).verified, false);
  });
});

test('missing, invalid and oversized challenge inputs never contact the provider', async () => {
  let calls = 0;
  await withServer({ ...verifiedOptions, verifyFetch: async () => { calls++; return verifyReply(); } }, async request => {
    for (const token of [undefined, null, 123, '', ' ', 'a'.repeat(2049)]) {
      const response = await verifiedSession(request, token === undefined ? null : token);
      assert.equal(response.status, 403);
      assert.equal((await response.json()).code, 'verification_failed');
    }
    const missing = await request('/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"mode":"quick"}' });
    assert.equal(missing.status, 403);
    for (const body of ['null', '[]', '{', JSON.stringify({ mode: 'quick', turnstileToken: 'a'.repeat(4096) })]) {
      assert.equal((await request('/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })).status, 400);
    }
    assert.equal(calls, 0);
  });
});

test('successful verification is exact-host/action bound and only precedes session issuance', async () => {
  let calls = 0;
  const challenge = 'challenge-input-must-not-be-returned';
  await withServer({ ...verifiedOptions, turnHost: 'relay.example.com:3478', turnSecret: 'private-relay-secret', verifyFetch: async (url, init) => {
    calls++;
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.equal(init.method, 'POST');
    assert.equal(init.redirect, 'error');
    assert.equal(init.body.get('secret'), verificationSecret);
    assert.equal(init.body.get('response'), challenge);
    assert.ok(init.signal instanceof AbortSignal);
    return verifyReply();
  } }, async request => {
    assert.equal((await verifiedSession(request, challenge, { headers: { Origin: 'https://attacker.example' } })).status, 403);
    assert.equal(calls, 0);
    const response = await verifiedSession(request, challenge);
    assert.equal(response.status, 201);
    const body = await response.json();
    assert.match(body.token, /^[0-9a-f]{48}$/);
    assert.equal(body.verified, true);
    assert.equal(body.relay.urls, 'turn:relay.example.com:3478?transport=udp');
    for (const secret of [challenge, verificationSecret, 'private-relay-secret']) assert.ok(!JSON.stringify(body).includes(secret));
    assert.equal((await request(`/__down?token=${body.token}&bytes=0`)).status, 200);
    assert.equal((await request('/health')).status, 200);
    assert.equal(calls, 1, 'measurements and health do not contact Turnstile');
  });
});

test('failed verification, wrong action and another allowed hostname cannot issue sessions', async () => {
  const replies = [
    { success: false, 'error-codes': ['invalid-input-response'] },
    { ...validVerification, success: 'true' },
    { ...validVerification, action: 'login' },
    { ...validVerification, action: undefined },
    { ...validVerification, hostname: 'elevate360systems.com' },
    { ...validVerification, hostname: 'www.elevate360systems.com.attacker.example' },
    { ...validVerification, hostname: undefined },
  ];
  await withServer({ ...verifiedOptions, origins: [origin, 'https://elevate360systems.com'], maxSessions: 1, verifyFetch: async () => verifyReply(replies.shift() || validVerification) }, async request => {
    for (let i = 0; i < 7; i++) {
      const response = await verifiedSession(request);
      assert.equal(response.status, 403);
      const body = await response.json();
      assert.equal(body.token, undefined);
      assert.equal(body.relay, undefined);
    }
    assert.equal((await verifiedSession(request)).status, 201, 'failures did not create sessions or consume successful-session quota');
  });
});

test('provider failures, malformed responses and oversize bodies fail closed without details', async () => {
  const privateDetail = 'provider-private-error-detail';
  const providers = [
    async () => { throw new Error(privateDetail); },
    async () => new Response(privateDetail, { status: 500 }),
    async () => new Response(privateDetail),
    async () => new Response('null'),
    async () => new Response('[]'),
    async () => verifyReply({ success: false, 'error-codes': ['invalid-input-secret'] }),
    async () => verifyReply({ success: false, 'error-codes': ['internal-error'] }),
    async () => new Response('x'.repeat(16385)),
    async () => new Response('{}', { headers: { 'Content-Length': '16385' } }),
  ];
  for (const verifyFetch of providers) {
    await withServer({ ...verifiedOptions, verifyFetch }, async request => {
      const response = await verifiedSession(request);
      assert.equal(response.status, 503);
      const body = await response.text();
      assert.ok(!body.includes(privateDetail));
      assert.ok(!body.includes(verificationSecret));
      assert.equal(JSON.parse(body).token, undefined);
    });
  }
});

test('verification deadline includes a stalled response body and releases provider capacity', async () => {
  let calls = 0;
  let signal;
  await withServer({ ...verifiedOptions, verificationTimeoutMs: 30, maxVerifications: 1, verifyFetch: async (_url, init) => {
    calls++;
    signal = init.signal;
    return calls === 1 ? new Response(new ReadableStream({ start(controller) {
      init.signal.addEventListener('abort', () => controller.error(new Error('aborted')), { once: true });
    } })) : verifyReply();
  } }, async request => {
    const response = await verifiedSession(request);
    assert.equal(response.status, 503);
    assert.equal(signal.aborted, true);
    assert.equal((await verifiedSession(request, 'fresh-challenge')).status, 201);
  });
});

test('a provider that never returns response headers is bounded by the verification deadline', async () => {
  let signal;
  await withServer({ ...verifiedOptions, verificationTimeoutMs: 30, verifyFetch: async (_url, init) => {
    signal = init.signal;
    return new Promise(() => {});
  } }, async request => {
    const response = await verifiedSession(request);
    assert.equal(response.status, 503);
    assert.equal(signal.aborted, true);
    assert.equal((await response.json()).token, undefined);
  });
});

test('replaying one challenge invokes Siteverify again and rejects its duplicate response', async () => {
  const seen = new Set();
  let calls = 0;
  await withServer({ ...verifiedOptions, verifyFetch: async (_url, init) => {
    calls++;
    const token = init.body.get('response');
    if (seen.has(token)) return verifyReply({ success: false, 'error-codes': ['timeout-or-duplicate'] });
    seen.add(token);
    return verifyReply();
  } }, async request => {
    assert.equal((await verifiedSession(request, 'one-use-challenge')).status, 201);
    const duplicate = await verifiedSession(request, 'one-use-challenge');
    assert.equal(duplicate.status, 403);
    assert.equal((await duplicate.json()).token, undefined);
    assert.equal(calls, 2);
  });
});

test('in-flight verification cap prevents more outbound requests and recovers after completion', async () => {
  const gate = latch();
  const started = latch();
  let calls = 0;
  await withServer({ ...verifiedOptions, maxVerifications: 2, verifyFetch: async () => {
    calls++;
    if (calls === 2) started.release();
    await gate.promise;
    return verifyReply();
  } }, async request => {
    const pending = [verifiedSession(request, 'a'), verifiedSession(request, 'b')];
    await started.promise;
    try {
      const response = await verifiedSession(request, 'c');
      assert.equal(response.status, 503);
      assert.equal(response.headers.get('retry-after'), '5');
      assert.equal(calls, 2);
    } finally { gate.release(); }
    assert.deepEqual((await Promise.all(pending)).map(response => response.status), [201, 201]);
    assert.equal((await verifiedSession(request, 'd')).status, 201);
  });
});

test('attempt quota is reserved before awaiting the provider and resets after its time window', async () => {
  const gate = latch();
  const started = latch();
  let calls = 0;
  let current = Date.now();
  await withServer({ ...verifiedOptions, now: () => current, maxVerifications: 20, verifyFetch: async () => {
    calls++;
    if (calls === 12) started.release();
    await gate.promise;
    return verifyReply({ success: false });
  } }, async request => {
    const pending = Array.from({ length: 12 }, (_, i) => verifiedSession(request, `challenge-${i}`));
    await started.promise;
    try {
      const response = await verifiedSession(request, 'over-limit');
      assert.equal(response.status, 429);
      assert.equal((await response.json()).code, 'verification_rate_limited');
      assert.equal(calls, 12);
    } finally { gate.release(); }
    assert.ok((await Promise.all(pending)).every(response => response.status === 403));
    current += 600001;
    assert.equal((await verifiedSession(request, 'fresh-window')).status, 403);
    assert.equal(calls, 13);
  });
});

test('concurrent successful verifications recheck the successful-session quota', async () => {
  const gate = latch();
  const started = latch();
  let calls = 0;
  await withServer({ ...verifiedOptions, verifyFetch: async () => {
    calls++;
    if (calls === 8) started.release();
    await gate.promise;
    return verifyReply();
  } }, async request => {
    const pending = Array.from({ length: 8 }, (_, i) => verifiedSession(request, `challenge-${i}`));
    await started.promise;
    gate.release();
    const responses = await Promise.all(pending);
    assert.equal(responses.filter(response => response.status === 201).length, 6);
    assert.equal(responses.filter(response => response.status === 429).length, 2);
  });
});

test('concurrent successful verifications cannot overfill the session table', async () => {
  const gate = latch();
  const started = latch();
  let calls = 0;
  await withServer({ ...verifiedOptions, maxSessions: 1, verifyFetch: async () => {
    calls++;
    if (calls === 2) started.release();
    await gate.promise;
    return verifyReply();
  } }, async request => {
    const pending = [verifiedSession(request, 'first'), verifiedSession(request, 'second')];
    await started.promise;
    gate.release();
    const responses = await Promise.all(pending);
    assert.equal(responses.filter(response => response.status === 201).length, 1);
    assert.equal(responses.filter(response => response.status === 429).length, 1);
  });
});
