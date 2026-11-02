import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { buildTaxonomy } from '../lib/schema-taxonomy.ts';

const entry = (id, level, label = id) => ({ id, level, label });
const ids = (items) => items.map((item) => item.id);
const assetEntries = (name) => JSON.parse(readFileSync(
  new URL(`../public/schemas/${name}.json`, import.meta.url), 'utf8',
)).oneOf.map(({ properties }) => ({
  id: (properties['@catId'] ?? properties['@classId']).const,
  level: Number(properties['@level'].const),
  label: properties['#text'].const,
}));

test('the published elementary vocabulary keeps late air and soil entries under their exact parents', () => {
  const source = assetEntries('tidas_flows_elementary_category');
  const data = buildTaxonomy(source);
  const byId = new Map(data.flat.map((item) => [item.id, item]));
  assert.equal(data.flat.length, 65);
  assert.deepEqual(ids(data.flat), ids(source));
  assert.deepEqual(ids(data.roots), ['1', '2', '3', '4']);
  assert.equal(data.maxLevel, 2);
  assert.deepEqual(ids(byId.get('1').children), ['1.1', '1.2', '1.3', '1.4']);
  assert.deepEqual(ids(byId.get('1.3').children), Array.from({ length: 13 }, (_, i) => `1.3.${i + 1}`));
  for (let i = 6; i <= 13; i++) {
    assert.deepEqual(byId.get(`1.3.${i}`).parents, ['Emissions', 'Emissions to air']);
  }
  assert.deepEqual(byId.get('1.4').parents, ['Emissions']);
  assert.deepEqual(ids(byId.get('1.4').children), ['1.4.1']);
  assert.deepEqual(byId.get('1.4.1').parents, ['Emissions', 'Emissions to industrial soil']);
  assert.deepEqual(byId.get('4').children, []);
});

test('dotted paths resolve children before parents while preserving input and sibling order', () => {
  const source = [entry('1.2.1', 2), entry('2', 0), entry('1.2', 1), entry('1.1', 1), entry('1', 0)];
  source.forEach(Object.freeze);
  Object.freeze(source);
  const data = buildTaxonomy(source);
  assert.deepEqual(ids(data.flat), ids(source));
  assert.deepEqual(ids(data.roots), ['2', '1']);
  assert.deepEqual(ids(data.roots[1].children), ['1.2', '1.1']);
  assert.deepEqual(data.flat[0].parents, ['1', '1.2']);
  assert.equal(data.flat[0].key, 'root/0:1:4/1:1.2:2/2:1.2.1:0');
  assert.deepEqual(buildTaxonomy(source), data, 'Repeated construction has deterministic keys and ancestry');
});

test('missing dotted parents remain roots instead of borrowing an unrelated preceding branch', () => {
  const data = buildTaxonomy([entry('1', 0), entry('2', 0), entry('2.1', 1), entry('1.9.1', 2)]);
  assert.deepEqual(ids(data.roots), ['1', '2', '1.9.1']);
  assert.deepEqual(data.flat[3].parents, []);
  assert.deepEqual(data.flat[2].children, []);
});

test('duplicate parent identifiers are ambiguous and every duplicate row survives', () => {
  const source = [entry('1', 0), entry('1.2', 1, 'first'), entry('1.2', 1, 'second'), entry('1.2.1', 2)];
  const data = buildTaxonomy(source);
  assert.equal(data.flat.length, source.length);
  assert.equal(new Set(data.flat.map((item) => item.key)).size, source.length);
  assert.deepEqual(ids(data.roots), ['1', '1.2.1']);
  assert.deepEqual(data.roots[0].children.map((item) => item.label), ['first', 'second']);
  assert.deepEqual(data.flat[3].parents, []);
  assert.ok(data.flat.slice(1, 3).every((item) => item.children.length === 0));
});

test('a taxonomy is admitted to dotted resolution only when every ID depth matches its level', () => {
  // One mismatched record keeps the entire vocabulary on the established ordered-level path.
  const data = buildTaxonomy([entry('1', 0), entry('2', 0), entry('2.1', 1), entry('1.9', 2)]);
  assert.deepEqual(ids(data.roots), ['1', '2']);
  assert.deepEqual(data.flat[3].parents, ['2', '2.1']);
});

test('the published product vocabulary retains 0 → 01 → 011 and its leading-zero leaf path', () => {
  const source = assetEntries('tidas_flows_product_category');
  const data = buildTaxonomy(source);
  const byId = new Map(data.flat.map((item) => [item.id, item]));
  assert.equal(data.flat.length, 4586);
  assert.deepEqual(data.flat.map(({ id, level, label }) => ({ id, level, label })), source);
  assert.deepEqual(ids(data.roots), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
  assert.deepEqual(ids(byId.get('0').children), ['01', '02', '03', '04']);
  assert.ok(byId.get('01').children.includes(byId.get('011')));
  assert.deepEqual(byId.get('011').parents, [
    'Agriculture, forestry and fishery products',
    'Products of agriculture, horticulture and market gardening',
  ]);
  assert.deepEqual(ids(byId.get('0111').children), ['01111', '01112']);
  assert.equal(byId.get('01111').label, 'Wheat, seed');
  assert.equal(byId.get('01111').key, 'root/0:0:0/1:01:1/2:011:2/3:0111:3/4:01111:4');
});

test('the published process vocabulary retains alphabetic sections with numeric descendants', () => {
  const source = assetEntries('tidas_processes_category');
  const data = buildTaxonomy(source);
  const byId = new Map(data.flat.map((item) => [item.id, item]));
  assert.equal(data.flat.length, 830);
  assert.deepEqual(data.flat.map(({ id, level, label }) => ({ id, level, label })), source);
  assert.deepEqual(ids(data.roots), 'ABCDEFGHIJKLMNOPQRSTUV'.split(''));
  assert.deepEqual(ids(byId.get('A').children), ['01', '02', '03']);
  assert.ok(byId.get('01').children.includes(byId.get('011')));
  assert.deepEqual(byId.get('011').parents, [
    'Agriculture, forestry and fishing',
    'Crop and animal production, hunting and related service activities',
  ]);
  assert.equal(byId.get('011').key, 'root/0:A:0/1:01:1/2:011:2');
  assert.deepEqual(ids(byId.get('B').children), ['05', '06', '07', '08', '09']);
  assert.deepEqual(byId.get('05').parents, ['Mining and quarrying']);
  assert.equal(byId.get('05').key, 'root/0:B:57/1:05:58');
});

test('undotted sibling and root transitions do not retain the previous branch ancestry', () => {
  const data = buildTaxonomy([
    entry('A', 0), entry('01', 1), entry('011', 2), entry('02', 1),
    entry('B', 0), entry('05', 1), entry('051', 2),
  ]);
  assert.deepEqual(ids(data.flat), ['A', '01', '011', '02', 'B', '05', '051']);
  assert.deepEqual(ids(data.roots), ['A', 'B']);
  assert.deepEqual(ids(data.roots[0].children), ['01', '02']);
  assert.deepEqual(data.flat[3].parents, ['A']);
  assert.deepEqual(ids(data.roots[1].children), ['05']);
  assert.deepEqual(data.flat[6].parents, ['B', '05']);
  assert.equal(data.flat[3].key, 'root/0:A:0/1:02:3');
  assert.equal(data.flat[6].key, 'root/0:B:4/1:05:5/2:051:6');
});
