#!/usr/bin/env node

/**
 * Dependency-free comparison of the site's published schemas against one
 * exact tidas-spec source tree. The report is evidence for semantic review;
 * W6b marks the report resolved only when every normative file is identical
 * and the retained viewer projection is explicitly outside the comparison.
 */

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const repoRoot = path.resolve(new URL('../..', import.meta.url).pathname);
const publicSchemaRoot = path.join(repoRoot, 'public', 'schemas');
const defaultSpecRoots = [path.join(repoRoot, 'tidas-spec'), path.join(repoRoot, '..', 'tidas-spec')];

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

function gitHead(root) {
  try {
    return execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() || null;
  } catch {
    return null;
  }
}

function escapePointer(token) {
  return String(token).replaceAll('~', '~0').replaceAll('/', '~1');
}

function joinPointer(parent, token) {
  return `${parent}/${escapePointer(token)}`;
}

function shortValue(value) {
  const encoded = JSON.stringify(value);
  if (encoded.length <= 600) return value;
  return { truncated: true, sha256: sha256(Buffer.from(encoded)), length: encoded.length };
}

function itemIdentity(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (Object.hasOwn(value, 'const')) return `const:${JSON.stringify(value.const)}`;
  if (Object.hasOwn(value, '$ref')) return `ref:${value.$ref}`;
  const properties = value.properties;
  if (properties && typeof properties === 'object' && !Array.isArray(properties)) {
    for (const name of Object.keys(properties).sort()) {
      const candidate = properties[name];
      if (candidate && typeof candidate === 'object' && Object.hasOwn(candidate, 'const')) {
        return `property-const:${name}:${JSON.stringify(candidate.const)}`;
      }
    }
    return `properties:${Object.keys(properties).sort().join(',')}`;
  }
  if (value.type && Object.keys(value).every((key) => key === 'type' || key === 'description')) return `type:${value.type}`;
  return null;
}

function category(pointer, kind) {
  const keyword = pointer.split('/').at(-1)?.replaceAll('~1', '/').replaceAll('~0', '~');
  if (kind === 'missing' || kind === 'extra') return 'structure';
  if (['description', 'title', 'examples', 'default', '$comment'].includes(keyword)) return 'documentation-or-example';
  if (['type', 'pattern', 'format', 'enum', 'const', '$ref', 'oneOf', 'anyOf', 'allOf', 'required', 'minItems', 'maxItems', 'minimum', 'maximum', 'additionalProperties', 'propertyNames'].includes(keyword)) return 'validation-constraint';
  return 'other-schema-keyword';
}

function compare(left, right, at, differences) {
  if (typeof left !== typeof right || Array.isArray(left) !== Array.isArray(right) || (left && typeof left === 'object' && right === null) || (left === null && right && typeof right === 'object')) {
    differences.push({ pointer: at || '/', kind: 'value', category: category(at, 'value'), left: shortValue(left), right: shortValue(right) });
    return;
  }
  if (left && typeof left === 'object' && !Array.isArray(left)) {
    for (const key of [...new Set([...Object.keys(left), ...Object.keys(right)])].sort()) {
      const child = joinPointer(at, key);
      if (!Object.hasOwn(left, key)) differences.push({ pointer: child, kind: 'missing', category: 'structure', left: null, right: shortValue(right[key]) });
      else if (!Object.hasOwn(right, key)) differences.push({ pointer: child, kind: 'extra', category: 'structure', left: shortValue(left[key]), right: null });
      else compare(left[key], right[key], child, differences);
    }
    return;
  }
  if (Array.isArray(left)) {
    const keyword = at.split('/').at(-1);
    if (keyword === 'enum') {
      const leftSet = new Map(left.map((value) => [JSON.stringify(value), value]));
      const rightSet = new Map(right.map((value) => [JSON.stringify(value), value]));
      for (const key of [...leftSet.keys()].filter((key) => !rightSet.has(key)).sort()) differences.push({ pointer: at, kind: 'extra', category: 'structure', left: leftSet.get(key), right: null });
      for (const key of [...rightSet.keys()].filter((key) => !leftSet.has(key)).sort()) differences.push({ pointer: at, kind: 'missing', category: 'structure', left: null, right: rightSet.get(key) });
      return;
    }
    if (keyword === 'required') {
      const leftSet = new Set(left);
      const rightSet = new Set(right);
      for (const value of [...leftSet].filter((item) => !rightSet.has(item)).sort()) differences.push({ pointer: at, kind: 'extra', category: 'structure', left: value, right: null });
      for (const value of [...rightSet].filter((item) => !leftSet.has(item)).sort()) differences.push({ pointer: at, kind: 'missing', category: 'structure', left: null, right: value });
      return;
    }
    if (['oneOf', 'anyOf', 'allOf'].includes(keyword)) {
      const index = (values) => new Map(values.map((value) => [itemIdentity(value) || JSON.stringify(value), value]));
      const leftIndex = index(left);
      const rightIndex = index(right);
      for (const key of [...new Set([...leftIndex.keys(), ...rightIndex.keys()])].sort()) {
        const child = joinPointer(at, key);
        if (!leftIndex.has(key)) differences.push({ pointer: child, kind: 'missing', category: 'structure', left: null, right: shortValue(rightIndex.get(key)) });
        else if (!rightIndex.has(key)) differences.push({ pointer: child, kind: 'extra', category: 'structure', left: shortValue(leftIndex.get(key)), right: null });
        else compare(leftIndex.get(key), rightIndex.get(key), child, differences);
      }
      return;
    }
    if (left.length !== right.length) differences.push({ pointer: at || '/', kind: 'value', category: 'other-schema-keyword', left: left.length, right: right.length });
    left.forEach((value, index) => compare(value, right[index], joinPointer(at, index), differences));
    return;
  }
  if (left !== right) differences.push({ pointer: at || '/', kind: 'value', category: category(at, 'value'), left: shortValue(left), right: shortValue(right) });
}

async function resolveSpecRoot(argument) {
  const candidates = argument ? [path.resolve(argument)] : defaultSpecRoots;
  for (const candidate of candidates) {
    try {
      await readFile(path.join(candidate, 'assets', 'tidas', 'schemas', 'tidas_flows.json'));
      return candidate;
    } catch {}
  }
  throw new Error('no tidas-spec root found; pass --spec-root');
}

async function buildReport(specRoot, siteCommit = null) {
  const specSchemaRoot = path.join(specRoot, 'assets', 'tidas', 'schemas');
  const names = (await (await import('node:fs/promises')).readdir(publicSchemaRoot)).filter((name) => name.endsWith('.json')).sort();
  const specNames = (await (await import('node:fs/promises')).readdir(specSchemaRoot)).filter((name) => name.endsWith('.json')).sort();
  const differences = [];
  const files = [];
  for (const name of [...new Set([...names, ...specNames])].sort()) {
    const publicPath = path.join(publicSchemaRoot, name);
    const specPath = path.join(specSchemaRoot, name);
    if (!names.includes(name)) {
      differences.push({ pointer: `/files/${escapePointer(name)}`, kind: 'missing', category: 'structure', left: null, right: name });
      files.push({ name, status: 'missing-site' });
      continue;
    }
    if (!specNames.includes(name)) {
      const status = name === 'tidas_data_types_viewer.json' ? 'viewer-projection' : 'extra-site';
      files.push({ name, status });
      if (status === 'extra-site') differences.push({ pointer: `/files/${escapePointer(name)}`, kind: 'extra', category: 'structure', left: name, right: null });
      continue;
    }
    const left = await readJson(publicPath);
    const right = await readJson(specPath);
    const start = differences.length;
    compare(left, right, `/files/${escapePointer(name)}`, differences);
    files.push({ name, status: differences.length === start ? 'identical' : 'different', siteSha256: sha256(await readFile(publicPath)), specSha256: sha256(await readFile(specPath)), differenceCount: differences.length - start });
  }
  const manifestPath = path.join(specRoot, 'spec-manifest.json');
  let manifest = {};
  try { manifest = await readJson(manifestPath); } catch {}
  const packageInfo = manifest.package || {};
  const disposition = differences.length === 0
    ? {
        status: 'resolved',
        owner: 'workspace-user-decision-and-tidas-site-owner',
        note: 'User decision #1240 establishes the original tidas-tools schema as semantic authority; tidas-spec is the controlled carrier, normative site assets match exactly, and the retained viewer projection is explicitly non-normative.',
      }
    : {
        status: 'unresolved',
        owner: 'tidas-spec-content-owner-and-tidas-site-owner',
        note: 'W6a requires semantic review; this generated ledger is evidence, not approval.',
      };
  return {
    reportVersion: 1,
    source: { siteRepository: 'tiangong-lca/tidas', siteCommit: siteCommit || gitHead(repoRoot), specRepository: 'tiangong-lca/tidas-spec', specCommit: gitHead(specRoot), specVersion: packageInfo.version || manifest.specVersion || null, manifestSha256: await readFile(manifestPath).then(sha256).catch(() => null) },
    paths: { site: 'public/schemas', spec: 'assets/tidas/schemas' },
    summary: { siteFiles: names.length, specFiles: specNames.length, identicalFiles: files.filter((file) => file.status === 'identical').length, differentFiles: files.filter((file) => file.status === 'different').length, viewerProjectionFiles: files.filter((file) => file.status === 'viewer-projection').length, differenceCount: differences.length, unresolvedCount: differences.length },
    files,
    differences,
    disposition,
  };
}

const args = process.argv.slice(2);
const valueFor = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
const specRoot = await resolveSpecRoot(valueFor('--spec-root'));
const report = await buildReport(specRoot, valueFor('--site-commit'));
const reportPath = valueFor('--report');
const checkPath = valueFor('--check');
if (checkPath) {
  const expected = JSON.parse(await readFile(path.resolve(checkPath), 'utf8'));
  if (JSON.stringify(expected) !== JSON.stringify(report)) throw new Error(`comparison report is stale: ${checkPath}`);
}
if (reportPath) await writeFile(path.resolve(reportPath), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.summary));
