---
title: tidas Repo Contract
docType: contract
scope: repo
status: active
authoritative: true
owner: tidas
language: en
whenToUse:
  - when a task may change public TIDAS specification pages, published schema downloads, or docs-site navigation and localization
  - when routing work from the workspace root into tidas
  - when deciding whether a change belongs here, in tidas-tools, in tidas-sdk, or in lca-workspace
whenToUpdate:
  - when spec/docs ownership boundaries change
  - when docs-site runtime or release automation changes
  - when repo-local documentation governance changes
checkPaths:
  - AGENTS.md
  - README.md
  - .docpact/**/*.yaml
  - _docs/agents/**
  - package.json
  - docs/**
  - static/schemas/**
  - sidebars.ts
  - docusaurus.config.ts
  - i18n/**
  - src/**
  - versions.json
  - .github/workflows/**
lastReviewedAt: 2026-04-23
lastReviewedCommit: 17895b187920ec7052ef7f47c26d25344ae5579f
related:
  - .docpact/config.yaml
  - _docs/agents/repo-validation.md
  - _docs/agents/repo-architecture.md
  - README.md
---

## Repo Contract

`tidas` owns the public TIDAS specification and docs-site surface: Docusaurus pages, published schema downloads, navigation, localization assets, and the tag-driven site release workflow. Start here when the task may change how the spec is explained or published on the site.

## Documentation Roles

| Document | Owns | Does not own |
| --- | --- | --- |
| `AGENTS.md` | repo contract, branch and delivery rules, hard boundaries, minimal execution facts | full site path map, proof matrix, or long setup prose |
| `.docpact/config.yaml` | machine-readable repo facts, routing intents, governed-doc rules, ownership, coverage, and freshness | explanatory prose or long-form walkthroughs |
| `_docs/agents/repo-validation.md` | minimum proof by change type, preview guidance, PR validation note shape | repo contract, branch policy truth, or site-shape explanations |
| `_docs/agents/repo-architecture.md` | compact docs-site mental model, stable path map, release/runtime split, and common misreads | checklist-style proof guidance or operator setup commands |
| `README.md` | repo landing context and basic site commands | machine-readable routing or lint semantics |

## Load Order

Read in this order:

1. `AGENTS.md`
2. `.docpact/config.yaml`
3. `_docs/agents/repo-validation.md` or `_docs/agents/repo-architecture.md`
4. the touched public site surface under `docs/**`, `static/schemas/**`, `i18n/**`, `src/**`, or the site config files
5. `README.md` only when you need basic setup or preview commands

The retained internal AI docs live under `_docs/agents/`, not `docs/agents/`, so Docusaurus does not publish them as public content.

## Operational Pointers

- path-level ownership, routing intents, governed-doc inventory, and lint rules live in `.docpact/config.yaml`
- minimum proof and preview guidance live in `_docs/agents/repo-validation.md`
- stable path groups and cross-repo handoffs live in `_docs/agents/repo-architecture.md`
- repo-local documentation maintenance is enforced by `.github/workflows/ai-doc-lint.yml` with `docpact lint`
- the main routing intents are `docs-site`, `published-schemas`, `site-runtime`, `proof`, `repo-docs`, and `root-integration`

## Minimal Execution Facts

Keep these entry-level facts in `AGENTS.md`. Use `README.md` and `_docs/agents/repo-validation.md` for the fuller setup and proof guidance.

- package manager: `npm`
- routine branch base: `main`
- routine PR base: `main`
- canonical validation baseline:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- optional render checks:
  - `npm run start`
  - `npm run serve`
- release is tag-driven through `v<version>` and deploys the built site to Cloudflare Pages

## Ownership Boundaries

The authoritative path-level ownership map lives in `.docpact/config.yaml`.

At a human-readable level, this repo owns:

- `docs/**` for public spec, integration, and tooling explanation pages
- `static/schemas/**` for published downloadable schema files served by the site
- `package.json`, `sidebars.ts`, `docusaurus.config.ts`, `i18n/**`, `src/**`, `versions.json`, and `.github/workflows/build.yml` for the docs-site runtime, navigation, localization, and release path
- `README.md`, `_docs/agents/**`, `.docpact/**`, and repo-local governed docs

This repo does not own:

- standalone conversion, validation, or export tooling logic
- generated SDK package surfaces
- workspace integration state after merge

Route those tasks to:

- `tidas-tools` for standalone tooling logic and packaged upstream assets
- `tidas-sdk` for generated package surfaces and package release automation
- `lca-workspace` for root integration after merge

## Branch And Delivery Facts

- GitHub default branch: `main`
- true daily trunk: `main`
- routine branch base: `main`
- routine PR base: `main`
- branch model: `M1`

`tidas` does not use a separate promote line. Normal implementation merges to `main`, and later workspace delivery still requires a root submodule bump when the updated docs or schema snapshot should ship through `lca-workspace`.

## Operational Invariants

- `static/schemas/**` is a published docs-site surface, not an automatic mirror of packaged upstream assets in `tidas-tools`
- this repo explains public spec and tooling usage; standalone executable tooling logic stays in `tidas-tools`
- generated SDK package output stays in `tidas-sdk`
- the tag-driven `build.yml` workflow deploys the built site to Cloudflare Pages

## Documentation Update Rules

- if a machine-readable repo fact, routing intent, or governed-doc rule changes, update `.docpact/config.yaml`
- if a human-readable repo contract, branch rule, or hard boundary changes, update `AGENTS.md`
- if proof expectations or preview guidance change, update `_docs/agents/repo-validation.md`
- if repo shape, path groups, or cross-repo handoff explanation changes, update `_docs/agents/repo-architecture.md`
- if landing context or basic setup commands change, update `README.md`
- do not copy the same rule into multiple docs just to make it easier to find

## Hard Boundaries

- do not treat the docs-site schema download surface as the standalone tooling upstream
- do not move standalone tooling logic into this repo
- do not treat generated SDK surfaces as a docs-site concern
- do not treat a merged repo PR here as workspace-delivery complete if the root repo still needs a submodule bump

## Workspace Integration

A merged PR in `tidas` is repo-complete, not delivery-complete.

If the change must ship through the workspace:

1. merge the child PR into `tidas`
2. update the `lca-workspace` submodule pointer deliberately
3. complete any later workspace-level validation that depends on the updated docs or schema snapshot
