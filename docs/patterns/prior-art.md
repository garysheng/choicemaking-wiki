---
title: "Prior art and evidence"
slug: /patterns/prior-art
sidebar_position: 99
description: "What already exists, where it stops, and the evidence against this wiki's position."
---

# Prior art and evidence

*What already exists, where it stops, and the evidence against our position.*

---

## What exists

| Area | What exists | What is missing |
|---|---|---|
| Survey methods | One method per question, such as [best-worst scaling](https://en.wikipedia.org/wiki/Best%E2%80%93worst_scaling) and [card sorting](https://www.lyssna.com/blog/what-is-card-sorting) | Built for surveys, not for work |
| Task theory | McGrath's task types and Foley's task taxonomy, read through secondary sources | Not built for AI, and not tied to interfaces |
| Choice architecture | [Tools for structuring and describing choices](https://business.columbia.edu/faculty/research/beyond-nudges-tools-choice-architecture) | Consumer and policy settings |
| Human-AI research | [Levels of automation](https://bibbase.org/network/publication/parasuraman-sheridan-wickens-amodelfortypesandlevelsofhumaninteractionwithautomation-2000), [18 guidelines](https://www.microsoft.com/en-us/research/blog/guidelines-for-human-ai-interaction-design), [Shi et al.](https://arxiv.org/abs/2310.07127), a survey of 154 papers whose control methods include option selection | They type the automation, the flow or the controls, not the choice |
| AI UX patterns | [Shape of AI](https://www.shapeof.ai/patterns/variations) | Sorts patterns, with no rule for which one fits |
| Agent protocols | [MCP elicitation](https://modelcontextprotocol.io/specification/draft/client/elicitation), [AG-UI interrupts](https://docs.ag-ui.com/concepts/interrupts), [A2UI](https://a2ui.org/), [ACP](https://agentclientprotocol.com/protocol/tool-calls) | They carry the message, not the kind of choice |
| Law | [DSA Article 25](https://www.springlex.eu/en/packages/dsa/dsa-regulation/article-25/), [AI Act Article 14](https://artificialintelligenceact.eu/article/14/), GDPR consent | They say what is forbidden or required, not what is good |
| Records | [C2PA](https://opensource.contentauthenticity.org/docs/manifest/writing/assertions-actions), [CAWG identity](https://spec.c2pa.org/specifications/specifications/2.4/identity/identity.html), ISO/IEC TS 27560 for consent | Named actors and consent are recorded. C2PA 2.2's listed actions show none for choosing or approving. Version 2.4 is unchecked |

[AP2](https://ap2-protocol.org) separates advance intent from final approval, in signed records. We read that through a secondary source.

## Evidence against our position

1. **Choosing alone may not count in law.** See the table above.
2. **Approval prompts can lose attention.** Anthropic [reports 93% acceptance](https://www.anthropic.com/engineering/claude-code-auto-mode) of permission prompts and says attention fades. Many of those approvals may also be correct.
3. **People may fail at oversight.** [Green](https://arxiv.org/abs/2109.05067) argues that people cannot perform the oversight functions that policies want, and he proposes oversight by institutions.
4. **More options is not always better.** The evidence is mixed. [Parallel prototypes](https://hci.stanford.edu/publications/2010/parallel-prototyping/ParallelPrototyping2010-submitted.pdf) helped human designers, in a small study. [Other work](https://dl.acm.org/doi/10.1145/3772318.3791648) found that small panels of AI answers helped.
5. **People may dislike what works.** In [one study](https://zbucinca.github.io/assets/pdf/publications/bucinca2021trust.pdf), the designs that reduced overreliance were rated least favorably.

## What the law says about each type

This wiki separates being proud of a work from owning it in law. The [US Copyright Office report](https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf), gives this map. It is the Office's view, not a court's, and a Chinese court has gone the other way.

| Type | The Office's view |
|---|---|
| Steer | Weak. Page 20 calls revising prompts "re-rolling" the dice |
| Pick one | Weak. Page 21 says selecting an output is not authorship |
| Mark up by comment | Weak, by the same reasoning |
| Edit | Stronger, case by case (page 27) |
| Combine and Arrange | Stronger at scale. Choosing two or three elements generally fails (pages 24-25) |

So the Shape family matters most for law. Our thesis is about pride and meaning, and that is a wider claim than copyright.

## A rule on pre-selection

[NN/g](https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/), [GOV.UK](https://design-system.service.gov.uk/components/radios/) and [EU law](https://natlawreview.com/article/planet49-decision-key-takeaways) seem to conflict. They answer three different questions: how a radio button works, whether people miss a question, and what counts as consent.

Our rule: pre-select only what is reversible. Never pre-select a removal unless the item can be recovered. Never pre-select consent.

## Where this leads

We found no standard for this, so the wiki could propose one in three parts:

1. **A vocabulary:** these choice types, open for any product or agent protocol to use.
2. **A bar:** the test for a real choice, and the six parts of a moment.
3. **A record:** an open format saying which choices a person made in a work. Existing records name actors and consent, and we found none that records this. It could support the claim that a work is truly co-made.
