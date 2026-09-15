# Reading structure and catalogue consolidation — 15 September 2026

## Request and status

**Implemented locally.** The reading edition now uses one searchable, sortable game table instead of separate catalogue tables, profile lists and product-access snapshots. No publication or Git push was performed.

## Changes

1. Retained all 46 game records and all 23 report-level appraisals. Each game has a two- or three-sentence editorial description, an explicitly classified display date, visible languages, platform, audience, intended learning objectives, evidence, access and price. Detailed results, instruments, denominators and limitations remain within expandable rows.
2. Removed the publication-as-access fallback. Game names open their records; product websites, stores, browser games, repositories, registries, research reports and secondary-review mentions have distinct labels. A missing public game link is stated explicitly.
3. Removed redundant product inventories from the field, evidence, availability, comparison and source-summary reading paths. The old catalogue/profile URLs retain short relocation pages, but are not additional chapters or search results.
4. Moved method/source navigation after the substantive chapters. The home page and evidence map lead with content rather than general classification rules; actual study limitations remain next to results.
5. Added an edge-docked menu with optional local-storage persistence. Desktop readers can reclaim the sidebar width; tablet-sized viewports start collapsed when there is no saved preference. The shared script supports keyboard operation, Escape, and browsers that refuse local storage.
6. Added individual-game search entries and preserved game-specific anchors in the self-contained tablet export.

## Evidence and provenance

This is an **editorial revision**, not a new systematic search, availability audit or playtest. Descriptions and dates were synthesised from the retained catalogue and former profiles using the project's scientific-review skill. No new outcome estimates were introduced; the study register was not changed. Release dates are not inferred from publication or access dates. Incompletely documented gameplay and languages remain qualified.

No new scientific source was introduced, so no new article acquisition or wishlist entry was required. Existing full-text/access limitations remain in the source records. The new direct README catalogue URL was retrieved from the local PC: HTTP 200, title “Game explorer | T1D Serious Games Knowledge Base”, catalogue search control present. The other external URLs reuse retained source/product records; their availability dates have not been refreshed. This turn did not repeat a comprehensive live external-link audit.

## Text consolidation

Approximate whitespace-token counts excluding URL strings, including headings and reference lists. These are not word counts of the entire site: expanded catalogue descriptions, product metadata and study appraisals are generated separately. Reduction includes consolidation into the catalogue, not deletion of the underlying evidence.

| Source | Before | After |
|---|---:|---:|
| index.qmd | 1119 | 488 |
| knowledge/games/index.qmd | 1099 | 779 |
| knowledge/games/evidence-map.qmd | 2085 | 1121 |
| knowledge/games/availability.qmd | 1790 | 590 |
| knowledge/games/catalogue.qmd | 1881 | 43 |
| knowledge/games/profiles.qmd | 3021 | 43 |
| knowledge/comparisons/comparative-analysis.qmd | 1728 | 745 |
| references/SOURCE-INDEX.md | 2109 | 1489 |

## Verification

1. Public and private builds completed: 25 reading chapters, plus two relocation pages in the multipage site.
2. Catalogue validation and scientific regression checks passed: 46 games and 23 report records.
3. The new reading-interface tests passed for text/combined/language filters, empty results, both year-sort directions, unknown dates, row expansion, deep links, persisted menu state, compact defaults, storage denial and Escape.
4. Generated HTML checks passed for internal files/assets, offline unique IDs and cross-chapter game anchors. The public build excludes review-only game image files.
5. The standalone private tablet file was rebuilt at approximately 8.16 MiB; the private multipage build retained 12 review images.
6. **Limit:** interaction tests use a small DOM test double and static generated-output assertions. They are not visual browser inspection, touch-device testing or game playtesting. Browser rendering was not performed in this turn.

The final local multipage output is the public-safe edition; the separately generated tablet HTML remains the private image edition.
