import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildChoiceTypes } from './build-choice-types.mjs';

const ROOT = new URL('../', import.meta.url);

// The list's order is part of what it publishes: the four families, then the order of the Patterns page.
const EXPECTED = [
  ['say-what-you-want', 'frame'], ['set-what-matters', 'frame'],
  ['pick-one', 'select'], ['accept-or-reject', 'select'], ['rate', 'select'], ['rank', 'select'],
  ['sort', 'select'], ['split', 'select'], ['set-a-value', 'select'],
  ['steer', 'shape'], ['mark-up', 'shape'], ['edit', 'shape'], ['combine', 'shape'], ['arrange', 'shape'],
  ['set-a-rule', 'govern'], ['hand-off', 'govern'], ['look-further', 'govern'], ['stop', 'govern'],
];

test('every pattern page names its type, and the list holds the 18', () => {
  const list = buildChoiceTypes(ROOT);
  assert.equal(list.types.length, 18);
  assert.equal(new Set(list.types.map((t) => t.id)).size, 18);
  for (const t of list.types) {
    assert.equal(t.url, `https://choicemaking.wiki/patterns/${t.id}`);
    assert.ok(['frame', 'select', 'shape', 'govern'].includes(t.family), t.id);
    assert.ok(t.does.length > 0, t.id);
  }
});

test('the list keeps the family order, and each type sits in its family', () => {
  assert.deepEqual(buildChoiceTypes(ROOT).types.map((t) => [t.id, t.family]), EXPECTED);
});

test('a page whose choice_type is not its own file name is refused', () => {
  const root = mkdtempSync(join(tmpdir(), 'choice-types-'));
  mkdirSync(join(root, 'docs/patterns'), { recursive: true });
  writeFileSync(join(root, 'docs/patterns/rate.mdx'), '---\ntitle: "Rate"\nchoice_type: rank\nfamily: select\norder: 1\n---\n\n*Score it.*\n');
  assert.throws(() => buildChoiceTypes(pathToFileURL(`${root}/`)), /rate\.mdx names choice_type rank/);
});

test('the committed file is what the pages say', () => {
  assert.deepEqual(JSON.parse(readFileSync(new URL('static/choice-types.json', ROOT), 'utf8')), buildChoiceTypes(ROOT));
});

test('the list names no product', () => {
  assert.doesNotMatch(JSON.stringify(buildChoiceTypes(ROOT)), /supersuit|helm|pluma/i);
});
