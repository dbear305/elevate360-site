# NetTruth QuickCheck: implementation and launch

Status (2026-09-10): implemented for the existing Elevate360 Next.js site. Daniel installed the owned NYC1 node and TURN service on 137.184.214.71. Public HTTPS health, session issuance, upload/download byte counts and timing/CORS headers passed endpoint smoke checks. Real browser measurements, actual UDP relay delivery, Windows execution, and multi-device calibration remain launch gates. This is a beta, not a calibrated competitor to Cloudflare or Ookla.

## Preview from Daniel's Windows PC

Use PowerShell 7 with the existing Vercel login, Node/npm and the working YubiKey identity at `%USERPROFILE%\.ssh\nettruth_yubi_02`. From a clean copy of this branch, run `./scripts/Deploy-NetTruthPreview.ps1`. Review the script before running it; it uses Vercel CLI 59.15.1, checks the existing `elevate360-site` project in `dbear305s-projects`, links that project, and builds a preview with both owned-node variables. It does not promote production.

After the build it uses SSH with strict host verification to add only the returned preview origin to `/etc/nettruth/node.env`. This briefly restarts `nettruth-node`, preserves other origins and settings, backs up the prior configuration, and rolls back on a failed health check. The YubiKey PIN/touch remains on Daniel's PC. No private key or relay secret is uploaded. The preview URL is saved locally under `.vercel/nettruth-preview-url.txt`; send that URL and the exported test JSON for review. Git-based previews now use the same owned endpoint by default through `src/lib/nettruth/config.ts`; an operator still needs to authorize each exact preview origin before running measurements.

Start with one Quick Check. Confirm the node label is New York, run completes, HTTP samples are present, packet loss is either measured with counts or explicitly unavailable, and JSON export succeeds. Fast links can lack loaded-latency samples with the current bounded payload plan; that is a calibration issue to resolve before accuracy claims. Never interpret missing metrics as a clean bill of health.

## Product and income path

The primary route `/systems/nettruth` now runs HTTP measurements. The old synthetic demonstration remains at `/systems/nettruth/demo` and is clearly identified. The primary commercial action is an inquiry for the existing Network Diagnostic, starting at $750. The visitor can export evidence and send an inquiry in their own email client, or use the site's existing contact form. No payment checkout, paid subscription, or guaranteed revenue is claimed.

Measure starts, finishes, report exports, diagnostic email clicks, and contact-form clicks using existing Vercel Analytics. These events contain mode/status and coarse provider type, not raw network metrics or imported local reports. A click is not a delivered inquiry or a sale. Track completed paid engagements separately before buying ads or adding subscription features.

## Delivered

- Download/upload HTTP throughput, idle RTT median/p95, jitter, loaded latency in both directions, sample counts, raw sample export, cautious next-step findings.
- Quick and extended plans (~96.6 MB/~296.6 MB payload before retries), 90/180-second wall-clock limits; stop on background tab/offline and explicit cancel.
- Operator-owned UDP packet-loss implementation with mandatory relay transport and no retransmissions. Missing relay/unsupported browser/failed connection stays unknown.
- Local Windows posture collector: effective firewall profiles, Defender, SMB1 feature, RDP NLA, adapter error counters. Reports are read in-browser without uploading. This does not scan routers, enumerate LAN devices, detect CVEs, or establish public port exposure.
- Print/PDF via browser print, JSON, up to five opt-in device-local summaries, coverage-aware use-case guidance.
- Dedicated Node HTTP service with exact CORS origins, short-lived client/origin-bound sessions, session/IP/global resource quotas, streaming bounded downloads, capped streaming uploads, and optional coturn credentials.

## Endpoint configuration

The website defaults to the owned NYC1 node at `https://measure.elevate360systems.com`. The page and CSP read one shared public configuration so automatic Git previews work without separately entered build variables. The engine uses `@cloudflare/speedtest` 1.13.1 with vendor measurement logging and result logging disabled. The internal reference-endpoint implementation remains available for development comparisons but is not selected by the website and is never an outage fallback. Infrastructure providers still see IPs and test traffic and may retain operational data.

The defaults can be overridden at build time with `NETTRUTH_NODE_ORIGIN=https://<measurement-host>` and optional `NETTRUTH_NODE_NAME`. Rebuild the site after changing either. A node outage stays an error; it is not silently replaced with reference data. Relay secrets never enter the Next.js build. The client receives only scoped short-lived credentials for a test.

## Deploy the owned measurement service

1. Select one VPS with a documented NIC/egress allowance and a location relevant to initial customers. Low-cost advertised shared NIC speeds are not capacity guarantees. Choose the host and budget before provisioning. Do not route throughput through Vercel Functions or a CDN proxy.
2. Point a DNS-only hostname at its public address. Install maintained Node 22+, Caddy, and coturn using supported packages. Use `Caddyfile.example` after replacing the hostname. Bind the Node process to `127.0.0.1:8090` behind Caddy under a restricted service account. The Dockerfile is optional; if used, expose port 8090 only to loopback and configure proxy trust for the actual proxy topology. The supplied loopback-trust mode is for a host-native Caddy/Node deployment.
3. Set Node environment:
   - `ALLOWED_ORIGINS=https://www.elevate360systems.com,https://elevate360systems.com` (add only exact preview origins intentionally).
   - `TRUST_LOOPBACK_PROXY=true` only with loopback Caddy overwriting `X-Real-IP`. Never expose this configuration directly to the Internet.
   - `BIND_HOST=127.0.0.1`, `PORT=8090`.
   - `HOURLY_BYTE_LIMIT` defaults to 2 GiB. This is a conservative process-local payload ceiling, including reservations for interrupted requests. It resets on restart; provider budget alerts/egress caps are also required for a public service.
   - `TURN_HOST=<public-host>:3478` and `TURN_SHARED_SECRET=<random secret>` only after coturn is configured.
4. Configure coturn from the reviewed template. Replace all placeholders. Use a random shared secret stored in protected server configuration only. Allow peers only on this node's own public address. Two browser peers relay through the same node; this restriction is intentional and prevents generic external peer forwarding. Only open TCP 443 (and 80 for certificate issuance) and UDP 3478 plus UDP 49160–49259 as needed. Restrict administrative access separately. If behind NAT, set coturn external IP mapping and verify routing.
5. Apply the site environment and rebuild. Check `/health` with an allowed Origin header and a real browser test. Confirm timing exposure, no compression/caching, upload byte count, UDP relay candidate selection and actual packet-loss reporting. The provided source does not include DNS/provider credentials or issue infrastructure purchases.
6. Monitor NIC saturation/CPU/egress, TLS renewal, quota rejections and healthy reachability. Quotas are per-process; keep one service instance or add shared quota storage before scaling horizontally. Do not advertise node-limited numbers as customer network limitations.

## Measurement and interpretation limits

The UI documents statistics and use-case heuristics. Throughput is sequential HTTP and a 90th-percentile result, not sustained multi-stream saturation. Fast links may have insufficient loaded samples. A >40 ms loaded-median increase is a flag for investigation, not proof of bufferbloat at a particular hop. Browser jitter is consecutive HTTP RTT variation, not RTP interarrival jitter. No request timeout is counted as a lost UDP packet. The UDP test is a bounded message-loss sample on a relay round trip, not loss to all Internet destinations. TCP retransmissions can hide loss from HTTP measurements.

Reference and owned endpoint results need not match. Compare repeated results with the same endpoint/device/connection, and label endpoint differences in any published comparison. Do not claim “more accurate than Cloudflare/Ookla” without a controlled benchmark.

## Windows collector verification

The script is unsigned. Download, read, and run under the organization's normal script policy; do not change execution policy globally or bypass security products to run it. It never requests administrator elevation. Restricted checks are unknown. It uses effective firewall ActiveStore but RDP settings are a local snapshot, not a full policy audit. Another antivirus product can explain disabled Defender. Adapter errors are cumulative counts, not security vulnerabilities or current loss rates. Missing checks and manipulated imports must not be treated as a trusted attestation.

Before public release, run it on supported Windows 10/11 machines with and without admin access, with third-party endpoint protection, disabled/unknown optional features, and no active hardware adapter. Import the result, review it, and verify no network traffic or setting modifications occur. The Linux development environment cannot perform those Windows checks.

## Release acceptance

- Build/type validation; deterministic math, unknown states, import validation, node API and quota tests.
- Real Chrome, Firefox, Edge, Safari/mobile test against the deployed node; verify idle/loaded samples, packet loss, cancellation, background-tab stop, offline, CORS failure, session expiry, and quota messages.
- Controlled baseline and injected delay/loss cases on an authorized lab network; zero-loss run is not a guarantee. Record loss counts and sample window. Verify relay does not manufacture loss through its own limits.
- Known fast/slow uplinks, Wi-Fi versus Ethernet, and repeated reference comparisons. Report bias/variance, not only best-case agreement.
- Confirm report export/print readability and local import behavior. Confirm existing contact-form provider activation and real inbox delivery (not just HTTP 200). No test email has been sent by this implementation.
- Confirm hostname, pricing, provider operating limits, and production readiness. Preview source is maintained in Daniel's existing public GitHub repository; private credentials must remain outside source control.

Do not add accounts, subscriptions, multi-region orchestration, a CVE scanner, or an AI narrator before the first paid diagnostic validates demand. The immediate bottlenecks are a calibrated owned node and a credible real-customer outcome.
