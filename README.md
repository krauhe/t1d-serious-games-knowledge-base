# T1D Serious Games Knowledge Base

A scientific resource for discovering, comparing, designing and maintaining games for type 1 diabetes (T1D).

## Read the knowledge base

**[Open the formatted and searchable edition.](https://krauhe.github.io/t1d-serious-games-knowledge-base/)**

The [game catalogue](https://krauhe.github.io/t1d-serious-games-knowledge-base/explorer.html) compares 46 games and related interventions by year, language, platform, audience, learning goals, evidence, access and price. Open a game for a short profile, direct product links and study details.

| Question | Chapter |
|---|---|
| What outcomes have games demonstrated? | [Evidence map](knowledge/games/evidence-map.qmd) |
| How can play support learning? | [Learning science](knowledge/design/learning-science.qmd) and [game mechanisms](knowledge/design/game-mechanisms.qmd) |
| How should a game be tested? | [Evaluation](knowledge/design/evaluation.qmd) |
| How can entry and use be made easier? | [Human factors](knowledge/human-factors/onboarding-and-accessibility.qmd) |
| What physiology matters when modelling glucose? | [T1D Physiology and Modelling](knowledge/physiology/index.qmd) |
| What could help projects survive? | [Adoption and sustainability](knowledge/sustainability/index.qmd) |
| When can a game become medical-device software? | [Regulatory boundaries and development pathways](knowledge/regulation/regulatory-boundaries.qmd) |

The audience is researchers, clinicians, educators, designers and developers. Physiological modelling is relevant to some games, not a prerequisite for psychosocial or experiential learning.

## Purpose

This resource grew out of research for [T1D Simulator](https://github.com/krauhe/t1d-simulator). Its aim is broader: make useful T1D learning games easier to discover, develop, evaluate and maintain, irrespective of who creates them.

Our hypothesis is that a brochure requires fewer interdependent forms of maintenance than a game. Games can depend on combined clinical, pedagogical, design and software expertise; funding changes or contributor turnover may leave that knowledge without an owner. The [sustainability chapters](knowledge/sustainability/index.qmd) distinguish supporting evidence from untested explanations.

Reusable evidence, design patterns and evaluation methods are intended to reduce duplicated work. T1D Simulator's source and physiological model are available under the [GNU General Public License version 3](https://github.com/krauhe/t1d-simulator/blob/main/LICENSE).

## Scope and evidence

This is a structured scoping review and evidence map, not a registered systematic review or individual medical advice. The inherited search reports a cut-off of **24 August 2026**, but complete historical search exports were not recovered. Later corrections and product checks carry separate dates; see [methods](methods.qmd).

Knowledge, engagement, transfer and clinical benefit are assessed separately. Catalogue inclusion is not endorsement, and project-affiliated games receive the same evidentiary treatment as other products.

## Build locally

The source uses Quarto-compatible chapters and a dependency-light builder. The generated website has full-text search, a sortable catalogue and an edge-docked collapsible menu.

Use **PDF** in the website header to open the complete reading edition, then **Save as PDF** to use your browser's print dialog. The **full scholarly edition** includes all chapters, game profiles and detailed study appraisals by default. **Compact catalogue edition** shortens only the expanded game records, not the scientific chapters. PDF saving on tablets depends on the browser's Print or Share menu.

```text
pnpm install
pnpm run validate
pnpm run build
pnpm run validate:links
```

The last command checks external URLs from the local computer. Login barriers, challenge pages and ambiguous responses still require manual investigation.

Local builds synchronise the detailed physiology chapters from the canonical scientific text when its source checkout is present. See [physiology synchronisation](docs/physiology-sync.md) for source configuration, version tracking and snapshot checks.

## Contribute and reuse

Corrections, missing products, updated access information and documented project histories are welcome. See [contributing](CONTRIBUTING.md), [editorial policy](EDITORIAL-POLICY.md) and [governance](GOVERNANCE.md).

Original content, data and figures use [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/); software uses the [MIT License](LICENSE). Third-party material retains its own terms; see [licensing notes](LICENSING.md).

Suggested attribution:

> T1D Serious Games Knowledge Base, Kristian Rauhe Harreby, [project repository](https://github.com/krauhe/t1d-serious-games-knowledge-base), CC BY 4.0. Indicate any changes.

Machine-readable citation metadata: [CITATION.cff](CITATION.cff).
