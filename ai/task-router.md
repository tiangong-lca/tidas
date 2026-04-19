---
title: tidas Task Router
docType: router
scope: repo
status: active
authoritative: false
owner: tidas
language: en
whenToUse:
  - when you already know the task belongs in tidas but need the right next file or next doc
  - when deciding whether a change belongs in spec pages, published schema downloads, site structure, or another repo
  - when routing between docs-site work and handoffs to tidas-tools, tidas-sdk, or lca-workspace
whenToUpdate:
  - when new docs-site or schema-publish surfaces appear
  - when cross-repo boundaries change
  - when validation routing becomes misleading
checkPaths:
  - AGENTS.md
  - ai/repo.yaml
  - ai/task-router.md
  - ai/validation.md
  - ai/architecture.md
  - docs/**
  - static/schemas/**
  - sidebars.ts
  - docusaurus.config.ts
  - i18n/**
lastReviewedAt: 2026-04-18
lastReviewedCommit: 8cece2a553f0d292df61d247fd861d01b627852f
related:
  - ../AGENTS.md
  - ./repo.yaml
  - ./validation.md
  - ./architecture.md
  - ../README.md
---

## Repo Load Order

When working inside `tidas`, load docs in this order:

1. `AGENTS.md`
2. `ai/repo.yaml`
3. this file
4. `ai/validation.md` or `ai/architecture.md`
5. `README.md` only for site commands

## High-Frequency Task Routing

| Task intent | First code paths to inspect | Next docs to load | Notes |
| --- | --- | --- | --- |
| Change public schema introduction or validation docs | `docs/core-modules/schema/**` | `ai/validation.md`, `ai/architecture.md` | This repo owns the public explanation surface. |
| Change public tooling guidance pages | `docs/tool/**`, `docs/integration/**`, `docs/use_case/**` | `ai/validation.md`, `ai/architecture.md` | If the actual tool behavior changes, coordinate with `tidas-tools`. |
| Change downloadable schema files published on the site | `static/schemas/**` | `ai/validation.md`, `ai/architecture.md` | These files are served by the site and must be reviewed explicitly. |
| Change site navigation, localization, or site runtime | `sidebars.ts`, `docusaurus.config.ts`, `i18n/**`, `src/**` | `ai/validation.md`, `ai/architecture.md` | This is docs-site structure, not standalone tooling logic. |
| Change standalone validation, conversion, or export behavior | `tidas-tools`, not this repo | root `ai/task-router.md` | Executable tooling lives in `tidas-tools`. |
| Change generated SDK package surfaces | `tidas-sdk`, not this repo | root `ai/task-router.md` | Generated packages live downstream in `tidas-sdk`. |
| Change repo-local AI-doc maintenance only | `AGENTS.md`, `ai/**`, `.github/workflows/ai-doc-lint.yml`, `.github/scripts/ai-doc-lint.*` | `ai/validation.md` when present, otherwise `ai/repo.yaml` | Keep the repo-local maintenance gate aligned with root `ai/ci-lint-spec.md` and `ai/review-matrix.md`. |
| Decide whether work is delivery-complete after merge | root workspace docs, not repo code paths | root `AGENTS.md`, `_docs/workspace-branch-policy-contract.md` | Root integration remains a separate phase. |

## Wrong Turns To Avoid

### Treating docs-site schema files as the only executable upstream

`static/schemas/**` is a published download surface. Standalone tooling still depends on packaged assets in `tidas-tools`.

### Fixing tooling behavior only in public docs

If the tool actually changed, route the executable fix to `tidas-tools` and then update the docs here.

### Treating generated SDK surfaces as a docs-site concern

If the package output changed, route the package work to `tidas-sdk`.

## Cross-Repo Handoffs

Use these handoffs when work crosses boundaries:

1. public spec page change plus standalone tooling follow-up
   - update `tidas`
   - coordinate with `tidas-tools`
2. public schema explanation plus SDK package follow-up
   - update `tidas`
   - coordinate with `tidas-sdk`
3. merged repo PR still needs to ship through the workspace
   - return to `lca-workspace`
   - do the submodule pointer bump there
