#!/usr/bin/env node
/**
 * Fail-closed build environment contract for the static documentation site.
 * 缺失/非法输入直接失败；SOURCE_COMMIT/SOURCE_DATE_EPOCH 允许从 git 推导。
 */
import { execSync } from 'node:child_process';

const errors = [];
const info = [];

function gitOut(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

// --- SOURCE_COMMIT：40 位 SHA ---
let sourceCommit = process.env.SOURCE_COMMIT;
if (!sourceCommit) {
  sourceCommit = gitOut('git rev-parse HEAD');
  if (sourceCommit) info.push(`SOURCE_COMMIT derived from git: ${sourceCommit}`);
}
if (!sourceCommit || !/^[0-9a-f]{40}$/i.test(sourceCommit)) {
  errors.push(`SOURCE_COMMIT invalid: ${JSON.stringify(sourceCommit ?? null)} (need 40-hex sha)`);
}

// --- SOURCE_DATE_EPOCH：unix 秒 ---
let epoch = process.env.SOURCE_DATE_EPOCH;
if (!epoch) {
  epoch = gitOut('git log -1 --format=%ct');
  if (epoch) info.push(`SOURCE_DATE_EPOCH derived from git: ${epoch}`);
}
if (!epoch || !/^\d+$/.test(String(epoch))) {
  errors.push(`SOURCE_DATE_EPOCH invalid: ${JSON.stringify(epoch ?? null)} (need unix seconds)`);
}

// --- DEPLOY_ENV ---
const deployEnv = process.env.DEPLOY_ENV;
if (!['ci', 'preview', 'production'].includes(deployEnv)) {
  errors.push(`DEPLOY_ENV invalid: ${JSON.stringify(deployEnv ?? null)} (need ci|preview|production)`);
}

// --- CANONICAL_ORIGIN ---
const origin = process.env.CANONICAL_ORIGIN;
if (!origin || !/^https?:\/\/[^/]+$/.test(origin)) {
  errors.push(`CANONICAL_ORIGIN invalid: ${JSON.stringify(origin ?? null)} (need origin without trailing path)`);
} else if (deployEnv === 'production' && origin !== 'https://tidas.tiangong.earth') {
  errors.push(`CANONICAL_ORIGIN must be https://tidas.tiangong.earth in production, got ${origin}`);
}

// --- SEARCH_MODE ---
const searchMode = process.env.NEXT_PUBLIC_SEARCH_MODE;
if (!['static', 'algolia'].includes(searchMode)) {
  errors.push(`NEXT_PUBLIC_SEARCH_MODE invalid: ${JSON.stringify(searchMode ?? null)} (need static|algolia)`);
}
// tidas 无 Algolia 应用：static 搜索在全环境可用；algolia 模式仅在显式配置后启用
if (searchMode === 'algolia' && deployEnv !== 'production') {
  errors.push(`SEARCH_MODE/DEPLOY_ENV mismatch: algolia with ${deployEnv} (algolia only for production)`);
}

// --- Algolia 公共变量 ---
const algoliaPublic = {
  NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
};
if (searchMode === 'static') {
  for (const [name, value] of Object.entries(algoliaPublic)) {
    if (value) errors.push(`NEXT_PUBLIC_SEARCH_MODE=static but ${name} is set`);
  }
} else if (searchMode === 'algolia') {
  if (!algoliaPublic.NEXT_PUBLIC_ALGOLIA_APP_ID) {
    errors.push('NEXT_PUBLIC_ALGOLIA_APP_ID required in algolia mode');
  }
  if (!algoliaPublic.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY) {
    errors.push('NEXT_PUBLIC_ALGOLIA_SEARCH_KEY required in algolia mode');
  }
  if (algoliaPublic.NEXT_PUBLIC_ALGOLIA_INDEX_NAME !== 'tiangong-lca-docs') {
    errors.push(
      `NEXT_PUBLIC_ALGOLIA_INDEX_NAME must be 'tiangong-lca-docs', got ${JSON.stringify(
        algoliaPublic.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? null,
      )}`,
    );
  }
}

// Tool versions are emitted as durable EdgeOne build evidence.
info.push(`node: ${process.version}`);
try {
  info.push(`pnpm: ${execSync('pnpm --version').toString().trim()}`);
} catch {
  info.push('pnpm: unavailable');
}

for (const line of info) console.log(`[check-env] ${line}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`[check-env] FAIL ${error}`);
  process.exit(1);
}
console.log(
  `[check-env] OK commit=${sourceCommit} epoch=${epoch} env=${deployEnv} origin=${origin} search=${searchMode}`,
);
