# Catalogue addition, search framing and targeted author follow-up

Date: 15 September 2026. Scope: narrow catalogue/editorial revision and an exploratory answer to an author-follow-up question, not a comprehensive literature-search update.

## Implemented changes

1. Added `dextro-dash-2000` as a publicly accessible proof of concept. Developer-authored information and affiliation are explicit; no outcome study or playtest is claimed. The catalogue now contains 46 records; the study register is unchanged.
2. Replaced prominent “anchor review” framing with independent searching, citation chaining and multiple-review comparison. Nørlev et al. is an initial reference-list source, not the sole foundation or a completeness guarantee. Its issue year is 2022, with online publication on 22 May 2021. Existing historical search-log limitations remain explicit.
3. Preserved the 24 August 2026 historical search cut-off and 6 September scientific correction date; the new product has its own 15 September appraisal/access date.

## Product verification

The official DEXTRO DASH 2000 browser page and GitHub repository were retrieved from the local PC on 15 September 2026 at approximately 10:39 UTC. Both returned HTTP 200 and matching titles. The repository README identifies Kristian Rauhe Harreby as concept developer, describes a fictional character, real-time platform-game mechanics and a physiology engine derived from T1D Simulator, and declares free browser access and GNU General Public License version 3 source. Product-page retrieval is not installation, gameplay testing or independent physiological/educational validation. No screenshot was added.

## Targeted author follow-up

The five authors of the 2022 participatory-design report are Jannie Nørlev, Christina Derosche, Katrine Sondrup, Ole Hejlesen and Stine Hangaard. The retained report was checked for author identity, prototype medium and study purpose. It describes a PowerPoint prototype intended for smartphone delivery, not a released smartphone application. Its small participatory evaluation is not evidence of clinical or educational effectiveness.

The following connections were established without treating coauthorship as proof of project continuity:

1. **Earlier game-related work:** Ole Hejlesen coauthored Lauritzen et al. (2012), *Social media and games as self-management tools for children and adolescents with type 1 diabetes mellitus*. The retained PDF and [institutional record](https://portal.fis.tum.de/en/publications/social-media-and-games-as-self-management-tools-for-children-and-/) establish the authorship and proposed social-game approach. It is not a follow-up trial of the later Nørlev prototype.
2. **Earlier educational simulation:** Hejlesen, Plougmann and Cavan (2000), *DiasNet: an Internet tool for communication and education in diabetes*. The [institutional bibliographic record](https://vbn.aau.dk/en/publications/diasnet-an-internet-tool-for-communication-and-education-in-diabe/) was verified locally; the indexed PubMed abstract describes experimentation with patients' own meal/insulin data. Full text was not acquired. This is an adjacent simulation/communication system, not evidence for an arcade game.
3. **Later adjacent research:** [Nørlev's institutional profile](https://vbn.aau.dk/en/persons/jadano/) lists subsequent insulin-adherence and telemonitoring work. [Nørlev and Hangaard (2026)](https://vbn.aau.dk/en/publications/development-of-a-digitally-applicable-tool-for-identifying-insuli/) report a digitally applicable adherence questionnaire. The abstract identifies a 10-item questionnaire and five-expert content-validity assessment, not a game or an educational-outcome trial. The linked PDF failed local retrieval; the record was added to the acquisition wishlist.

No verified later game release or follow-up effectiveness report for the 2022 prototype was located in this bounded search. This is not proof of discontinuation, no subsequent work, a change of job, or loss of funding. No unsupported biographical explanation was adopted. Searches for Derosche and Sondrup did not establish an additional diabetes-game publication beyond the two shared papers; author-name matching and coverage remain incomplete.

## Search and access scope

Web searches combined each of the five author names with `game`, `serious game`, `diabetes`, `publications`, and targeted exact-title searches. Follow-up searches included `DiaKost`, `DiasNet education simulation Hejlesen`, and the smartphone-paper title with follow-up/year terms. Nørlev's expanded name was resolved through the institutional profile and matching ORCID identity. These are exploratory web/indexed-publication searches, not an exhaustive author bibliography or a new multi-index citation census.

Locally verified institutional pages: prototype article, Nørlev profile, 2026 questionnaire article, DiasNet 2000 record and the Lauritzen 2012 record (all HTTP 200 with matching identity). The TUM address redirected to its trailing-slash equivalent. JMIR article retrieval returned HTTP 202 with no content; PubMed returned a cookie challenge; the Nørlev all-publications page and the 2026 repository PDF returned HTTP 403. No challenge was bypassed. The existing Nørlev 2022 and Lauritzen 2012 PDFs were reused. DiasNet 2000 and the inaccessible 2026 PDF were recorded on the wishlist with access failure distinguished from a paywall.

## Verification

Passed `tools/validate.mjs`, including scientific regression checks: 46 games, 23 study/report records. The private site and standalone tablet file were rebuilt successfully: 27 chapters, 12 retained review images, approximately 8.66 MiB. `docs/reviews/2026-09-06_corrections/verify-build.mjs` passed its static assertions. Browser visual validation and gameplay testing were not performed. No simulator or DEXTRO DASH code was changed. No commit or push was requested.

### Subsequent pre-push verification

The owner subsequently requested commit and push. A public build and static validation passed; private literature, review-only images, the standalone private edition and generated `_site` files are excluded from Git. A local check of all 190 external URLs in the 27 rendered public pages returned 152 automatically classified as working and 38 restricted, with no automatically classified broken links. Manual inspection identified false-positive success labels among HTTP 200 “Client Challenge” pages, empty HTTP 202 responses, “Redirecting” intermediate pages and generic APA landing pages. These remain access-restricted or destination-content-unverified, not confirmed working article links. The local report is retained under `.validation/prepush-2026-09-15/`; the automated classification is not a guarantee of source identity, content access or scientific support. No access challenge was bypassed.
