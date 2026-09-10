import http from 'node:http';
import { randomBytes, createHmac } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const MiB = 1024 * 1024;
export function createMeasurementServer(options = {}) {
  const origins = new Set(options.origins || []);
  if (!origins.size || [...origins].some(o => { try { return new URL(o).origin !== o; } catch { return true; } })) throw new Error('Set exact allowed origins. Wildcards are not supported.');
  const now = options.now || Date.now;
  const sessions = new Map();
  const clients = new Map();
  const maxRequest = options.maxRequestBytes || 25_000_000;
  const hourlyLimit = options.hourlyByteLimit || 2 * 1024 * MiB;
  const maxSessions = options.maxSessions || 64;
  let hourlyBytes = 0;
  let hourStart = now();
  let active = 0;
  const payload = randomBytes(64 * 1024);
  const cleanup = setInterval(() => {
    for (const [key, session] of sessions) if (session.expires < now()) sessions.delete(key);
    for (const [key, client] of clients) if (client.expires < now()) clients.delete(key);
    if (now() - hourStart >= 3600000) { hourlyBytes = 0; hourStart = now(); }
  }, 30000);
  cleanup.unref();

  const server = http.createServer({ maxHeaderSize: 8192 }, async (req, res) => {
    const origin = req.headers.origin;
    res.setHeader('Cache-Control', 'no-store, no-transform');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    const json = (status, data) => { if (!res.destroyed) { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); } };
    if (!origin || !origins.has(origin)) return json(403, { error: 'Origin not allowed' });
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Timing-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Expose-Headers', 'Server-Timing, Content-Length');
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' }); res.end(); return;
    }
    let url;
    try { url = new URL(req.url, 'http://node.invalid'); } catch { return json(400, { error: 'Invalid URL' }); }
    const ip = options.trustLoopbackProxy && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress) && typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : req.socket.remoteAddress;
    const readBody = async (limit) => {
      const parts = []; let bytes = 0;
      for await (const chunk of req) { bytes += chunk.length; if (bytes > limit) throw new Error('Body too large'); parts.push(chunk); }
      return Buffer.concat(parts).toString('utf8');
    };
    if (url.pathname === '/health' && req.method === 'GET') return json(200, { status: 'ok', protocol: 'nettruth-node.v1', udpRelayConfigured: Boolean(options.turnHost && options.turnSecret) });
    if (url.pathname === '/session' && req.method === 'POST') {
      if (Number(req.headers['content-length']) > 512 || !String(req.headers['content-type']).startsWith('application/json')) return json(400, { error: 'Small JSON body required' });
      let body;
      try { body = JSON.parse(await readBody(512)); } catch { return json(400, { error: 'Invalid session request' }); }
      if (!['quick', 'extended'].includes(body.mode)) return json(400, { error: 'Invalid test mode' });
      // Check and reserve atomically after awaiting the body. Concurrent requests
      // must not all reuse a stale counter or bypass the session capacity limit.
      const prior = clients.get(ip);
      if (sessions.size >= maxSessions || clients.size >= 10000 || (prior && prior.expires > now() && prior.count >= 6)) { res.setHeader('Retry-After', '600'); return json(429, { error: 'Test capacity reached' }); }
      const token = randomBytes(24).toString('hex');
      const expires = now() + 240000;
      clients.set(ip, { count: prior && prior.expires > now() ? prior.count + 1 : 1, expires: prior && prior.expires > now() ? prior.expires : now() + 600000 });
      sessions.set(token, { ip, origin, expires, requests: 0, active: 0, remaining: body.mode === 'extended' ? 400_000_000 : 150_000_000 });
      let relay;
      if (options.turnHost && options.turnSecret) {
        if (!/^[a-z0-9.-]+:\d+$/i.test(options.turnHost)) return json(503, { error: 'Invalid relay configuration' });
        const username = `${Math.floor(expires / 1000)}:${randomBytes(10).toString('hex')}`;
        relay = { urls: `turn:${options.turnHost}?transport=udp`, username, credential: createHmac('sha1', options.turnSecret).update(username).digest('base64') };
      }
      return json(201, { token, expiresAt: new Date(expires).toISOString(), ...(relay ? { relay } : {}) });
    }
    if (!['/__down', '/__up'].includes(url.pathname)) return json(404, { error: 'Not found' });
    if ((url.pathname === '/__down' && req.method !== 'GET') || (url.pathname === '/__up' && req.method !== 'POST')) return json(405, { error: 'Method not allowed' });
    const session = sessions.get(url.searchParams.get('token'));
    if (!session || session.expires <= now() || session.ip !== ip || session.origin !== origin) return json(401, { error: 'Invalid or expired session' });
    if (now() - hourStart >= 3600000) { hourlyBytes = 0; hourStart = now(); }
    const down = url.pathname === '/__down';
    const rawBytes = down ? url.searchParams.get('bytes') : req.headers['content-length'];
    const bytes = Number(rawBytes);
    if (rawBytes == null || !/^\d+$/.test(String(rawBytes)) || !Number.isSafeInteger(bytes) || bytes < 0 || bytes > maxRequest || (!down && !bytes)) return json(400, { error: 'Invalid payload size' });
    if (session.requests >= 1000 || session.active >= 4 || active >= 24 || bytes > session.remaining || hourlyBytes + bytes > hourlyLimit) { res.setHeader('Retry-After', '600'); return json(429, { error: 'Measurement quota reached' }); }
    session.requests++; session.remaining -= bytes; hourlyBytes += bytes; session.active++; active++;
    let released = false;
    const release = () => { if (!released) { released = true; session.active--; active--; } };
    res.once('close', release); res.once('finish', release);
    if (down) {
      res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Length': bytes, 'Server-Timing': 'cfRequestDuration;dur=0' });
      let remaining = bytes;
      const write = () => {
        while (remaining > 0 && !res.destroyed) {
          const chunk = payload.subarray(0, Math.min(remaining, payload.length)); remaining -= chunk.length;
          if (!res.write(chunk)) { res.once('drain', write); return; }
        }
        if (!res.destroyed) res.end();
      };
      write();
    } else {
      let received = 0;
      try {
        for await (const chunk of req) { received += chunk.length; if (received > bytes) throw new Error('Payload size exceeded'); }
        if (received !== bytes) return json(400, { error: 'Incomplete upload' });
        // Never subtract time spent receiving the upload from upload duration.
        res.setHeader('Server-Timing', 'cfRequestDuration;dur=0');
        json(200, { received });
      } catch { json(400, { error: 'Incomplete upload' }); }
    }
  });
  server.requestTimeout = 20000;
  server.headersTimeout = 10000;
  server.keepAliveTimeout = 5000;
  server.maxHeadersCount = 32;
  server.maxConnections = 100;
  server.on('close', () => clearInterval(cleanup));
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createMeasurementServer({
    origins: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
    trustLoopbackProxy: process.env.TRUST_LOOPBACK_PROXY === 'true',
    turnHost: process.env.TURN_HOST,
    turnSecret: process.env.TURN_SHARED_SECRET,
    hourlyByteLimit: Number(process.env.HOURLY_BYTE_LIMIT) || undefined,
  });
  server.listen(Number(process.env.PORT || 8090), process.env.BIND_HOST || '127.0.0.1', () => console.log('NetTruth measurement node listening. Request and IP logging disabled.'));
}
