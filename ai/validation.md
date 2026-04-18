---
title: tidas Validation Guide
docType: guide
scope: repo
status: active
authoritative: false
owner: tidas
language: en
whenToUse:
  - when a tidas change is ready for local validation
  - when deciding the minimum proof required for docs-site, schema-publish, or release-workflow changes
  - when writing PR validation notes for tidas work
whenToUpdate:
  - when the repo gains new canonical site-check commands
  - when change categories require different proof
  - when site deploy or localization behavior changes
checkPaths:
  - ai/validation.md
  - ai/task-router.md
  - package.json
  - docs/**
  - static/schemas/**
  - sidebars.ts
  - docusaurus.config.ts
  - i18n/**
  - src/**
  - .github/workflows/**
lastReviewedAt: 2026-04-18
lastReviewedCommit: 8cece2a553f0d292df61d247fd861d01b627852f
related:
  - ../AGENTS.md
  - ./repo.yaml
  - ./task-router.md
  - ./architecture.md
  - ../README.md
---

## Default Baseline

Unless the change is doc-only AI-contract work, the default local baseline is:

```bash
npm run lint
npm run typecheck
npm run build
```

Use `npm run start` or `npm run serve` when the task needs local page-render verification.

## Validation Matrix

| Change type | Minimum local proof | Additional proof when risk is higher | Notes |
| --- | --- | --- | --- |
| `docs/**` content only | `npm run lint`; `npm run build` | run `npm run start` or `npm run serve` when the page has MDX, math, or layout-sensitive content | Public docs correctness is the primary concern here. |
| `static/schemas/**` | `npm run build`; inspect the touched schema files directly | verify the linked explanatory pages still describe the published schema correctly | These files are not auto-synced from `tidas-tools`. |
| `sidebars.ts`, `docusaurus.config.ts`, `i18n/**`, or `src/**` | `npm run lint`; `npm run typecheck`; `npm run build` | run `npm run start` if the task changes navigation or runtime rendering | Site structure and localization can break build or routing even when page content is unchanged. |
| release workflow only | inspect `.github/workflows/build.yml`; run `npm run build` | record any Cloudflare-specific assumptions checked locally | Tag-driven deploy proof happens later in GitHub Actions. |
| AI docs only | run repo-local `ai-doc-lint` against touched files or the equivalent local PR check | do one scenario-based routing check from root into this repo | Refresh review metadata even when prose-only docs change. |

## Minimum PR Note Quality

A good PR note for this repo should say:

1. which site commands ran
2. whether any local render check was performed
3. whether published schema files changed independently of tooling assets elsewhere
