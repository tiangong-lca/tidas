import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(read(relativePath));
const workflowSources = fs
  .readdirSync(path.join(repositoryRoot, '.github/workflows'))
  .filter((fileName) => fileName.endsWith('.yml'))
  .map((fileName) => ({ fileName, source: read(`.github/workflows/${fileName}`) }));

const expectedActions = new Map([
  ['actions/checkout', '3d3c42e5aac5ba805825da76410c181273ba90b1'],
  ['actions/upload-artifact', '043fb46d1a93c77aae656e7c1c64a875d1fc6a0a'],
  ['dtolnay/rust-toolchain', '4360b52568e2003a75bf9bc1d59f33a8e3fc893c'],
  ['pnpm/setup', '84cb39b217b10273981911c288cd62326dc7c6d2'],
]);

test('bounds Node 24 while pinning pnpm, TypeScript, and markdownlint exactly', () => {
  const packageJson = readJson('package.json');
  const edgeOne = readJson('edgeone.json');

  assert.equal(packageJson.packageManager, 'pnpm@11.24.0');
  assert.deepEqual(packageJson.engines, { node: '>=24.18.0 <25', pnpm: '11.24.0' });
  assert.equal(packageJson.devDependencies.typescript, '7.0.2');
  assert.equal(packageJson.devDependencies['markdownlint-cli2'], '0.23.2');
  assert.equal(read('.nvmrc').trim(), '24');
  assert.equal(edgeOne.nodeVersion, '24.18.0');
  assert.equal(
    packageJson.scripts.lint,
    "pnpm exec markdownlint-cli2 '**/*.md' '**/*.mdx' '#node_modules' '#content/docs/.source'",
  );
  assert.equal(
    packageJson.scripts.test,
    'node --test scripts/check-env.test.mjs scripts/content-contract.test.mjs scripts/toolchain-contract.test.mjs scripts/seo-policy.test.mjs scripts/versioned-spec.test.mjs',
  );
});

test('keeps the canonical repository on one pnpm lock and TypeScript 7 graph', () => {
  const lockfile = read('pnpm-lock.yaml');

  assert.match(lockfile, /^\s{2}markdownlint-cli2@0\.23\.2:/mu);
  assert.match(lockfile, /^\s{2}typescript@7\.0\.2:/mu);
  assert.doesNotMatch(lockfile, /^\s{2}typescript@[0-6]\./mu);
  assert.equal(fs.existsSync(path.join(repositoryRoot, 'package-lock.json')), false);
  assert.equal(fs.existsSync(path.join(repositoryRoot, 'yarn.lock')), false);
});

test('uses pnpm only across active repository automation', () => {
  const activeSources = [
    ['package.json', read('package.json')],
    ...fs
      .readdirSync(path.join(repositoryRoot, 'scripts'))
      .filter((fileName) => /\.(?:mjs|sh)$/u.test(fileName) && !fileName.endsWith('.test.mjs'))
      .map((fileName) => [`scripts/${fileName}`, read(`scripts/${fileName}`)]),
    ...fs
      .readdirSync(path.join(repositoryRoot, '.githooks'))
      .map((fileName) => [`.githooks/${fileName}`, read(`.githooks/${fileName}`)]),
    ...workflowSources.map(({ fileName, source }) => [`.github/workflows/${fileName}`, source]),
  ];

  for (const [relativePath, source] of activeSources) {
    assert.doesNotMatch(source, /(^|[\s"'`:])npx(?=$|[\s"'])/mu, relativePath);
    assert.doesNotMatch(source, /(^|[\s"'`:])npm\s+(?:exec|install|pack|publish|run|test)(?=$|\s)/mu, relativePath);
  }
});

test('pins every external action to a reviewed executable commit', () => {
  const observedActions = new Map();

  for (const { fileName, source } of workflowSources) {
    for (const match of source.matchAll(/^\s*uses:\s*([^\s#]+)/gmu)) {
      const actionRef = match[1];
      if (actionRef.startsWith('./')) continue;

      // owner/repo, plus any subdirectory path for an action that lives inside a repository.
      assert.match(actionRef, /^[a-z0-9_.-]+\/[a-z0-9_.-]+(?:\/[a-z0-9_.-]+)*@[a-f0-9]{40}$/iu, fileName);
      const separator = actionRef.lastIndexOf('@');
      const action = actionRef.slice(0, separator);
      const commit = actionRef.slice(separator + 1);
      assert.equal(commit, expectedActions.get(action), `${fileName}: unexpected ${action} commit`);
      observedActions.set(action, commit);
    }
  }

  assert.deepEqual(observedActions, expectedActions);
  assert.equal(workflowSources.some(({ source }) => source.includes('pnpm/action-setup')), false);
  assert.equal(workflowSources.some(({ source }) => source.includes('actions/setup-node')), false);
});

test('binds the pull-request workflow to the exact pnpm and Node runtime', () => {
  const setupWorkflows = workflowSources.filter(({ source }) => source.includes('uses: pnpm/setup@'));
  assert.equal(setupWorkflows.length, 1);
  assert.match(setupWorkflows[0].source, /version:\s*11\.24\.0/u);
  assert.match(setupWorkflows[0].source, /runtime:\s*node@24\.19\.0/u);
  assert.match(setupWorkflows[0].source, /install:\s*false/u);
});

// Run the real build wrapper in a disposable process. Only its external phase
// commands are intercepted; an inner pnpm test must not recursively run this test.
function traceBuild(failAt = -1, failureStatus = 19) {
  const driver = `
    import childProcess from 'node:child_process';
    import { syncBuiltinESMExports } from 'node:module';
    let index = 0;
    childProcess.spawnSync = (command, args) => {
      console.log('TRACE ' + JSON.stringify([command, ...args]));
      return { status: index++ === Number(process.argv[2]) ? JSON.parse(process.argv[3]) : 0 };
    };
    syncBuiltinESMExports();
    await import(process.argv[1]);
  `;
  const result = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', driver, pathToFileURL(path.join(repositoryRoot, 'scripts/build.mjs')).href,
      String(failAt), JSON.stringify(failureStatus)],
    {
      cwd: repositoryRoot,
      encoding: 'utf8',
      timeout: 10_000,
      env: { ...process.env, NODE_OPTIONS: '', SOURCE_COMMIT: 'a'.repeat(40), SOURCE_DATE_EPOCH: '1',
        DEPLOY_ENV: 'ci', CANONICAL_ORIGIN: 'http://localhost:3000', NEXT_PUBLIC_SEARCH_MODE: 'static' },
    },
  );
  assert.ifError(result.error);
  return { ...result, trace: result.stdout.split('\n').filter((line) => line.startsWith('TRACE '))
    .map((line) => JSON.parse(line.slice(6))) };
}

const expectedBuildTrace = [
  ['node', 'scripts/check-env.mjs'], ['node', 'scripts/sync-versioned-spec.mjs', '--verify'], ['pnpm', 'test'], ['next', 'build'],
  ['node', 'scripts/verify-out.mjs'], ['node', 'scripts/verify-site.mjs'],
];

test('documented full baselines execute tests once through the actual build wrapper', () => {
  const build = traceBuild();
  assert.equal(build.status, 0, build.stderr);
  assert.deepEqual(build.trace, expectedBuildTrace);
  assert.match(build.stdout, /BUILD PIPELINE GREEN/u);
  const baselines = [
    read('AGENTS.md').split('- canonical local baseline:')[1]?.split('- visual changes')[0],
    read('_docs/agents/repo-validation.md').split('## Default baseline')[1]?.match(/```bash([\s\S]*?)```/u)?.[1],
  ];
  for (const baseline of baselines) {
    assert.ok(baseline, 'the governed baseline must remain discoverable');
    const commands = [...baseline.matchAll(/\bpnpm (lint|typecheck|test|build)\b/gu)].map((match) => match[1]);
    assert.deepEqual(commands.filter((command) => command !== 'test'), ['lint', 'typecheck', 'build']);
    const fullTests = commands.filter((command) => command === 'test').length
      + build.trace.filter(([command, argument]) => command === 'pnpm' && argument === 'test').length;
    assert.equal(fullTests, 1, 'build already runs the full test suite');
  }
});

test('actual build stops at every failed phase and never reports green', () => {
  for (const [index] of expectedBuildTrace.entries()) {
    const build = traceBuild(index);
    assert.equal(build.status, 19, build.stderr);
    assert.deepEqual(build.trace, expectedBuildTrace.slice(0, index + 1));
    assert.doesNotMatch(build.stdout, /BUILD PIPELINE GREEN/u);
  }
  const interrupted = traceBuild(1, null);
  assert.equal(interrupted.status, 1);
  assert.deepEqual(interrupted.trace, expectedBuildTrace.slice(0, 2));
  assert.doesNotMatch(interrupted.stdout, /BUILD PIPELINE GREEN/u);
});
