# Scientific audit corrections and residual work

Date: 6 September 2026. Language: scientific English. Scope: the Serious Games Knowledge Base only.

## Decision and release boundary

The owner authorised correction of the reported errors and weaknesses, with a commit and push first. Checkpoint `593485b3f295f029354fe17d85849ba198a5c992` was committed and pushed to `origin/main` before these corrections. The following corrections are local; no subsequent commit, push or publication is included in this correction phase. No Simulator source, physiological implementation or gameplay file was changed.

The [original audit](2026-09-06_scientific-content-audit.md) retains the original findings and now contains a dated status annotation at each finding. Its original coverage, retrieval and appraisal registers describe the original audit, not a newly completed search or a complete post-correction appraisal.

## Principal corrections

1. **Citation identity and physiological context.** Removed the 12 misidentified PubMed citations from current physiological chapters. Corrected identifiable intended references; removed or narrowed propositions for which the stated support could not be substantiated. Quantitative anchors now specify population, protocol, units, source-reading depth and limits of transfer to type 1 diabetes (T1D).
2. **Game and study classification.** Corrected Diabetic Mario's uncontrolled Android pilot, eddii's company-sponsored controlled outcome study and I Got This's type 2 diabetes (T2D) narrative and institutional provenance. Corrected endpoint labels and denominators for Tangbao, injection-distress research and WeCan. Removed unverified paired-caregiver architecture from Qare and Qure descriptions without asserting that the architecture is disproven.
3. **Evidence versus inference.** Mixed-diabetes reviews are no longer T1D-specific efficacy evidence. Non-public access is not a longitudinal disappearance rate. Learning architectures, maintenance explanations and comparison advantages are explicitly proposals or adjacent evidence where appropriate.
4. **Structured study records.** Added [23 linked study/report records](../../data/studies.json) to the 45-product catalogue. Each record distinguishes purpose, design, population, version, outcomes, instrument, denominator, follow-up, support depth and methodological concerns. Unknown fields remain unknown. Several records still contain inherited summaries requiring primary-report extraction.
5. **Reproducibility and provenance.** Separated the historical search cut-off, targeted correction/appraisal date, access checks and build date. Added [eligibility decisions](../../references/ELIGIBILITY-DECISIONS.md) without inventing missing historical searches or screening decisions.
6. **Derived content and governance.** Propagated corrections to game cards, tables, profiles, comparisons, methods and learning/physiology chapters. Corrected the timeline's era and gameplay descriptions. Governance now agrees with the existing licences.

## Disposition of all findings

“Fixed” closes the located defect, not every possible scientific weakness in the affected chapter. The [machine-readable status register](2026-09-06_corrections/finding-status.json) contains the rationale and affected files for each finding.

| Disposition | Findings | Remaining boundary |
|---|---|---|
| Fixed: 18 | F01–F07, F10–F17, F20, F22–F23 | The reported defects have been corrected; this is not a full-corpus certification. |
| Partially addressed: historical reproducibility | F08 | Missing original queries, citation-index exports and screening records remain unavailable. |
| Partially addressed: study extraction and appraisal | F09, F18 | The schema and key corrections are implemented; full primary-report extraction and risk-of-bias appraisal are incomplete. |
| Partially addressed: comparator coverage | F19 | Comparator reviews are connected and candidates recorded; complete candidate screening and forward-citation reconciliation remain outstanding. |
| Partially addressed: source access | F21 | New full texts were retrieved where accessible; the broader backlog and three corrected physiological sources remain incomplete. |
| Partially addressed: independent visual verification | F24 | Regression and structural checks were added; browser visual inspection of the revised website was blocked by the browser tool's local-file security policy. |

## Source use and access

The [correction acquisition register](2026-09-06_corrections/source-access.json) records exact identifiers, dated routes, access results, retained-file hashes and reading depth for six corrected physiological sources. Three full texts were newly retained and relevant sections inspected: Chadt and Al-Hasani (2020), Gradel et al. (2018) and Steiner et al. (2015). The corrected Rizza (1981), Cobelli (2009) and Kovatchev (2009) sources remain without acquired full text after the recorded repository/publisher fallback attempts. Their restricted use is identified in the chapters and [current wishlist](../../references/PAYWALLED-WISHLIST.md).

The [additional inspection ledger](2026-09-06_corrections/inspected-sources.json) records targeted reinspection of previously retained Gerich, Basu and Najjar articles. Reading depth is not inferred from file presence. The original game/learning appraisals remain separately traceable. No access control was bypassed and no missing full-text results were fabricated.

## Verification and its limits

1. The scientific regression test validates 45 game records and 23 linked study/report records, including the corrected Mario, eddii, I Got This, Qare and Qure, and AvaType1 facts; it rejects the 12 known erroneous physiological identifiers. This detects recurrence of known errors, not all unsupported claims.
2. Structural validation covers source navigation, local links, schema relationships and generated pages. Both the private website and single-file tablet edition are rebuilt from the corrected sources. The final website build is public-mode; review-only game images remain confined to the private tablet output.
3. Local network checks covered 166 unique URLs in the navigable source corpus. The main run recorded 131 technically reachable, 32 restricted and three failed requests; a separate retry retrieved all three failed destinations. The combined technical result is therefore 134 reachable, 32 restricted and no unresolved failed request. A generic publisher landing page or redirect does not establish complete visible-content or full-text verification. Detailed classifications and scope are recorded in [link-verification.json](2026-09-06_corrections/link-verification.json).
4. Sorensen's institutional route first presented a human-verification challenge, then returned the correct thesis title. This intermittent behaviour is documented rather than silently represented as uninterrupted access.
5. The browser tool refused local-file access. No alternative browser, local server or automation route was used to bypass that restriction. The revised website is therefore **not independently visually browser-tested**. Installation, device/region acquisition and gameplay were not tested.
6. The updated audit HTML and PDF are generated separately from the website. PDF page numbering, link annotations, geometry and page images are checked by the audit's renderer/inspection workflow; final counts are recorded in the [verification addendum](2026-09-06_scientific-content-audit/VERIFICATION.md). The original timeline is also rasterised for visual inspection.

## Remaining scientific work

1. Recover genuine historical search exports if they exist; otherwise execute and document a separately dated reproducible update rather than backdating one.
2. Complete the pending study-level primary extraction, outcome-specific appraisal and linkage of multiple reports before pooling participant counts or effects.
3. Screen the recorded omitted candidates and finish the two-index forward-citation reconciliation; complete critical appraisal of the adjacent comparator reviews.
4. Acquire the outstanding texts through lawful public or institutional routes. A subscription barrier is not evidence of poor research.
5. Complete an independent browser inspection when the relevant local pages can be opened through an authorised tool.

## Abbreviations

T1D: type 1 diabetes. T2D: type 2 diabetes. PDF: Portable Document Format. URL: uniform resource locator. JSON: JavaScript Object Notation. CGM: continuous glucose monitoring. CC BY: Creative Commons Attribution. MIT: Massachusetts Institute of Technology; also the name of the permissive software licence used for project code.
