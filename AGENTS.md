---
title: tidas AI Working Guide
docType: contract
scope: repo
status: active
authoritative: true
owner: tidas
language: en
whenToUse:
  - when a task may change public TIDAS specification pages, published schema files, or docs-site navigation and localization
  - when routing work from the workspace root into tidas
  - when deciding whether a change belongs here, in tidas-tools, in tidas-sdk, or in lca-workspace
whenToUpdate:
  - when spec/docs ownership boundaries change
  - when docs-site runtime or release automation changes
  - when the repo-local AI bootstrap docs under ai/ change
checkPaths:
  - AGENTS.md
  - README.md
  - ai/**/*.md
  - ai/**/*.yaml
  - package.json
  - docs/**
  - static/schemas/**
  - sidebars.ts
  - docusaurus.config.ts
  - i18n/**
  - src/**
  - versions.json
  - .github/workflows/**
lastReviewedAt: 2026-04-18
lastReviewedCommit: 8cece2a553f0d292df61d247fd861d01b627852f
related:
  - ai/repo.yaml
  - ai/task-router.md
  - ai/validation.md
  - ai/architecture.md
  - README.md
---

## Repo Contract

`tidas` owns the public TIDAS specification and docs-site surface: Docusaurus pages, published schema downloads, navigation, and localization assets. Start here when the task may change how the spec is explained or published on the site.

## AI Load Order

Load docs in this order:

1. `AGENTS.md`
2. `ai/repo.yaml`
3. `ai/task-router.md`
4. `ai/validation.md`
5. `ai/architecture.md`
6. `README.md` only for basic site commands

Do not assume executable tooling logic lives here just because the repo publishes schema files.

## Repo Ownership

This repo owns:

- `docs/**` and `src/**` for public spec/docs-site content and components
- `static/schemas/**` for published downloadable schema files on the site
- `sidebars.ts`, `docusaurus.config.ts`, and `i18n/**` for navigation, site runtime, and localization
- the tag-driven Cloudflare Pages release workflow

This repo does not own:

- standalone conversion, validation, or export tooling logic
- generated SDK package surfaces
- workspace integration state after merge

Route those tasks to:

- `tidas-tools` for standalone tooling logic and upstream packaged assets
- `tidas-sdk` for generated package surfaces
- `lca-workspace` for root integration after merge

## Runtime Facts

- Package manager: `npm`
- Canonical local commands:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `npm run start`
  - `npm run serve`
- Release is tag-driven through `v<version>` and deploys the built site to Cloudflare Pages

## Hard Boundaries

- Do not treat the docs-site schema download surface as the executable tooling upstream
- Do not move standalone tooling logic into this repo
- Do not treat a merged repo PR here as workspace-delivery complete if the root repo still needs a submodule bump

## Workspace Integration

A merged PR in `tidas` is repo-complete, not delivery-complete.

If the change must ship through the workspace:

1. merge the child PR into `tidas`
2. update the `lca-workspace` submodule pointer deliberately
3. complete any later workspace-level validation that depends on the updated docs or schema snapshot
