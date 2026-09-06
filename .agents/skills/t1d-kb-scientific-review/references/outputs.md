# Outputs and verification

## Whole-base review deliverables

Use `docs/reviews/YYYY-MM-DD_scientific-content-audit.md` for the scientific report. Put machine-readable coverage, claim/source and acquisition records in a matching subdirectory. Preserve identifiers and link findings to exact source locations. Provide a readable HTML report and a PDF when requested or when applying the scientific-review report convention; use `output/pdf/AIReview - YYYY-MM-DD - Subject.pdf`, linked references and `Page x / y` numbering. Inspect every PDF page visually.

Report:

1. Scope, review date, repository revision/working changes, actual method and review limitations.
2. Principal conclusions supported by located findings.
3. Coverage of every chapter, catalogue record and source category, distinguishing inspected content from independently verified evidence.
4. Prioritised findings with stable ID, severity, location, existing claim, evidence inspected, interpretation and proposed correction. Use critical/major/minor/editorial according to consequences, not rhetorical intensity. Separate definite errors from unresolved verification.
5. Literature/source results: valid full texts reused/acquired, unresolved sources on the wishlist, bibliographic mismatches and exact search record locations.
6. Recommended correction sequence and decisions requiring substantive author judgment.
7. Linked references and abbreviation glossary.

In review mode, corrections to reviewed chapters remain proposals. Skill files, the requested report, acquisition records and wishlist can be written as part of the review. Do not add the review to website navigation or publish it without a request. Preserve unrelated local visual work.

## Reusable audit tools

Use `scripts/inventory.py` to inventory navigation, source paragraphs, citations, catalogue records and local article files. Its paragraph flags and filename/hash matches are discovery aids, not scientific judgments. It writes only to the supplied output directory and reads source documents without modifying them.

Use `scripts/source_access.py --root <repository> --inventory <inventory.json> --output <private-working-directory>` for locally executed metadata checks and lawful full-text retrieval candidates. An optional `--extra-local <article-directory>` searches an existing collection before downloading. It requires requests, BeautifulSoup and PyMuPDF. Validate each candidate's actual title, author, article body and identifier; a filename, a DOI in a reference list, or a successful download is insufficient. The inventory captures linked scholarly URLs, not every unlinked author-date string: inspect catalogue study citations and prose for missing identifiers separately. Archive technical retrieval results separately from editorial claim-support decisions.

Reuse the repository's `tools/validate.mjs` and `tools/check-external-links.mjs` as appropriate. Structural success is not scientific validation. When necessary, inspect the built site for rendering, references, navigation, search and table consistency; do not launch a broad visual redesign during a scientific audit.

## Completion criteria

All in-scope documents and game records have a coverage entry; all material findings have locations and evidence/verification status; every source substantively used by the audit has a validated full text or a wishlist entry; claims of searches or verification correspond to retained records; unresolved access is explicit. Report any remaining unverified underlying sources numerically where possible. Do not call a complete corpus inspection complete source verification.

For revisions, update the canonical source and affected derived records, record the finding's fixed/partial/open status and date, and rebuild only necessary outputs. Do not silently change the historical literature-search cut-off or product verification dates. Validate the skill with the bundled skill-creator validator and exercise it on the actual review; behavioural quality requires checking decisions, not merely passing frontmatter validation.
