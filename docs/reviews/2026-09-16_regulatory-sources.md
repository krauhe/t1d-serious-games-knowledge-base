# Regulatory chapter: sources, claims and integration record

Date: 16 September 2026. Scope: new `knowledge/regulation/regulatory-boundaries.qmd`. Status: implemented locally; no publication or product-specific legal classification. This is a targeted official-guidance synthesis, not a systematic review or a complete legal compliance assessment.

## Search and selection

Web-search interface queries executed on 16 September 2026:

1. `site:fda.gov Policy Device Software Functions Mobile Medical Applications guidance 2026`
2. `site:health.ec.europa.eu MDCG 2019-11 rev 1 June 2025 software`
3. `site:eur-lex.europa.eu 2017/745 consolidated 2026 Article 2 Rule 11`
4. `site:fda.gov Quality Management System Regulation February 2 2026 medical devices`
5. `site:fda.gov clinical decision support software January 2026 guidance`
6. `site:eur-lex.europa.eu "02017R0745" "2026"`
7. `site:eur-lex.europa.eu "02017R0745-20250110"`
8. `site:health.ec.europa.eu "2017/745" "pdf" "Article 10"`
9. `site:eur-lex.europa.eu "02017R0745-20260719" "Article 61"`
10. `site:fda.gov De Novo classification request medical devices`
11. `MDR 2017 745 pdf site:health.ec.europa.eu/document/download`
12. `MDR 2017 745 regulation pdf site:laegemiddelstyrelsen.dk`
13. `site:eur-lex.europa.eu/legal-content/EN/TXT/ "02017R0745-20260719" "quality management system"`
14. `site:health.ec.europa.eu "MDCG 2020-1" "Clinical Evaluation"`
15. `site:health.ec.europa.eu "manufacturers" "quality management" "notified body" "MDR"`

Six substantive sources were selected: FDA 2022 software policy, FDA 2026 CDS guidance, FDA device-regulation overview, FDA De Novo pathway page, MDCG 2025 software qualification/classification guidance, MDCG 2020 clinical-evaluation guidance. All six have locally retained full text and inspected relevant content. Selection prioritised current official guidance and explanatory pages, not commercial regulatory advice. FDA's January 2026 CDS update was identified and used; the chapter does not reproduce only the older 2022 account. The FDA De Novo page's own content date is 30 September 2025. Historical EU manufacturer-transition factsheets were not used as current compliance instructions. No product-specific approval dossiers or developer motive interviews were searched or analysed.

## Acquisition and identity

All substantive source links in the chapter were successfully retrieved from the local PC, either in the preceding assessment on the same date or during this revision. PDF signatures, page counts, title and relevant sections were verified; HTML titles and meaningful main content were inspected. Hashes refer to private retained files, not an assertion of redistribution rights. Exact requested URLs are the linked references in the chapter.

| Source | Local full text under `private-literature/articles/` | Access and reading |
|---|---|---|
| FDA (2022), Policy for Device Software Functions and Mobile Medical Applications | `FDA 2022 - RW - Policy for Device Software Functions.pdf` | Previous same-day local HTTP 200 PDF, 45 pages; reused. Sections IV, V.A–B, VI and Appendix A relevant passages read. Historical final redirect URL not retained; requested PDF identity verified. |
| FDA (2026a), Clinical Decision Support Software | `FDA 2026 - Clinical Decision Support Software.pdf` | HTTP 200 PDF, 27 pages. Requested/final URL both `https://www.fda.gov/media/109618/download`. Title confirms 29 January 2026 issue, superseding 6 January 2026. Pages 1–10 inspected; chapter uses introduction, four statutory criteria and continuous-glucose example. Remaining examples not comprehensively appraised. |
| FDA (2026b), Overview of Device Regulation | `FDA 2026 - Overview of Device Regulation.html` | HTTP 200, main body read including February 2026 QMSR update, 510(k), PMA, research, quality and reporting. Requested URL is chapter reference; final redirect field not captured in initial download. |
| FDA (2025), De Novo Classification Request | `FDA 2025 - De Novo Classification Request.html` | HTTP 200; requested/final URL identical to chapter reference. Title and content date verified. Definition, two submission options, pre-submission recommendation and evidence-content passages read. Chapter does not quote fees or review time targets. |
| MDCG (2025), MDCG 2019-11 Rev.1 | `MDCG 2025 - RW - Software Qualification and Classification Rev1.pdf` | Previous same-day local HTTP 200 PDF, 36 pages; reused. Relevant definitions, qualification, therapeutic VR example, insulin example, Rule 11, conformity assessment and module/interface passages read. Historical final redirect URL not retained. Not a cover-to-cover appraisal of IVDR appendices. |
| MDCG (2020), MDCG 2020-1 | `MDCG 2020 - Clinical Evaluation Medical Device Software.pdf` | HTTP 200 PDF, 22 pages; requested/final URL identical to chapter reference. PDF pages 1–17 read, including §§3–4.6. Appendix examples not independently appraised. |

SHA-256:

1. FDA 2022: `7fb21371f814ec843c208e2b98e3505a7f4f47aa845040a419af4929e95d053e`.
2. FDA 2026 CDS: `156bdc583aa71b6997ba327d8d97ade09fd1f76c5999a1214cdbe7c3e03d1eef`.
3. FDA 2026 overview HTML: `fd4d5f7ae779ebabe097ffd2cf9cc0dd9bc20a3b22b92a9f66ffffd98b99be0e`.
4. FDA 2025 De Novo HTML: `f46fe6573d2cc1d8b9ceee47ef32308dc23a5c9684ad487a1fbb75ab9071f836`.
5. MDCG 2025: `ed60b2084a91648bf483eb6c33641e0635e51bfb9712f889124c279b1885f38d`.
6. MDCG 2020: `9d46e8caaee4ca9537525d1f32a98c7cdeaa39d8a0aa4a4f9d074f8688b2a0bf`.

## Material claim ledger

| Chapter location/claim | Inspected support | Status and boundary |
|---|---|---|
| Genre/platform is not dispositive; intended purpose matters | FDA 2022 §IV; MDCG 2025 §§1–3 | Supported; product-specific classification not attempted |
| Non-device, enforcement discretion and oversight are distinct | FDA 2022 §§V–VI, Appendix A | Supported; enforcement discretion not described as approval or statutory exemption |
| General education may include filtering by patient characteristics | FDA 2022 Appendix A item 3 | Supported; not expanded into permission for treatment calculations |
| CPR training games listed as non-device examples | FDA 2022 Appendix A item 2 | Supported regulatory example, not T1D efficacy evidence |
| Self-management without specific treatment suggestions may fall within policy discretion | FDA 2022 §V.B | Supported with conditional language and distinction from non-device status |
| Non-device CDS exclusion uses four cumulative criteria, including professional recipient and independent review | FDA 2026 CDS §§II–IV | Supported; limited to this exclusion, not a claim that all patient-facing tools are devices |
| Repeated CGM measurements differ from a discrete glucose result under the CDS input criteria | FDA 2026 CDS §IV.1–2 | Supported; not extrapolated to all display/storage functions |
| Qualification precedes MDR classification; risk of harm alone does not establish qualification | MDCG 2025 §§3–4 | Supported guidance interpretation; current consolidated legislation not fully retrieved |
| Therapeutic personalised VR narrative game can be MDSW | MDCG 2025 §3.2 | Supported hypothetical regulatory example; neither named product approval nor effectiveness claim |
| Rule 11 baseline/escalation and other applicable rules | MDCG 2025 §4.2 | Supported, deliberately no class assigned to a real T1D product |
| Insulin recommendations remain relevant regardless of pump/pen/syringe | MDCG 2025 §3.2 | Supported |
| Nonmedical module interfaces can affect medical-device safety/performance | MDCG 2025 §7 | Supported; separate tabs not treated as regulatory segregation |
| Valid clinical association, technical and clinical performance require distinct evidence | MDCG 2020 §§3–4 | Supported framework; application to game studies labelled interpretation |
| Clinical evaluation continues through changes and post-market evidence | MDCG 2020 §§4.4–4.6 | Supported |
| 510(k), De Novo and PMA are different pathways; exemptions also exist | FDA overview and De Novo page | Supported high-level pathways, not a submission checklist |
| QMSR effective 2 February 2026 | FDA overview update | Supported; full ISO standard not acquired or represented as inspected |
| Fictional scenarios/limited personalisation as an educational design choice | Above intended-use framework | Explicit design inference; not a safe harbour |
| Developer motives and prevalence of regulatory avoidance | No qualifying study/history collected | Unknown; chapter explicitly declines inference |

## Full-text wishlist fragment for integration

**European Parliament and Council (2017, consolidated 19 July 2026), Regulation (EU) 2017/745 on medical devices; CELEX 02017R0745-20260719.** Priority: high before a definitive regulatory/legal update. Official consolidated version identified through EUR-Lex search results, but local PDF and HTML retrieval returned HTTP 202 with empty content, as did the original-law endpoint. This is an open-access retrieval failure, not a paywall. Purpose: directly verify Articles 2, 10, 52 and 61, Annex VIII Rule 11 and applicable amendments, instead of relying on quoted provisions in MDCG guidance. Lawful next route: normal browser access to EUR-Lex or an official institutional legal-library copy. Exact attempted endpoints, **not fully verified locally**: `https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A02017R0745-20260719`; `https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02017R0745-20260719`; `https://eur-lex.europa.eu/eli/reg/2017/745/oj/eng`. The chapter does not cite inaccessible direct legislation as if freshly read, and discloses its guidance-based EU account.

## Integration fragments

Navigation: add `knowledge/regulation/regulatory-boundaries.qmd`, label **Regulatory boundaries**, preferably a **Regulation and responsible development** group or adjacent to evaluation/sustainability. Do not redate the original August game search.

Glossary additions if absent:

1. **CDS — Clinical decision support:** software supporting clinical decisions; a functional description, not itself a regulatory status.
2. **FDA — Food and Drug Administration:** United States regulatory agency.
3. **MDCG — Medical Device Coordination Group:** European coordination group issuing nonbinding medical-device guidance.
4. **MDR — Medical Device Regulation:** here Regulation (EU) 2017/745, not the distinct US abbreviation for Medical Device Reporting.
5. **MDSW — Medical device software:** software with an intended medical purpose within the applicable device definition.
6. **PMA — Premarket approval:** an FDA market-access pathway applicable to relevant class III devices.
7. **QMSR — Quality Management System Regulation:** current FDA quality-system framework, effective 2 February 2026.
8. **VR — Virtual reality:** computer-generated immersive environment.

Source-register entry: targeted regulatory search **16 September 2026**, six official guidance/web sources locally retained with relevant passages read, one direct-legislation full-text gap; not a clinical efficacy update or product regulatory audit. References are fully specified in the chapter.

## Verification and limitations

Manual inspection: first-use abbreviation expansion, linked institutional author-date citations, hypothesised design mappings labelled, no motive attribution, no definite individual product status, no universal claim that serious games cannot be medical devices. `git diff --check` was clean apart from line-ending notices at the working-tree level. Parent agent owns build/navigation/whole-site verification. No browser visual verification, legal-professional review, compliance certification or comprehensive regulatory database search is claimed.
