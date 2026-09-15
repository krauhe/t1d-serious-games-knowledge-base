/**
 * Fanger kendte videnskabelige regressionsfejl fra audit 6. september 2026.
 * Testen erstatter ikke faglig appraisal: den kontrollerer identitet, kendte
 * klassifikationsfejl og relationer mellem spil og studier, ikke sandhed generelt.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const games = JSON.parse(read('data/games.json')).games;
const studies = JSON.parse(read('data/studies.json')).studies;
const byGame = id => games.find(game => game.id === id);
const ids = new Set(studies.map(study => study.id));
assert.equal(ids.size, studies.length, 'Study ids must be unique');
const linked = new Set();
for (const game of games) {
  assert.equal(game.playtest_status, 'not_playtested');
  assert.ok(game.evidence.appraisal_date && game.availability.verified_on);
  assert.ok(game.evidence.search_scope, 'Missing bounded evidence-search statement: ' + game.id);
  assert.match(game.design_assessment.evidence_basis, /inference/i);
  assert.equal(game.evidence.study_ids.length, game.evidence.studies.length);
  for (const id of game.evidence.study_ids) {
    const study = studies.find(item => item.id === id);
    assert.ok(study, 'Missing study: ' + id);
    assert.equal(study.game_id, game.id, 'Wrong game/report relationship');
    linked.add(id);
    for (const field of ['report_citation','report_urls','intervention_version','purpose','design','population','sample','outcomes','appraisal','extraction_status','support_depth','appraised_on']) {
      assert.ok(field in study, id + ': missing ' + field);
    }
    for (const domain of ['allocation','measurement','missing_data','selective_reporting','conflicts']) {
      assert.ok(study.appraisal[domain], id + ': missing appraisal domain ' + domain);
    }
    assert.ok(study.outcomes.every(outcome => ['construct','reported_result','instrument','follow_up','denominator'].every(field => field in outcome)));
  }
}
assert.equal(linked.size, studies.length, 'Orphan study report');
// Et offentligt proof of concept må ikke blive til en effektundersøgelse ved katalogopdatering.
assert.equal(byGame('dextro-dash-2000').development_status, 'proof of concept');
assert.equal(byGame('dextro-dash-2000').evidence.level, 'public product without peer-reviewed evaluation');
assert.deepEqual(byGame('dextro-dash-2000').evidence.study_ids, []);
assert.equal(byGame('diabetic-mario').evidence.level, 'pre/post or feasibility study');
assert.deepEqual(byGame('diabetic-mario').platforms, ['Android']);
assert.match(byGame('diabetic-mario').target_population.diabetes_specificity, /not require/i);
assert.equal(byGame('eddii').evidence.level, 'controlled outcome study');
assert.equal(studies.find(s => s.game_id === 'eddii').sample.randomised, 92);
assert.equal(studies.find(s => s.game_id === 'eddii').sample.analysed, 70);
assert.match(byGame('i-got-this').target_population.diabetes_specificity, /T2D/);
assert.match(byGame('i-got-this').developer.names.join(' '), /Lawrence Hall/);
assert.match(byGame('qare-and-qure').core_gameplay_loop, /unverified|verification/i);
assert.ok(!byGame('ava-type-1').platforms.includes('Android'));
const invalidPmids = ['7026740','32591907','7011057','12107742','18175767','19150402','30058925','24729196','15303622','20948577','29994703','21129332'];
for (const file of fs.readdirSync(path.join(root, 'knowledge/physiology')).filter(file => file.endsWith('.qmd'))) {
  const text = read('knowledge/physiology/' + file);
  for (const pmid of invalidPmids) assert.ok(!text.includes('/' + pmid + '/'), file + ': rejected citation ' + pmid);
}
const nav = JSON.parse(read('data/navigation.json')).flatMap(section => section.items).filter(item => item.source);
for (const item of nav) {
  const text = read(item.source);
  assert.ok(!/Yao, M\.|Qare and Qure: paired educational games|Five to eight participants|Ahmadi, N\./.test(text), item.source + ': reverted bibliographic/claim correction');
}
console.log('Scientific regression checks: OK (' + games.length + ' games, ' + studies.length + ' study/report records). Incomplete appraisal remains explicitly labelled.');
