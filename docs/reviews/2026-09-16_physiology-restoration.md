# Physiological Reference Restoration and Canonical-Source Synchronisation

**Date:** 16 September 2026. **Status:** implemented locally; not published by this task.

## Result and scope

The short knowledge-base physiology module had become a selective summary rather than the intended detailed reference. It now has two explicit reading levels: four corrected orientation chapters, and 30 long-form chapters generated from the canonical `BG-SCIENCE.md` in the T1D Simulator repository. All numbered source sections, including 10b, are represented. No simulator code or model implementation was modified.

The corrected source snapshot is version **2026-09-16-v1**. Its 30 section bodies contain approximately **90,736 word tokens**, including bibliography and implementation footers; the transferred bodies contain **88,786** after structural omissions. Counts exclude Markdown link destinations but are not publication word counts. The difference is principally 38 implementation footers, status markers and part-divider lines. The source introduction and original table of contents are replaced by the knowledge-base module index rather than duplicated.

**Verification boundary:** every section was structurally mapped and its transferred output hashed. Selected problematic passages and their evidence were inspected; this is not a claim that every sentence or every underlying full text in the 90,000-word corpus received an independent scientific reappraisal. The restored reference retains substantial inherited evidence-verification work. A mechanically complete transfer is not a fully validated review.

## Canonical corrections

Following the user's instruction, scientific corrections were applied to the original source by the main agent, not embedded as a separate knowledge-base interpretation. The [correction log](2026-09-16_physiology-restoration/canonical-correction-log.json) records 51 targeted rules and 87 occurrences across the source, including:

1. Previously rejected physiological citation identities were corrected or removed rather than restored blindly. Exact intended identities were established for DeFronzo (1981), Søeborg (2009) and Lieber (2004); inaccessible numerical claims were narrowed or removed.
2. The Rizza glucose-production/utilization comparison remains explicitly abstract-supported. Unverified lipolysis, receptor-occupancy and Hill-coefficient tables are not presented as measured results from that experiment. The ratio 55/29 is approximately 1.90, not threefold.
3. Mathematical distinctions were corrected: a Hill response scales as concentration to the power *n* at low concentrations; its midpoint need not be its maximum-slope location; a glucose pool cannot be substituted for an insulin concentration.
4. Haahr and Heise's 20% versus 82% variability comparison was identified as a pharmacodynamic glucose-infusion-rate area-under-the-curve endpoint, with dose, repeated-clamp timing and steady-state context retained.
5. Unverified universal regulatory requirements, comprehensive-model rankings and quantified development-time savings were narrowed. Specific preclinical acceptance does not establish a requirement to test all algorithms on exactly 300 virtual subjects.

**FIXED, 16 September 2026:** the listed targeted defects. **PARTIALLY ADDRESSED:** broader source verification; other inherited claims and publication identities remain to be appraised. These statuses must not be read as certification of the entire source.

The source patch and rule file are historical audit artifacts only. The importer does not load or apply them. Future scientific revisions belong in canonical `BG-SCIENCE.md` and then propagate structurally.

## Synchronisation contract

`tools/import-physiology.mjs` accepts `--write --auto`, an explicit `--source <file>` or `T1D_BG_SCIENCE`, and a non-mutating `--check` mode. It creates numbered chapters and the [navigation fragment](2026-09-16_physiology-restoration/navigation.json). The [manifest](2026-09-16_physiology-restoration/coverage.json) records source version, source and generator fingerprints, source Git commit/dirty state at generation, omissions, section coverage and output hashes.

1. With a local canonical source, changed source or generator content triggers regeneration; unchanged content produces no writes.
2. Without the default sibling source, `--auto` retains the committed snapshot only after checking all output hashes and the generator fingerprint. An explicit invalid source path fails rather than silently falling back.
3. An edited generated chapter, conflicting unmanaged destination, invalid anchor, unresolved section link or removed mapping blocks synchronisation. User changes are not overwritten.
4. All chapters are prepared and validated before writes. Staged files replace outputs, with the manifest written last. A bounded retry handles transient Windows/Dropbox rename locks without deleting destinations. This is not a transaction across arbitrary filesystem failure; interrupted output fails subsequent integrity checks.
5. Text hashes normalise CRLF to LF for Windows/Linux portability. Article-file hashes remain byte-exact.

**Verification:** `tools/check-physiology-sync.mjs` passed source update, repeat-run determinism, no-overwrite, late validation failure, unmanaged-file protection and offline/CI cases. An initial transient Windows `EPERM` rename failure motivated the bounded retry; the complete test passed afterwards. No browser visual validation is claimed here.

## Literature reuse and unresolved acquisition

The [local literature register](2026-09-16_physiology-restoration/local-literature-register.json) records 103 matching file candidates from the existing physiological collection: 64 reading candidates were copied to the knowledge base's ignored article directory, and 13 byte-identical candidates reused. Remaining records were chiefly notes or files that did not establish full text and were not promoted to acquired articles. Automated article-body and PDF-signature checks are separated from bibliographic identity and scientific reading.

Across 566 distinct linked source URLs, 115 have a retained local candidate and 451 remain unmatched in this reconciliation. These are URL counts, not independent publication counts: DOI, PubMed and PMC links can identify the same work. Work-level deduplication and claim-level full-text appraisal remain incomplete. The [full-text backlog](2026-09-16_physiology-restoration/full-text-backlog.md) gives every unmatched URL an explicit acquisition status and lawful next route. Missing local matching is not labelled a paywall.

Gradel (2018) and Steiner (2015) XML reading copies previously inspected in the knowledge base were also copied back into the canonical source's ignored reference collection. The source wishlist's erroneous DeFronzo PMID was corrected and Søeborg/Lieber acquisition gaps added, preserving earlier entry dates. Three new identity checks and publisher attempts are recorded in the [access update](2026-09-16_physiology-restoration/source-access-update.json). None yielded a newly downloaded full text.

## Remaining work

1. Appraise restored claims against original studies, prioritising numeric tables, physiological-to-clinical extrapolation, current device/product assertions and the two research-model chapters. The restoration does not turn historical assertions into a current search.
2. Resolve the 451 unmatched URL records and inspect the retained candidates. Do not assume author/year filenames establish article identity or that a large HTML response is necessarily a valid full text.
3. Complete integrated navigation, public/private builds and visual reading/PDF checks in the main task. The new chapter volume must remain navigable without reintroducing duplicate scientific summaries.
