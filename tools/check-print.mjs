/** Test PDF-knap, gendannelse efter print og bygningens indhold uden browserafhængighed. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const code = read('tools/print.js');

function fixture({ unavailable = false, throws = false, edition = 'full' } = {}) {
  const events = {}, classes = new Set();
  const details = [{ open: false }, { open: true }];
  let click, printCalls = 0, imageCalls = 0;
  const button = { addEventListener(type, handler) { click = handler; } };
  const selector = { value: edition }, status = {};
  const document = {
    fonts: { ready: Promise.resolve() },
    getElementById: id => ({ 'save-pdf': button, 'pdf-edition': selector, 'pdf-status': status }[id]),
    querySelectorAll: selector => selector === 'main details' ? details : [{ decode() { imageCalls++; return Promise.reject(Error('Broken image')); } }],
    body: { classList: {
      toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); },
      remove(name) { classes.delete(name); }
    } }
  };
  const window = {
    addEventListener(name, handler) { events[name] = handler; },
    setTimeout() {},
    print: unavailable ? undefined : function () {
      printCalls++;
      assert.ok(details.every(detail => detail.open), 'Open all details before printing');
      events.beforeprint();
      if (throws) throw Error('Print unavailable');
    }
  };
  vm.runInNewContext(code, { document, window });
  return { click: () => click(), events, classes, details, button, status, selector,
    counts: () => ({ printCalls, imageCalls }) };
}

let test = fixture();
await test.click();
assert.deepEqual(test.counts(), { printCalls: 1, imageCalls: 1 });
assert.equal(test.button.disabled, false);
assert.equal(test.classes.has('print-study-details'), true);
test.events.beforeprint(); // Gentaget event må ikke overskrive den oprindelige tilstand.
test.events.afterprint();
assert.deepEqual(test.details.map(detail => detail.open), [false, true]);
test.events.afterprint(); // Kan også sendes efter annullering eller mere end én gang.
test.selector.value = 'compact';
await test.click();
assert.equal(test.classes.has('print-study-details'), false);
test.events.afterprint();
assert.equal(test.classes.has('print-study-details'), false);

test = fixture({ throws: true });
await test.click();
assert.deepEqual(test.details.map(detail => detail.open), [false, true]);
assert.match(test.status.textContent, /could not open/);
test = fixture({ unavailable: true });
await test.click();
assert.equal(test.counts().printCalls, 0);
assert.match(test.status.textContent, /Share or Print/);

// Browserens egen Print-menu skal også åbne detaljer og respektere valget.
test = fixture();
test.events.beforeprint();
assert.ok(test.details.every(detail => detail.open));
assert.ok(test.classes.has('print-study-details'));
test.events.afterprint();
assert.deepEqual(test.details.map(detail => detail.open), [false, true]);

const css = read('tools/print.css');
assert.match(css, /@media print/);
assert.match(css, /size: A4 portrait/);
assert.match(css, /counter\(page\)/);
assert.match(css, /\.game-table \.game-detail-row[\s\S]*?display: block !important/);
assert.match(css, /body:not\(\.print-study-details\) \.study-appraisal/);
assert.match(css, /\.game-table \.game-entry \+ \.game-entry \{ break-before: auto;/);

const games = JSON.parse(read('data/games.json')).games;
const navigation = JSON.parse(read('data/navigation.json')).flatMap(group => group.items);
const siteFile = path.join(root, '_site/reading.html');
function inspectEdition(file, isPrivate) {
  const html = fs.readFileSync(file, 'utf8');
  assert.equal((html.match(/class="tablet-chapter"/g) || []).length, navigation.length);
  assert.equal((html.match(/class="game-profile"/g) || []).length, games.length);
  assert.equal((html.match(/class="game-figure"/g) || []).length > 0, isPrivate);
  assert.equal(html.includes('<strong>Private tablet edition.</strong>'), isPrivate);
  assert.match(html, /id="save-pdf"/);
  assert.match(html, /<option value="full" selected>/);
  assert.match(html, /<option value="compact">/);
  assert.match(html, /id="reading-contents"/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Reading edition has duplicate anchors');
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const match of markup.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.includes(match[1]), 'Unresolved reading-edition anchor: ' + match[1]);
  }
  // Offentlige læseudgaver må aldrig få indlejret de private billeder, heller ikke skjult.
  const reviewDirectory = path.join(root, 'figures/game-images-review-only');
  if (!isPrivate && fs.existsSync(reviewDirectory)) {
    for (const file of fs.readdirSync(reviewDirectory)) {
      if (!/\.(?:png|jpe?g|webp|gif)$/i.test(file)) continue;
      const bytes = fs.readFileSync(path.join(reviewDirectory, file));
      assert.ok(!html.includes(bytes.toString('base64')), 'Private image leaked into public reading edition: ' + file);
    }
  }
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
}

if (fs.existsSync(siteFile)) {
  inspectEdition(siteFile, fs.existsSync(path.join(root, '_site/PRIVATE-IMAGE-BUILD.txt')));
  for (const entry of navigation) {
    const output = entry.generated || entry.source.replace(/\.(?:qmd|md)$/i, '.html');
    const html = read('_site/' + output);
    const prefix = '../'.repeat(output.split('/').length - 1);
    assert.ok(html.includes(`href="${prefix}reading.html#pdf-export"`), output + ': PDF link missing');
  }
}
if (process.argv.includes('--tablet')) {
  inspectEdition(path.join(root, 'output/private/T1D-Serious-Games-Knowledge-Base-private.html'), true);
}
console.log('PDF export: print lifecycle, fallback, contents, profiles, anchors and public-image separation passed (no browser rendering test).');
