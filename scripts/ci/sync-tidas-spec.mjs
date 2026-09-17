#!/usr/bin/env node

/**
 * Synchronize the website's unversioned normative schema surface from one
 * explicit tidas-spec tree. The versioned /spec/0.1.0 output is immutable and
 * is intentionally outside this W6b projection.
 */

import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const defaultPublicRoot = path.join(repositoryRoot, 'public', 'schemas');
const defaultMetadataPath = path.join(repositoryRoot, 'content', 'tidas-spec-source.json');
const projectionFile = 'tidas_data_types_viewer.json';
const schemaFiles = [
  'tidas_contacts.json',
  'tidas_contacts_category.json',
  'tidas_data_types.json',
  'tidas_flowproperties.json',
  'tidas_flowproperties_category.json',
  'tidas_flows.json',
  'tidas_flows_elementary_category.json',
  'tidas_flows_product_category.json',
  'tidas_lciamethods.json',
  'tidas_lciamethods_category.json',
  'tidas_lifecyclemodels.json',
  'tidas_locations_category.json',
  'tidas_processes.json',
  'tidas_processes_category.json',
  'tidas_sources.json',
  'tidas_sources_category.json',
  'tidas_unitgroups.json',
  'tidas_unitgroups_category.json',
].sort();

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

function fail(message) {
  throw new Error(`[sync-tidas-spec] ${message}`);
}

async function readJson(file, label) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

async function loadSource(specRoot, specCommit, publicRoot) {
  if (!/^[0-9a-f]{40}$/u.test(specCommit || '')) fail('--spec-commit must be a 40-character lowercase commit SHA');
  const manifestPath = path.join(specRoot, 'spec-manifest.json');
  const lockPath = path.join(specRoot, 'assets', 'tidas', 'schema.lock.json');
  const manifest = await readJson(manifestPath, 'spec-manifest.json');
  const lock = await readJson(lockPath, 'schema.lock.json');
  if (manifest.manifestVersion !== 1) fail('manifestVersion must be 1');
  if (manifest.package?.name !== '@tiangong-lca/tidas-spec') fail('manifest package identity is unexpected');
  if (manifest.specVersion !== '0.1.0' || manifest.package?.version !== manifest.specVersion) fail('manifest spec version is unexpected');
  if (manifest.source?.repository !== 'https://github.com/tiangong-lca/tidas-toolkit') fail('manifest source repository is unexpected');
  if (manifest.source?.commit !== '9c0d8b1c8ceb1841074f5bc6de5fbb7fcc9318f5') fail('manifest source commit is unexpected');
  if (manifest.counts?.schemasPerLanguage !== schemaFiles.length) fail('manifest schema count is unexpected');
  const records = lock.schemaSets?.en?.files;
  if (!records || lock.schemaSets.en.fileCount !== schemaFiles.length) fail('English schema lock is incomplete');
  const lockedNames = Object.keys(records).sort();
  if (JSON.stringify(lockedNames) !== JSON.stringify(schemaFiles)) fail('English schema lock file set is unexpected');
  for (const name of schemaFiles) {
    if (!/^[0-9a-f]{64}$/u.test(records[name]?.contentSha256 || '')) fail(`schema lock hash is invalid for ${name}`);
  }
  const assets = new Map();
  for (const name of schemaFiles) {
    const file = path.join(specRoot, 'assets', 'tidas', 'schemas', name);
    const bytes = await readFile(file).catch(() => fail(`canonical schema is missing: ${name}`));
    const digest = sha256(bytes);
    if (digest !== records[name].contentSha256) fail(`canonical schema hash does not match lock: ${name}`);
    assets.set(name, { bytes, sha256: digest });
  }
  const viewerPath = path.join(publicRoot, projectionFile);
  const viewerBytes = await readFile(viewerPath).catch(() => fail(`retained viewer projection is missing: ${projectionFile}`));
  const manifestSha256 = sha256(await readFile(manifestPath));
  return {
    manifestSha256,
    manifest,
    assets,
    viewerProjectionSha256: sha256(viewerBytes),
    metadata: {
      schema: 'tiangong-lca.tidas-site-spec-source.v1',
      spec_repository: 'https://github.com/tiangong-lca/tidas-spec',
      spec_commit: specCommit,
      spec_version: manifest.specVersion,
      source_repository: manifest.source.repository,
      source_commit: manifest.source.commit,
      manifest_sha256: manifestSha256,
      schemas: schemaFiles.map((name) => ({ name, sha256: assets.get(name).sha256 })),
      viewer_projection: {
        file: projectionFile,
        normative: false,
        source: 'tidas_data_types.json',
        sha256: sha256(viewerBytes),
      },
    },
  };
}

async function validateSiteSet(publicRoot) {
  const entries = await readdir(publicRoot, { withFileTypes: true }).catch(() => fail(`public schema root is missing: ${publicRoot}`));
  const names = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
  const expected = [...schemaFiles, projectionFile].sort();
  const extras = names.filter((name) => !expected.includes(name));
  const nonFiles = entries.filter((entry) => !entry.isFile()).map((entry) => entry.name);
  if (extras.length) fail(`unexpected public schema files: ${extras.join(', ')}`);
  if (nonFiles.length) fail(`unexpected public schema entries: ${nonFiles.join(', ')}`);
  if (!names.includes(projectionFile)) fail(`retained viewer projection is missing: ${projectionFile}`);
}

async function readMetadata(metadataPath) {
  return readJson(metadataPath, 'content/tidas-spec-source.json');
}

async function assertCurrent({ source, publicRoot, metadataPath }) {
  const actualMetadata = await readMetadata(metadataPath);
  if (JSON.stringify(actualMetadata) !== JSON.stringify(source.metadata)) fail('source identity metadata is stale or malformed');
  for (const [name, expected] of source.assets) {
    const actual = await readFile(path.join(publicRoot, name)).catch(() => fail(`public schema is missing: ${name}`));
    if (!actual.equals(expected.bytes)) fail(`public schema differs from canonical source: ${name}`);
  }
  const viewer = await readFile(path.join(publicRoot, projectionFile));
  if (sha256(viewer) !== source.viewerProjectionSha256) fail('viewer projection changed without updating its explicit projection evidence');
}

export async function sync({ specRoot, specCommit, publicRoot = defaultPublicRoot, metadataPath = defaultMetadataPath, write = false, check = false } = {}) {
  if (write === check) fail('choose exactly one of --write or --check');
  if (!specRoot) fail('--spec-root is required');
  const source = await loadSource(path.resolve(specRoot || ''), specCommit, publicRoot);
  await validateSiteSet(publicRoot);
  if (check) {
    await assertCurrent({ source, publicRoot, metadataPath });
    return { mode: 'check', schemas: schemaFiles.length, projection: projectionFile, specCommit };
  }
  await mkdir(path.dirname(metadataPath), { recursive: true });
  for (const name of schemaFiles) await writeFile(path.join(publicRoot, name), source.assets.get(name).bytes);
  await writeFile(metadataPath, `${JSON.stringify(source.metadata, null, 2)}\n`);
  await assertCurrent({ source, publicRoot, metadataPath });
  return { mode: 'write', schemas: schemaFiles.length, projection: projectionFile, specCommit };
}

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const specRoot = option('--spec-root');
  const specCommit = option('--spec-commit');
  const write = process.argv.includes('--write');
  const check = process.argv.includes('--check');
  sync({ specRoot, specCommit, write, check })
    .then((result) => console.log(JSON.stringify(result)))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
