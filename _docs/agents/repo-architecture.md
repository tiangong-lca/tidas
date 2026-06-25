---
title: tidas Architecture Notes
docType: guide
scope: repo
status: active
authoritative: false
owner: tidas
language: en
whenToUse:
  - when you need a compact mental model of the repo before editing spec pages, schema downloads, or site runtime files
  - when deciding which site layer owns a behavior change
  - when spec docs, downloadable schemas, or downstream handoffs are mentioned without exact paths
whenToUpdate:
  - when major site layers or localization paths change
  - when the published-schema surface changes
  - when downstream handoffs make the current map misleading
checkPaths:
  - _docs/agents/repo-architecture.md
  - .docpact/config.yaml
  - docs/**
  - static/schemas/**
  - package.json
  - sidebars.ts
  - docusaurus.config.ts
  - i18n/**
  - src/**
  - .github/workflows/build.yml
  - .githooks/pre-push
  - scripts/docpact
  - scripts/docpact-gate.sh
  - scripts/install-git-hooks.sh
lastReviewedAt: 2026-06-25
lastReviewedCommit: 216e890d93db7c7327d92c3020d6fedb6d79f723
related:
  - ../../AGENTS.md
  - ../../.docpact/config.yaml
  - ./repo-validation.md
  - ../../README.md
---

## Repo Shape

This repo is a Docusaurus site that publishes public TIDAS specification content plus downloadable schema files.

## Stable Path Map

| Path group | Role |
| --- | --- |
| `docs/**` | public spec, integration, and tooling explanation pages |
| `static/schemas/**` | published downloadable schema files |
| `package.json` | site scripts and package-manager baseline |
| `sidebars.ts` | site navigation structure |
| `docusaurus.config.ts` | site config, locales, and plugin wiring |
| `i18n/**` | localization assets |
| `src/**` | site runtime components and custom pages |
| `.github/workflows/build.yml` | tag-driven Cloudflare Pages deployment |

## Practical Cross-Repo Chain

The practical role split today is:

- `tidas`: public spec/docs surface
- `tidas-tools`: executable tooling and packaged upstream assets
- `tidas-sdk`: generated package surfaces

Important consequence:

`static/schemas/**` is a published docs-site surface, not an automatic mirror of `tidas-tools/src/tidas_tools/tidas/schemas/**`.

Treat both surfaces explicitly.

## Public Docs Subdomains And Handoffs

- `docs/core-modules/schema/**` is the public schema explanation and validation surface owned here; if the meaning of those docs changes in a way that affects downstream package consumers, expect follow-up in `tidas-sdk`
- `docs/tool/**`, `docs/integration/**`, and `docs/use_case/**` are public guidance surfaces owned here; if the underlying executable tool behavior changed, route that implementation work to `tidas-tools`
- `static/schemas/**` is the published download surface served by the site; compare it explicitly against `tidas-tools/src/tidas_tools/tidas/schemas/**` when refreshing downloadable schemas

## Site Runtime

The repo uses Docusaurus with localized site assets and can build or serve static output locally through the npm scripts in `package.json`.

## Release Architecture

Tag `v<version>` triggers the release gate, which runs `npm run lint`, `npm run typecheck`, and `npm run build` before the Cloudflare Pages deploy of the `build/` output.

This release path is part of the repo architecture, not just a deployment checklist.

## Common Misreads

- downloadable schema files on the site are not the only executable upstream
- standalone tooling behavior does not live here
- generated SDK package output does not live here
- a merged child PR does not finish workspace delivery

## Local Docpact Push Gate

This repository has a versioned local `pre-push` hook under `.githooks/pre-push` that delegates to `scripts/docpact-gate.sh`. The gate resolves the CLI through `scripts/docpact`, so local agent shells do not need bare `docpact` on `PATH`. The hook is a local developer guard for docpact config validation and enforced doc-governance linting; ordinary PRs and pushes rely on the local gate; `.github/workflows/ai-doc-lint.yml` is manual-dispatch fallback for remote reproduction.
