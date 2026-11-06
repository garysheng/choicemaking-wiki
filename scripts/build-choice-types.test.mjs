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

test('the consumer page gives the five steps as checkboxes, links real types and names no product', () => {
  const page = readFileSync(new URL('docs/reference/use-these-choice-types.md', ROOT), 'utf8');
  assert.equal(page.match(/^- \[ \] /gm)?.length, 5);
  assert.match(page, /https:\/\/choicemaking\.wiki\/choice-types\.json/);
  assert.match(page, /https:\/\/hypercontext\.wiki\/standards\/choice-type\/v1/);
  assert.doesNotMatch(page, /supersuit|helm|pluma/i);
  const ids = new Set(buildChoiceTypes(ROOT).types.map((t) => t.id));
  const linked = [...page.matchAll(/\]\(\/patterns\/([a-z-]+)\)/g)].map((m) => m[1]).filter((id) => id !== 'prior-art');
  assert.ok(linked.length > 0);
  for (const id of linked) assert.ok(ids.has(id), `${id} is not a choice type`);
  assert.match(readFileSync(new URL('sidebars.ts', ROOT), 'utf8'), /'reference\/use-these-choice-types'/);
});
