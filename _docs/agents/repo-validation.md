---
title: tidas Validation Guide
docType: guide
scope: repo
status: active
authoritative: false
owner: tidas
language: en
whenToUse:
  - when a TIDAS site change is ready for proof
  - when deciding the minimum checks for content, Schema, UI, localization, metadata, or publication changes
  - when writing PR validation evidence
whenToUpdate:
  - when canonical commands, page budgets, browser coverage, or publication checks change
checkPaths:
  - _docs/agents/repo-validation.md
  - package.json
  - .nvmrc
  - scripts/build.mjs
  - scripts/check-env.mjs
  - scripts/check-env.test.mjs
  - scripts/content-contract.test.mjs
  - scripts/toolchain-contract.test.mjs
  - scripts/verify-out.mjs
  - scripts/verify-site.mjs
  - content/schema-inventory.json
  - content/docs/**
  - public/schemas/**
  - app/**
  - components/**
  - .github/workflows/**
lastReviewedAt: 2026-09-16
lastReviewedCommit: 5fb2b821cde73196888a5dbcf19fd02bf358c14f5
lastReviewedNote: "Reviewed for TIDAS #74: versioned specification publication adds a pinned 0.1.0 archive identity, 39-file reference closure, atomic sync and tracked-output verification, four localized docs entries, and content/toolchain/build contracts while preserving the unversioned /schemas baseline. Lint, typecheck, 53-test suite, fixed-archive verification, tracked-output verification, and full static build with output/site gates pass. Independent PR review and exact production publication remain pending."
related:
  - ../../AGENTS.md
  - ../../.docpact/config.yaml
  - ./repo-architecture.md
  - ../../README.md
---

Historical review note, 2026-08-25: Issue #56 made exact Node 24.19.0, pnpm 11.23.0, and TypeScript 7.0.2 checks, full Node contracts, local markdownlint, and immutable CI setup required proof.

Review note, 2026-08-26: Issue #58 requires exact pnpm 11.24.0 for the current toolchain proofs while retaining Node 24.19.0 and sole TypeScript 7.0.2. Toolchain validation also audits that pnpm 11.24.0 leaves the single root workspace lock byte-identical and that no npm/Yarn fallback, schema/generated drift, dependency, package-version, tag, or publication change appears.

Review note, 2026-08-30: Issue #61 requires Node `>=24.18.0 <25`, exact pnpm `11.24.0`, and exact TypeScript `7.0.2`. Proof must accept EdgeOne's preinstalled Node `24.18.0` and newer Node 24 patches while rejecting older Node 24 releases, major-only runtime strings, and Node 25+.

Review note, 2026-08-30: the beginner-facing terminology update extends content-contract proof to require the four localized glossaries in root navigation, plain homepage and inventory labels, advanced placement of tool-version details, and explicit separation of format checks, documentation completeness, data quality, independent review, and named compliance claims.

## Default baseline

Run from the repository root:

```bash
pnpm lint
pnpm typecheck
DEPLOY_ENV=ci \
CANONICAL_ORIGIN=http://localhost:3000 \
NEXT_PUBLIC_SEARCH_MODE=static \
pnpm build
```

`pnpm build` runs the bounded Node 24 and exact package-tool environment contract, all toolchain tests, static export, output contract, and site-quality gate. A green compile without the final gates is incomplete proof. Run `pnpm test` or the named `test:env`, `test:content`, `test:toolchain`, and `test:seo` commands for focused early feedback; they need not be repeated separately when running the full baseline because build already runs the complete suite.

## Change matrix

| Change | Required proof |
| --- | --- |
| prose or navigation | `pnpm test:content`, lint, full build, generated-link gate, spot-check affected locale pages |
| section index or Schema inventory | `pnpm test:content`, full build, verify folder/index de-duplication in all locales, reconcile every public JSON asset and 8/9/1/1 roles, confirm the viewer projection is non-normative |
| versioned specification release | fixed-archive sync and verify, tracked-output verify without network, `pnpm test`, lint, typecheck, full build, and confirm the index's digest/reference closure plus four localized entry pages |
| German or French translation | lint, full build, compare source meaning, verify no English body copy remains, inspect navigation and search in that locale |
| site UI or responsive layout | baseline plus browser screenshots at 390, 1440, 1633, 2048, and 2560 widths, light and dark themes, keyboard focus, no horizontal overflow |
| root or language behavior | visit `/` and all locale homes; switch from `/` to another language; verify there is no redirect and URLs remain within the current route model |
| Schema explorer | baseline plus generic structure and taxonomy interaction checks, raw download, error state, search cap, lazy expansion, and the budgets below |
| media | full build image gate plus light/dark browser inspection |
| metadata, sitemap, robots, search, or OG | inspect generated HTML/endpoints and verify canonical, alternate, locale, commit, and environment consistency |
| canonical home, `/zh` alias, or alternate resolution | baseline plus `pnpm test:seo`; confirm `out/zh/index.html` is absent, `/` carries the canonical, no alternate or sitemap entry names `/zh`, and `edgeone.json` declares both permanent redirects |
| page summary or description coverage | baseline; read the `verify:out` authored/derived/unresolved measurement and its sorted unresolved URL list. Unresolved pages are editorial debt, never a build failure and never an auto-noindex |
| breadcrumb or structured data | baseline; `verify-site` requires ordered, absolute crumb targets that resolve to real exported pages |
| publication config | baseline with the same environment variables configured in EdgeOne; inspect `edgeone.json` and PR validation workflow |
| toolchain, package manager, environment checker, or CI actions | clean frozen install, `pnpm test:env`, `pnpm test:toolchain`, lint, typecheck, and full build; require Node `>=24.18.0 <25`, exact pnpm `11.24.0`, exact TypeScript `7.0.2`, EdgeOne `24.18.0`, local `.nvmrc` major `24`, and reviewed executable action commits |
| search-console ownership marker | build with `BAIDU_SITE_VERIFICATION` set and confirm `verify:out` reports the exact marker on the document heads; build without it and confirm the same gate reports absence across every page. Neither run may print the value |
| repository docs or Docpact | strict config validation, coverage, list-rules, route, governed diff lint, and review marks when required |

## Static site gates

`scripts/verify-out.mjs` checks the build/output contract, including system endpoints, commit/digest evidence, locale counts, language attributes, robots behavior, and internal-path exclusion. It also checks the optional search-console ownership marker: when `BAIDU_SITE_VERIFICATION` is set the exact value must appear on the probed document heads, and when it is unset no page may carry the marker at all. The gate reports presence, absence or a mismatch, and never echoes the value. It also requires that `/zh` is not exported while `/` carries the canonical, that `edgeone.json` declares both permanent redirects, that the sitemap omits `lastmod` and never names the alias, that every sitemap URL and alternate resolves to a real artifact, that the retired `/docs/intro/**` shapes stay absent, and that every source page exports an artifact. It measures page summaries from the artifacts as authored, derived, or unresolved, and prints the unresolved URLs as advisory editorial debt that blocks nothing.

`scripts/verify-site.mjs` checks:

- every generated first-party page and media link resolves;
- relative, root-absolute, and same-origin absolute links resolve from the public URL of their source page, and every internal fragment names a real target element;
- public MDX contains no path-relative document link, and retired `/docs/intro/integration/**` or `/docs/intro/use-case/**` targets fail the build;
- public MDX does not contain raw `<a>` or `<p>` hydration hazards;
- public MDX does not depend on GitHub user-attachment URLs whose build-time image probing can make exports nondeterministic;
- Schema pages do not contain anonymous `oneOf N` labels;
- Schema HTML is at most 300,000 bytes;
- a Schema page contains fewer than 500 rendered buttons and 6,000 static elements.
- the TIDAS identity, system-map signature, flat taxonomy-table markers, and gradient- and shadow-free custom CSS contract remain present.
- all four documentation roots retain the TIDAS system-hub and system-matrix markers.
- every page that declares an hreflang alternate declares the same set in the HTML and in the sitemap, and each target resolves to a real exported file; a page declaring none, or a check that would inspect zero pages, fails rather than passing silently;
- every `BreadcrumbList` is valid JSON, uses ordered `ListItem` entries, and every crumb is an absolute URL that resolves to a real exported page.

`scripts/content-contract.test.mjs` checks the source-side contracts that must fail before static generation: substantive four-locale section indexes, `pagesIndex` de-duplication, page-tree-derived directories, responsive brand labels, complete Schema inventory coverage and role counts, viewer derivation boundaries, CLI release authority, locale-preserving platform links, beginner-facing homepage and inventory language, four root glossaries, and the boundary between automated checks and professional LCA judgement.

For the loaded taxonomy page, browser proof must also show:

- at least the elementary and product taxonomies expose `[data-schema-taxonomy]`;
- fewer than 6,000 live DOM nodes and 500 buttons;
- document height below 30,000px;
- search renders no more than 50 results;
- collapsed branches do not materialize their descendants;
- every taxonomy ID column has one stable horizontal position regardless of hierarchy depth;
- hierarchy indentation affects the name cell only, leaf rows are not buttons, and search results retain ID, label, and parent breadcrumb;
- `const`, `$ref`, tuple items, and semantic union labels are visible in the generic explorer.
- required structure rows keep the disclosure SVG and field-name text vertically aligned within 2px, with a disclosure hit target of at least 24×24px.

## Browser smoke

Use Playwright or the in-app browser against the current static build or development server. Record:

1. root homepage, one normal document, and the flows Schema page;
2. desktop and mobile viewport screenshots;
3. dark-theme media and contrast;
4. console errors, failed network requests, and hydration warnings;
5. keyboard access to navigation, language, search, Schema load, taxonomy expand, and search results.

The browser smoke should traverse every sitemap page when content structure changes. Any console error, failed first-party asset, invalid nesting warning, or horizontal overflow is a failure.

For documentation-root changes, inspect every locale at 390px and 1440px, then the shared layout at 1633px, 2048px, and 2560px in light and dark themes. Every `[data-docs-portal]` link must stay within the current locale, resolve successfully, remain visible on mobile, and the page must have no horizontal overflow.

## PR evidence

Record the commands that ran, the browser viewports/themes checked, relevant page budgets, locale coverage, and whether published schemas changed independently of executable assets in `tidas-tools`.

## Docpact proof

Use the workspace wrapper with an absolute repository root:

```bash
/Users/davidli/projects/workspace/scripts/docpact validate-config --root "$PWD" --strict
/Users/davidli/projects/workspace/scripts/docpact coverage --root "$PWD" --format json
/Users/davidli/projects/workspace/scripts/docpact list-rules --root "$PWD" --format json
```

After coding, run governed diff lint against the task base and inspect individual diagnostics before recording review evidence.

## Generated shared SEO checker

The workspace source repository is private. Public CI runs the generated
`scripts/vendor/workspace-seo/check.py` snapshot locally, verifies its SHA-256
against `manifest.json`, and retains the JSON report. It does not fetch a private
GitHub Action or require a PAT. The snapshot is maintained only in workspace
source; do not edit its generated bytes in this repository. Its files use LF
checkout rules so the receipt is portable. Python 3.10 or later is sufficient.

From an authorized workspace checkout, update or verify this consumer with
`python3 scripts/seo/export.py --commit <reviewed-full-sha> --target <child-root>`
(add `--check` for read-only exact-source verification). The public CI hash
check proves local integrity, not the private source identity; workspace
integration additionally compares the selected Git blob.
