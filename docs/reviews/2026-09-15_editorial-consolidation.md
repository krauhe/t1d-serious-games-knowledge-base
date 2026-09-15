# Editorial consolidation and standard game profiles

Date: 15 September 2026. Mode: authorised editorial revision using the T1D Knowledge Base Scientific Review skill, not a new literature search or independent full-text appraisal.

## Checkpoint and scope

The existing changes were committed and pushed first as `ca374050377c966439d508f6a1c82bd39f09eaa1`. The owner authorised committing and pushing this follow-up revision on 15 September 2026.

Coverage: all 24 navigable source documents, the generated catalogue and the descriptive/developer/evidence/access fields of all 46 game records. README, editorial policy and catalogue rendering were also inspected. The 23 report-level records were checked for preservation, not freshly re-appraised. Four source/history ledgers remain unchanged to preserve provenance and unresolved acquisition work.

## Changes

1. **E01 — Fixed (2026-09-15): repeated findings and theory.** The access audit has one numerical treatment in availability; product outcomes remain in the evidence map and catalogue; explanatory feedback and the learning-loop figure are centred in learning science. Other chapters link to these treatments or discuss a distinct application.
2. **E02 — Fixed (2026-09-15): verbose summaries and checklists.** Overviews, methods, design, human factors and sustainability were shortened. Repeated physiology conclusions were reduced without altering the quantitative anchor table. First-use definitions and source-specific limitations were retained; the central glossary now contains abbreviations formerly repeated in chapter-end glossaries.
3. **E03 — Fixed (2026-09-15): inconsistent profile presentation.** Every game has the same visible order: play and learning; development; evidence; access. The existing two- or three-sentence descriptions are retained. Detailed metadata, design notes and all 23 study appraisals remain expandable beneath each profile.
4. **E04 — Fixed (2026-09-15): evaluative filler.** MyDiabetic's unsupported superlative and rhetorical summaries for PAL and the Sparapani framework were replaced with descriptive evidence statements. No study outcomes, classifications or availability dates changed.
5. **E05 — Fixed (2026-09-15): future redundancy.** The editorial policy now assigns topics a primary home and requires the common profile structure.
6. **E06 — Fixed (2026-09-15): empty image areas.** Profiles without an available image show source links without reserving figure space. A failed image load removes its figure while preserving the source link; duplicate source and product URLs appear only once. Public output retains links rather than private review images.

## Quantified reduction

Across the 20 reading-source documents excluding the four source/history ledgers, front matter and reference sections, the word-token count fell from **21,059 to 11,523 (45.3%)**. This denominator includes headings, tables, methods and the expanded glossary; it excludes the generated game catalogue, README and shared page furniture. It is a length measure, not a validated measure of information quality.

The linked [coverage record](2026-09-15_editorial-consolidation/coverage.json) gives per-file counts. Tokens were counted as Unicode letter/number runs after removing front matter, reference sections and Markdown link destinations; the baseline was read with `git show ca37405:<path>`.

## Evidence and source limits

No newly cited external destination was introduced in the navigable source chapters. Existing citations and source-access records were reused; no source acquired or critically appraised anew is claimed. Unresolved full texts remain in the existing wishlist/backlog. Historical search, source-appraisal and product-access dates were not refreshed by editing.

The checkpoint's local link audit inspected 186 distinct URLs in rendered HTML: 154 were initially classified as working and 32 as restricted, with none classified as broken. Manual checks found challenge/intermediary/empty responses among nominal successes, so these counts **do not mean all destinations were fully verified**. Restricted and ambiguous source access remains unresolved. The wider scan also included historical acquisition endpoints; its 16 failures were not actual rendered-page links.

The pre-push rerun checked 567 URLs, including 191 rendered-page destinations. The latter initially returned 159 nominal successes, 30 restrictions and two errors. Both errors were retried: the MIT handle returned the expected physiological-modelling thesis; the Bari handle resolved to a blocked institutional page. Publisher challenge pages, intermediary redirects and empty HTTP 202 responses still prevent complete verification. Nine other failures were historical acquisition endpoints, not rendered-page links. The five newly exposed image-source links returned valid image responses from their product sites.

## Verification

1. Public and private builds, catalogue validation, scientific regression checks and deterministic interaction tests were run. All 46 game entries, 23 report appraisals, 25 tablet chapters and game anchors are retained.
2. The study register is unchanged from the checkpoint; the glucose–insulin quantitative table is unchanged.
3. All 12 private game-image byte sequences were found embedded in the tablet file. Public output excludes those image files.
4. An exact-paragraph scan found no repeated paragraphs longer than 18 words across the knowledge chapters after excluding references. This does not establish zero semantic overlap; definitions, necessary context and the catalogue/evidence-map relationship deliberately remain.
5. A first private validation briefly reported missing copied images; a later read verified all 12 files and the validation passed. A subsequent build hit a local directory lock and passed on retry; no application or content change was made to suppress either check.
6. No browser rendering or visual inspection was performed: browser access was previously blocked. JavaScript checks use deterministic DOM test doubles, not a real tablet. Readability and touch layout still require user inspection.

Final artifact: `output/private/T1D-Serious-Games-Knowledge-Base-private.html`. The normal `_site` output is rebuilt in public-safe mode after the private export. No simulator or physiological-model implementation files were changed.
