import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cp, mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { sync } from './sync-tidas-spec.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sourcePublicRoot = path.join(repositoryRoot, 'public', 'schemas');
const sourceSchemaFiles = (await readdir(sourcePublicRoot)).filter((name) => name !== 'tidas_data_types_viewer.json').sort();
const sourceCommit = 'a'.repeat(40);
const sourceToolsCommit = '9c0d8b1c8ceb1841074f5bc6de5fbb7fcc9318f5';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

async function makeFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'tidas-site-sync-'));
  const specRoot = path.join(root, 'spec');
  const specSchemaRoot = path.join(specRoot, 'assets', 'tidas', 'schemas');
  const publicRoot = path.join(root, 'public', 'schemas');
  const metadataPath = path.join(root, 'content', 'tidas-spec-source.json');
  await mkdir(specSchemaRoot, { recursive: true });
  await mkdir(publicRoot, { recursive: true });
  const files = {};
  for (const name of sourceSchemaFiles) {
    const bytes = await readFile(path.join(sourcePublicRoot, name));
    await writeFile(path.join(specSchemaRoot, name), bytes);
    await writeFile(path.join(publicRoot, name), bytes);
    files[name] = { contentSha256: sha256(bytes) };
  }
  await cp(path.join(sourcePublicRoot, 'tidas_data_types_viewer.json'), path.join(publicRoot, 'tidas_data_types_viewer.json'));
  await writeFile(path.join(specRoot, 'assets', 'tidas', 'schema.lock.json'), json({ schemaSets: { en: { fileCount: sourceSchemaFiles.length, files } } }));
  await writeFile(path.join(specRoot, 'spec-manifest.json'), json({
    manifestVersion: 1,
    package: { name: '@tiangong-lca/tidas-spec', version: '0.1.0' },
    specVersion: '0.1.0',
    source: { repository: 'https://github.com/tiangong-lca/tidas-toolkit', commit: sourceToolsCommit },
    counts: { schemasPerLanguage: sourceSchemaFiles.length },
  }));
  return { root, specRoot, publicRoot, metadataPath };
}

test('canonical sync writes and checks normative assets with projection evidence', async () => {
  const fixture = await makeFixture();
  const result = await sync({ ...fixture, specCommit: sourceCommit, write: true });
  assert.equal(result.schemas, 18);
  assert.equal((await sync({ ...fixture, specCommit: sourceCommit, check: true })).mode, 'check');
  const identity = JSON.parse(await readFile(fixture.metadataPath, 'utf8'));
  assert.equal(identity.spec_commit, sourceCommit);
  assert.equal(identity.viewer_projection.normative, false);
});

test('canonical sync fails closed on hash drift and unexpected files', async () => {
  const fixture = await makeFixture();
  await sync({ ...fixture, specCommit: sourceCommit, write: true });
  await writeFile(path.join(fixture.publicRoot, 'tidas_flows.json'), '{}\n');
  await writeFile(path.join(fixture.publicRoot, 'unexpected.json'), '{}\n');
  await assert.rejects(() => sync({ ...fixture, specCommit: sourceCommit, check: true }), /unexpected public schema files/u);
});

test('canonical sync fails closed on invalid manifest identity', async () => {
  const fixture = await makeFixture();
  const manifestPath = path.join(fixture.specRoot, 'spec-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.package.name = '@invalid/tidas-spec';
  await writeFile(manifestPath, json(manifest));
  await assert.rejects(() => sync({ ...fixture, specCommit: sourceCommit, check: true }), /manifest package identity/u);
});
