# Elevate360 Security Research

Practical OSINT, security automation, and reproducible cybersecurity labs.

This section starts with a working domain evidence collector. It gathers DNS answers through Google Public DNS and certificate names through crt.sh, preserves provenance, and compares observations across runs. It runs independently of the website and NetTruth services.

## Quick start

Requires Python 3.10 or newer. No packages, API keys, or installation steps are required.

From the repository root:

```bash
cd security-research
python3 src/evidence.py example.com --fixture examples/fixture.json
```

On Windows, use `py -3` in place of `python3`.
The offline demo uses clearly labeled synthetic responses and makes no network requests. It prints a new directory containing `report.json` and `report.md`.

[Read the sample report](examples/report.md) or [inspect the JSON](examples/report.json).

## Collect public evidence

```bash
python3 src/evidence.py example.com
```

The tool makes six DNS-over-HTTPS requests and one certificate-transparency query, with a 15-second timeout per request and a short pause between requests. It contacts Google and crt.sh, not target web servers. DNS resolution can cause Google's resolver to query authoritative nameservers. The providers see the queried domain. There are no port scans, authentication attempts, or automatic retries.

Run again later and compare against the JSON file from the earlier run:

```bash
python3 src/evidence.py example.com --previous reports/REPLACE_WITH_PRIOR_RUN/report.json
```

Use the actual path printed by your earlier run. Synthetic and live reports cannot be mixed in a comparison. Sources must succeed in both runs to be compared. TTL changes and certificate-ID changes are excluded from the observation comparison.

Exit codes: `0` all configured source requests succeeded; `2` partial collection with reports saved; `1` invalid input, comparison, or output failure. Success does not imply complete Internet coverage. HTTP 429, timeouts, malformed responses, and DNS failures appear in the source records.

## Explore

| Location | Contents |
| --- | --- |
| [src/evidence.py](src/evidence.py) | Dependency-free command-line collector |
| [tests](tests/test_evidence.py) | Offline parsing, error, comparison, and CLI tests |
| [examples](examples/README.md) | Synthetic source data and generated reports |
| [labs](labs/01-domain-evidence.md) | Reproducible evidence and change-detection lab |
| [research](research/README.md) | Demonstration case study and research template |
| [docs/methodology.md](docs/methodology.md) | Collection behavior and evidence limitations |
| [docs/resources.md](docs/resources.md) | Curated primary resources |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution and verification instructions |

## Verification

```bash
python3 -m unittest discover -s tests -v
```

The GitHub Actions workflow runs the offline tests and demo whenever this section changes. Live source availability is not tested in CI.

## Scope and reuse

Use the labs for training and the collector for public-source research. Define an engagement's scope before adding active testing. Keep private evidence and credentials out of commits; generated reports are ignored by Git.

The [MIT license](LICENSE) applies only to the new material within `security-research/`. It does not relicense the website, NetTruth, or third-party source data. See the repository [security policy](../SECURITY.md) for vulnerability reporting.

## Next milestone

Publish one original, sanitized case study with independently checked findings. Then improve the collector based on actual use. Active probes, dashboards, and scheduled monitoring are outside this initial release.
