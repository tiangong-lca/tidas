import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseArchive, run } from './sync-versioned-spec.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

function tarEntry(name, bytes, type = '0') {
  const header = Buffer.alloc(512);
  Buffer.from(name).copy(header, 0);
  Buffer.from(`${bytes.length.toString(8).padStart(11, '0')}\0`).copy(header, 124);
  header[156] = type.charCodeAt(0);
  return Buffer.concat([header, bytes, Buffer.alloc((512 - (bytes.length % 512)) % 512)]);
}

function archive(entries) {
  return gzipSync(Buffer.concat([...entries.map(([name, bytes, type]) => tarEntry(name, bytes, type)), Buffer.alloc(1024)]));
}

test('versioned public output matches its generated reference-closure index', async () => {
  const index = JSON.parse(await readFile(path.join(root, 'public/spec/0.1.0/index.json'), 'utf8'));
  const inventory = JSON.parse(await readFile(path.join(root, 'content/schema-inventory.json'), 'utf8'));
  const identity = inventory.versionedSpecs.find((entry) => entry.version === index.version);
  assert.ok(identity);
  assert.equal(index.package, '@tiangong-lca/tidas-spec');
  assert.equal(index.specRevision, identity.specRevision);
  assert.equal(index.archiveSha256, identity.archiveSha256);
  assert.equal(index.manifestSha256, identity.manifestSha256);
  assert.equal(index.assetCount, 39);
  assert.equal(index.referenceClosure.length, 39);
  for (const entry of index.referenceClosure) {
    const bytes = await readFile(path.join(root, 'public/spec/0.1.0', entry.path));
    assert.equal(digest(bytes), entry.sha256, entry.path);
  }
  assert.equal(await readFile(path.join(root, 'public/spec/0.1.0/manifest.json')).then(digest), index.manifestSha256);
});

test('tracked output verifies without requiring a remote archive', async () => {
  const result = await run({ verifyOnly: true });
  assert.equal(result.mode, 'verify-tracked');
  assert.equal(result.archiveSha256, '921a0ffa0d3703bc2d9bd8a5bbb02d327be7746177487af8245ac2788a7cf91e');
  assert.equal(result.assetCount, 39);
});

test('archive parser rejects traversal and non-regular members', () => {
  assert.throws(() => parseArchive(archive([['package/../escape.json', Buffer.from('{}')]])), /unsafe archive member path/u);
  assert.throws(() => parseArchive(archive([['package/link', Buffer.from(''), '2']])), /not a regular file/u);
});

test('archive parser preserves regular file bytes', () => {
  const members = parseArchive(archive([['package/spec-manifest.json', Buffer.from('{"ok":true}')]]));
  assert.deepEqual(members.get('package/spec-manifest.json'), Buffer.from('{"ok":true}'));
});
