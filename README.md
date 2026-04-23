---
title: TIDAS Landing
docType: overview
scope: repo
status: active
authoritative: false
owner: tidas
language: en
whenToUse:
  - when you need the shortest high-level overview of the TIDAS docs-site repo
  - when you need basic install, build, preview, or release commands
whenToUpdate:
  - when basic site commands or the AI entry surface change
  - when the repo's high-level purpose shifts
checkPaths:
  - README.md
  - AGENTS.md
  - .docpact/config.yaml
  - _docs/agents/**
  - package.json
  - .github/workflows/**
lastReviewedAt: 2026-04-23
lastReviewedCommit: 17895b187920ec7052ef7f47c26d25344ae5579f
related:
  - AGENTS.md
  - .docpact/config.yaml
  - _docs/agents/repo-validation.md
  - _docs/agents/repo-architecture.md
---

# TIDAS

## AI Docs Entry

Use this order for AI bootstrap inside `tidas`:

1. `AGENTS.md`
2. `.docpact/config.yaml`
3. `_docs/agents/repo-validation.md`
4. `_docs/agents/repo-architecture.md`
5. then load the touched public docs-site surface under `docs/**`, `static/schemas/**`, `i18n/**`, `src/**`, or the site config files

These files form the low-entropy contract layer. The public docs site content remains the owned change surface; the retained internal AI docs stay under `_docs/agents/` so they are not published as site pages.

## Installation

```bash
npm ci
```

## Error check & fix

```bash
npm run lint

npm run lint:fix
```

This command will check the code style and fix the code style automatically.

## Validation Baseline

Run this baseline before opening or updating a PR:

```bash
npm run lint
npm run typecheck
npm run build
```

## Local Development Preview

```bash
npm run start
```

This command starts the local Docusaurus development server for interactive page checks. Use it when the task needs local rendering confirmation; it is not a substitute for the validation baseline above.

## Build

```bash
npm run build

npm run serve
```

`npm run build` is part of the required validation baseline. `npm run serve` is an optional post-build preview for checking the generated static output locally.

## Translation

```bash
npx docusaurus write-translations --locale en
npx docusaurus write-translations --locale zh-CN
npx docusaurus write-translations --locale ja
```

## Version

```bash
npm run docusaurus docs:version 0.0.1
```

## Publish

```bash
git tag

git tag v0.0.1
git push origin v0.0.1
```
