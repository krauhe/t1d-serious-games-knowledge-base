# T1D Serious Games Knowledge Base

**A scientific resource for discovering, comparing, designing, evaluating, and sustaining serious games relevant to type 1 diabetes.**

## Formatted and searchable edition

The formatted and searchable edition will be linked here after its first verified deployment.

This independent knowledge base is intended for researchers, clinicians, diabetes educators, game designers, developers, patient organisations, and maintainers. It integrates peer-reviewed evidence, structured product information, learning science, human factors, type 1 diabetes (T1D) physiology, evaluation methodology, and software-sustainability practice.

The objective is not to identify one preferred game. It is to make it easier to determine what has been developed, what remains accessible, what outcomes have actually been measured, and which design and maintenance decisions are supported by evidence.

> **Working thesis:** a brochure can describe a dynamic system; a simulation can ask the learner to predict, act, observe, obtain a causal explanation, and try again. Whether this produces transferable competence or clinical benefit remains an empirical question.

## Why this resource is needed

Research on T1D serious games is fragmented across clinical, educational, human-computer interaction, and game-design literature. Evaluated interventions are often short-lived research prototypes, while publicly available products frequently lack independent outcome evaluation. In a 2024 accessibility review, 21 of 23 research-origin diabetes games could not be accessed publicly ([Reinders et al., 2024](https://doi.org/10.1016/j.diabres.2024.111833)). Earlier T1D-focused evidence was predominantly paediatric and heterogeneous, with limited support for sustained behavioural or clinical effects ([Nørlev et al., 2022](https://pubmed.ncbi.nlm.nih.gov/34024156/)).

This repository addresses the resulting separation between:

1. interventions that have been studied;
2. products that people can actually obtain;
3. mechanisms that are educationally plausible;
4. outcomes that have been demonstrated; and
5. projects that can be maintained after their original funding or research team disappears.

## Project origin and public purpose

This knowledge base originated in research undertaken to improve [T1D Simulator](https://github.com/krauhe/t1d-simulator), an educational game for exploring glucose dynamics in T1D. Its broader purpose is to facilitate the discovery, use, design, evaluation, and long-term maintenance of T1D learning games, irrespective of product, developer, or institutional origin.

**Sustainability hypothesis.** Static educational material such as a brochure can often be revised as a bounded content object. A serious game requires continuing coordination across T1D physiology and clinical practice, pedagogy, game design, software engineering, user experience, accessibility, evaluation, governance, and lived experience. When time-limited funding ends or a central researcher, developer, clinician, or community advocate changes role, tacit knowledge and operational ownership may be lost. This may contribute to the documented disappearance of evaluated games, although the relative importance of these causes has not yet been established empirically ([Reinders et al., 2024](https://doi.org/10.1016/j.diabres.2024.111833)).

The knowledge base therefore separates reusable evidence, design patterns, evaluation methods, documented failures, and maintenance practices from any single product. The source code, physiological simulation model, and technical documentation underpinning T1D Simulator are available under the [GNU General Public License version 3](https://github.com/krauhe/t1d-simulator/blob/main/LICENSE). The knowledge base's original scientific content, structured data, and figures are licensed under CC BY 4.0, while its software and build tooling use the MIT License. Together, these resources are intended to reduce duplicated work and support current and future serious-game teams working for the benefit of the T1D community.

The project's origin does not confer evidentiary priority. Every catalogued product is assessed using the same criteria for evidence, provenance, accessibility, and sustainability.

## What the knowledge base contains

The current evidence map includes:

1. **A structured catalogue of 45 games and game-like interventions**, including active products, historical releases, research prototypes, experiential games, clinician-training games, and adjacent categories.
2. **An evidence map** that distinguishes controlled outcome studies, pre/post and feasibility studies, usability and co-design work, development descriptions, unevaluated public products, and developer claims.
3. **Availability and provenance records** covering platform, audience, language, cost, region, access restrictions, developer type, release status, and verification confidence.
4. **Learning and game-design foundations** addressing simulation, deliberate practice, feedback, retrieval, progression, narrative, social learning, motivation, accessibility, and cognitive load.
5. **T1D physiology and modelling for relevant game types**, describing glucose regulation, insulin, meals, exercise, variability, safety boundaries, and simulation-model families for products that represent physiological or treatment dynamics.
6. **Evaluation guidance** separating knowledge gain, practical competence, transfer, self-efficacy, distress, engagement, behaviour, and clinical endpoints such as glycated haemoglobin.
7. **Sustainability guidance** covering documentation, governance, succession, dependencies, localisation, privacy, professional trust, research-software practice, and responsible use of artificial intelligence.

## Start reading

| Question | Suggested entry point |
|---|---|
| Which games exist, and are they still accessible? | [Game catalogue](knowledge/games/catalogue.qmd) and [availability analysis](knowledge/games/availability.qmd) |
| What does the evidence actually establish? | [Evidence map](knowledge/games/evidence-map.qmd) |
| How should a learning game be designed? | [Learning science](knowledge/design/learning-science.qmd) and [game mechanisms](knowledge/design/game-mechanisms.qmd) |
| How should outcomes be evaluated? | [Evaluation framework](knowledge/design/evaluation.qmd) |
| Which accessibility and onboarding problems matter? | [Human factors](knowledge/human-factors/onboarding-and-accessibility.qmd) |
| When a game represents glucose or treatment dynamics, which physiological constraints matter? | [T1D Physiology and Modelling](knowledge/physiology/index.qmd) |
| Why do research games disappear? | [Adoption and sustainability](knowledge/sustainability/index.qmd) |
| How was the evidence assembled? | [Methods and sources](methods.qmd) and [source register](references/SOURCE-INDEX.md) |

## Evidence discipline

The resource does not treat engagement, satisfaction, knowledge acquisition, behaviour change, and clinical benefit as interchangeable outcomes. Claims are labelled according to their basis:

1. **Direct evidence** from a relevant T1D serious-game population.
2. **Adjacent evidence** from another disease, population, educational setting, or technology.
3. **Industry practice** describing a production convention without implying health effectiveness.
4. **Design inference** identifying a testable proposal rather than an established effect.
5. **Product claim** reporting what a developer or distributor states without presenting it as independently measured evidence.

Public availability is not evidence of effectiveness, and peer-reviewed evaluation is not evidence that an intervention remains obtainable.

## Scope and limitations

The principal evidence search closed on **24 August 2026**. Product availability, prices, platform compatibility, and distribution status can change and therefore carry verification dates and confidence assessments.

The work is presented as a structured scoping review and evidence map. It is not a registered systematic review, a product endorsement, individual medical advice, or a substitute for professional diabetes education.

## Website and local development

The source is organised as a multi-page scientific website with responsive navigation, full-text search, linked references, and an interactive game explorer. The publication configuration is defined in `_quarto.yml`, while the repository's dependency-light builder generates the complete public-safe site in `_site/`.

```text
pnpm install
pnpm run validate
pnpm run build
pnpm run validate:links
```

`validate:links` retrieves every unique external URL from the local computer, follows redirects, inspects the returned page, and writes detailed local reports to `.validation/external-links-report.md` and `.validation/external-links-report.json`. Access challenges and ambiguous successful responses remain subject to manual browser review.

## Source transparency

The [source register](references/SOURCE-INDEX.md) records bibliographic identifiers, stable links, retrieval status, and access limitations. References that require institutional access are retained in the [full-text wishlist](references/PAYWALLED-WISHLIST.md) so they can be reassessed when lawful access becomes available.

## Governance and contributions

Corrections, missing products, updated availability information, replication data, and documented project histories are welcome. Contributions should preserve the distinction between measured evidence, inference, and product claims and should provide stable, directly accessible source links.

See the [contribution guide](CONTRIBUTING.md), [editorial policy](EDITORIAL-POLICY.md), [governance model](GOVERNANCE.md), and [licensing notes](LICENSING.md) before contributing or reusing material.

## Licence and citation

Original scientific and editorial content, structured catalogue data, metadata, and original figures are available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Original software and build tooling are available under the [MIT License](LICENSE). Third-party material remains subject to its original rights and stated terms.

Suggested attribution:

> T1D Serious Games Knowledge Base, Kristian Rauhe Harreby, [https://github.com/krauhe/t1d-serious-games-knowledge-base](https://github.com/krauhe/t1d-serious-games-knowledge-base), licensed under CC BY 4.0. Changes, if any, are indicated.

Machine-readable citation metadata are provided in [`CITATION.cff`](CITATION.cff).
