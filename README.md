---
title: TIDAS README
docType: guide
scope: repo
status: active
authoritative: false
owner: tidas
language: en
whenToUse:
  - when onboarding to the TIDAS spec site repository
  - when checking public setup and publish commands
whenToUpdate:
  - when public setup, versioning, or publish commands change
  - when the README no longer reflects the current release workflow
checkPaths:
  - README.md
  - package.json
  - .github/workflows/publish-docs.yml
  - next.config.ts
  - edgeone.json
  - crowdin.yml
  - content/docs/**
lastReviewedAt: "2026-08-23"
lastReviewedCommit: 296ecc7
lastReviewedNote: "Reviewed for Fumadocs migration (Next.js 16 + TS7 static site): docs/ and i18n/ trees migrated to content/docs dot-locale convention; ja locale dropped, de/fr scaffolded; site runtime is Next.js App Router with app/lib/components; EdgeOne Makers owns build+deploy via Git integration; legacy Docusaurus infrastructure removed."
---

Public documentation for the [TIDAS](https://tidas.tiangong.earth) (TianGong LCA Data System), built with
[Next.js 16](https://nextjs.org) + [Fumadocs 16](https://fumadocs.dev) + TypeScript 7 (native),
exported as a fully static site and published by [EdgeOne Makers](https://pages.edgeone.ai)
(Git integration).

## Locales

- `zh`（默认，内容源）— `/zh/docs/...`
- `en` — `/en/docs/...`
- `de` / `fr` — scaffolded from en, frontmatter translated, body pending Crowdin full pass

Source files follow the dot-locale convention: `page.mdx`（中文）、`page.en.mdx`、`page.de.mdx`、`page.fr.mdx`.
The former `ja` locale was dropped during migration; all four current locales generate independently
(`fallbackLanguage: null`).

## Development

Requires Node.js ≥ 24.18.0 and pnpm 11.22.0 (`packageManager` enforced). `.nvmrc` pins Node 24.

```bash
pnpm install

# 本地开发（next dev）
pnpm dev

# 契约构建（环境契约校验 → next build → out/ 结构断言）
DEPLOY_ENV=ci \
CANONICAL_ORIGIN=http://localhost:3000 \
NEXT_PUBLIC_SEARCH_MODE=static \
pnpm build

pnpm typecheck   # next typegen && tsc --noEmit（TypeScript 7 原生）
pnpm lint        # markdownlint（md + mdx）
```

## Build contract

The build is environment-contract driven (`scripts/build.mjs`):

| 变量 | 约束 |
| --- | --- |
| `SOURCE_COMMIT` | 40 位 SHA；缺省时由 `git rev-parse HEAD` 推导 |
| `SOURCE_DATE_EPOCH` | commit 时间戳（unix 秒）；缺省由 git 推导 |
| `DEPLOY_ENV` | `ci` / `preview` / `production`（决定 noindex、robots、搜索后端） |
| `CANONICAL_ORIGIN` | 生产固定 `https://tidas.tiangong.earth` |
| `NEXT_PUBLIC_SEARCH_MODE` | `static`（ci/preview）或 `algolia`（production） |

`pnpm build` 产出 `out/`（静态导出）并通过 `scripts/verify-out.mjs` 的 13 项契约断言
（search-records/llms 的 commit 戳与 digest、sitemap 数量、无 ja 泄漏、内部路径零泄漏、
OG 图数量、html lang 映射、robots 按 DEPLOY_ENV 分形）。

## Publishing

EdgeOne Makers Git integration owns build + deploy (GitHub Actions runs validation only).
See `.github/workflows/publish-docs.yml` for the PR validate gate.

## Repository layout

```text
app/            Next.js App Router（[lang] 四语言路由 + 系统端点）
components/     UI components（search dialog、TidasImage、JsonSchemaViewer、MDX components）
content/docs/   文档源（dot-locale 契约）
lib/            i18n / source loader / 分类常量
public/         静态资产（img locale 目录、schemas、logo 双色）
scripts/        build.mjs / check-env.mjs / verify-out.mjs / migrate.mjs（一次性迁移工具）
```

## Migration notes

This site was migrated from Docusaurus 3.8.1 in August 2026 following the
[workspace migration guide](https://github.com/tiangong-lca/workspace/blob/main/_docs/reference/docusaurus-to-fumadocs-migration-guide.md).
The legacy `docs/` + `i18n/` trees were removed after content-check verification.
Internal underscore-prefixed documents (`_todo`, `_reference-package`, `_tidas-eilcd` etc.)
were excluded from the public tree during migration.
