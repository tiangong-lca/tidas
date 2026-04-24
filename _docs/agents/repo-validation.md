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
  - _docs/agents/repo-validation.md
  - .docpact/config.yaml
  - package.json
  - docs/**
  - static/schemas/**
  - sidebars.ts
  - docusaurus.config.ts
  - i18n/**
  - src/**
  - .github/workflows/**
lastReviewedAt: 2026-04-24
lastReviewedCommit: 2fe49a50f2d9e5c7925c768e0e3f85eb930055d0
related:
  - ../../AGENTS.md
  - ../../.docpact/config.yaml
  - ./repo-architecture.md
  - ../../README.md
---

## Default Baseline

Unless the change is doc-only repo-maintenance work, the default local baseline is:

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
| `static/schemas/**` | `npm run build`; inspect the touched schema files directly | verify the linked explanatory pages still describe the published schema correctly | These files are a published site surface, not an auto-sync from `tidas-tools`. |
| `package.json`, `sidebars.ts`, `docusaurus.config.ts`, `i18n/**`, `src/**`, or `versions.json` | `npm run lint`; `npm run typecheck`; `npm run build` | run `npm run start` if the task changes navigation or runtime rendering | Site structure and localization can break build or routing even when page content is unchanged. |
| release workflow only | inspect `.github/workflows/build.yml`; run `npm run build` | record any Cloudflare-specific or tag-specific assumptions checked locally | Tag-driven deploy proof happens later in GitHub Actions. |
| repo docs or docpact config only | `docpact validate-config --root . --strict`; `docpact lint --root . --worktree --mode enforce` | perform route checks for affected intent surfaces such as `docs-site`, `published-schemas`, or `proof` | Refresh review metadata even when prose-only docs change. |

## Minimum PR Note Quality

A good PR note for this repo should say:

1. which site commands ran
2. whether any local render check was performed
3. whether published schema files changed independently of tooling assets elsewhere

## Docpact Governance Notes

The repo's machine-readable governance source is `.docpact/config.yaml`.

That means:

- governed-doc rules, routing intents, ownership boundaries, coverage, and freshness live in `.docpact/config.yaml`
- `.github/workflows/ai-doc-lint.yml` should validate config and run `docpact lint`
- retained explanatory docs stay in `AGENTS.md`, this file, `repo-architecture.md`, and `README.md`
