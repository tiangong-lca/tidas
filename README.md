---
title: TIDAS README
docType: guide
scope: repo
status: active
authoritative: false
owner: tidas
language: en
whenToUse:
  - when onboarding to the TIDAS specification site
  - when checking setup, validation, locale, or publication commands
whenToUpdate:
  - when contributor setup, build inputs, validation, localization, or publication changes
checkPaths:
  - README.md
  - package.json
  - next.config.ts
  - edgeone.json
  - app/**
  - components/**
  - content/docs/**
  - scripts/**
  - .github/workflows/publish-docs.yml
lastReviewedAt: 2026-08-23
lastReviewedCommit: 9aafaf5a088f1ecf21342035fe937de4e2964b1e
lastReviewedNote: "Reviewed for Issue #48 TianGong Data System identity, neutral landing UI, tabular Schema explorer, complete localization, static quality gates, and EdgeOne publication."
---

Public documentation and downloadable data contracts for
[TIDAS](https://tidas.tiangong.earth), the TianGong LCA Data System. The site is a
Next.js App Router static export using Fumadocs and TypeScript.

## Public URLs and locales

- `/` renders the complete default Chinese homepage and serves as `x-default`.
- `/zh/`, `/en/`, `/de/`, and `/fr/` are locale homepages.
- Documentation uses `/{lang}/docs/...`.
- Each `/{lang}/docs/` root is a system-navigation hub with recommended entry points, a TIDAS module matrix, and representative Schema links; it does not duplicate the marketing homepage.
- Chinese, English, German, and French content sources are independently maintained; no locale falls back to another.

Sources use the dot-locale convention: `page.mdx`, `page.en.mdx`, `page.de.mdx`,
and `page.fr.mdx`. Metadata files use the equivalent `meta*.json` convention.

## Development

Use the Node.js and pnpm versions declared by `.nvmrc`, `package.json`, and
`edgeone.json`.

```bash
pnpm install --frozen-lockfile
pnpm dev

pnpm lint
pnpm typecheck

DEPLOY_ENV=ci \
CANONICAL_ORIGIN=http://localhost:3000 \
NEXT_PUBLIC_SEARCH_MODE=static \
pnpm build
```

The build wrapper derives `SOURCE_COMMIT` and `SOURCE_DATE_EPOCH` from Git when
they are not supplied. It requires explicit deployment environment, canonical
origin, and search mode inputs.

| Variable | Contract |
| --- | --- |
| `SOURCE_COMMIT` | 40-character Git SHA; derived from `HEAD` when omitted |
| `SOURCE_DATE_EPOCH` | Unix commit timestamp; derived from Git when omitted |
| `DEPLOY_ENV` | `ci`, `preview`, or `production` |
| `CANONICAL_ORIGIN` | origin without a trailing path; production is `https://tidas.tiangong.earth` |
| `NEXT_PUBLIC_SEARCH_MODE` | `static`, or explicitly configured `algolia` in production |

`pnpm build` produces `out/` and runs both output-contract and site-quality
verification. The gates cover generated endpoints, locale/search evidence,
browser-resolved internal links and fragments, images, MDX hydration hazards,
and Schema page budgets. Public MDX uses locale-absolute document routes rather
than `./` or `../` links.

## Schema explorer

Public Schema files live under `public/schemas/**` and are downloadable directly.
Documentation pages pass a public URL to `JsonSchemaViewer`; the browser fetches
the file only after the reader opens the explorer. Large classification schemas
therefore do not inflate static HTML.

The explorer presents root classification `oneOf` data in a searchable flat
table. Hierarchy is carried by the category-name cell while identifier and
child-count columns remain aligned. Ordinary schemas use a lazy structure table
with constants, references, tuple items, and meaningful union labels.

## Publishing

EdgeOne Pages Git integration owns build and deployment from `main` using
`edgeone.json`. GitHub Actions runs the pull-request validation gate; it does not
upload or deploy the built site.

## Repository layout

```text
app/             locale routes and generated search/crawler/sharing endpoints
components/      TianGong Data System UI, search, media, MDX, and Schema explorer
content/docs/    four-language public documentation
lib/             content loader, i18n, navigation, and metadata policy
public/          downloadable schemas, images, assets, and brand files
scripts/         build, output/site verification, and Docpact wrappers
_docs/agents/    retained architecture and validation guidance
```

Read `AGENTS.md` before changing repository-owned behavior. Use Docpact routing
with this repository as the explicit root before implementation, and run the
governed diff workflow afterward.
