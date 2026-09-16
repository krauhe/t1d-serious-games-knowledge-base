# Scientific depth restoration and reading-edition revision

Date: 16 September 2026. Mode: authorised revision with targeted evidence checking, not a comprehensive new search.

## Decisions and coverage

1. Sentence-level concision must preserve scientific depth. Keep one canonical game catalogue; use topic chapters for explanation and outcome synthesis.
2. Restore general physiology from the affiliated project's scientific document. Correct identified source errors upstream, then generate the knowledge-base reference chapters from that canonical text. Transferred evidence is not newly verified merely because the import succeeds.
3. Expand learning science, mechanisms, evaluation and human factors using source-specific findings and explicit transfer limits. Agent coverage is recorded separately in `2026-09-16_learning-depth.md`.
4. Add regulatory boundaries and development pathways, separating European and United States frameworks and non-device status from enforcement discretion. Its source appraisal is recorded separately in `2026-09-16_regulatory-sources.md`.
5. Expand adoption and maintenance around documented adjacent evidence, operational examples and testable hypotheses. Do not attribute a particular game's disappearance to staff departure or funding without its project history.
6. Make full study appraisals the default PDF selection. Preserve a clearly labelled compact-catalogue option, retaining the same complete chapters. Remove forced page breaks between individual game profiles.

## Main-agent claim/source check

| Location | Evidence read | Decision |
|---|---|---|
| Why games disappear: measuring sustainability | Braithwaite et al. (2020), retained full XML: bibliographic front matter, abstract, methods, results and discussion | Use 92 studies, 27 definitions, 11 post-funding evaluations; distinguish programme continuation from patient benefit. The previous broad attribution of barriers to this paper was replaced with the specific subsequent review. |
| Why games disappear: barriers | Zurynski et al. (2023), newly retained full PMC HTML: identity, abstract, factor results, discontinuation, discussion and limitations | 124 studies; 61 leadership/support, 54 training/support/supervision, 50 staffing/turnover, eight discontinuation reports. Reporting frequencies are not effects or T1D-game failure rates. |
| Why games disappear: digital-health context | Kaboré et al. (2022), retained full XML: abstract, study characteristics and barrier/facilitator results | Twelve studies, four of each qualitative/quantitative/mixed-method design; limits of infrastructure and workflow findings retained. |
| Maintenance patterns | Taschuk and Wilson (2017), retained full XML: guidance on release versioning, dependencies, testing and reproducibility | Worked handover and budget examples explicitly presented as proposals, not validated survival interventions. |
| Evidence map: glycaemic synthesis | Yao et al. (2024), retained PDF pp. 1–4, 7–9 | Preserve pooled null result; add population composition and inclusion/search limits. Do not repeat the authors' stronger claim of clinically important improvement as an established finding. |

Other unchanged references and extracted game findings remain subject to their earlier appraisal/access statuses. This pass does not reappraise all 46 games or all inherited physiological claims.

## Targeted searches and acquisition

Executed 16 September 2026 using web search:

1. `"Built to last" Braithwaite 2020 sustainability 92`
2. `"Barriers and facilitators" "Kaboré" 2022 sustainability digital health 12`
3. `"Built to last? Barriers and facilitators" 2023 01315 PMC`

The third search identified the subsequent barriers review as a more appropriate direct source for the existing sustainability argument. No database-wide update or independent human screening is claimed.

Zurynski, Y. et al. (2023), *Built to last? Barriers and facilitators of healthcare program sustainability: a systematic integrative review*, Implementation Science 18:62. DOI `10.1186/s13012-023-01315-x`; PMID `37957669`; PMCID `PMC10641997`.

Local retrieval: requested `https://pmc.ncbi.nlm.nih.gov/articles/PMC10641997/`, HTTP 200, 315,872 bytes, verified title, author and article body. Retained as `private-literature/articles/Zurynski 2023 - RW - Healthcare Program Sustainability.html`; SHA-256 `367e61e61c36ec6660e5f1ad41a09410ff0ce1b3b510433f8c6f1bb9f088ac42`. Final redirect URL was not captured by that first command; no redirect identity is asserted. The linked PMC PDF endpoint returned HTTP 200 **HTML**, not a PDF, and was not retained as a PDF. Valid HTML full text resolves the acquisition requirement.

Local link checks: Kaboré DOI resolved to the correct Frontiers full article; Taschuk DOI resolved to the correct PLOS article. Braithwaite DOI returned HTTP 403; the full XML was already retained and read. A failed destination check is not a claim that the article is paywalled or that its retained full text is invalid.

## Verification status

1. Canonical source `2026-09-16-v1` synchronised into 30 detailed reference chapters, approximately 88,786 words including bibliography. All numbered source sections are represented; implementation footers are excluded.
2. Isolated synchronisation tests passed source updates, idempotence, edited/unmanaged-file protection, late validation failure, offline snapshots and CRLF/LF portability. Interrupted filesystem writes remain detectable rather than being claimed transaction-safe.
3. Public-safe and private builds passed: 56 reading chapters, 59 rendered HTML files, 46 game records and 23 study/report records. The private edition retains 12 review images; the public build excludes them.
4. Print lifecycle, full/compact selection, internal links, filters, sorting, expansion, deep links, menu persistence and storage-denial tests passed. These are static and simulated-interface checks, not browser visual tests.
5. The refreshed private standalone HTML is approximately 9.88 MiB; the public reading edition is approximately 7.58 MiB. Subsequent real-Chromium export and PDF layout checks passed; see `2026-09-16_pdf-export-verification.md`. Native browser Print/Save as PDF remains the export mechanism.
6. Both repositories pass their normal Git whitespace checks. No commit, push or publication was performed. The Quarto pre-render hook is configured; the dependency-light renderer was executed, not a separate Quarto render.

Structural tests cannot establish claim validity, browser print fidelity or independent source verification. A whole-repository local URL audit includes historical failed acquisition attempts as well as active reading links; its machine classifications are not claim-level bibliographic validation.

The local audit completed 1,124 unique URL requests. Nine HTTP 404 results belong to historical acquisition/API attempts in audit registers, not newly introduced chapter links. It also recorded 196 access restrictions. Manual checking found that the tool misclassified Springer pages titled “Client Challenge” as working, including Cai's apparent PDF route (HTTP 200, HTML rather than PDF). The challenge detector was corrected and tested, but the full network audit was not rerun; its original 919 “working” classifications must not be read as 919 verified resources. Cai remains on the acquisition wishlist. Publisher restrictions and bibliographic identity checks remain separate unresolved work.
