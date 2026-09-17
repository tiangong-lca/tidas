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
  - .nvmrc
  - next.config.ts
  - edgeone.json
  - app/**
  - components/**
  - content/schema-inventory.json
  - content/docs/**
  - scripts/**
  - .github/workflows/publish-docs.yml
lastReviewedAt: 2026-09-17
lastReviewedCommit: 2b46fe5eb6ad16d43ee90a1b739113470c1658c0
lastReviewedNote: "Reviewed for TIDAS #78: the 18 normative website schema assets converge byte-for-byte with the approved tidas-spec candidate, source identity is bound by commit and manifest hashes, and the retained viewer projection is non-normative. The sync/check gate, drift tests, full test suite, typecheck, and static output/site verification preserve existing public URL, version, publication, and runtime boundaries."
---

Historical review note, 2026-08-25: Issue #56 confirmed the pnpm/Fumadocs setup with exact pnpm 11.23.0, while `.nvmrc`, `package.json`, and `edgeone.json` remained the version authorities.

Review note, 2026-08-26: Issue #58 updates the current pnpm-only toolchain to exact pnpm 11.24.0 across the root manifest, engine, environment, CI, and test contracts. pnpm 11.24.0 reconciles the existing sole root workspace lock without changing its bytes; Node 24.19.0, TypeScript 7.0.2, dependencies, site content/runtime, package version, tags, and publication remain unchanged.

Review note, 2026-08-30: Issue #61 allows supported Node 24 patch releases from `24.18.0` up to (but not including) Node 25. Local `.nvmrc` selects Node major `24`, EdgeOne pins preinstalled Node `24.18.0`, and PR validation remains on reviewed Node `24.19.0`; pnpm `11.24.0` and TypeScript `7.0.2` remain exact.

Review note, 2026-08-30: the beginner-facing terminology update adds a localized `/docs/glossary/` page and rewrites the homepage, introduction, core overview, tool overview, and Schema inventory labels without changing contributor setup, schemas, executable tools, or publication behavior.

Review note, 2026-09-17: TIDAS #78 adds the source-bound `scripts/ci/sync-tidas-spec.mjs` check/write gate and negative fixtures for manifest, file-set, hash, source-identity, and viewer-projection drift. It does not change the documented package, versioned archive, public URL, publication, or runtime contract.

Public documentation and downloadable data contracts for
[TIDAS](https://tidas.tiangong.earth), the TianGong LCA Data System. The site is a
Next.js App Router static export using Fumadocs and TypeScript.

## Public URLs and locales

- `/` renders the complete default Chinese homepage and serves as `x-default`. It is the only Chinese home.
- `/zh` and `/zh/` are permanent 301 redirects to `/` and are never generated, canonical, or used as an alternate.
- `/en/`, `/de/`, and `/fr/` are locale homepages.
- Documentation uses `/{lang}/docs/...` in all four locales, including `zh`.
- Each `/{lang}/docs/` root is a system-navigation hub with recommended entry points, a TIDAS module matrix, and representative Schema links; it does not duplicate the marketing homepage.
- Each `/{lang}/docs/glossary/` page centrally explains LCA concepts, TIDAS data terms, and the difference between automated checks, data quality, independent review, and named compliance claims.
- Chinese, English, German, and French content sources are independently maintained; no locale falls back to another.

Sources use the dot-locale convention: `page.mdx`, `page.en.mdx`, `page.de.mdx`,
and `page.fr.mdx`. Metadata files use the equivalent `meta*.json` convention.

## Development

Use Node `>=24.18.0 <25` and pnpm `11.24.0`. `.nvmrc` selects the current local
Node 24 release, while `edgeone.json` independently pins EdgeOne's preinstalled
Node `24.18.0` build runtime.

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
| `BAIDU_SITE_VERIFICATION` | optional search-console ownership marker for the deployed site. Omitted, no marker is published; the value is never hardcoded in this repository, and gates report its presence or a mismatch without echoing it |

`pnpm build` produces `out/` and runs both output-contract and site-quality
verification. The gates cover generated endpoints, locale/search evidence,
browser-resolved internal links and fragments, images, MDX hydration hazards,
and Schema page budgets. Public MDX uses locale-absolute document routes rather
than `./` or `../` links.

The gates also hold the canonical URL model: `/` is the Chinese home, `/zh` and
`/zh/` are permanent redirects declared in `edgeone.json` and are never exported,
canonical, or used as an alternate; the sitemap lists only pages that exist and
carries no `lastmod`. Page summaries are measured as authored, derived, or
unresolved, and the unresolved URLs are printed as editorial debt that blocks
nothing.

`pnpm test` runs the environment, content, toolchain, and SEO policy suites.
`pnpm test:env`, `pnpm test:content`, `pnpm test:toolchain`, and `pnpm test:seo`
run one suite each for focused early feedback.

## Schema explorer

Public Schema files live under `public/schemas/**` and are downloadable directly as the unversioned compatibility baseline. Immutable releases are published under `public/spec/<version>/`; each release contains an index, manifest, schema lock, localized schemas, and methodology assets. `scripts/spec-pin.json` and `scripts/sync-versioned-spec.mjs` keep the release closure pinned and verifiable.
Documentation pages pass a public URL to `JsonSchemaViewer`; the browser fetches
the file only after the reader opens the explorer. Large classification schemas
therefore do not inflate static HTML.

`content/schema-inventory.json` is the machine-readable authority for published
asset counts and roles. It distinguishes dataset objects, classification
vocabularies, shared types, and the derived non-normative viewer projection;
matching tool-side file names does not imply that the public files are an
automatic mirror.

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
content/docs/    four-language public documentation and localized section indexes
content/schema-inventory.json  published Schema asset roles and count authority
lib/             content loader, i18n, navigation, and metadata policy
public/          downloadable schemas, images, assets, and brand files
scripts/         build, output/site verification, and Docpact wrappers
_docs/agents/    retained architecture and validation guidance
```

Read `AGENTS.md` before changing repository-owned behavior. Use Docpact routing
with this repository as the explicit root before implementation, and run the
governed diff workflow afterward.
