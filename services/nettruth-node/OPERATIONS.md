# Owner-operated NetTruth measurement node

This package installs a beta measurement endpoint on Daniel's existing Ubuntu 24.04 x64 Droplet, 137.184.214.71. It does not publish the frontend, configure DNS, change SSH authentication, certify capacity, or perform vulnerability scanning.

## Install

Extract the complete bundle on the server. From its directory, run `bash install.sh`. It checks the OS and assigned IP before modifying anything, installs OS updates, Caddy from its official stable APT repository, Ubuntu coturn, and the checksum-pinned Node 24.21.0 runtime. Keep the authenticated SSH connection and DigitalOcean Web Console available. No automatic reboot is performed.

The installer permits TCP 22/80/443 and UDP 3478/49160-49259 through UFW. Existing firewall rules are preserved and require review if this server was used for other purposes. It starts restricted Node and TURN service accounts, creates the relay secret only on the server, retains that secret on reruns, and backs up replaced configuration under `/var/backups/nettruth/`. The default coturn unit is disabled in favor of the dedicated `nettruth-turn` unit. This installer is for this dedicated test node, not a shared production server.

In the authoritative DNS provider, add the A record `measure` pointing to `137.184.214.71`. Do not change the website's existing A/CNAME records, mail records or nameservers. The measurement record must resolve directly to this server; do not proxy it through a CDN. Caddy obtains and renews its TLS certificate after the DNS record resolves and ports 80/443 are reachable.

## Commands you own

| Task | Command |
| --- | --- |
| Service/HTTPS health | `bash /opt/nettruth-node/verify.sh` |
| Service status | `systemctl status nettruth-node nettruth-turn caddy --no-pager` |
| Node service errors | `journalctl -u nettruth-node -n 60 --no-pager` |
| TLS/service errors | `journalctl -u caddy -n 60 --no-pager` |
| Restart measurements | `systemctl restart nettruth-node nettruth-turn` |
| Stop measurements | `systemctl stop nettruth-node nettruth-turn` |
| Ubuntu/Caddy/coturn updates | `apt-get update && apt-get upgrade` |
| Firewall review | `ufw status verbose` |
| Runtime version | `/opt/nettruth-runtime/bin/node --version` |

Ubuntu security updates are enabled; automatic reboot is disabled. Schedule and verify reboots when `/var/run/reboot-required` exists. Third-party Caddy updates and the pinned Node runtime remain an owner maintenance responsibility. Track their upstream security releases. For Node updates, update the pinned version AND its official SHA256 after reviewing the release, rerun the installer, and repeat regression checks. Do not assume unattended-upgrades patches every dependency.

The Node application does not log requests or IPs. IP-based counters exist temporarily in RAM. TURN session logging is directed to /dev/null; service-level failures remain visible in systemd. Caddy access logging is not enabled, but service errors and OS/provider logs may contain IPs. Do not claim zero data collection across all providers.

## Accuracy release gate

The $12 shared-CPU NYC1 node is a pilot. It must not be advertised as a certified reference or accurate across all link speeds. The current HTTP test is sequential, using Cloudflare's published SDK; it may underestimate a fast connection, and short transfers may provide insufficient loaded-latency samples. Browser jitter is HTTP RTT variation. UDP results are message loss over the specified TURN path. They do not establish loss at an individual hop or a network-wide vulnerability.

Before public release, record endpoint, node specifications, client/browser, connection type, test version, UTC time, sample counts, payload volume, and raw samples. Establish repeatability and measurement error with controlled known bandwidth limits, delay, jitter, and loss on an authorized lab path. Compare against an independent reference on the SAME path, accounting for queue discipline and UDP versus TCP semantics. Test concurrent users and monitor server CPU, NIC, and event-loop capacity. Record the maximum validated link speed and concurrency. Mark runs with insufficient samples or server saturation inconclusive; do not blame the customer's connection.

Do not claim the benchmark has run until its data exist. Public browser/device checks, UDP relay connectivity, fault injection, capacity calibration and privacy/export checks remain outstanding. If the shared host is a bottleneck, move to a dedicated-CPU plan or suitable dedicated node before claiming premium measurement quality. A more expensive host alone does not validate the algorithm.

## Costs and recovery

The HTTP service reserves at most 2 GiB/hour per process by default; restart resets that counter. TURN has allocation/session quotas but does NOT share the HTTP byte ceiling. Neither these limits nor a DigitalOcean billing alert is a hard spending cap. Monitor provider outbound traffic and set billing/usage alerts before public access. Stop the measurement services if usage is unexpected.

Keep source under Daniel's existing version control and secure off-server copies of the required operational configuration. A spare independently enrolled hardware key and account recovery access prevent a single lost YubiKey from becoming an outage. Do not copy private SSH material or relay secrets into this public source tree.

Configuration backups are protected and remain on this server; they are not disaster-recovery backups. To roll back, stop affected services, restore the appropriate backed-up configuration and previous server.mjs from source, run `caddy validate`, then restart and verify. No database or customer records are stored by this measurement service.
