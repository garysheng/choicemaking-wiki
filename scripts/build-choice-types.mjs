// The machine-readable list of the 18 choice types, built from the header of each pattern page, so a
// page is the one place a type is defined. Writes static/choice-types.json. `pnpm build` runs this first.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const field = (head, key) => head.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?$`, 'm'))?.[1]?.trim();

export function buildChoiceTypes(root) {
  const dir = new URL('docs/patterns/', root);
  const types = readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((f) => {
    const text = readFileSync(new URL(f, dir), 'utf8');
    const head = text.split('---')[1] ?? '';
    const id = field(head, 'choice_type');
    if (!id) throw new Error(`${f} has no choice_type`);
    if (id !== f.replace(/\.mdx$/, '')) throw new Error(`${f} names choice_type ${id}, which is not its own file name`);
    return {
      id,
      name: field(head, 'title'),
      family: field(head, 'family'),
      does: text.match(/^\*(.+)\*$/m)?.[1] ?? '',
      url: `https://choicemaking.wiki/patterns/${id}`,
      order: Number(field(head, 'order')),
    };
  }).sort((a, b) => a.order - b.order).map(({ order, ...t }) => t);
  return { version: 1, types };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = new URL('../', import.meta.url);
  writeFileSync(new URL('static/choice-types.json', root), `${JSON.stringify(buildChoiceTypes(root), null, 2)}\n`);
}
