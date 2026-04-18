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
  - ai/architecture.md
  - ai/repo.yaml
  - docs/**
  - static/schemas/**
  - sidebars.ts
  - docusaurus.config.ts
  - i18n/**
  - src/**
lastReviewedAt: 2026-04-18
lastReviewedCommit: 8cece2a553f0d292df61d247fd861d01b627852f
related:
  - ../AGENTS.md
  - ./repo.yaml
  - ./task-router.md
  - ./validation.md
  - ../README.md
---

## Repo Shape

This repo is a Docusaurus site that publishes public TIDAS specification content plus downloadable schema files.

## Stable Path Map

| Path group | Role |
| --- | --- |
| `docs/**` | public spec, integration, and tooling explanation pages |
| `static/schemas/**` | published downloadable schema files |
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

## Site Runtime

The repo uses Docusaurus with localized site assets and can build or serve static output locally through the npm scripts in `package.json`.

## Release Architecture

Tag `v<version>` triggers the site build and a Cloudflare Pages deploy of the `build/` output.

This release path is part of the repo architecture, not just a deployment checklist.

## Common Misreads

- downloadable schema files on the site are not the only executable upstream
- standalone tooling behavior does not live here
- generated SDK package output does not live here
- a merged child PR does not finish workspace delivery
