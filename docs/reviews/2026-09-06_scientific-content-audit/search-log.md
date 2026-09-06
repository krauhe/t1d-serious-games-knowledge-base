# Audit search and verification log

**Executed:** 6 September 2026. **Purpose:** targeted verification during a scientific audit, not a new systematic review or reconstruction of the August search.

## 1. Corpus and local evidence

The inventory contains 30 reviewed documents and 45 catalogue records, with original source hashes. Linked scholarly references were extracted from the source corpus, resolved against Crossref and Europe PubMed Central, and checked against existing article files before new retrieval. Queries, HTTP responses, redirects and full-text candidate routes are preserved per record in [source-access-register.json](source-access-register.json). Identifier deduplication does not establish study-level independence.

The local link checker screened 178 external URLs: 142 working, 35 restricted and one broken under its technical rules. A successful response was not accepted as proof of correct publication identity. The reported Sorensen handle failure was route-dependent: another acquisition route yielded the manuscript.

The legacy Simulator game-literature source index was inspected for original forward-citation exports. Summary counts were present; the underlying union of citation-index records and record-level screening decisions was not located. This is a reproducibility limitation, not proof that the historical searches did not occur.

## 2. Targeted web queries retained exactly

These literal queries are preserved from tool-call records. Earlier exploratory queries were not all retained as exact strings; the list is therefore not represented as an exhaustive search export.

| Query | Purpose and disposition |
|---|---|
| `"I Got This" diabetes game Lawrence Hall of Science` | Official developer page located; local HTTP 200 with matching product text. T2D and creator identity confirmed; app installation not tested. |
| `"A Simple Health-Based Game for Children" Qare Qure` | Reconcile the claimed caregiver interpretation with the actual Moosa publication. Metadata checked; primary full text not acquired. |
| `"Educational technologies for families and children with type 1 diabetes" review 2025` | Morgado comparator identified; full-text XML obtained. Candidate for a separately dated update, not automatically classified as a core game review. |
| `"19322968231223759" eddii` | Company-sponsored trial identified and its full-text methods, outcomes and disclosures inspected. |
| `"Test-enhanced learning" Roediger Karpicke 2006 pdf site:edu` | Search for a lawful institutional learning-science text; candidate routes required direct inspection. Search snippets were not treated as evidence. |
| `"The Power of Feedback" Hattie Timperley 2007 pdf site:edu` | Search for a lawful full text; unresolved access remains in the acquisition backlog. |
| `"A meta-analysis of the cognitive and motivational effects" pdf Wouters` | A candidate author-upload PDF returned HTTP 403 locally; no challenge page was retained as an article. |
| `"Repeated testing produces superior transfer" Butler pdf site:edu` | Former Duke URL returned HTTP 404; current Washington University author-publication page yielded the complete 2010 paper. |

Other targeted query families addressed the mismatched Rizza, Søeborg, Haahr and Cobelli citations, the Nørlev/Reinders comparators and newer paediatric interventions. The exact identifier requests and returned identities, rather than reconstructed natural-language query strings, are retained in the access register. No ACM, IEEE, trial-registry or app-store systematic update is claimed for this audit.

## 3. Retrieval routes and selection

1. Crossref bibliographic metadata and Europe PMC identifier/abstract metadata were used to reconcile publication identity, not to establish full-text claim support.
2. Existing PDFs, trusted repository HTML and Europe PMC full-text XML were used when available. Article bodies were checked; response size alone was insufficient. A filename collision in the first retrieval run was detected, excluded from matching, and corrected using identifier-derived filename suffixes.
3. The two Butler papers were obtained from the author's institutional publication page on 6 September. Title pages confirmed identity; relevant experimental sections were read. They are adjacent learning evidence, not T1D outcome studies.
4. Subscription restrictions, repository failures, incorrect linked identities and uncompleted full-text appraisal remain separate statuses. Inaccessible sources were not treated as negative results or silently removed from consideration.
5. The source register includes acquired candidate files; only [inspected-sources.json](inspected-sources.json) records the narrower manual appraisal depth. Private reading copies are not approved for public redistribution by inclusion in this audit.

## 4. Eligibility and reporting limits

Morgado and Beh are comparator candidates because their scopes extend beyond serious games. I Got This remains relevant as a T2D experiential comparator, not direct T1D evidence. eddii remains a gamified management intervention; its trial does not demonstrate educational transfer. Butler's experiments support bounded text-learning mechanisms, not an entire simulation design package. These decisions are explicit and do not retroactively alter the original catalogue or historical search cut-off.

The audit did not enumerate a complete forward-citation universe or claim independent dual screening. A future literature update should preserve raw index exports, exact database queries, record-level eligibility decisions, deduplication and report-to-study relationships from the outset.
