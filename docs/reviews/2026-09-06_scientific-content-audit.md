# Scientific Content Audit

## T1D Serious Games Knowledge Base

**Review date:** 6 September 2026. **Reviewed revision:** `22261b2f17acb66bcc77d1e446a93ee58fecde02`, with the local working tree inspected. **Mode:** critical review; chapter corrections are proposed, not implemented. **Audience:** researchers, clinicians, educators, developers and maintainers.

## 1. Executive assessment

The knowledge base has a useful multidisciplinary structure, but its current scientific reliability is insufficient for use as an independently verified reference. The principal problem is not simply a shortage of citations. Some citations identify different publications; some studies are assigned the wrong population or design; and several plausible design or sustainability hypotheses become empirical assertions when repeated elsewhere.

The audit identified **12 distinct PubMed identifiers that do not identify the work attributed to them** in the physiological chapters. Several resolve to completely unrelated subjects, including leukaemia, ovarian tissue, neuronal neurotransmitter release and ultrasound beamforming. Successful network responses therefore concealed substantive bibliographic errors. This finding does not demonstrate that every associated physiological proposition is false; it demonstrates that the stated support is invalid.

Product evidence is distorted in both directions. *Diabetic Mario* is classified as a controlled outcome study despite the available original paper describing an uncontrolled Android pilot with 12 children, without requiring diabetes for eligibility. Conversely, the *eddii* record understates a published, company-sponsored randomised trial as unspecified engagement evidence. Its limitations are substantial, but omitting its measured glycaemic endpoint is not justified by those limitations. *I Got This* is misclassified as type 1 diabetes (T1D) and attributed to the wrong developer; the official product describes type 2 diabetes (T2D) and identifies the University of California, Berkeley's Lawrence Hall of Science. [Baghaei et al. (2016)](https://doi.org/10.1089/g4h.2015.0038), [Ahmadi and Lucero (2025; online 2024)](https://doi.org/10.1177/19322968231223759), [Lawrence Hall of Science (n.d.)](https://lawrencehallofscience.org/science-apps/i-got-this/).

Important existing conclusions survive scrutiny. Knowledge, satisfaction, transfer, self-management behaviour and clinical outcomes must remain separate. The knowledge base generally avoids claiming class-wide clinical efficacy. Its interpretation of the small historical *Packy & Marlon* trial is appropriately cautious, and its principal numerical summary of the diabetes-game meta-analysis is accurate. However, these strengths do not compensate for the identified source and classification defects. [Brown et al. (1997; abstract verified)](https://pubmed.ncbi.nlm.nih.gov/9183781/), [Yao et al. (2024)](https://doi.org/10.2196/43574).

**Recommendation:** retain the architecture and scientific ambition; correct source identity and study extraction before expanding the prose. Do not describe the present content as scientifically verified. This is a recommendation about evidential status, not a decision to withdraw or publish the website.

## 2. Scope, method and limits

### 2.1 What was inspected

The complete source-corpus inspection covered **30 documents**: 24 navigable source pages, including the source register and wishlist, plus six editorial/repository documents. All **45 game records** were read, including audience, gameplay, provenance, evidence, availability and design-assessment fields. The corpus contains approximately 39,500 whitespace-delimited words, including tables, references and metadata. Coverage and source hashes are recorded in [coverage.json](2026-09-06_scientific-content-audit/coverage.json).

The audit compared narrative pages with structured records and inspected the build and validation pathways. It did not playtest products, install mobile applications, audit the physiological implementation of T1D Simulator, or conduct a complete accessibility or visual-design review. Existing unrelated visual changes were preserved. No simulator files were changed.

### 2.2 Source verification

Verification proceeded from the proposition to its cited work, not from a search result to a plausible-sounding paragraph. Checks included digital object identifier (DOI) and PubMed identifier (PMID) resolution, title and author reconciliation, locally retained full text, relevant methods/results sections, and comparison with the exact claim. The audit retained technical retrieval records from the user's computer. Publisher and repository access restrictions are not interpreted as negative scientific evidence.

An existing local link checker assessed 178 external uniform resource locators (URLs): 142 were classified as working, 35 as restricted and one as broken. These are **technical screening results**, not 142 scientifically correct references or 142 installable products. The apparent Sorensen handle failure was inconsistent with a successful Portable Document Format (PDF) retrieval through the source-acquisition workflow; it should be treated as route-dependent access, not definitive disappearance.

The scholarly-source register additionally records identifier and acquisition checks; its live totals and access backlog are in [counts.json](2026-09-06_scientific-content-audit/counts.json) and [source-access-register.json](2026-09-06_scientific-content-audit/source-access-register.json). Counts refer to encountered identifiers and URLs, not a deduplicated universe of independent studies. Downloaded files and metadata matches were not automatically treated as verified claim support. The more limited set of substantively appraised sources is explicitly listed in [inspected-sources.json](2026-09-06_scientific-content-audit/inspected-sources.json).

### 2.3 Search and appraisal boundaries

This was a single-agent, whole-corpus scientific audit with targeted literature and product checks. It was **not** a new formal systematic review, a complete rerun of every historical database search, independent dual screening, or a claim-by-claim verification of every underlying reference. Targeted searches investigated suspected citation mismatches, omitted evidence and lawful full-text routes. Exact query families actually issued during this audit, dates, discoveries and access outcomes are recorded in [search-log.md](2026-09-06_scientific-content-audit/search-log.md).

The historical 24 August 2026 evidence cut-off was not silently advanced. Sources discovered or checked on 6 September are audit evidence; proposed additions must receive an explicit update date. No global percentage of “unsupported claims” is reported: paragraph-level citation detection cannot provide that denominator reliably.

## 3. Priority findings

Findings are **OPEN** unless a specific partial action is recorded. F21 is partially addressed through the new acquisition rules and expanded wishlist; source gaps remain. “Major” denotes a defect materially affecting scientific interpretation, provenance or reproducibility. “Minor” denotes a narrower correction or qualification. “Editorial” denotes internal status or presentation inconsistency. These labels describe consequences, not evidence that harm has occurred.

### F01 — Major: twelve misidentified physiological references

**Locations:** `knowledge/physiology/glucose-insulin-system.qmd:20–38`; `meals-insulin-exercise.qmd:25–35`; `variability-and-safety.qmd:36–40`; `model-families.qmd:24–47`, and their reference lists. Exact occurrences are retained in the source register.

| Attributed work | Cited PubMed identifier | Work actually identified, abbreviated |
|---|---|---|
| DeFronzo et al., 1981 | 7026740 | Notexin and acetylcholine release in rat brain preparations |
| Chadt and Al-Hasani, 2020 | 32591907 | Antiresorptive-associated osteonecrosis of the jaw |
| Rizza et al., 1981 | 7011057 | Pulmonary injury during endotoxaemia in sheep |
| Cryer, 2002 | 12107742 | Vascular function, insulin resistance and fatty acids |
| Wolever, 2008 | 18175767 | Riccardi et al.: glycaemic index/load across metabolic states |
| Søeborg et al., 2009 | 19150402 | B-cell signalling proteins, not insulin pharmacology |
| Heinemann, 2018 | 30058925 | Glucagon-like peptide-1 receptor agonists and cancer |
| Haahr and Heise, 2014 | 24729196 | Chronic myeloid leukaemia: 2014 update |
| Lieber, 2004 | 15303622 | Oscar-Berman and Marinkovic: alcoholism and the brain |
| Cobelli et al., 2009 | 20948577 | Residual ovarian tissue and bone loss in aged mice |
| Bondia et al., 2018 | 29994703 | Doppler-based ultrasound motion compensation |
| Kovatchev et al., 2009 | 21129332 | A multinational closed-loop clinical study, not the attributed in-silico paper |

**Evidence:** local Europe PubMed Central (Europe PMC) metadata for the exact cited identifiers; not a similarity search. Complete titles and authors are preserved in the machine-readable register.

**Correction:** identify each intended work and then recheck the proposition against that work. Do not repair identifiers by selecting any paper on a similar topic. Confirmed intended records include Rizza's dose-response study, PMID 7018254; Haahr and Heise's degludec review, PMID 25179915; and Cobelli's model review, PMID 20936056. The degludec full text was located; unresolved texts remain in the acquisition backlog. [Rizza et al. (1981; abstract verified)](https://pubmed.ncbi.nlm.nih.gov/7018254/), [Haahr and Heise (2014)](https://pubmed.ncbi.nlm.nih.gov/25179915/), [Cobelli et al. (2009; metadata verified)](https://pubmed.ncbi.nlm.nih.gov/20936056/).

### F02 — Major: a controlled study is created from an uncontrolled pilot

**Locations:** `data/games.json`, record `diabetic-mario`, particularly `evidence.level`, `target_population` and `platforms`; `knowledge/games/catalogue.qmd`, Diabetic Mario row; `knowledge/games/evidence-map.qmd`, knowledge evidence table.

The record assigns “controlled outcome study”, a personal-computer platform and T1D-specific framing. The retained author manuscript describes a pre/post pilot, 12 children aged 9–13, Samsung tablets/Android, and one week of exposure. Diabetes was not an eligibility requirement. There was no concurrent comparator. The manuscript reports a health-knowledge questionnaire, not demonstrated diabetes-management competence.

**Correction:** classify the evaluated version as an uncontrolled mobile pilot, explicitly separate the intended diabetes audience from the recruited sample, supply the actual sample size and assessment, and avoid borrowing T1D specificity from the anchor review. Secondary reviews can themselves misclassify primary research. [Baghaei et al. (2016), Methods §4.1–4.3](https://doi.org/10.1089/g4h.2015.0038).

### F03 — Major: eddii's outcome evidence is materially understated

**Locations:** `data/games.json`, record `eddii`; `knowledge/games/catalogue.qmd`, adjacent-management table; `knowledge/games/availability.qmd`, eddii row.

The JavaScript Object Notation (JSON) record uses “public product without peer-reviewed evaluation” while also containing an unlinked study string. The cited publication is an open-label randomised trial, not merely an engagement report. Ninety-two children aged 5–12 were randomised; glycaemic analyses included 70 participants, 38 intervention and 32 control. Following two onboarding weeks, the intervention used the app for six weeks, with additional follow-up described. The abstract reports an adjusted difference-in-differences (the between-group difference in change over time) of approximately **5.38 percentage points in time in range**, versus Dexcom G6 alone.

Important limitations include exclusion after randomisation, reassignment of three consecutive enrollees to replenish an arm, short exposure, high baseline time in range, narrow device eligibility, and company sponsorship/employment. These limit causal confidence and generalisability; they do not turn a measured glycaemic endpoint into engagement-only evidence. The paper also contains reporting inconsistencies requiring care, including self-care scores exceeding the stated scale maximum.

**Correction:** retain eddii in the gamified-management category, add the published trial and outcome-specific limitations, and distinguish company-sponsored evidence from independent replication. Do not infer educational transfer or current-version efficacy from this trial. [Ahmadi and Lucero (2025; online 2024), Methods, Results and disclosures](https://doi.org/10.1177/19322968231223759).

### F04 — Major: I Got This has the wrong disease and provenance

**Locations:** `data/games.json`, record `i-got-this`; `knowledge/games/catalogue.qmd` and `profiles.qmd`, experiential-game entries.

The record calls the work T1D-specific and attributes it to Ayogo and the Diabetes Hands Foundation. The official page, fetched locally with matching visible content, describes a girl diagnosed with **T2D**, identifies the Lawrence Hall of Science as creator, and describes public research funding and clinical/educational collaborators. Reinders' own table also identifies T2D.

**Correction:** retain it as an explicitly adjacent experiential game; correct disease, developer, languages and official source. The product page's download claims still require contemporary store/device confirmation. [Lawrence Hall of Science (n.d.)](https://lawrencehallofscience.org/science-apps/i-got-this/), [Reinders et al. (2024), Table 2](https://doi.org/10.1016/j.diabres.2024.111833).

### F05 — Major: mixed-diabetes findings are labelled direct T1D evidence

**Locations:** `knowledge/sustainability/why-games-disappear.qmd:12,73,101`; `knowledge/games/availability.qmd:10`; `knowledge/design/learning-science.qmd:70`.

Reinders explicitly included T1D and T2D, children and adults. Its overall 23-game denominator is not a T1D-only estimate. Yao's review also combines diabetes populations and includes exercise-oriented interventions. A “Direct T1D evidence” badge attached to pooled statements overstates population applicability.

**Correction:** label the aggregate as mixed-diabetes field evidence and extract a T1D subset only if the underlying records permit it. For recent T1D knowledge gains, cite the actual T1D studies instead of using a glucose-focused mixed-diabetes meta-analysis as omnibus support. [Reinders et al. (2024), eligibility criteria](https://doi.org/10.1016/j.diabres.2024.111833), [Yao et al. (2024)](https://doi.org/10.2196/43574).

### F06 — Major: non-release is converted into disappearance

**Locations:** `index.qmd:19`; `knowledge/sustainability/why-games-disappear.qmd:14`; `knowledge/games/availability.qmd`, explanatory sections.

“The finding establishes loss of access” is too strong. Reinders reports that 21/23 research games were not published/available publicly, and its conclusion specifically discusses games never publicly released. That observation is not a longitudinal estimate of previously available products becoming unavailable. A discontinued commercial game and a never-released prototype represent different implementation failures.

**Proposed replacement:** “The review documents limited public access to research-origin diabetes games. It does not establish how many had previously been publicly available, nor why individual projects were not released or ceased distribution.” [Reinders et al. (2024), Discussion and Conclusion](https://doi.org/10.1016/j.diabres.2024.111833).

### F07 — Major: sustainability hypotheses become established causal explanations

**Locations:** `knowledge/games/availability.qmd`, “Why a research game often disappears” and “Why games are rarely offered during diagnosis education”; contrast `index.qmd`, explicitly labelled sustainability hypothesis.

Funding termination, staff turnover, multidisciplinary dependence and procurement constraints are plausible explanations. The resource sometimes labels them appropriately, but elsewhere states the causal account without study-specific evidence. The brochure comparison is particularly categorical. General digital-health and software-maintenance evidence cannot quantify which causes dominate T1D game non-release or discontinuation.

**Correction:** maintain a three-part distinction: observed access state; documented project-specific cause, where available; and untested system-level hypothesis. Describe how the hypothesis could be tested through maintainer interviews, archived release histories and reasons-for-closure coding. Existing adjacent sustainability literature can inform those questions without becoming direct T1D causal evidence. [Braithwaite et al. (2020)](https://doi.org/10.1136/bmjopen-2019-036453), [Kaboré et al. (2022)](https://doi.org/10.3389/fdgth.2022.1014375).

### F08 — Major: historical search reproducibility is overstated

**Locations:** `methods.qmd:27`; `references/SOURCE-INDEX.md`, §§1 and 3.

The methods promise database-specific queries, retrieval outcomes and individual eligibility decisions. The inspected source register contains query families, dates, aggregate citation counts and category summaries, but not the full database-by-database executed queries, raw forward-citation records, reconciled union or record-level exclusion log needed to reproduce those claims. The corresponding legacy Simulator collection was searched and contained essentially the same summary, not the missing raw citation exports.

This is an **auditability gap**, not evidence that the historical searches were never performed. Counts of 36 OpenAlex and 24 Semantic Scholar citations cannot substitute for the records and decisions behind them.

**Correction:** recover historical exports if they exist; otherwise state that the search is only partially reconstructable. A new search must use its actual execution date and cannot retroactively substantiate the old counts.

### F09 — Major: study extraction is incomplete despite a complete-looking schema

**Locations:** `data/games.json`, including `ar-food-game`, `pal`, `diaquarium`, `diabetic-mario`, `norlev-smartphone-prototype`, `insuonline` and `eddii`; `tools/validate.mjs`.

Fields contain placeholders such as “reported in article”, “see source” and “varied”. Several study strings have no stable identifier; `eddii.links.publications` is empty despite a study being mentioned. The current validator checks record shape and selected enum values, not study identity, comparator, analysed denominator, outcome instrument, timing, effect estimate or correspondence with the prose.

**Correction:** introduce a study-level register with stable study and report identifiers. Game records should link to it, not compress the entire evidence base into one rating and free-text sentence. Missing extraction should remain explicitly incomplete. A structurally valid JSON file is not a validated evidence map.

### F10 — Major: Qare and Qure's paired-caregiver interpretation is unverified

**Locations:** `knowledge/design/learning-science.qmd:88,136`; `data/games.json`, `qare-and-qure`; related catalogue row.

The bibliography supplies a title about paired educational games for children and caregivers. The DOI identifies **A Simple Health-Based Game for Children**, by Moosa, Al-Maadeed and AlJa'am. The anchor review describes a child character and an arcade-style game; it does not establish the asserted linked child–caregiver system. The primary full text was not obtained.

**Correction:** repair the bibliographic title and flag paired-role gameplay as unverified pending the original paper. Do not infer two user roles from a product's two-word name. The nearby citation to Nørlev's separate participatory smartphone study also does not document PAL's dashboard. Cite each project to its own publication. [Nørlev et al. (2022a), evidence table](https://doi.org/10.1177/19322968211018236), [Moosa et al. (2018; metadata verified, full text outstanding)](https://doi.org/10.1109/COMAPP.2018.8460213).

### F11 — Major: prescriptive learning claims exceed their cited support

**Locations:** `knowledge/design/learning-science.qmd:43–50,68,84`; `knowledge/design/game-mechanisms.qmd`; `knowledge/comparisons/comparative-analysis.qmd`, archetype discussion.

Examples include “Immediate disclosure of the complete answer can suppress reasoning”, the claim that quizzes are “strongest” under a specific combination of conditions, and an uncited field-wide statement about the rarity of delayed transfer tests. These may be reasonable hypotheses, but the local text does not establish their boundary conditions or provide a transparent evidence denominator. A theoretical mechanism, an intervention feature and an experimentally isolated mechanism are not interchangeable.

**Correction:** link each empirical proposition to the result that supports it; replace universal or comparative language where no comparison exists; label the proposed four-layer feedback architecture as design inference. Preserve the useful predict–act–observe–explain–retry–vary loop, but do not call it an empirically validated complete package.

A concrete adjacent source is available for a narrower claim: Butler and colleagues compared explanatory with correct-answer feedback in two text-learning experiments, including delayed inference questions. That is stronger support for a bounded feedback proposal than a general statement that more explanation is always better; it is still not T1D game evidence. [Shute (2008)](https://doi.org/10.3102/0034654307313795), [Butler, Godbole and Marsh (2013), author-deposited full text](https://sites.wustl.edu/mdl1/files/2026/06/Butler-et-al.-2013-Explanation-feedback-is-better-than-correct-answer-feedback-for-promoting-transfer-of-learning.pdf).

### F12 — Minor: the five-to-eight-user heuristic needs qualification

**Location:** `knowledge/human-factors/onboarding-and-accessibility.qmd:108`.

A precise sample-size range is provided without a source or an explicit iterative-testing rationale. The text correctly says that such a sample cannot estimate prevalence or effectiveness. Nevertheless, the range can be read as a generally adequate design rule across highly different ages, literacy levels and access needs.

**Correction:** present a small first round as a pragmatic formative-testing proposal, not a universal adequacy threshold. Specify target group, tasks, stopping criterion and repeated rounds; distinguish issue discovery from quantitative estimation. The tutorial evidence cited earlier does not validate this sample-size rule. [Andersen et al. (2012)](https://doi.org/10.1145/2207676.2207687).

### F13 — Major: field-wide absence claims lack reproducible bounds

**Locations:** product profiles and JSON statements of “no independent evaluation”; `knowledge/design/learning-science.qmd:84,90`; MyDiabetic's “Best-documented” JSON summary.

“No qualifying study located in this search” is a bounded observation. “Best-documented” and “clearest controlled signal” imply systematic comparative appraisal. The resource lacks a transparent, complete study-level table sufficient to justify those superlatives. The eddii omission demonstrates that the absence claims need active checking.

**Correction:** give search date, aliases, databases and inclusion criteria for important absence claims; avoid superlatives without a defined comparison. Do not convert failure to retrieve a paper into absence of evidence. Treat abstracts, full-text appraisal and inaccessible studies as distinct states.

### F14 — Minor: platform and availability representations disagree

**Locations:** `knowledge/comparisons/comparative-analysis.qmd`, AvaType1 row; `data/games.json`, `ava-type-1`; headings for “currently available” companions and FlightGlucose.

The comparison says AvaType1 iOS/Android listings were identified, whereas the canonical record lists only iOS/iPadOS and explicitly notes iOS-only access. Several “currently available” groupings include products whose public acquisition is incompletely verified.

**Correction:** generate repeated factual fields from the canonical catalogue. Separate an active website, a visible store listing, a completed installation and a successful play session. A group heading must not silently upgrade a record's access status. This audit did not install the apps and does not settle their complete regional availability.

### F15 — Minor: bibliographic metadata needs a second pass beyond wrong identifiers

**Locations:** physiological reference lists; Gu citations in profiles/source index; Yao entries in the home page and methods.

Examples include Becker and Frick's 2008 insulin-glulisine pharmacokinetic review cited as Becker 2007 with a different title/journal; Horowitz's 1993 healthy-subject study given a different title and implied clinical context; and Yao's paper assigned a paraphrased title, incorrect first-author initial and *Journal of Medical Internet Research*, although the article is in *JMIR Serious Games*. Gu's published 2026 volume is correctly identified in one reference list but cited as 2025 elsewhere. Preserve online-first and volume dates rather than guessing from digits in the DOI.

A useful negative control: the MyDiabetic PDF's filename suggests Koutna, but its actual title page identifies **Daniel Novak**. The existing Novak citation should not be “corrected” on the basis of that filename. Source contents, not filename or reviewer expectation, decide identity.

### F16 — Major: quantitative physiology is not consistently anchored to context

**Locations:** `knowledge/physiology/glucose-insulin-system.qmd`; `meals-insulin-exercise.qmd`; `variability-and-safety.qmd`; `model-families.qmd`.

The chapters contain useful distinctions between compartments, timing, counterregulation and model purpose. However, several numerical or mechanistic claims sit beside mismatched references, and some “established evidence” callouts provide no direct citation at the point of assertion. A correct-looking range is insufficient for modelling unless population, protocol, formulation, measurement compartment and uncertainty are identifiable.

**Correction:** after F01, create a quantitative claim table for values actually retained in the prose: value/range, units, population, experimental conditions, source location and intended scope. Distinguish plasma pharmacokinetics from glucose-lowering pharmacodynamics and interstitial measurement delay from model compartments. Avoid declaring general physiological propositions false solely because the present citation is wrong.

### F17 — Major: endpoint labels obscure what was measured

**Locations:** `knowledge/games/evidence-map.qmd`, practical competence section; Gu/DiaPed/WeCan records; `methods.qmd`, evidence classes.

Injection-related observed distress is not injection-technique competence. A self-management scale is not necessarily a knowledge examination or independently observed performance. Gu's abstract reports “95% session completion”, whereas its results describe **95% of children attending at least 10 of 12 sessions** and dropout below 4%. These are different denominators; the paper's reporting discrepancy prevents confidently labelling the figure as overall follow-up completion. WeCan satisfaction is respondent-based and should not share an implicit denominator with randomisation or completion. The methods also group pre/post designs and feasibility objectives together, although feasibility trials can be randomised.

**Correction:** store study design, study purpose, outcome construct, instrument, denominator and follow-up separately. Preserve these distinctions in every compressed table. [Ebrahimpour et al. (2015)](https://doi.org/10.5812/ijp.25(3)2015.427), [Gu et al. (2026)](https://doi.org/10.1038/s41598-025-30114-1), [Wu et al. (2024; abstract verified)](https://doi.org/10.1016/j.pedhc.2024.05.009).

### F18 — Major: numerical accuracy is not the same as methodological credibility

**Locations:** outcome summaries throughout `knowledge/games/evidence-map.qmd`, `profiles.qmd`, and `data/games.json`.

The summaries usually acknowledge small samples and short follow-up. They rarely provide outcome-specific appraisal of allocation, departures from assignment, missing data, measurement validity, selective reporting or commercial conflicts. Reporting a very large pre/post effect without the calculation convention is particularly difficult to interpret. The detailed eddii reading illustrates why design labels alone cannot provide credibility ratings.

**Correction:** appraise each important endpoint using design-appropriate domains and justify judgments. Do not reduce qualitative studies, feasibility studies and controlled trials to a single ascending “quality” hierarchy. For meta-analyses, preserve populations, comparators, heterogeneity and uncertainty; do not pool incomparable learning and clinical outcomes. No new pooled effect was calculated in this audit.

### F19 — Major: useful comparator literature is omitted or disconnected

**Locations:** `references/SOURCE-INDEX.md`; learning/evaluation chapters; catalogue records for adjacent interventions.

Targeted searching identified a 53-study family/child educational-technology review covering both digital and non-digital methods and a 2026 paediatric digital-health review with explicit behavioural-theory mapping. These are not substitutes for a serious-game review, but they directly inform the brochure comparison, caregiver scope and gamification boundary. Papers on bant, Diabetes Journey and Diactive-1 are already present in the local source collection or wishlist but are not reconciled transparently to catalogue inclusion/exclusion decisions.

**Correction:** record eligibility decisions for these candidates, distinguish games from broader mobile health, and inspect primary studies before importing review conclusions. Maintain comparator modules for physical play, adult learning, caregiver education, psychosocial outcomes and mixed-diabetes products. The audit identifies gaps, not a claim that every candidate must become a core game. [Morgado et al. (2025)](https://pubmed.ncbi.nlm.nih.gov/39899746/), [Beh et al. (2026)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12954698/).

### F20 — Minor: “neutral” comparison still contains unlabelled preferences

**Locations:** `data/games.json`, multiple `design_assessment.design_relevance` fields; comparison archetypes.

The revised comparative chapter appropriately treats T1D Simulator as one product among others. Residual JSON advice nevertheless assumes a lightweight, no-personal-health-data simulation as the preferred destination, including instructions to avoid proprietary devices or preserve a particular data boundary. Those may suit one project but are not universal rules for an inclusive knowledge base. Some strengths/limitations also read as observed usability judgments despite desk-research status.

**Correction:** state the use case and label these as design trade-offs or hypotheses. A psychosocial game need not model glucose; a clinically governed data-linked intervention is not automatically an inferior learning product. Reserve observed usability language for an actual documented test.

### F21 — Major: source acquisition was too narrowly governed and incompletely tracked

**Status: PARTIALLY ADDRESSED — 6 September 2026.** Acquisition policy and wishlist coverage improved; unresolved full texts and incomplete appraisal remain.

**Locations:** `references/PAYWALLED-WISHLIST.md`; source-register acquisition statements.

The previous wishlist sometimes treated absence of an explicit redistribution licence as a reason not to retain an author-uploaded paper for private reading. Ordinary lawful access and permission to republish are separate questions. Meanwhile, numerous learning-science and physiological citations had no corresponding entry in the game-focused wishlist.

**Action in this audit:** expanded the acquisition backlog, reused existing legitimate article files, acquired open full texts where routes worked, and recorded unsuccessful routes rather than retaining challenge pages. Brown's discovered author-upload route returned Hypertext Transfer Protocol (HTTP) status 403 locally; this is recorded as a retrieval limitation, not a finding about the paper's copyright status. Unrelated papers reached through wrong citations are not counted as acquisition of the intended work. The reviewed scientific chapters have not been rewritten.

### F22 — Editorial: governance contradicts the current licensing documents

**Location:** `GOVERNANCE.md:5–7`, compared with `LICENSING.md`, `CONTRIBUTING.md` and `CITATION.cff`.

Governance still describes a private initial phase and absence of an open licence. The licensing documents already assign Creative Commons Attribution 4.0 to original content and the MIT licence to software. This is an internal status contradiction, independent of any legal interpretation.

**Correction:** update governance to the actual project phase and distinguish completed publication decisions from proposed future roles. This audit does not change repository visibility or licensing.

### F23 — Major: living-update provenance is insufficiently granular

**Locations:** frontmatter across chapters; site-wide cut-off text; `references/PAYWALLED-WISHLIST.md`, SugarVita entry.

The resource mixes an August evidence cut-off, September availability checks, physiology metadata claiming review through 2025, and later comparator discoveries. These can coexist, but readers cannot reliably tell which search supports each chapter or whether a later addition changes field-wide conclusions.

**Correction:** retain separate dates for scientific search, substantive appraisal, product access, content revision and rendered build. Add a change record explaining whether an update adds evidence, changes interpretation or merely repairs metadata. Do not let a rebuild date imply fresh literature searching.

### F24 — Major: correction propagation and release checks are inadequate

**Locations:** repeated catalogue/profile/comparison tables; `data/games.json`; `tools/build-site.mjs`; `tools/validate.mjs`.

The builder copies JSON and renders independently maintained prose. Neither process reconciles their scientific claims. Existing validators can therefore accept the wrong trial design, a mismatched PubMed identifier or an Android claim contradicted by the canonical record. Spot checks of the existing rendered catalogue confirmed that the disputed Diabetic Mario and I Got This entries reach the reader. The two original scientific figure sources were also inspected; timeline eras and product dates require evidential reconciliation, not only valid Scalable Vector Graphics (SVG) markup. The learning-loop figure remains a conceptual proposal rather than a tested intervention package.

**Correction:** link findings to canonical claim/study IDs, regenerate repeated factual fields where practical, and add explicit tests for known corrected errors. Test source identity and claim support separately from link reachability, syntax, navigation and page layout. Retain the audit history with open/fixed/partial status and verification date.

## 4. What should be retained

1. **Outcome separation.** The distinction between factual knowledge, competence, transfer, behaviour, distress and clinical outcomes is central and generally well expressed.
2. **Cautious interpretation of small trials.** Brown's abstract supports the reported parent-communication and self-care signals, not class-wide benefit or a statistically established urgent-care reduction. Full text remains necessary for deeper appraisal.
3. **The main Yao extraction.** Seven studies and 607 participants contributed to the reported glycated haemoglobin (HbA1c) mean difference of −0.09 percentage points, 95% confidence interval −0.29 to 0.10, P=.36. The physical-activity estimate and substantial heterogeneity are also accurately described. These mixed-diabetes results do not establish T1D educational transfer. [Yao et al. (2024), Results](https://doi.org/10.2196/43574).
4. **Hypothesis-driven simulation design.** The proposed predict–act–observe–explain–retry–vary loop is a useful research programme when labelled as such. Adjacent retrieval experiments support narrower retention/transfer mechanisms, not the effectiveness of every simulation implementing the loop. [Butler (2010), author-deposited full text](https://sites.wustl.edu/mdl1/files/2026/06/Butler-2010-Repeated-testing-produces-superior-transfer-of-learning-relative-to-repeated-studying.pdf).
5. **An inclusive directory.** Historical, commercial, academic, independent, psychosocial and experiential work should remain visible without being ranked on one physiological or clinical scale.
6. **Provenance and uncertainty fields.** The schema's intent is valuable; its contents need better extraction and consistency rather than replacement with promotional descriptions.

## 5. Recommended correction sequence

### Stage 1 — Restore bibliographic and classification integrity

Resolve F01–F04 and F10 before substantial expansion. Reconcile paper identity, study design, population, product/version and endpoint. Repair metadata globally only after the intended work is confirmed. Preserve unresolved claims as explicitly unverified, or remove them from evidential summaries until support is obtained.

### Stage 2 — Build the claim–study–game relationship

Use separate identifiers for a game, an evaluated version, a study, a publication and a claim. A single study may generate several publications; a game may be evaluated in several studies. Record source locations and outcome-specific limitations. Avoid double-counting participants or assigning one efficacy label to a whole product.

### Stage 3 — Reconcile inference and evidence

Review uncited empirical assertions, superlatives and causal maintenance explanations. Retain well-reasoned design proposals, but make their status visible next to the proposition. Add primary support for narrower claims where available. Do not add decorative citations that merely discuss the same subject.

### Stage 4 — Repair reproducibility and update provenance

Recover historical exports where possible; explicitly document remaining gaps. Run a separately dated update for omitted comparator literature and trial reports. State the eligibility and exclusion decisions, including cases excluded because the intervention is a utility, a non-game simulation or a mixed-diabetes comparator.

### Stage 5 — Verify all derived representations

Check catalogue, profile, comparison, source register, figures and rendered pages against the corrected records. Run structural and link checks, then inspect the displayed evidence and references. Commit, push and publication remain separate owner decisions.

## 6. Review skill delivered with this audit

The new project-local [t1d-kb-scientific-review skill](../../.agents/skills/t1d-kb-scientific-review/SKILL.md) adapts the Simulator science-review principles without importing simulator-specific implementation requirements. It separates review, update and authorised revision; requires claim-to-source verification; separates study design from outcome relevance and credibility; and requires lawful full-text acquisition or a documented wishlist entry.

Its safeguards were exercised against the actual corpus. They exposed mismatched identifiers, a misclassified pilot and an understated commercial trial, while preventing a false correction based on the MyDiabetic filename. The retrieval helper was also corrected during this audit to prevent collisions between records with missing metadata. Automated candidate matching remains an aid, not a scientific decision.

## 7. Residual limitations and acceptance status

**Complete:** source-corpus and 45-record inspection; located findings; new skill and supporting workflow; local retrieval attempts; expanded full-text backlog; explicit source-access and coverage records.

**Not complete:** independent appraisal of every underlying publication; retrieval of all cited full texts; a complete new systematic search; installation/playtesting; a specialist clinical sign-off; implementation of the proposed content corrections.

Of 24 findings, 23 remain open and F21 is partially addressed. No scientific chapter correction is claimed. Status must change only after the affected canonical and derived representations have been corrected and checked. This report should not be treated as certification of the existing website.

## 8. Abbreviations and terms

1. **T1D:** type 1 diabetes.
2. **T2D:** type 2 diabetes.
3. **CGM:** continuous glucose monitoring; repeated sensor-based estimation of interstitial glucose.
4. **HbA1c:** glycated haemoglobin, an integrated marker of preceding glycaemic exposure.
5. **DOI:** digital object identifier, a persistent publication identifier.
6. **PMID:** PubMed identifier.
7. **PMC / Europe PMC:** PubMed Central / Europe PubMed Central, literature repositories and discovery services.
8. **JSON:** JavaScript Object Notation, the structured catalogue format.
9. **SVG:** Scalable Vector Graphics, the original diagram format.
10. **HTTP:** Hypertext Transfer Protocol; its status codes describe technical responses, not scientific correctness.
11. **Difference-in-differences:** comparison of change over time between groups; interpretation depends on design and analysis assumptions.
12. **Transfer:** application of acquired knowledge or skill to unpractised tasks or contexts.
13. **URL:** uniform resource locator, the address of an online resource.
14. **PDF:** Portable Document Format, used for the paginated report and article copies.

## 9. Linked reference index

The cited sources and inspection depth are indexed in [inspected-sources.json](2026-09-06_scientific-content-audit/inspected-sources.json). Full-text gaps are distinguished from bibliographic errors in the [acquisition backlog](2026-09-06_scientific-content-audit/full-text-backlog.md). References below preserve the article identity; an accessible abstract is not labelled a full-text appraisal.

A final local check of these 22 exact source URLs classified 16 as reachable and six as access-restricted, with none classified as broken. The restricted publisher routes were Ahmadi, Andersen, Baghaei, Braithwaite, Nørlev and Shute. Their publication identities and retained reading copies were checked separately; the publisher links are **not fully verified public-access routes**. A working abstract page does not imply access to the complete paper.

1. [Ahmadi, F. and Lucero, A. (2025; online 2024). Gaming the System: A Fun Continuous Glucose Monitor Interface Improves Glycemic Outcomes for Children. *Journal of Diabetes Science and Technology*, 19(3), 836–842.](https://doi.org/10.1177/19322968231223759)
2. [Andersen, E. et al. (2012). The impact of tutorials on games of varying complexity. *Proceedings of CHI 2012*.](https://doi.org/10.1145/2207676.2207687)
3. [Baghaei, N. et al. (2016). Diabetic Mario: Designing and Evaluating Mobile Games for Diabetes Education. *Games for Health Journal*.](https://doi.org/10.1089/g4h.2015.0038)
4. [Beh, E. et al. (2026). Digital Health Interventions in Children and Adolescents With Type 1 Diabetes Mellitus and Their Impact on Clinical and Behavioral Outcomes: Scoping Review.](https://pmc.ncbi.nlm.nih.gov/articles/PMC12954698/)
5. [Braithwaite, J. et al. (2020). Built to last? The sustainability of healthcare system improvements, programmes and interventions: a systematic integrative review. *BMJ Open*.](https://doi.org/10.1136/bmjopen-2019-036453)
6. [Brown, S.J. et al. (1997). Educational video game for juvenile diabetes: results of a controlled trial. *Medical Informatics*, 22(1), 77–89. Abstract checked; full text outstanding.](https://pubmed.ncbi.nlm.nih.gov/9183781/)
7. [Butler, A.C. (2010). Repeated testing produces superior transfer of learning relative to repeated studying. *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 36, 1118–1133.](https://sites.wustl.edu/mdl1/files/2026/06/Butler-2010-Repeated-testing-produces-superior-transfer-of-learning-relative-to-repeated-studying.pdf)
8. [Butler, A.C., Godbole, N. and Marsh, E.J. (2013). Explanation feedback is better than correct answer feedback for promoting transfer of learning. *Journal of Educational Psychology*.](https://sites.wustl.edu/mdl1/files/2026/06/Butler-et-al.-2013-Explanation-feedback-is-better-than-correct-answer-feedback-for-promoting-transfer-of-learning.pdf)
9. [Cobelli, C. et al. (2009). Diabetes: Models, Signals, and Control. *IEEE Reviews in Biomedical Engineering*, 2, 54–96. Correct identity verified; full text outstanding.](https://pubmed.ncbi.nlm.nih.gov/20936056/)
10. [Ebrahimpour, F. et al. (2015). Effect of Playing Interactive Computer Game on Distress of Insulin Injection Among Type 1 Diabetic Children. *Iranian Journal of Pediatrics*, 25(3), e427.](https://doi.org/10.5812/ijp.25(3)2015.427)
11. [Gu, H., Mohd Muhaiyuddin, N.D.B. and Shaari, N.B. (2026). Narrative-driven virtual reality serious game to support type 1 diabetes self-management in children. *Scientific Reports*, 16, 596.](https://doi.org/10.1038/s41598-025-30114-1)
12. [Haahr, H. and Heise, T. (2014). A review of the pharmacological properties of insulin degludec and their clinical relevance. *Clinical Pharmacokinetics*, 53, 787–800.](https://pubmed.ncbi.nlm.nih.gov/25179915/)
13. [Kaboré, S.S. et al. (2022). Barriers and facilitators for the sustainability of digital health interventions in low and middle-income countries: a systematic review. *Frontiers in Digital Health*.](https://doi.org/10.3389/fdgth.2022.1014375)
14. [Lawrence Hall of Science (n.d.). I Got This. Official product page; checked 6 September 2026.](https://lawrencehallofscience.org/science-apps/i-got-this/)
15. [Moosa, A.M., Al-Maadeed, N. and AlJa'am, J.M. (2018). A Simple Health-Based Game for Children. *International Conference on Computer and Applications*. Full text outstanding.](https://doi.org/10.1109/COMAPP.2018.8460213)
16. [Morgado, P.C. et al. (2025). Educational technologies for families and children with type 1 diabetes: a scoping review. *Revista da Escola de Enfermagem da USP*, 58, e20240134.](https://pubmed.ncbi.nlm.nih.gov/39899746/)
17. [Nørlev, J. et al. (2022a; online 2021). Game Mechanisms in Serious Games That Teach Children with Type 1 Diabetes How to Self-Manage: A Systematic Scoping Review. *Journal of Diabetes Science and Technology*, 16(5), 1253–1269.](https://doi.org/10.1177/19322968211018236)
18. [Reinders, E.F.H. et al. (2024). Serious digital games for diabetes Mellitus: A scoping review of its current State, Accessibility, and functionality for patients and healthcare providers. *Diabetes Research and Clinical Practice*, 216, 111833.](https://doi.org/10.1016/j.diabres.2024.111833)
19. [Rizza, R.A., Mandarino, L.J. and Gerich, J.E. (1981). Dose-response characteristics for effects of insulin on production and utilization of glucose in man. *American Journal of Physiology*, 240, E630–E639. Abstract checked; full text outstanding.](https://pubmed.ncbi.nlm.nih.gov/7018254/)
20. [Shute, V.J. (2008). Focus on Formative Feedback. *Review of Educational Research*, 78(1), 153–189.](https://doi.org/10.3102/0034654307313795)
21. [Wu, Y. et al. (2024). Delivering a Smartphone Serious Game-Based Intervention to Promote Resilience for Adolescents With Type 1 Diabetes: A Feasibility Study. *Journal of Pediatric Health Care*, 38(6), 893–902. Abstract checked; full text outstanding.](https://doi.org/10.1016/j.pedhc.2024.05.009)
22. [Yao, W. et al. (2024). Electronic Interactive Games for Glycemic Control in Individuals With Diabetes: Systematic Review and Meta-Analysis. *JMIR Serious Games*, 12, e43574.](https://doi.org/10.2196/43574)
