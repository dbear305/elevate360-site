import test from 'node:test';
import assert from 'node:assert/strict';
import { createMeasurementSession } from '../src/lib/nettruth/session.ts';

const origin = 'https://measure.example';
const challenge = 'single-use-challenge-token';
const sessionToken = 'a'.repeat(48);
const response = overrides => Response.json({ verified: true, token: sessionToken, expiresAt: new Date(Date.now() + 240000).toISOString(), ...overrides });

test('verification is submitted once in the selected node POST body and excluded from returned session fields', async () => {
  const calls = [];
  const session = await createMeasurementSession(origin, 'quick', challenge, new AbortController().signal, { fetch: async (url, options) => {
    calls.push({ url, options });
    return response({ turnstileToken: challenge, extra: 'discard', relay: { urls: 'turn:relay.example:3478?transport=udp', username: 'relay-user', credential: 'relay-pass', extra: 'discard' } });
  } });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${origin}/session`);
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.credentials, 'omit');
  assert.equal(calls[0].options.redirect, 'error');
  assert.equal(calls[0].options.cache, 'no-store');
  assert.deepEqual(JSON.parse(calls[0].options.body), { mode: 'quick', turnstileToken: challenge });
  assert.equal(session.origin, origin);
  assert.equal(session.token, sessionToken);
  assert.equal(JSON.stringify(session).includes(challenge), false);
  assert.equal(JSON.stringify(session).includes('discard'), false);
});

test('403, 429 and 503 require user retry and never resend or expose an echoed token', async () => {
  for (const [status, expected] of [[403, /fresh verification/], [429, /busy/], [503, /temporarily unavailable/]]) {
    let calls = 0;
    await assert.rejects(createMeasurementSession(origin, 'quick', challenge, new AbortController().signal, { fetch: async () => {
      calls++;
      return Response.json({ error: challenge }, { status });
    } }), error => expected.test(error.message) && !error.message.includes(challenge));
    assert.equal(calls, 1);
  }
});

test('legacy or unenforced nodes cannot start verified measurements', async () => {
  for (const verified of [undefined, false, 'true']) {
    await assert.rejects(createMeasurementSession(origin, 'quick', challenge, new AbortController().signal, { fetch: async () => response({ verified }) }), /valid verified session/);
  }
});

test('expired and malformed session credentials remain unavailable', async () => {
  for (const overrides of [{ token: 'wrong' }, { expiresAt: 'invalid' }, { expiresAt: new Date(Date.now() - 1).toISOString() }]) {
    await assert.rejects(createMeasurementSession(origin, 'quick', challenge, new AbortController().signal, { fetch: async () => response(overrides) }), /valid verified session/);
  }
});

test('missing verification and insecure or non-origin endpoints send no request', async () => {
  let calls = 0;
  const options = { fetch: async () => { calls++; return response(); } };
  for (const token of ['', ' ', 'x'.repeat(2049)]) {
    await assert.rejects(createMeasurementSession(origin, 'quick', token, new AbortController().signal, options), /complete verification/);
  }
  for (const endpoint of ['http://measure.example', `${origin}/path`, 'https://user:pass@measure.example']) {
    await assert.rejects(createMeasurementSession(endpoint, 'quick', challenge, new AbortController().signal, options), /exact HTTPS origin/);
  }
  assert.equal(calls, 0);
});

test('cancellation before a session request sends no token', async () => {
  const controller = new AbortController(); controller.abort();
  let calls = 0;
  await assert.rejects(createMeasurementSession(origin, 'quick', challenge, controller.signal, { fetch: async () => { calls++; return response(); } }), { name: 'AbortError' });
  assert.equal(calls, 0);
});

test('cancellation interrupts a stalled session request without retries', async () => {
  const controller = new AbortController();
  let calls = 0;
  let requestSignal;
  const pending = createMeasurementSession(origin, 'quick', challenge, controller.signal, { fetch: async (_url, options) => {
    calls++; requestSignal = options.signal;
    return new Promise(() => {});
  } });
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(requestSignal.aborted, true);
  assert.equal(calls, 1);
});

test('session response time limit includes the body and cancels a stalled read', async () => {
  let cancelled = false;
  // Keep the event loop active while AbortSignal.timeout uses an unref'ed timer.
  const keepAlive = setInterval(() => {}, 1000);
  try {
    await assert.rejects(createMeasurementSession(origin, 'extended', challenge, new AbortController().signal, { timeoutMs: 20, fetch: async () => new Response(new ReadableStream({ cancel() { cancelled = true; } })) }), /took too long/);
    assert.equal(cancelled, true);
  } finally { clearInterval(keepAlive); }
});

test('oversized response is rejected without accepting hidden credentials', async () => {
  await assert.rejects(createMeasurementSession(origin, 'quick', challenge, new AbortController().signal, { fetch: async () => response({ padding: 'x'.repeat(4096) }) }), /invalid session/);
});
