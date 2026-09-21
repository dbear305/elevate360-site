import type { TestMode } from "./model";
import type { RelayCredentials } from "./packet-loss";

export type MeasurementSession = { origin: string; token: string; expiresAt: string; relay?: RelayCredentials };

type SessionOptions = { fetch?: typeof fetch; timeoutMs?: number };

// A Turnstile token is single-use. Submit once to the selected node; a failed
// request requires a new challenge instead of retrying or changing endpoints.
export async function createMeasurementSession(origin: string, mode: TestMode, turnstileToken: string, signal: AbortSignal, options: SessionOptions = {}): Promise<MeasurementSession> {
  signal.throwIfAborted();
  const url = new URL(origin);
  if (url.protocol !== "https:" || url.origin !== origin || url.username || url.password) throw new Error("The measurement node must use an exact HTTPS origin.");
  if (!["quick", "extended"].includes(mode) || !turnstileToken || turnstileToken.length > 2048 || turnstileToken.trim() !== turnstileToken) throw new Error("Please complete verification before starting a test.");
  const requestSignal = AbortSignal.any([signal, AbortSignal.timeout(options.timeoutMs ?? 10000)]);
  let onAbort = () => {};
  const interrupted = new Promise<never>((_, reject) => {
    onAbort = () => reject(requestSignal.reason);
    requestSignal.addEventListener("abort", onAbort, { once: true });
  });
  try {
    return await Promise.race([interrupted, (async () => {
      const response = await (options.fetch ?? fetch)(`${origin}/session`, {
        method: "POST", credentials: "omit", cache: "no-store", redirect: "error",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, turnstileToken }), signal: requestSignal,
      });
      if (!response.ok) {
        await response.body?.cancel();
        if (response.status === 403) throw new Error("Verification was not accepted or expired. Run the test again for a fresh verification.");
        if (response.status === 429) throw new Error("This test server is busy. Wait a few minutes before trying again.");
        if (response.status === 503) throw new Error("Verification is temporarily unavailable on this test server. Please try again later.");
        throw new Error("The test server could not start a verified session. Please try again.");
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("The test server returned an invalid session.");
      const cancelReader = () => { void reader.cancel().catch(() => {}); };
      requestSignal.addEventListener("abort", cancelReader, { once: true });
      const decoder = new TextDecoder();
      let body = "";
      let bytes = 0;
      try {
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          bytes += part.value.byteLength;
          if (bytes > 4096) { await reader.cancel(); throw new Error("The test server returned an invalid session."); }
          body += decoder.decode(part.value, { stream: true });
        }
        body += decoder.decode();
      } finally { requestSignal.removeEventListener("abort", cancelReader); reader.releaseLock(); }
      requestSignal.throwIfAborted();
      let value;
      try { value = JSON.parse(body); } catch { throw new Error("The test server returned an invalid session."); }
      if (!value || value.verified !== true || typeof value.token !== "string" || !/^[a-f0-9]{48}$/.test(value.token) || typeof value.expiresAt !== "string" || !Number.isFinite(Date.parse(value.expiresAt)) || Date.parse(value.expiresAt) <= Date.now()) throw new Error("The test server did not confirm a valid verified session. Please try again later.");
      const session: MeasurementSession = { origin, token: value.token, expiresAt: value.expiresAt };
      if (value.relay && typeof value.relay.urls === "string" && typeof value.relay.username === "string" && typeof value.relay.credential === "string") session.relay = { urls: value.relay.urls, username: value.relay.username, credential: value.relay.credential };
      return session;
    })()]);
  } catch (error) {
    signal.throwIfAborted();
    if (requestSignal.aborted) throw new Error("Verification took too long. Run the test again for a fresh verification.");
    // Network errors can contain the request URL. Never forward a response body
    // or the verification token into reports, analytics, logs, or storage.
    if (error instanceof TypeError) throw new Error("The test server could not be reached. Please try again.");
    throw error;
  } finally { requestSignal.removeEventListener("abort", onAbort); }
}
