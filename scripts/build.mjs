#!/usr/bin/env node
/**
 * v4 §6.2 构建包装器：解析/校验环境契约 → next build → verify-out。
 *
 * EdgeOne 不注入 SOURCE_COMMIT/SOURCE_DATE_EPOCH，这里按契约从 git 推导并
 * 导出到构建环境；DEPLOY_ENV/CANONICAL_ORIGIN/NEXT_PUBLIC_SEARCH_MODE
 * 必须显式提供（对应 EdgeOne 环境变量矩阵 / CI fixture），不做静默默认。
 */
import { execSync, spawnSync } from 'node:child_process';

function gitOut(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

const env = { ...process.env };

if (!env.SOURCE_COMMIT) {
  const derived = gitOut('git rev-parse HEAD');
  if (!derived) {
    console.error('[build] SOURCE_COMMIT not set and git rev-parse HEAD failed');
    process.exit(1);
  }
  env.SOURCE_COMMIT = derived;
}
if (!env.SOURCE_DATE_EPOCH) {
  const derived = gitOut('git log -1 --format=%ct');
  if (!derived) {
    console.error('[build] SOURCE_DATE_EPOCH not set and git log failed');
    process.exit(1);
  }
  env.SOURCE_DATE_EPOCH = derived;
}

for (const name of ['DEPLOY_ENV', 'CANONICAL_ORIGIN', 'NEXT_PUBLIC_SEARCH_MODE']) {
  if (!env[name]) {
    console.error(
      `[build] ${name} is required (set it explicitly; no silent defaults). ` +
        'Example: DEPLOY_ENV=ci CANONICAL_ORIGIN=http://localhost:3000 NEXT_PUBLIC_SEARCH_MODE=static',
    );
    process.exit(1);
  }
}

const steps = [
  ['check-env', ['node', 'scripts/check-env.mjs']],
  ['build', ['next', 'build']],
  ['verify-out', ['node', 'scripts/verify-out.mjs']],
  ['verify-site', ['node', 'scripts/verify-site.mjs']],
];

for (const [label, command] of steps) {
  console.log(`\n[build] === ${label} ===`);
  const result = spawnSync(command[0], command.slice(1), {
    stdio: 'inherit',
    env,
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    console.error(`[build] step ${label} failed with exit ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

console.log('\n[build] BUILD PIPELINE GREEN');
