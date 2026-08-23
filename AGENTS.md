---
title: tidas Repo Contract
docType: contract
scope: repo
status: active
authoritative: true
owner: tidas
language: en
whenToUse:
  - when changing the public TIDAS specification, schemas, navigation, localization, site runtime, or publication path
  - when routing work from lca-workspace into tidas
  - when deciding whether work belongs in tidas, tidas-tools, tidas-sdk, or lca-workspace
whenToUpdate:
  - when repository ownership or public URL boundaries change
  - when the docs runtime, localization model, validation contract, or publication path changes
  - when repository documentation governance changes
checkPaths:
  - AGENTS.md
  - README.md
  - .docpact/**/*.yaml
  - _docs/agents/**
  - package.json
  - next.config.ts
  - edgeone.json
  - app/**
  - components/**
  - lib/**
  - content/docs/**
  - public/schemas/**
  - scripts/**
  - .github/workflows/**
lastReviewedAt: 2026-08-23
lastReviewedCommit: 45ea507c597395ebbe34213115cb301bb0f2fb68
lastReviewedNote: "Reviewed for Issue #48: TianGong Data System identity, neutral Fumadocs landing UI, flat tabular Schema explorers, visual-test markers, and current static quality gates."
related:
  - .docpact/config.yaml
  - _docs/agents/repo-validation.md
  - _docs/agents/repo-architecture.md
  - README.md
---

## Repository contract

`tidas` owns the public TIDAS specification and its static documentation site. That includes explanatory content, downloadable JSON Schema files, navigation, localization, search artifacts, and the site runtime that publishes them.

## Documentation roles

| Document | Owns |
| --- | --- |
| `AGENTS.md` | repository contract, ownership boundaries, branch and delivery facts, hard invariants |
| `.docpact/config.yaml` | machine-readable ownership, coverage, routing, rules, and freshness |
| `_docs/agents/repo-architecture.md` | current site layers, path map, runtime/publication split, cross-repository handoffs |
| `_docs/agents/repo-validation.md` | proof required by change type and visual/static-site quality budgets |
| `README.md` | contributor setup, build contract, repository orientation, publication overview |

Read this file first, then `.docpact/config.yaml` and the routed workflow documents. Public content under `content/docs/**` is a product surface, not agent guidance.

## Minimal execution facts

- package manager: `pnpm` as pinned by `packageManager`
- routine branch and PR base: `main`
- branch model: `M1`
- canonical local baseline:
  - `pnpm lint`
  - `pnpm typecheck`
  - `DEPLOY_ENV=ci CANONICAL_ORIGIN=http://localhost:3000 NEXT_PUBLIC_SEARCH_MODE=static pnpm build`
- visual changes additionally require browser checks at desktop and mobile widths
- EdgeOne Pages Git integration owns production build and deployment from `main`
- GitHub Actions validates pull requests; it does not publish the site

Use exact versions and additional commands from `package.json`, `edgeone.json`, and `_docs/agents/repo-validation.md`; do not reconstruct them from this contract.

## Current public surface

- `/` directly renders the complete default Chinese homepage and is the `x-default` URL; it is not a redirect.
- Locale homepages use `/{lang}/` for `zh`, `en`, `de`, and `fr`.
- Documentation uses `/{lang}/docs/...`.
- First-party document links use locale-absolute `/{lang}/docs/**/` targets. Path-relative document links are forbidden because trailing-slash pages resolve them below the current page directory.
- All four locales are independent content sources with no fallback language.
- `content/docs/**` uses dot-locale files: `page.mdx`, `page.en.mdx`, `page.de.mdx`, and `page.fr.mdx`.
- `public/schemas/**` is the downloadable Schema surface. Large schemas are fetched by the client only when a reader opens the explorer; they must not be serialized into page HTML.
- `out/**` is generated static output and never an authority source.

This is a greenfield URL model. Do not add redirects, aliases, or compatibility copies for removed paths. Update every first-party link to the current route and let unknown paths return 404.

## Ownership boundaries

This repository owns:

- `content/docs/**` for the public specification, integrations, tools, examples, and FAQ;
- `public/schemas/**` for published downloadable schemas;
- `app/**`, `components/**`, `lib/**`, `next.config.ts`, and site styles for routing and rendering;
- `public/img/**`, `public/assets/**`, and brand files for site media;
- `edgeone.json` and build verification for the EdgeOne publication contract;
- repository docs, Docpact configuration, and local/remote documentation gates.

It does not own:

- conversion, validation, import, export, or release implementation logic: route to `tidas-tools`;
- generated SDK packages: route to `tidas-sdk`;
- workspace integration after repository delivery: route to `lca-workspace`.

Public guidance about tools remains here, but executable behavior remains in `tidas-tools`. Changes to schema meaning may require a tracked follow-up in `tidas-sdk`.

## Runtime and content invariants

- The site is a Next.js App Router static export using Fumadocs.
- Keep root, locale, document, sitemap, search, OG, robots, and `llms.txt` outputs mutually consistent.
- Resolve generated links with browser URL semantics and verify relative, root-absolute, same-origin absolute, and fragment targets against the static export; retired `/docs/intro/integration/**` and `/docs/intro/use-case/**` shapes must fail.
- Every indexed page must expose canonical metadata and locale alternates; the sitemap must carry the same alternates.
- Search results must stay locale-scoped and bounded in the UI.
- Schema taxonomies must expose semantic identifiers, names, levels, search, and a raw download; anonymous `oneOf N` lists are forbidden.
- Schema taxonomies render as a flat native table whose name column alone carries hierarchy indentation; identifier and child-count columns remain aligned across levels.
- Taxonomy branch controls expose expansion state, leaf rows are not buttons, and the governed `data-schema-taxonomy`, `data-taxonomy-row`, `data-taxonomy-id`, and `data-taxonomy-label` markers remain available to browser proof.
- Do not render more than 50 taxonomy search results or eagerly materialize an unbounded taxonomy tree.
- Public branding names TIDAS as the TianGong Data System. The Schema specification is one system layer, not the product subtitle.
- Light and dark media variants must reference files that exist; use one asset in both themes when no dark variant exists.
- Raw `<a>` and `<p>` elements are not allowed in public MDX because they bypass component mappings and can create invalid nested HTML.
- German and French pages must contain genuine translations, not English body copies labeled as localized content.

## Documentation update rules

- machine-readable path, ownership, routing, or rule changes update `.docpact/config.yaml`;
- ownership, branch, URL, or publication invariants update `AGENTS.md`;
- site shape and cross-repository explanation update `_docs/agents/repo-architecture.md`;
- proof requirements and budgets update `_docs/agents/repo-validation.md`;
- contributor setup and build commands update `README.md`.

Do not copy the same detailed procedure into several documents.

## Delivery and workspace integration

A merged repository PR is repository-complete, not workspace-delivery complete. If the updated specification must ship through the workspace:

1. merge the child PR into `tidas/main`;
2. select the exact eligible child commit;
3. update the `lca-workspace` submodule pointer deliberately;
4. run the required workspace validation and complete the tracked integration record.

## Local Docpact gate

Install the versioned hook once per checkout:

```bash
./scripts/install-git-hooks.sh
```

The pre-push hook delegates to `scripts/docpact-gate.sh`, which resolves the CLI through `scripts/docpact`, validates config strictly, and enforces governed-document review against `origin/main` by default. Use `DOCPACT_BASE_REF` or `--base` only for an intentional nonstandard stack.
