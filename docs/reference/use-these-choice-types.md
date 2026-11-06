---
title: "Use these choice types in your application"
slug: /reference/use-these-choice-types
description: "How any AI application reads the 18 choice types, names the type of each choice, and tests that no choice goes without a type."
---

# Use these choice types in your application

*Your application reads one list, and it names the type of every choice it puts in front of a person.*

---

The [18 choice types](/patterns) are a public list. A person can read them on the pattern pages. An application can read them as data. Any AI application can use the list.

The list gives your application words for what a person does. These words let you design each type once, and they let you test that no choice goes without a type.

## The list

The file is at `https://choicemaking.wiki/choice-types.json`. It is built from the pattern pages, so it always says what the pages say.

```json
{
  "version": 1,
  "types": [
    {
      "id": "pick-one",
      "name": "Pick one",
      "family": "select",
      "does": "Choose one from a few.",
      "url": "https://choicemaking.wiki/patterns/pick-one"
    }
  ]
}
```

The file holds all 18 types. Each type has these five fields:

| Field | What it holds |
|---|---|
| `id` | The name your code uses |
| `name` | The name a person reads |
| `family` | One of four: `frame`, `select`, `shape`, `govern` |
| `does` | What the person does, in one line |
| `url` | The page that defines the type |

## The steps

- [ ] Read `https://choicemaking.wiki/choice-types.json`, or the standard at `https://hypercontext.wiki/standards/choice-type/v1`.
- [ ] Name the type of every choice your application puts in front of a person.
- [ ] Pin the version you read.
- [ ] Add a test that fails on a choice with no type.
- [ ] Propose a type when none fits.

To pin a version, keep a copy of the list in your repository. A new type makes a new version. The meaning of an old version does not change, so your copy stays correct.

To propose a type, [open an issue](https://github.com/garysheng/choicemaking-wiki/issues) on this wiki's repository. Say what the person does, and give one example from each of two fields. A new type gets a page here first, and then it goes on the list.

## A worked example

This example is made up. Doug runs a small holding company, and he is buying a seventh company. His team uses an application called Larkfield Desk, where an AI agent prepares the deal and Doug makes the choices.

| What Larkfield Desk puts in front of Doug | Choice type |
|---|---|
| What must this deal achieve? | [Say what you want](/patterns/say-what-you-want) |
| Which of three offer structures goes to the seller? | [Pick one](/patterns/pick-one) |
| Which of the 40 contract clauses does Doug keep? | [Accept or reject](/patterns/accept-or-reject) |
| What must change in the letter of intent? | [Mark up](/patterns/mark-up) |
| What is the top price? | [Set a value](/patterns/set-a-value) |
| When must the agent ask before it sends a number to the lender? | [Set a rule](/patterns/set-a-rule) |

The team writes these six choices in one table in its code.

```js
// choices.mjs
export const CHOICES = [
  { id: 'deal-goal', type: 'say-what-you-want' },
  { id: 'offer-structure', type: 'pick-one' },
  { id: 'contract-clauses', type: 'accept-or-reject' },
  { id: 'letter-of-intent', type: 'mark-up' },
  { id: 'top-price', type: 'set-a-value' },
  { id: 'lender-rule', type: 'set-a-rule' },
];
```

The team keeps its copy of the list in `choice-types.v1.json`. One test holds the table to that copy.

```js
// choices.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CHOICES } from './choices.mjs';

const list = JSON.parse(readFileSync(new URL('./choice-types.v1.json', import.meta.url), 'utf8'));
const ids = new Set(list.types.map((t) => t.id));

test('every choice names a type on the pinned list', () => {
  for (const choice of CHOICES) assert.ok(ids.has(choice.type), `${choice.id} has no type on the list`);
});
```

When a developer adds a choice with no type, the test fails. When a developer uses a word that is not on the list, the test fails too. Larkfield Desk does not use the other 12 types yet. That is correct, because an application supports only the types that it needs.

## Further Reading

- [The 18 choice types](/patterns): the list, the six properties of every moment, and the six parts of every moment.
- [Prior art and evidence](/patterns/prior-art): what exists already, and where it stops.
- [Reference](/reference): the other utility pages of this wiki.
