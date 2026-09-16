# Physiology source synchronisation

`docs/BG-SCIENCE.md` in the T1D Simulator repository is the canonical physiological text. Correct scientific content there, not in the generated knowledge-base chapters under `knowledge/physiology/reference/`.

Every local `npm run build`, `npm run build:private` or `npm run build:tablet` runs the physiology synchronisation hook before rendering. Quarto also declares this hook as a `pre-render` command and requires Node.js on its command path. The hook imports the complete scientific sections, adjusts internal links, omits implementation footers and updates both site and Quarto navigation. It does not shorten or scientifically rewrite the source.

The default source is the neighbouring repository `Diabetes Simulator - Virtuel udforskning af din virkelighed/docs/BG-SCIENCE.md`. Set `T1D_BG_SCIENCE` to an absolute file path when the checkout is elsewhere. A configured but missing source is an error. `npm run sync:physiology` runs the same synchronisation without rebuilding the site.

The hook reads the latest **local file**, including uncommitted corrections. It does not pull from GitHub, run in the background, commit, push or publish. Updating a remote repository does not update an already exported HTML file; rebuild that edition after updating the local source.

Source version, source hash, generator hash, chapter hashes, omissions and inherited citations are recorded under `docs/reviews/2026-09-16_physiology-restoration/`. Hashes of text use normalised line endings for Windows/Linux portability. A missing default source, as on GitHub Pages, uses the version-controlled snapshot only after integrity checks. A changed generator requires regeneration with the canonical source present.

Local edits to generated chapters stop the import rather than being overwritten. Previously generated chapters are not silently deleted if a source section disappears. Resolve such changes deliberately upstream and review the resulting import.

Verification: `node tools/check-physiology-sync.mjs` exercises isolated fixtures, including updates, unchanged rebuilds, invalid input and overwrite protection. `npm run validate` checks the imported snapshot alongside site and scientific regression checks. These checks establish structural integrity, not scientific validity: inherited claims retain their recorded appraisal and full-text-access limitations.
