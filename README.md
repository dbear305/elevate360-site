# Elevate360 Systems

Company website and NetTruth network diagnostic services, founded by [Daniel Berriel IV](https://github.com/dbear305).

[Website](https://www.elevate360systems.com/) · [Daniel's projects](https://github.com/dbear305) · [Independent Security Lab](https://github.com/dbear305/security-lab)

## Repository map

| Location | Purpose |
| --- | --- |
| `src/app/` | Company website, contact flow, and product pages |
| `src/app/systems/nettruth/` | NetTruth interface and diagnostic flows |
| `src/lib/nettruth/` | Measurement, scoring, node selection, and session logic |
| `services/nettruth-node/` | Network diagnostic node and operating instructions |
| `scripts/` | Deployment and regional setup utilities |
| `tests/` | Application and NetTruth checks |
| `docs/` | NetTruth setup, launch, and verification documentation |

NetTruth remains here because its interface, shared code, deployment scripts, and tests are connected. Independent security research lives in [dbear305/security-lab](https://github.com/dbear305/security-lab).

## Local development

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. Read the relevant documentation before configuring external services or regional nodes.

## Verification

```bash
npm run check
npm run test:nettruth
```

`check` runs lint, type checking, and a production build. The NetTruth test command uses Node's experimental TypeScript stripping; the existing verification workflow uses Node 22.

## Operations and security

- [NetTruth launch guide](docs/NETTRUTH-LAUNCH.md)
- [NetTruth verification](docs/NETTRUTH-VERIFICATION.md)
- [Node operations](services/nettruth-node/OPERATIONS.md)
- [Security policy](SECURITY.md)

This repository contains company work. Daniel's personal GitHub profile also includes independent software, security research, and technical experiments.
