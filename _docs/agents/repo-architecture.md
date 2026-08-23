---
title: tidas Architecture Notes
docType: guide
scope: repo
status: active
authoritative: false
owner: tidas
language: en
whenToUse:
  - when selecting the layer that owns a public page, Schema download, locale, runtime, or publication change
  - when a TIDAS docs task names a capability without an exact path
whenToUpdate:
  - when site layers, path groups, localization, Schema delivery, or publication ownership changes
checkPaths:
  - _docs/agents/repo-architecture.md
  - .docpact/config.yaml
  - app/**
  - components/**
  - lib/**
  - content/docs/**
  - public/schemas/**
  - edgeone.json
  - .github/workflows/publish-docs.yml
lastReviewedAt: 2026-08-23
lastReviewedCommit: b867f324aa4730530d25ce9532bc17f199ce023a
lastReviewedNote: "Reviewed for Issue #48 and the current neutral Fumadocs, TianGong Data System landing, tabular Schema explorer, four-locale, and EdgeOne architecture."
related:
  - ../../AGENTS.md
  - ../../.docpact/config.yaml
  - ./repo-validation.md
  - ../../README.md
---

## Site shape

The repository publishes a Next.js App Router static export using Fumadocs. EdgeOne Pages checks out the selected Git commit, runs the repository build command, and deploys `out/`. GitHub Actions provides pull-request validation only.

## Stable path map

| Path group | Role |
| --- | --- |
| `app/(entry)/**` | root `x-default` homepage and document shell |
| `app/(locale)/[lang]/**` | locale homepages and documentation routes |
| `app/api`, `app/llms.txt`, `app/search-records.json`, `app/sitemap.ts`, `app/robots.ts`, `app/og` | generated discovery, search, crawler, and sharing surfaces |
| `components/docs-home.tsx`, `components/site-brand.tsx`, `app/global.css` | neutral Fumadocs visual foundation and TianGong Data System identity |
| `components/json-schema-viewer.tsx` | lazy semantic Schema structure table and taxonomy table |
| `components/search.tsx`, `components/provider.tsx` | locale-scoped search and UI context |
| `content/docs/**` | four-language public specification and guidance |
| `public/schemas/**` | directly downloadable JSON Schema files |
| `public/img/**`, `public/assets/**`, `public/logo-*.svg` | public media and brand assets |
| `lib/i18n.ts`, `lib/source.ts`, `lib/layout.shared.tsx`, `lib/metadata.ts` | content loading, navigation, localization, and metadata policy |
| `scripts/build.mjs`, `scripts/verify-*.mjs` | deterministic build pipeline and static-site gates |
| `edgeone.json` | EdgeOne install, build, output, and Node contract |
| `.github/workflows/publish-docs.yml` | pull-request validation |

## Request and build flow

```text
content/docs + public/schemas + UI components
                    │
                    ▼
            Next.js static build
                    │
          ┌─────────┴──────────┐
          ▼                    ▼
     out/**/*.html      search / llms / sitemap / OG
          │                    │
          └─────────┬──────────┘
                    ▼
            static quality gates
                    │
                    ▼
              EdgeOne deploy
```

Large Schema JSON files remain separate public assets. MDX passes a public `src` to the viewer, so the static HTML contains only the explorer shell. A reader explicitly opens the explorer before the browser fetches and interprets the Schema.

Taxonomy schemas are identified by root `oneOf` branches that contain constant `#text`, `@catId` or `@classId`, and `@level` fields. They render as a bounded flat native table: only the name cell is indented, identifier and child-count columns remain aligned, branches are interactive, and leaves remain non-button rows. Search uses the same columns and adds the parent breadcrumb. Other schemas render as a lazy flat structure table whose branch labels prefer title, constants, enums, and references over ordinal names.

The landing page uses Fumadocs neutral primitives and a TIDAS-specific system stack that presents methodology, data structure, and data resources. Primary controls keep the accessible TIDAS brand purple as a solid color while supporting surfaces remain neutral; the system map and Schema tables are the deliberately custom product surfaces.

## Locale and URL model

- `/` is a real Chinese homepage and `x-default`; no redirect occurs.
- `/zh/`, `/en/`, `/de/`, and `/fr/` are locale homepages.
- `/{lang}/docs/...` is the only documentation route family.
- Dot-locale sources are independent; `fallbackLanguage` is disabled.
- Canonical metadata, hreflang links, sitemap alternates, search tags, and HTML language attributes must describe the same locale graph.
- Removed URL families receive 404. There is no compatibility or redirect layer.

## Cross-repository handoffs

- `tidas` explains the specification and publishes Schema downloads.
- `tidas-tools` implements conversion, validation, import, export, and reproducible release behavior.
- `tidas-sdk` owns generated package surfaces.
- `lca-workspace` owns the final submodule pointer and cross-repository integration.

`public/schemas/**` is a deliberate published site surface, not an automatic mirror. Compare it explicitly with the maintained tool assets when refreshing schemas.

## Common misreads

- A green Next.js build does not prove links, images, hydration, localization, or page-size budgets; the repository gates do.
- Importing a large JSON Schema from MDX serializes it into HTML and RSC payloads even if the visible tree is collapsed.
- Locale-labelled English copies are not translations.
- A merged child PR does not complete workspace delivery.
