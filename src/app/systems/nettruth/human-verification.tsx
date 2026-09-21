"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileOptions = {
  sitekey: string; action: string; theme: "dark"; size: "flexible"; retry: "never";
  "refresh-expired": "never"; "refresh-timeout": "never"; "response-field": false;
  callback: (token: string) => void;
  "error-callback": () => void; "expired-callback": () => void;
  "timeout-callback": () => void; "unsupported-callback": () => void;
};
type Turnstile = { render: (container: HTMLElement, options: TurnstileOptions) => string | undefined; remove: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }

// Only Cloudflare's documented onload callback confirms API initialization.
// A script load event or window.turnstile object can exist before it is ready.
let turnstileLoaded = false;

type Props = { siteKey: string; attempt: number; signal: AbortSignal; onVerified: (token: string) => void; onError: (error: Error) => void; onCancel: () => void };

export function HumanVerification({ siteKey, attempt, signal, onVerified, onError, onCancel }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  const [ready, setReady] = useState(() => turnstileLoaded);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  // A documented onload callback also gives a failed script load a fresh URL on
  // manual retry; Next's script cache would otherwise retain the failed request.
  const loadCallback = `nettruthTurnstileReady${attempt}`;
  useEffect(() => {
    heading.current?.focus();
    if (ready) return;
    const globals = window as unknown as Record<string, unknown>;
    globals[loadCallback] = () => {
      turnstileLoaded = true;
      delete globals[loadCallback];
      if (mounted.current && !signal.aborted) setReady(true);
    };
    const timer = setTimeout(() => {
      if (mounted.current && !signal.aborted) onError(new Error("Verification could not load. Check your connection or browser blockers, then run the test again."));
    }, 15000);
    // A cancelled attempt can finish loading later. Keep its provider callback
    // until it fires so the initialized API can be reused without reloading it.
    return () => { clearTimeout(timer); };
  }, [ready, loadCallback, onError, signal]);

  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    const api = window.turnstile;
    let widgetId: string | undefined;
    let finished = false;
    const remove = () => {
      if (widgetId !== undefined) { api.remove(widgetId); widgetId = undefined; }
    };
    const abort = () => { finished = true; remove(); };
    const fail = (message: string) => {
      if (finished || signal.aborted) return;
      finished = true; remove(); onError(new Error(message));
    };
    signal.addEventListener("abort", abort, { once: true });
    // api.js is loaded asynchronously; Turnstile.ready() is forbidden in that
    // mode. Its onload callback above is the gate for explicit rendering.
    if (!signal.aborted) {
      try {
        widgetId = api.render(container.current, {
          sitekey: siteKey, action: "nettruth", theme: "dark", size: "flexible", retry: "never",
          "refresh-expired": "never", "refresh-timeout": "never", "response-field": false,
          callback: token => {
            if (finished || signal.aborted) return;
            if (!token || token.length > 2048) { fail("Verification was not completed. Run the test again to retry."); return; }
            finished = true;
            remove(); // Stop the challenge before selection/session/measurement.
            onVerified(token);
          },
          "error-callback": () => fail("Verification could not complete. Run the test again to retry."),
          "expired-callback": () => fail("Verification expired. Run the test again for a fresh check."),
          "timeout-callback": () => fail("Verification timed out. Run the test again to retry."),
          "unsupported-callback": () => fail("This browser cannot complete verification. Try a supported, up-to-date browser."),
        });
        if (widgetId === undefined) fail("Verification could not start. Run the test again to retry.");
        if (finished) remove();
      } catch { fail("Verification could not start. Run the test again to retry."); }
    }
    return () => { finished = true; signal.removeEventListener("abort", abort); remove(); };
  }, [ready, siteKey, signal, onVerified, onError]);

  return <section className="nt-verification" aria-labelledby="nettruth-verification-title">
    <div><h3 id="nettruth-verification-title" ref={heading} tabIndex={-1}>Verify before your test</h3><p>Complete this quick check to start. Measurement begins after verification finishes.</p></div>
    {!ready ? <p role="status">Loading verification…</p> : null}
    <div ref={container} className="nt-verification-widget" />
    <button type="button" className="nt-button nt-secondary" onClick={onCancel}>Cancel</button>
    {!ready ? <Script id={`nettruth-turnstile-${attempt}`} src={`https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${loadCallback}`} strategy="afterInteractive" onError={() => { delete (window as unknown as Record<string, unknown>)[loadCallback]; if (mounted.current && !signal.aborted) onError(new Error("Verification could not load. Check your connection or browser blockers, then run the test again.")); }} /> : null}
  </section>;
}
