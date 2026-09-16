/**
 * Isolerede integrationstests af fysiologisynkroniseringens databeskyttelse.
 * Alle skriveforsøg sker i en ny testmappe under den ignorerede .validation/.
 * Hverken den rigtige kilde eller de rigtige referencekapitler ændres.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validation = path.join(root, '.validation');
fs.mkdirSync(validation, {recursive:true});
const fixture = fs.mkdtempSync(path.join(validation, 'physiology-sync-'));
const script = path.join(fixture, 'tools/import-physiology.mjs');
fs.mkdirSync(path.dirname(script), {recursive:true});
fs.copyFileSync(path.join(root, 'tools/import-physiology.mjs'), script);
const canonical = path.join(fixture, 'canonical/docs/BG-SCIENCE.md');
fs.mkdirSync(path.dirname(canonical), {recursive:true});
let source = '<!-- doc-version: 2026-09-16-v1 -->\n\n' + Array.from({length:30}, (_, i) =>
  `<a name="topic-${i+1}"></a>\n## ${i+1}. Topic ${i+1}\n\nScientific paragraph ${i+1}.\n\n*Implementation: fixture-specific footer.*\n\n`
).join('');
fs.writeFileSync(canonical, source, 'utf8');
const run = (args, success=true) => {
  // Et eventuelt personligt kilde-override må ikke påvirke fixture-testen.
  const env = {...process.env};
  delete env.T1D_BG_SCIENCE;
  const result = spawnSync(process.execPath, [script, ...args], {cwd:fixture, env, encoding:'utf8'});
  assert.equal(result.status === 0, success, result.stdout + result.stderr);
  return result;
};
const sync = ['--source', canonical, '--write'];
const manifestPath = path.join(fixture, 'docs/reviews/2026-09-16_physiology-restoration/coverage.json');
const manifest = () => JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const hashes = () => manifest().sections.map(row => crypto.createHash('sha256').update(fs.readFileSync(path.join(fixture,row.output))).digest('hex'));

run(sync);
assert.equal(manifest().sections.length, 30);
assert.equal(manifest().source_version, '2026-09-16-v1');
const first = fs.readFileSync(manifestPath, 'utf8');
run(sync);
assert.equal(fs.readFileSync(manifestPath, 'utf8'), first, 'Repeat sync must be idempotent');
run(['--source', canonical, '--check']);

source = source.replace('2026-09-16-v1','2026-09-16-v2') + '\nAdditional source paragraph.\n';
fs.writeFileSync(canonical,source,'utf8');
run(['--source',canonical,'--check'],false);
run(sync);
assert.equal(manifest().source_version,'2026-09-16-v2');

const chapter = path.join(fixture,manifest().sections[0].output);
const originalChapter = fs.readFileSync(chapter,'utf8');
fs.appendFileSync(chapter,'\nA local user edit.\n','utf8');
run(sync,false);
assert.match(fs.readFileSync(chapter,'utf8'),/A local user edit/);
fs.writeFileSync(chapter,originalChapter,'utf8');

const before = hashes();
fs.writeFileSync(canonical,source + '\n[Invalid late link](#missing-topic)\n','utf8');
run(sync,false);
assert.deepEqual(hashes(),before,'Validation failure must not leave partial chapter writes');
fs.writeFileSync(canonical,source,'utf8');

const unmanaged = path.join(fixture,'knowledge/physiology/reference/31-topic-31.qmd');
fs.writeFileSync(unmanaged,'User-owned file.','utf8');
fs.writeFileSync(canonical,source + '\n<a name="topic-31"></a>\n## 31. Topic 31\n\nNew chapter.\n','utf8');
run(sync,false);
assert.equal(fs.readFileSync(unmanaged,'utf8'),'User-owned file.');
assert.deepEqual(hashes(),before);
fs.writeFileSync(canonical,source,'utf8');

run(['--source',path.join(fixture,'does-not-exist.md'),'--auto','--write'],false);
run(['--auto','--write']); // CI uden søsterprojektet skal kunne bruge snapshot.
// Git kan skifte mellem CRLF og LF uden en indholdsmæssig ændring.
for (const file of [script, canonical, ...manifest().sections.map(row => path.join(fixture,row.output))]) {
  fs.writeFileSync(file, fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n').replace(/\n/g,'\r\n'),'utf8');
}
run(['--source',canonical,'--check']);
run(['--auto','--write']);
fs.appendFileSync(script,'\n// Simulate a changed importer.\n','utf8');
run(['--auto','--write'],false);
console.log('Physiology sync: source updates, snapshot integrity, idempotence, no-overwrite, late failures and offline/CI passed.');
