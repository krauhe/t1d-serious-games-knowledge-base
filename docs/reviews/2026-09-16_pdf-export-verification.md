# Browser PDF export verification

Date: 16 September 2026. Result: **PASS in installed desktop Chrome/Chromium**. This is an output and interface check, not a scientific reappraisal or tablet-browser certification.

## Executed checks

`tools/check-print-browser.mjs` opened the public reading file and private standalone HTML in isolated headless Chrome. External network requests were blocked. The test clicked the actual PDF button, observed its invocation of native `window.print()`, and generated PDF through Chromium's print engine using the page's own print stylesheet and lifecycle events. The details elements returned to their original expanded/collapsed state, and no JavaScript errors occurred.

| Edition | Chapters | PDF pages | Link annotations | Missing chapter headings | Blank pages |
|---|---:|---:|---:|---:|---:|
| Public, full scholarly | 56 | 376 | 2,793 | 0 | 0 |
| Private, full scholarly | 56 | 380 | 2,780 | 0 | 0 |
| Public, compact catalogue | 56 | 352 | 2,761 | 0 | 0 |

`tools/check-pdf-output.py` checked all 57 top-level headings (including the publication title), all page counters in `Page x / y` format, and link annotations. Compact mode retains every chapter; only detailed catalogue material is reduced. Counts reflect this tested snapshot and may change with subsequent content updates.

All 380 private-edition pages were rasterised with Poppler and visually screened on 19 contact sheets. Higher-resolution checks covered a seven-column physiology table, an insulin-response equation, the public regulatory chapter and a compact game profile. No missing images, overlapping text or clipped page content was observed. Wide tables necessarily wrap long terms; chapter-ending pages can contain substantial whitespace. This was layout screening, not line-by-line proofreading at full resolution on every page.

The normal scientific, navigation, reading-interface, privacy and print-lifecycle regression checks also passed. Public output excludes uncleared third-party game images. Test PDFs, raster images, extracted text and machine logs remain in the ignored `.validation/pdf/` directory.

## Limits

The operating-system print dialog was not manually operated. Chromium PDF generation validates the print output, but Safari, Android/iPad print/share workflows, paper-printer settings and user-selected scaling were not tested. External link annotations were retained; this check does not establish that every remote publisher currently permits access. Previously recorded literature-access and scientific-appraisal limitations remain unchanged.
