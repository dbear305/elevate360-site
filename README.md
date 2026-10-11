# Elevate360 Systems

Company website for Elevate360 Systems LLC, founded by [Daniel Berriel IV](https://github.com/dbear305).

[Website](https://www.elevate360systems.com/) · [Daniel's projects](https://github.com/dbear305) · [Independent Security Lab](https://github.com/dbear305/security-lab)

## Repository map

| Location | Purpose |
| --- | --- |
| `src/app/` | Company website, contact flow, and product pages |
| `src/lib/` | Contact delivery, campaign attribution, and accepted-inquiry analytics |
| `tests/` | Contact delivery and attribution regression checks |

Independent security research lives in [dbear305/security-lab](https://github.com/dbear305/security-lab).

## Retired network testing

NetTruth was retired after the measurement VPS nodes were removed. The website no longer serves its test, demo, paid diagnostic flow, or Windows posture download. Existing `/systems/nettruth` links and subpaths permanently redirect to `/systems`. Its measurement library, speed-test dependency, and network-specific workflows are also removed from the active checkout.

The complete source, tests, deployment scripts, node service, and operating documentation remain recoverable at the [last pre-retirement revision](https://github.com/dbear305/elevate360-site/tree/ada7beb191aeff661b07a72bce5d2e449cb4d36d) and in Git history for sale, licensing, or rollback. This retirement does not provision any infrastructure.

## Local development

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

## Verification

```bash
npm run check
node --experimental-strip-types --test tests/*.test.mjs
```

`check` runs lint, type checking, and a production build. Regression checks use Node's TypeScript stripping with Node 22 or later.

## Operations and security

- [Security policy](SECURITY.md)

This repository contains company work. Daniel's personal GitHub profile also includes independent software, security research, and technical experiments.
