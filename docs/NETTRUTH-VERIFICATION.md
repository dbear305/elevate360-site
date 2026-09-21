# NetTruth human verification

NetTruth verifies a Cloudflare Turnstile token before a measurement node issues a
test session or UDP relay credentials. The homepage remains public. The challenge
is removed before node selection and measurements begin, so it does not run during
latency or throughput sampling. Existing session quotas and byte limits remain in
force.

This document describes activation; it does not establish that any deployment or
production verification has completed.

## Configuration

Create a **Managed** widget in Cloudflare Turnstile. Allow the exact public website
hostnames where visitors start tests, including any apex and `www` versions used.
The widget runs on the website, so these are website hostnames, not measurement-node
hostnames. Add the intended preview hostname separately; do not allow arbitrary
preview domains. Each node's `ALLOWED_ORIGINS` must also include that exact HTTPS
preview origin for preview tests.

| Location | Variable | Value |
| --- | --- | --- |
| Website public configuration | `src/lib/nettruth/verification-config.ts` | Public widget site key supplied by the owner |
| Optional deployment override | `NEXT_PUBLIC_NETTRUTH_TURNSTILE_SITE_KEY` | Public key for a separate widget; rebuild after changing it |
| Both measurement nodes | `TURNSTILE_SECRET_KEY` | Corresponding private widget secret |
| Both measurement nodes | `NETTRUTH_REQUIRE_VERIFICATION` | `true` |

Keep secrets in the hosting environment or the existing private node environment
file. Never commit them, put them in frontend variables, or print them in logs.
The public site key is intentionally stored with the website configuration. Only
the secret must remain outside the repository. An explicit empty deployment
override disables new runs instead of falling back to the configured public key.
If separate preview and production widgets are used, each backend must have the
secret matching the widget from which it accepts requests.

Each node verifies the token with Cloudflare, requires action `nettruth`, and checks
that the returned hostname equals the hostname of the allowed browser `Origin`.
Adding only a browser checkbox or a Vercel page challenge does not protect direct
requests to the separate measurement nodes.

Verification defaults to required. Missing server secrets or an empty public site
key prevent new tests from starting. `NETTRUTH_REQUIRE_VERIFICATION=false` is an
explicit legacy opt-out that removes the node's human-verification gate; it is not
an automatic fallback or a safe response to a verification failure.

## Coordinated activation

1. Configure the widget and preview site key. Stage the frontend and backend changes
   for review, keeping the current production version until activation is ready.
   Where possible, validate the real widget against a staging node first.
2. Prepare private backups of each live node's current server file and environment.
   Install the revised measurement server and add the secret and required setting
   without replacing unrelated environment values. Preserve the current Caddy and
   TURN configurations. **Do not rerun the full node installer for this update:** it
   also rewrites the proxy configuration and may reset an existing transport choice.
3. In a brief coordinated maintenance window, activate the revised service on both
   nodes and the rebuilt production frontend with the matching public site key.
   While the old frontend and required backend are mixed, new runs will fail closed.
   Do not disable verification to hide this temporary version mismatch.
4. Complete a real browser verification and test against each node from the preview
   and production origins being supported. Confirm the challenge disappears before
   the measurement phase. Remove preview-origin access when it is no longer needed.

The installer performs read-only configuration validation before creating locks,
backups, or making package changes. Reinstallation preserves saved verification
settings unless explicitly overridden by environment variables; a required gate
without a secret stops that preflight.

## Acceptance checks

- Missing, invalid, expired, and already-used tokens must not issue a new session or
  relay credentials. Rejected requests must not fall back to an unverified session.
- A real successful widget flow must issue a session and complete a measurement
  against each intended node. A provider test key alone cannot establish this.
- A token with the wrong action or a hostname different from the requesting allowed
  origin must be rejected. Provider outages must fail closed with a recoverable UI.
- Existing node sessions may remain usable for their original lifetime of up to
  four minutes; restarting the node process clears its in-memory session store.
- Keep existing request, session, concurrency, and byte limits. CAPTCHA complements
  those limits; it does not impose a provider billing cap.

If activation fails, keep testing unavailable while restoring a verified working
configuration or deliberately rolling back both frontend and backend versions.
Rolling back to a legacy backend removes this protection and must be a conscious
operational decision.

Cloudflare references: [widget modes](https://developers.cloudflare.com/turnstile/concepts/widget/),
[hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/),
and [server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
