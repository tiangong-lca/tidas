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
  - content/schema-inventory.json
  - content/docs/**
  - public/schemas/**
  - package.json
  - .nvmrc
  - scripts/build.mjs
  - scripts/check-env.mjs
  - scripts/*.test.mjs
  - edgeone.json
  - .github/workflows/publish-docs.yml
lastReviewedAt: 2026-08-26
lastReviewedCommit: 30171cee7c22bfc902f7e9c5ffaac6e929dc194e
lastReviewedNote: "Reviewed for Issue #58 after the current package-manager identity advanced to exact pnpm 11.24.0 without changing the static pipeline, package graph, generated surface, or publication path."
related:
  - ../../AGENTS.md
  - ../../.docpact/config.yaml
  - ./repo-validation.md
  - ../../README.md
---

Historical review note, 2026-08-25: Issue #56 established one exact fail-closed Node 24.19.0, pnpm 11.23.0, and TypeScript 7.0.2 contract with deterministic pnpm-only CI tooling.

Review note, 2026-08-26: Issue #58 changes only the current package-manager identity from pnpm 11.23.0 to exact pnpm 11.24.0. The same root workspace and byte-identical lock, Node 24.19.0, sole TypeScript 7.0.2 graph, static pipeline, schemas/generated output, dependencies, version, and publication path remain in place.

## Site shape

The repository publishes a Next.js App Router static export using Fumadocs. EdgeOne Pages checks out the selected Git commit, runs the repository build command, and deploys `out/`. GitHub Actions provides pull-request validation only.

## Stable path map

| Path group | Role |
| --- | --- |
| `app/(entry)/**` | root `x-default` homepage and document shell |
| `app/(locale)/[lang]/**` | locale homepages and documentation routes |
| `app/api`, `app/llms.txt`, `app/search-records.json`, `app/sitemap.ts`, `app/robots.ts`, `app/og` | generated discovery, search, crawler, and sharing surfaces |
| `components/docs-home.tsx`, `components/docs-portal.tsx`, `components/site-brand.tsx`, `app/global.css` | neutral Fumadocs foundation, landing identity, compact/full responsive brand, and documentation-root navigation |
| `components/category-directory.tsx` | localized section directories derived from the Fumadocs page tree |
| `components/schema-inventory-summary.tsx`, `content/schema-inventory.json` | rendered Schema role/count summary and its machine-readable asset authority |
| `components/json-schema-viewer.tsx` | lazy semantic Schema structure table and taxonomy table |
| `components/search.tsx`, `components/provider.tsx` | locale-scoped search and UI context |
| `content/docs/**` | four-language public specification and guidance |
| `public/schemas/**` | directly downloadable JSON Schema files |
| `public/img/**`, `public/assets/**`, `public/logo-*.svg` | public media and brand assets |
| `lib/i18n.ts`, `lib/source.ts`, `lib/layout.shared.tsx`, `lib/metadata.ts` | content loading, navigation, localization, and metadata policy |
| `scripts/build.mjs`, `scripts/check-env.mjs`, `scripts/*.test.mjs`, `scripts/verify-*.mjs` | exact toolchain enforcement, deterministic build pipeline, Node contracts, and static-site gates |
| `edgeone.json` | EdgeOne install, build, output, and Node contract |
| `.github/workflows/publish-docs.yml` | pull-request validation |

## Request and build flow

```text
content/docs + schema inventory + public/schemas + UI components
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

Before static generation, the build requires exact Node `24.19.0`, pnpm `11.24.0`, and TypeScript `7.0.2`, then executes the environment/toolchain Node contracts. The package graph uses local markdownlint, while CI uses immutable executable action commits with the same exact runtime identity.

Large Schema JSON files remain separate public assets. MDX passes a public `src` to the viewer, so the static HTML contains only the explorer shell. A reader explicitly opens the explorer before the browser fetches and interprets the Schema.

`content/schema-inventory.json` classifies every published JSON asset and owns the public count vocabulary. It separates 8 dataset-object contracts, 9 classification-vocabulary contracts, 1 shared-types contract, and 1 derived viewer projection. The viewer projection is non-normative and presentation-only. The 18 contract file names match the logical entries in the `tidas-tools` schema lock, but the public directory is not an automatic mirror and the inventory does not claim structural or byte-for-byte equality.

Localized section roots are real content pages as well as navigation folders. Each section `meta*.json` points `pagesIndex` at `index` and excludes `index` from its child list; `components/category-directory.tsx` resolves the current folder from `source.getPageTree(language)` and renders its children. This preserves existing URLs, removes folder/index duplicate labels, and makes new children discoverable without duplicating manual card lists.

Taxonomy schemas are identified by root `oneOf` branches that contain constant `#text`, `@catId` or `@classId`, and `@level` fields. They render as a bounded flat native table: only the name cell is indented, identifier and child-count columns remain aligned, branches are interactive, and leaves remain non-button rows. Search uses the same columns and adds the parent breadcrumb. Other schemas render as a lazy flat structure table whose branch labels prefer title, constants, enums, and references over ordinal names.

The landing page uses Fumadocs neutral primitives and a TIDAS-specific system stack that presents methodology, data structure, and data resources. Primary controls keep the accessible TIDAS brand purple as a solid color while supporting surfaces remain neutral; the system map and Schema tables are the deliberately custom product surfaces.

The shared brand has one complete accessible name. Wide unconstrained navigation may show `TIDAS / TianGong Data System`; the fixed documentation sidebar and mobile header deliberately render `TIDAS` rather than clipping or ellipsizing part of the product name.

The four `content/docs/index*.mdx` sources render `components/docs-portal.tsx` inside the ordinary Fumadocs document layout. The portal preserves the document title and sidebar, then adds recommended entry points, a definition-to-operation system matrix, and representative Schema links. It shares the same three-part information hierarchy as the TianGong LCA documentation hub but exposes a distinct `data-docs-portal="tidas-system-hub"` and `data-docs-portal-map="tidas-system-matrix"` product signature instead of the LCA task route.

## Locale and URL model

- `/` is a real Chinese homepage and `x-default`; no redirect occurs.
- `/zh/`, `/en/`, `/de/`, and `/fr/` are locale homepages.
- `/{lang}/docs/...` is the only documentation route family.
- First-party links are locale-absolute. Static verification resolves every emitted href from the public URL of its source HTML, so a relative link cannot silently become a nested retired route.
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
