---
name: t1d-kb-scientific-review
description: Review, update, or revise scientific content in the T1D Serious Games Knowledge Base, verifying claim-to-source support, study outcomes, product records, literature coverage, and acquisition of cited full texts. Use for whole-base audits and evidence-based chapter development; not for simulator implementation or ordinary visual changes.
---

# T1D Knowledge Base Scientific Review

## Purpose and working modes

Produce an inspectable scientific resource for researchers, clinicians, educators, game developers, and maintainers. Apply the repository's AGENTS.md and EDITORIAL-POLICY.md. Write scientific artifacts and this skill's resources in English; discuss findings in the user's language.

Choose the mode from the request:

1. **Review:** inspect the requested corpus and original evidence; produce located, prioritised findings and proposed corrections. Do not silently rewrite reviewed chapters.
2. **Update:** search the requested topic through the actual search date, record new evidence and access results, and distinguish the update from the historical search.
3. **Revise:** implement authorised corrections in canonical sources, preserve study limitations, and check all affected catalogue, chapter, and rendered representations.

A whole-base review covers all navigable source chapters, all game records, relevant editorial/source documents, and the source-to-rendered-content relationship. Record coverage explicitly. Completing inspection of every page is different from verifying every underlying source; report both denominators.

## Discovery and routing

Read the relevant content completely before judging it. Start with `data/navigation.json`, `data/games.json`, `methods.qmd`, `references/SOURCE-INDEX.md`, `references/PAYWALLED-WISHLIST.md`, and the applicable policies. Inspect existing local literature and acquisition logs before downloading again. Resolve all paths from this repository, not the T1D Simulator working directory.

Read [claim and source verification](references/claim-verification.md) for every scientific review or revision. Read [domain appraisal](references/domain-appraisal.md) for the relevant subject areas. Read [outputs and verification](references/outputs.md) for whole-base reviews and completed deliverables.

## Essential evidence rules

- Audit material empirical, quantitative, mechanistic, historical, effectiveness, safety, availability, and causal assertions. A nearby citation is a candidate source, not proof of support.
- Distinguish absent citation, wrong citation, partial support, overgeneralisation, contradiction, explicitly labelled inference, and verification blocked by inaccessible evidence. Do not call an inaccessible claim false merely because it cannot be checked.
- Read the original result for pivotal conclusions. Record population, intervention/version, comparator, endpoint, instrument, analysed denominator, follow-up, estimate and uncertainty where reported. Do not invent missing values or infer equivalence from a nonsignificant result.
- Treat study design, methodological credibility, population relevance, and endpoint relevance as separate dimensions. Assess evidence for individual outcomes rather than assigning one effectiveness rating to an entire game.
- Keep direct T1D evidence separate from mixed-diabetes and adjacent learning evidence. A theoretical mechanism or feature in an effective intervention does not establish that the feature caused the effect.
- Product availability, price, publication date, scientific search date and reviewed version are separate dated observations. A listing is not an installation or playtest. Preserve `not_playtested` for desk research.
- Apply identical evidence standards to project-affiliated games. Physiology is relevant to learning objectives that use it; psychosocial and experiential games need not simulate glucose.
- Download cited or substantively used sources when lawful full text is available, using the acquisition procedure in claim-verification.md. Every remaining full-text gap goes on the existing wishlist, including open-access retrieval failures. Never treat a redistribution licence as a prerequisite for ordinary lawful private reading.
- Verify external destinations from the user's computer. Record technical access separately from resource identity and claim support. Inspect redirects and challenge pages. Never report an untested link as verified.
- Explain specialist terms and abbreviations at first use in each independently readable chapter. Use linked author-date citations. Keep important limitations beside the affected statement. Quantify where informative and supported; avoid decorative molecular detail and false precision.
- Search/report only what was actually done. Preserve historical uncertainty; never backdate a reconstructed search or fabricate independent screening. Parallel agents require explicit user authorisation and do not constitute independent human reviewers.

## Implementation and maintenance

Use the existing build and validation scripts. Extend checks only for demonstrated gaps relevant to the task. Keep substantive audit results and source metadata version-controlled; keep downloaded full texts and private working extractions under ignored `private-literature/`. Keep private acquisition mechanics out of public explanatory prose unless directly pertinent to scientific access limitations.

This skill adapts the T1D Simulator project's `science-reviewer` principles of primary-source reading, quantitative context and inline limitations to multidisciplinary evidence review. It intentionally has no simulator-implementation cross-reference requirement. The general scientific-literature-review conventions inform linked citations and report formatting; this project uses its own canonical chapters and existing literature directories.
