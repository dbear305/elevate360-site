# NetTruth QuickCheck: implementation and launch

Status (2026-09-10): implemented for the existing Elevate360 Next.js site. Daniel installed the owned NYC1 node and TURN service on 137.184.214.71. Endpoint smoke checks passed. Daniel's Texas browser completed an extended run with six metrics and 0 of 1,000 UDP messages lost in that sample. The screenshot shows 46.4 ms idle RTT and 160.3 ms added delay under load; distance alone does not establish the cause of that increase. Raw report review, Windows collector execution, repeatability and capacity calibration remain launch gates. This is a beta, not a calibrated competitor to Cloudflare or Ookla.

## Preview from Daniel's Windows PC

The working deployment path is the existing GitHub-to-Vercel integration for `feat/nettruth-quickcheck`. A branch push builds a preview automatically. Production remains a separate promotion. The local CLI deployment previously failed with generic `fetch failed`; its cause is not established, so do not repeatedly retry it or change DNS/TLS to work around it. `Deploy-NetTruthPreview.ps1` remains an optional CLI path; it now builds from the same node inventory and only authorizes NYC.

Use PowerShell 7, the existing Vercel login and `%USERPROFILE%\.ssh\nettruth_yubi_02` to retrieve the READY preview for its exact Git commit. Then pipe `scripts/allow-nettruth-preview.py` over SSH to each configured node, passing that exact preview origin. Strict host verification and the YubiKey PIN/touch remain on Daniel's PC. The helper preserves settings, backs up the prior configuration, restarts only `nettruth-node`, and rolls back on failed local health. No private key or relay secret is uploaded. Do not authorize all `vercel.app` origins. Git previews read `src/lib/nettruth/nodes.json` by default.

Start with one Quick Check. Confirm the node label is New York, run completes, HTTP samples are present, packet loss is either measured with counts or explicitly unavailable, and JSON export succeeds. Fast links can lack loaded-latency samples with the current bounded payload plan; that is a calibration issue to resolve before accuracy claims. Never interpret missing metrics as a clean bill of health.

## Product and income path

The primary route `/systems/nettruth` now runs HTTP measurements. The old synthetic demonstration remains at `/systems/nettruth/demo` and is clearly identified. The primary commercial action is an inquiry for the existing Network Diagnostic, starting at $750. The visitor can export evidence and send an inquiry in their own email client, or use the site's existing contact form. No payment checkout, paid subscription, or guaranteed revenue is claimed.

Measure starts, finishes, report exports, diagnostic email clicks, and contact-form clicks using existing Vercel Analytics. These events contain mode/status and coarse provider type, not raw network metrics or imported local reports. A click is not a delivered inquiry or a sale. Track completed paid engagements separately before buying ads or adding subscription features.

## Delivered

- Automatic server choice before each run, manual server selection, and server-selection evidence in exports. Only the deployed NYC node is active initially.
- Download/upload HTTP throughput, idle RTT median/p95, jitter, loaded latency in both directions, sample counts, raw sample export, cautious next-step findings.
- Quick and extended plans (~96.6 MB/~296.6 MB payload before retries), 90/180-second wall-clock limits; stop on background tab/offline and explicit cancel.
- Operator-owned UDP packet-loss implementation with mandatory relay transport and no retransmissions. Missing relay/unsupported browser/failed connection stays unknown.
- Local Windows posture collector: effective firewall profiles, Defender, SMB1 feature, RDP NLA, adapter error counters. Reports are read in-browser without uploading. This does not scan routers, enumerate LAN devices, detect CVEs, or establish public port exposure.
- Print/PDF via browser print, JSON, up to five opt-in device-local summaries, coverage-aware use-case guidance.
- Dedicated Node HTTP service with exact CORS origins, short-lived client/origin-bound sessions, session/IP/global resource quotas, streaming bounded downloads, capped streaming uploads, and optional coturn credentials.

## Endpoint configuration

The website defaults to the owned NYC1 node at `https://measure.elevate360systems.com`. The page and CSP read one shared public configuration so automatic Git previews work without separately entered build variables. The engine uses `@cloudflare/speedtest` 1.13.1 with vendor measurement logging and result logging disabled. The internal reference-endpoint implementation remains available for development comparisons but is not selected by the website and is never an outage fallback. Infrastructure providers still see IPs and test traffic and may retain operational data.

The page and Content Security Policy read the same validated inventory in `src/lib/nettruth/nodes.json`. Add only deployed and verified nodes. Alternatively, set `NETTRUTH_NODES` to a JSON array with `id`, `name`, and bare HTTPS `origin` fields. One to eight nodes are supported; IDs and origins must be unique. The legacy `NETTRUTH_NODE_ORIGIN` plus optional `NETTRUTH_NODE_NAME` override still selects a single node. Remove that legacy override when using the fleet inventory; configuring both override forms fails the build. Rebuild after inventory changes. Relay secrets never enter the Next.js build. The client receives only scoped short-lived credentials for a test.

Auto contacts each configured node from the visitor's current connection without GPS or IP-geolocation lookup. It discards one warmup response, takes three HTTP health samples, requires at least two successful timed responses, and selects the lowest median. At most three nodes are probed concurrently, with a 1.5-second deadline per request and response body. Selection runs again on every test. All speed, idle/loaded latency and packet-loss measurements then stay on the chosen node. Manual choice probes only that server and never silently falls back. An unavailable fleet produces an error, never synthetic results.

Selection probe times include browser/HTTP processing and are not the reported idle RTT. A responsive health endpoint does not establish spare throughput or UDP availability. The export records selection mode, selected ID, timestamp, probe samples and availability; the normal test records its measured coverage separately.

## Add a regional node

Auto selection needs real geographic coverage. The initial registry contains NYC only; a Dallas label without a deployed Dallas server must never be added. DigitalOcean's current Droplet locations do not include Dallas. Vultr's Dallas (`dfw`) region is a candidate second pilot, subject to checkout availability and capacity validation. Existing NYC stays available for East Coast visitors and comparisons.

1. Provision a dedicated Ubuntu 24.04 x64 measurement VM in the chosen region, using Daniel's public SSH key. Confirm provider price and traffic allowance. Record its actual public IPv4; do not reuse NYC's IP.
2. Point a DNS-only A record, for example `measure-dfw.elevate360systems.com`, to that new address. Keep the website and mail records intact.
3. On that VM, run the complete node installer with `NETTRUTH_PUBLIC_IP`, `NETTRUTH_HOSTNAME`, and `NETTRUTH_NODE_NAME` set to its verified identity. These are nonsecret parameters. Use the server's separate generated relay secret and existing restrictive firewall/peer rules.
4. Verify valid public HTTPS, byte counts, timing headers, actual browser UDP delivery, resource limits, and the same exact preview origin on both nodes. Keep a node out of the registry until these checks pass.
5. Add its actual `id`, `name`, and HTTPS `origin` to `nodes.json`, push a preview, and authorize the new preview origin on every registered node. The example Dallas hostname is not a deployed endpoint until steps 1–4 are complete.
6. Compare Auto and manual runs from Texas and the East Coast; export raw reports. Verify fresh selection after changing networks, unavailable-node exclusion, and manual failure without fallback. Calibrate each node independently and record its validated capacity before making accuracy claims.

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

Regional selection is requested functionality; fleet provisioning and capacity validation remain operational work. Accounts, subscriptions, a CVE scanner and an AI narrator remain outside this release. The commercial goal is a calibrated service and a credible paid diagnostic outcome.
