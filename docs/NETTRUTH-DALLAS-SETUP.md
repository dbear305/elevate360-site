# Dallas node: owner deployment

The website's automatic selector is implemented. NYC is the only deployed node until this procedure is completed. These steps add Dallas without moving the existing NYC service. No Dallas server, account charge, DNS record or regional calibration is created by this document.

## 1. Create the server in Vultr

The proposed configuration, checked September 10, 2026:

| Setting | Value |
| --- | --- |
| Location | Dallas (`dfw`) |
| Instance type | Dedicated CPU, CPU Optimized |
| Plan | `voc-c-2c-4gb-50s-amd` |
| Resources | 2 dedicated vCPUs, 4 GB RAM, 50 GB storage |
| Listed base cost | $40/month; confirm the checkout total and traffic terms |
| Operating system | Ubuntu 24.04 x64 |
| Hostname / label | `nettruth-dfw-01` |
| Connectivity | Direct public IPv4 |
| SSH access | Daniel's existing `nettruth_yubi_02.pub` public key |

Official setup: https://docs.vultr.com/products/compute/instances/optimized-cloud-compute/provisioning

Current plan inventory: https://api.vultr.com/v2/plans?per_page=500

Dedicated CPU reduces a source of contention; it does not establish network capacity, measurement accuracy or an unlimited transfer allowance. No optional paid add-ons are needed for initial endpoint validation. Review usage and billing alerts in the provider console before public traffic.

On Daniel's **Windows PC, in PowerShell**, copy the existing public key:

```powershell
Get-Content "$env:USERPROFILE\.ssh\nettruth_yubi_02.pub" | Set-Clipboard
```

Paste that public key in Vultr's SSH-key field and select it for the new server. Do not generate a replacement key or share the identity file without `.pub`.

## 2. Set the DNS record

In the authoritative DNS provider for `elevate360systems.com`, create:

| Field | Value |
| --- | --- |
| Type | A |
| Name | `measure-dfw` |
| Data | The new Dallas server's actual public IPv4 |
| TTL | Lowest normal available setting during setup |

This is a separate DNS-only record. Existing `measure`, website and mail records stay in place. The server must be reached directly, without a CDN proxy. A TTL is a cache duration, not a timer that must always elapse before a new record works.

## 3. Obtain the trusted SSH host fingerprint

Open **the new Dallas server's Vultr web console**. At its Ubuntu shell, run:

```bash
hostname
ip -4 -o addr show scope global
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Confirm the hostname and public IPv4 match the new instance. Copy the complete `SHA256:...` fingerprint from the final command. This is public server identity information; it is not a password or private key. Verify it through the provider console before using it to authorize an SSH connection.

## 4. Install from the reviewed source

Open the updated Elevate360 source folder on the **Windows PC**, in PowerShell 7. Keep the YubiKey connected. Run:

```powershell
.\scripts\Install-NetTruthRegion.ps1 `
    -PublicIPv4 (Read-Host 'Dallas public IPv4') `
    -HostFingerprint (Read-Host 'ED25519 SHA256 fingerprint from the Vultr console')
```

The defaults are `measure-dfw.elevate360systems.com` and `Elevate360 - Dallas (DFW)`. The script checks every existing ED25519 host entry against the independently obtained fingerprint. A matching saved key becomes the pin for all SSH connections; when none is saved, the script retrieves and checks the public host key first. SSH strictly verifies the pinned key before authentication. The script then stages the complete source package, verifies its SHA-256 checksums, and invokes the regional installer. It never copies the private SSH identity or a relay secret. Enter the local identity-file passphrase, hardware-key PIN or touch when OpenSSH requests it.

Windows OpenSSH 9.5 can fail in `ssh-keyscan` with `choose_kex: unsupported KEX method sntrup761x25519-sha512@openssh.com` even when ordinary SSH works ([Microsoft issue](https://github.com/PowerShell/Win32-OpenSSH/issues/2140)). Using a saved key that matches the owner-supplied fingerprint avoids that helper defect. No server algorithms or host-verification settings are weakened. A missing saved key still requires successful retrieval and fingerprint verification.

A fresh install opens three SSH connections: prepare, upload, install. Answer the passphrase/PIN/touch prompts promptly; the server can close a connection while authentication is still pending. `User presence confirmed` confirms the local hardware-key operation, not completion of server authentication.

If the upload finished but SSH closed before the bootstrap extracted it, rerun this script with the original IP/fingerprint plus `-ResumeStage` and `-ResumeArchiveSHA256`, using the exact staging directory and source-bundle hash printed by that run. This performs one SSH authentication and rechecks the preserved archive's checksum and complete inventory before starting the installer. It does not upload or create a new staging directory. It refuses existing extracted files rather than overwriting a partially started installation; inspect those files and the server logs if that check fails.

The installer updates Ubuntu packages, installs the pinned runtime/Caddy/coturn, configures restricted service accounts and relay peers, and opens the service ports through the host firewall. It requires a dedicated measurement VM. A provider firewall, if attached, must also permit TCP 22 for administration, TCP 80/443, UDP 3478 and UDP 49160–49259; additional unrelated inbound ports are unnecessary.

If the installer reports a pending HTTPS check, keep its output and rerun the verifier after resolving the reported DNS/TLS/firewall issue. Do not recreate keys or reinstall repeatedly to treat a certificate problem. No automatic reboot is performed.

## 5. Verify and register the actual node

At the **Dallas Ubuntu shell**:

```bash
bash /opt/nettruth-node/verify.sh
```

If the verifier reports a reboot requirement, schedule the reboot while no tests are running, reconnect, and repeat verification. Caddy must present a valid public certificate. Confirm public API health, exact download/upload byte counts, timing headers and actual browser UDP delivery.

Only after those checks pass, add this node's actual ID/name/origin to `src/lib/nettruth/nodes.json`, deploy a preview, and authorize its exact origin on both nodes with `scripts/allow-nettruth-preview.py`. Use Auto and manual runs from Texas, export the reports, and verify which node was selected. DNS proximity does not override the measured response-time selector.

Before making premium accuracy claims, record repeatability, known-bandwidth/delay/loss cases and concurrent-load capacity separately for NYC and Dallas. A successful health check or a faster result alone is not calibration. Source and maintenance instructions remain in Daniel's existing GitHub repository.
