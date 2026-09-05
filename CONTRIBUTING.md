# Contributing

Contributions should improve scientific traceability, product discoverability, design reasoning, accessibility, or long-term maintainability.

## Before proposing a change

1. Identify whether the change concerns a game record, study, scientific chapter, design hypothesis, availability check, correction, or technical infrastructure.
2. Search for an existing record by title, alias, digital object identifier, PubMed identifier, store identifier, and official URL.
3. Read [`EDITORIAL-POLICY.md`](EDITORIAL-POLICY.md) and [`methods.qmd`](methods.qmd).

## Game submissions

A game submission should provide:

1. title, aliases, release history, intended population, and diabetes specificity;
2. platform, language, genre, learning objectives, and core gameplay loop;
3. developer or owner provenance and documented lived-experience involvement;
4. evidence class, study population, sample size, outcomes, and limitations;
5. current availability, price, monetisation, regions, accounts, and hardware requirements;
6. official, store, archive, and publication links;
7. image source and reuse status; and
8. the date and confidence of the availability verification.

Do not infer effectiveness from ratings, testimonials, downloads, awards, or marketing language.

## Scientific contributions

1. Prefer primary literature for quantitative or causal claims and systematic reviews for field mapping.
2. Use linked Harvard-style citations in prose.
3. Define specialist terms and expand abbreviations at first use.
4. Separate direct evidence, adjacent evidence, industry practice, design inference, and product claims.
5. State important limitations near the claim rather than only at the end of a page.
6. Do not commit restricted publications or other third-party material without permission; contribute bibliographic metadata, stable links, and access limitations instead.

## Validation

Run:

```text
pnpm install
pnpm run validate
pnpm run build
```

The standard build is public-safe and substitutes labelled source links where an image has not been cleared for republication.

## Contributor licensing

By submitting a contribution, you agree that accepted original scientific content, catalogue data, metadata, or figures may be distributed under CC BY 4.0 and that accepted software contributions may be distributed under the MIT License. Do not submit material you do not have the right to license on these terms. See [`LICENSING.md`](LICENSING.md) for the complete repository policy.

## Corrections

Correction reports should include the page or record, disputed wording, supporting source, proposed wording, and whether the issue affects safety, interpretation, access, or attribution.
