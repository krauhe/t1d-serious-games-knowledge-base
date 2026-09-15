/**
 * Kontrollerer de genererede rettelser uden browserautomation.
 * Dette er HTML-/datakontrol, ikke en visuel browser- eller gameplaytest.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const explorer = read('_site/explorer.html');
const tablet = read('output/private/T1D-Serious-Games-Knowledge-Base-private.html');
const games = JSON.parse(read('data/games.json')).games;
const studies = JSON.parse(read('data/studies.json')).studies;
const cards = [...explorer.matchAll(/<article class="game-card"[\s\S]*?<\/article>/g)].map(match => match[0]);
assert.equal(cards.length, games.length, 'Missing game cards');
assert.equal((explorer.match(/class="study-appraisal"/g) || []).length, studies.length, 'Missing study details');
assert.equal((tablet.match(/class="study-appraisal"/g) || []).length, studies.length, 'Tablet study details differ');
assert.equal((tablet.match(/class="tablet-chapter"/g) || []).length, 27);
const card = id => {
  const title = games.find(game => game.id === id).title;
  return cards.find(html => html.includes('<h2>' + title.replaceAll('&', '&amp;') + '</h2>'));
};
assert.match(card('diabetic-mario'), /Android/);
assert.match(card('diabetic-mario'), /pre\/post or feasibility study/);
assert.doesNotMatch(card('diabetic-mario'), /data-evidence="controlled outcome study"/);
assert.match(card('eddii'), /5\.38/);
assert.match(card('eddii'), /70/);
assert.match(card('i-got-this'), /T2D/);
assert.match(card('i-got-this'), /Lawrence Hall/);
assert.match(card('qare-and-qure'), /unverified|verification/i);
assert.doesNotMatch(card('ava-type-1'), /data-platforms="[^"]*Android/);
assert.match(tablet, /5\.38/);
assert.match(tablet, /Self-Management Scale/);
assert.match(explorer, /Availability checked:[\s\S]*Scientific appraisal:/);
assert.deepEqual(JSON.parse(read('_site/data/studies.json')), JSON.parse(read('data/studies.json')));
const isPrivate = fs.existsSync(path.join(root, '_site/PRIVATE-IMAGE-BUILD.txt'));
if (!isPrivate) {
  const privateImages = path.join(root, '_site/assets/game-images');
  assert.ok(!fs.existsSync(privateImages) || fs.readdirSync(privateImages).length === 0, 'Private image files in public build');
  assert.doesNotMatch(explorer, /src="assets\/game-images\//);
}
console.log(JSON.stringify({mode:isPrivate?'private':'public',games:cards.length,studyReports:studies.length,tabletChapters:27,validation:'static assertions passed; no browser visual test'}, null, 2));
