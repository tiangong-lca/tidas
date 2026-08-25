import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EXPECTED_TOOLCHAIN_VERSIONS,
  readToolchainVersions,
  validateToolchainVersions,
} from './check-env.mjs';

test('accepts only the exact repository toolchain versions', () => {
  assert.deepEqual(
    validateToolchainVersions({
      node: '24.19.0',
      pnpm: '11.23.0',
      typescript: '7.0.2',
    }),
    [],
  );
  assert.deepEqual(EXPECTED_TOOLCHAIN_VERSIONS, {
    node: '24.19.0',
    pnpm: '11.23.0',
    typescript: '7.0.2',
  });
});

for (const [tool, actual] of [
  ['node', '24.18.0'],
  ['pnpm', '11.22.0'],
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
