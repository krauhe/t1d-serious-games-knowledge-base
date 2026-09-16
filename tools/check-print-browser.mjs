/**
 * Tester PDF-knappen i rigtig Chromium og eksporterer samme printlayout.
 * Kræver Playwright (eventuelt via NODE_PATH) og installeret Chrome.
 * Skriver kun QA-filer i .validation/pdf/; publicerer ikke dokumenterne.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.validation/pdf');
fs.mkdirSync(output, {recursive:true});
const browser = await chromium.launch({channel:'chrome', headless:true});
const results = [];
try {
  for (const [name, source, edition] of [
    ['public-full', '_site/reading.html', 'full'],
    ['private-full', 'output/private/T1D-Serious-Games-Knowledge-Base-private.html', 'full'],
    ['public-compact', '_site/reading.html', 'compact']
  ]) {
    const page = await browser.newPage({viewport:{width:1280,height:900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // Offlineudgaven skal fungere uden eksterne netværksafhængigheder.
    await page.route(/^https?:/, route => route.abort());
    await page.goto(pathToFileURL(path.join(root,source)).href);
    await page.locator('#pdf-edition').selectOption(edition);
    const chapterCount = await page.locator('.tablet-chapter').count();
    const initial = await page.locator('main details').evaluateAll(items => items.map(item => item.open));
    // Observer det ægte kald, men lad browserens printfunktion køre uændret.
    await page.evaluate(() => {
      const nativePrint = window.print.bind(window);
      window.__printCalls = 0;
      window.print = function () { window.__printCalls++; return nativePrint(); };
    });
    await page.locator('#save-pdf').click();
    await page.waitForFunction(() => !document.getElementById('save-pdf').disabled);
    assert.equal(await page.evaluate(() => window.__printCalls), 1, name + ': native print not invoked');
    assert.match(await page.locator('#pdf-status').textContent(), /Choose Save as PDF/);
    await page.emulateMedia({media:'print'});
    const pdfPath = path.join(output,name + '.pdf');
    // Chromium bruger her sidens egen @page og før/efter-print-håndtering.
    await page.pdf({path:pdfPath, preferCSSPageSize:true, printBackground:true, tagged:true, outline:true});
    await page.emulateMedia({media:'screen'});
    const restored = await page.locator('main details').evaluateAll(items => items.map(item => item.open));
    assert.deepEqual(restored,initial,name + ': expanded state not restored after print');
    assert.equal(await page.locator('body').evaluate(body => body.classList.contains('print-study-details')),false);
    assert.deepEqual(errors,[],name + ': JavaScript errors');
    results.push({name,source,edition,chapterCount,bytes:fs.statSync(pdfPath).size,nativePrintCalls:1,screenStateRestored:true});
    await page.close();
  }
  fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({browser:browser.version(),results},null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
} finally { await browser.close(); }
