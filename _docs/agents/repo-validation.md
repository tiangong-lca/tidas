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
  - scripts/build.mjs
  - scripts/verify-out.mjs
  - scripts/verify-site.mjs
  - content/docs/**
  - public/schemas/**
  - app/**
  - components/**
  - .github/workflows/**
lastReviewedAt: 2026-08-23
lastReviewedCommit: 5341f69234cdae9b5d01a444c2fee2fe11225cb0
lastReviewedNote: "Reviewed for Issue #48 system identity, neutral UI, tabular Schema alignment, accessibility, localization, metadata, and visual gates."
related:
  - ../../AGENTS.md
  - ../../.docpact/config.yaml
  - ./repo-architecture.md
  - ../../README.md
---

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

`pnpm build` runs the environment contract, static export, output contract, and site-quality gate. A green compile without the final gates is incomplete proof.

## Change matrix

| Change | Required proof |
| --- | --- |
| prose or navigation | lint, full build, generated-link gate, spot-check affected locale pages |
| German or French translation | lint, full build, compare source meaning, verify no English body copy remains, inspect navigation and search in that locale |
| site UI or responsive layout | baseline plus browser screenshots at 390, 1440, 1633, 2048, and 2560 widths, light and dark themes, keyboard focus, no horizontal overflow |
| root or language behavior | visit `/` and all locale homes; switch from `/` to another language; verify there is no redirect and URLs remain within the current route model |
| Schema explorer | baseline plus generic structure and taxonomy interaction checks, raw download, error state, search cap, lazy expansion, and the budgets below |
| media | full build image gate plus light/dark browser inspection |
| metadata, sitemap, robots, search, or OG | inspect generated HTML/endpoints and verify canonical, alternate, locale, commit, and environment consistency |
| publication config | baseline with the same environment variables configured in EdgeOne; inspect `edgeone.json` and PR validation workflow |
| repository docs or Docpact | strict config validation, coverage, list-rules, route, governed diff lint, and review marks when required |

## Static site gates

`scripts/verify-out.mjs` checks the build/output contract, including system endpoints, commit/digest evidence, locale counts, language attributes, robots behavior, and internal-path exclusion.

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
