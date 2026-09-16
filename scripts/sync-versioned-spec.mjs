#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, rename, rm, stat, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pinPath = path.join(repositoryRoot, 'scripts', 'spec-pin.json');
const pin = JSON.parse(await readFile(pinPath, 'utf8'));
const packagePrefix = 'package/';
const expectedAssetPattern = /^assets\/tidas\/(?:schema\.lock\.json|schemas\/[^/]+\.json|schemas_zh\/[^/]+\.json|methodologies\/[^/]+\.ya?ml)$/u;

function fail(message) {
  throw new Error(`[versioned-spec] ${message}`);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function parseOctal(field) {
  const text = field.toString('utf8').replace(/\0.*$/u, '').trim();
  if (!text) return 0;
  if (!/^[0-7]+$/u.test(text)) fail(`invalid tar size field: ${JSON.stringify(text)}`);
  return Number.parseInt(text, 8);
}

function tarPath(name) {
  if (!name || name.includes('\\') || name.startsWith('/') || name.split('/').includes('..')) {
    fail(`unsafe archive member path: ${name || '<empty>'}`);
  }
  return name;
}

export function parseArchive(archiveBytes) {
  let tar;
  try {
    tar = gunzipSync(archiveBytes);
  } catch (error) {
    fail(`archive is not valid gzip: ${error.message}`);
  }
  const members = new Map();
  let offset = 0;
  let zeroBlocks = 0;
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    offset += 512;
    if (header.every((byte) => byte === 0)) {
      zeroBlocks += 1;
      if (zeroBlocks === 2) break;
      continue;
    }
    zeroBlocks = 0;
    const name = tarPath(header.subarray(0, 100).toString('utf8').replace(/\0.*$/u, ''));
    const type = String.fromCharCode(header[156] || 0);
    if (type !== '\0' && type !== '0') fail(`archive member ${name} is not a regular file`);
    const size = parseOctal(header.subarray(124, 136));
    if (!Number.isSafeInteger(size) || size < 0 || offset + size > tar.length) fail(`archive member ${name} has an invalid size`);
    if (members.has(name)) fail(`archive contains duplicate member ${name}`);
    members.set(name, Buffer.from(tar.subarray(offset, offset + size)));
    offset += Math.ceil(size / 512) * 512;
  }
  if (zeroBlocks < 2) fail('archive is missing the terminating tar blocks');
  if (tar.subarray(offset).some((byte) => byte !== 0)) fail('archive has trailing non-zero data');
  return members;
}

function manifestFiles(manifest) {
  if (!Array.isArray(manifest.files)) fail('spec manifest has no files array');
  const records = new Map();
  for (const record of manifest.files) {
    if (!record || typeof record.path !== 'string' || !expectedAssetPattern.test(record.path)) continue;
    if (records.has(record.path)) fail(`manifest contains duplicate asset ${record.path}`);
    if (!/^[0-9a-f]{64}$/u.test(record.sha256)) fail(`manifest asset ${record.path} has no SHA-256 digest`);
    records.set(record.path, record);
  }
  if (records.size !== pin.importedAssetFileCount) {
    fail(`manifest declares ${records.size} web assets; expected ${pin.importedAssetFileCount}`);
  }
  return records;
}

export function verifyCandidate(archiveBytes) {
  const archiveSha256 = sha256(archiveBytes);
  if (archiveSha256 !== pin.archiveSha256) fail(`archive SHA-256 ${archiveSha256} does not match pinned ${pin.archiveSha256}`);
  const members = parseArchive(archiveBytes);
  const manifestBytes = members.get(`${packagePrefix}${pin.manifestPath}`);
  if (!manifestBytes) fail(`archive is missing ${pin.manifestPath}`);
  const manifestSha256 = sha256(manifestBytes);
  if (manifestSha256 !== pin.manifestSha256) fail(`manifest SHA-256 ${manifestSha256} does not match pinned ${pin.manifestSha256}`);
  let manifest;
  try {
    manifest = JSON.parse(manifestBytes.toString('utf8'));
  } catch (error) {
    fail(`manifest is not valid JSON: ${error.message}`);
  }
  if (manifest.package?.name !== pin.package || manifest.package?.version !== pin.version) {
    fail('manifest package identity does not match the web pin');
  }
  if (manifest.source?.repository !== pin.importedSourceRepository || manifest.source?.commit !== pin.importedSourceCommit) {
    fail('manifest imported-source identity does not match the web pin');
  }
  const records = manifestFiles(manifest);
  const assets = [];
  for (const [assetPath, record] of records) {
    const member = members.get(`${packagePrefix}${assetPath}`);
    if (!member) fail(`archive is missing manifest asset ${assetPath}`);
    const digest = sha256(member);
    if (digest !== record.sha256) fail(`archive bytes for ${assetPath} do not match the manifest`);
    const outputPath = assetPath.slice('assets/tidas/'.length);
    assets.push({ assetPath, outputPath, bytes: member, sha256: digest });
  }
  assets.sort((left, right) => left.outputPath.localeCompare(right.outputPath));
  return { archiveSha256, manifestSha256, manifestBytes, manifest, assets };
}

function outputIndex(candidate) {
  return Buffer.from(`${JSON.stringify({
    schemaVersion: 1,
    package: pin.package,
    version: pin.version,
    specRevision: pin.specRevision,
    archiveSha256: candidate.archiveSha256,
    manifestSha256: candidate.manifestSha256,
    assetCount: candidate.assets.length,
    referenceClosure: candidate.assets.map(({ outputPath, sha256: digest }) => ({ path: outputPath, sha256: digest })),
    legacyBaseline: 'public/schemas',
    generatedBy: 'scripts/sync-versioned-spec.mjs',
  }, null, 2)}\n`);
}

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

function expectedOutput(candidate) {
  const files = new Map([
    ['manifest.json', candidate.manifestBytes],
    ['index.json', outputIndex(candidate)],
  ]);
  for (const asset of candidate.assets) files.set(asset.outputPath, asset.bytes);
  return files;
}

async function compareOutput(outputRoot, expected) {
  if (!(await exists(outputRoot))) fail(`versioned output is missing: ${path.relative(repositoryRoot, outputRoot)}`);
  const actual = new Map();
  async function walk(directory, relative = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const nextRelative = relative ? path.join(relative, entry.name) : entry.name;
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(full, nextRelative);
      else if (entry.isFile()) actual.set(nextRelative.split(path.sep).join('/'), await readFile(full));
      else fail(`versioned output contains a non-file entry: ${nextRelative}`);
    }
  }
  await walk(outputRoot);
  if (actual.size !== expected.size) fail(`versioned output has ${actual.size} files; expected ${expected.size}`);
  for (const [relative, bytes] of expected) {
    const current = actual.get(relative);
    if (!current || !current.equals(bytes)) fail(`versioned output differs at ${relative}`);
  }
}

async function verifyTrackedOutput(outputRoot) {
  const indexPath = path.join(outputRoot, 'index.json');
  const manifestPath = path.join(outputRoot, 'manifest.json');
  if (!(await exists(indexPath)) || !(await exists(manifestPath))) {
    fail(`versioned output is missing its index or manifest: ${path.relative(repositoryRoot, outputRoot)}`);
  }
  let index;
  try {
    index = JSON.parse(await readFile(indexPath, 'utf8'));
  } catch (error) {
    fail(`versioned output index is not valid JSON: ${error.message}`);
  }
  if (index.schemaVersion !== 1 || index.package !== pin.package || index.version !== pin.version || index.specRevision !== pin.specRevision) {
    fail('versioned output index identity does not match the web pin');
  }
  if (index.archiveSha256 !== pin.archiveSha256 || index.manifestSha256 !== pin.manifestSha256) {
    fail('versioned output index digest does not match the web pin');
  }
  const manifestBytes = await readFile(manifestPath);
  const manifestSha256 = sha256(manifestBytes);
  if (manifestSha256 !== pin.manifestSha256) fail(`tracked manifest SHA-256 ${manifestSha256} does not match pinned ${pin.manifestSha256}`);
  let manifest;
  try {
    manifest = JSON.parse(manifestBytes.toString('utf8'));
  } catch (error) {
    fail(`tracked manifest is not valid JSON: ${error.message}`);
  }
  if (manifest.package?.name !== pin.package || manifest.package?.version !== pin.version) {
    fail('tracked manifest package identity does not match the web pin');
  }
  if (manifest.source?.repository !== pin.importedSourceRepository || manifest.source?.commit !== pin.importedSourceCommit) {
    fail('tracked manifest imported-source identity does not match the web pin');
  }
  const records = manifestFiles(manifest);
  const assets = [];
  for (const [assetPath, record] of records) {
    const outputPath = assetPath.slice('assets/tidas/'.length);
    const bytes = await readFile(path.join(outputRoot, outputPath)).catch(() => fail(`tracked output is missing ${outputPath}`));
    const digest = sha256(bytes);
    if (digest !== record.sha256) fail(`tracked output bytes for ${outputPath} do not match the manifest`);
    assets.push({ assetPath, outputPath, bytes, sha256: digest });
  }
  assets.sort((left, right) => left.outputPath.localeCompare(right.outputPath));
  if (index.assetCount !== assets.length || !Array.isArray(index.referenceClosure)) {
    fail('versioned output index asset closure is incomplete');
  }
  const candidate = { archiveSha256: index.archiveSha256, manifestSha256, manifestBytes, manifest, assets };
  await compareOutput(outputRoot, expectedOutput(candidate));
  return candidate;
}

async function writeAtomic(outputRoot, files) {
  const parent = path.dirname(outputRoot);
  await mkdir(parent, { recursive: true });
  const stage = await mkdtemp(path.join(parent, '.spec-stage-'));
  const backup = `${outputRoot}.backup-${process.pid}`;
  try {
    for (const [relative, bytes] of files) {
      const destination = path.join(stage, relative);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, bytes, { flag: 'wx' });
    }
    const hadExisting = await exists(outputRoot);
    if (hadExisting) await rename(outputRoot, backup);
    try {
      await rename(stage, outputRoot);
    } catch (error) {
      if (hadExisting) await rename(backup, outputRoot);
      throw error;
    }
    if (hadExisting) await rm(backup, { recursive: true, force: true });
  } catch (error) {
    await rm(stage, { recursive: true, force: true });
    throw error;
  }
}

async function resolveArchive(explicit, { fetchRemote = true } = {}) {
  const candidates = [
    explicit,
    process.env.TIDAS_SPEC_ARCHIVE_PATH,
    path.join(repositoryRoot, '..', 'tidas-spec', 'release', pin.archiveFile),
    path.join(repositoryRoot, '..', '..', '.codex-worktrees', 'tidas-spec-1', 'release', pin.archiveFile),
  ].filter(Boolean);
  for (const candidate of candidates) if (await exists(candidate)) return readFile(candidate);
  if (!fetchRemote) return undefined;
  if (!pin.archiveUrl.startsWith('https://')) fail('archiveUrl must be an HTTPS URL');
  const response = await fetch(pin.archiveUrl);
  if (!response.ok) fail(`could not fetch pinned archive (${response.status} ${response.statusText})`);
  return Buffer.from(await response.arrayBuffer());
}

export async function run({ archivePath, verifyOnly = false, outputRoot = path.join(repositoryRoot, pin.versionedPublicRoot) } = {}) {
  if (verifyOnly && !archivePath && !process.env.TIDAS_SPEC_ARCHIVE_PATH) {
    const candidate = await verifyTrackedOutput(outputRoot);
    return {
      outputRoot,
      version: pin.version,
      archiveSha256: candidate.archiveSha256,
      manifestSha256: candidate.manifestSha256,
      assetCount: candidate.assets.length,
      mode: 'verify-tracked',
    };
  }
  const archive = await resolveArchive(archivePath, { fetchRemote: !verifyOnly });
  if (!archive && verifyOnly) {
    const candidate = await verifyTrackedOutput(outputRoot);
    return {
      outputRoot,
      version: pin.version,
      archiveSha256: candidate.archiveSha256,
      manifestSha256: candidate.manifestSha256,
      assetCount: candidate.assets.length,
      mode: 'verify-tracked',
    };
  }
  const candidate = verifyCandidate(archive);
  const files = expectedOutput(candidate);
  if (verifyOnly) await compareOutput(outputRoot, files);
  else {
    await writeAtomic(outputRoot, files);
    await compareOutput(outputRoot, files);
  }
  return {
    outputRoot,
    version: pin.version,
    archiveSha256: candidate.archiveSha256,
    manifestSha256: candidate.manifestSha256,
    assetCount: candidate.assets.length,
    mode: verifyOnly ? 'verify' : 'sync',
  };
}

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const verifyOnly = process.argv.includes('--verify') || process.argv.includes('--check');
  const archivePath = option('--archive');
  const outputRoot = option('--output-root');
  run({ archivePath, verifyOnly, outputRoot: outputRoot ? path.resolve(outputRoot) : undefined })
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
