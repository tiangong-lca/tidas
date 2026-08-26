import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EXPECTED_TOOLCHAIN_VERSIONS,
  readToolchainVersions,
  resolvePnpmInvocation,
  validateToolchainVersions,
} from './check-env.mjs';

test('resolves Corepack and pnpm/setup executables without a command shell', () => {
  const exists = () => true;
  assert.deepEqual(
    resolvePnpmInvocation('/tooling/pnpm.cjs', {
      execPath: '/runtime/node',
      fileExists: exists,
      platform: 'linux',
    }),
    { command: '/runtime/node', prefixArgs: ['/tooling/pnpm.cjs'] },
  );
  assert.deepEqual(
    resolvePnpmInvocation('pnpm', {
      fileExists: (candidate) => candidate === '/home/runner/setup-pnpm/pnpm',
      platform: 'linux',
      pnpmHome: '/home/runner/setup-pnpm',
    }),
    { command: '/home/runner/setup-pnpm/pnpm', prefixArgs: [] },
  );
  assert.deepEqual(
    resolvePnpmInvocation('pnpm', {
      fileExists: (candidate) => candidate === 'C:\\setup-pnpm\\pnpm.exe',
      platform: 'win32',
      pnpmHome: 'C:\\setup-pnpm',
    }),
    { command: 'C:\\setup-pnpm\\pnpm.exe', prefixArgs: [] },
  );
});

test('rejects missing, nonexistent, and command-shell pnpm shims', () => {
  const exists = () => true;
  assert.throws(() => resolvePnpmInvocation(undefined, { fileExists: exists }), /missing/);
  assert.throws(
    () => resolvePnpmInvocation('/missing/pnpm', { fileExists: () => false }),
    /not a readable file/,
  );
  assert.throws(
    () =>
      resolvePnpmInvocation('C:\\tooling\\pnpm.cmd', {
        fileExists: exists,
        platform: 'win32',
      }),
    /supported pnpm entry/,
  );
});

test('accepts only the exact repository toolchain versions', () => {
  assert.deepEqual(
    validateToolchainVersions({
      node: '24.19.0',
      pnpm: '11.24.0',
      typescript: '7.0.2',
    }),
    [],
  );
  assert.deepEqual(EXPECTED_TOOLCHAIN_VERSIONS, {
    node: '24.19.0',
    pnpm: '11.24.0',
    typescript: '7.0.2',
  });
});

for (const [tool, actual] of [
  ['node', '24.18.0'],
  ['pnpm', '11.23.0'],
  ['typescript', '6.9.0'],
  ['pnpm', 'unavailable'],
]) {
  test(`rejects ${tool} version ${actual}`, () => {
    const versions = { ...EXPECTED_TOOLCHAIN_VERSIONS, [tool]: actual };
    assert.deepEqual(validateToolchainVersions(versions), [
      `${tool} version mismatch: expected ${EXPECTED_TOOLCHAIN_VERSIONS[tool]}, got ${actual}`,
    ]);
  });
}

test('the installed repository toolchain satisfies the same contract', () => {
  assert.deepEqual(validateToolchainVersions(readToolchainVersions()), []);
});
