/**
 * Byggehook til fysiologiens eneste tekstkilde, T1D-projektets BG-SCIENCE.md.
 * Importøren kontrollerer kilde og genererede kapitler; denne fil holder kun
 * navigationen ajour. Ingen netværkskald, Git-operationer eller baggrundsjob.
 * Uden den lokale kilde bruger CI den versionsstyrede, verificerede kopi.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
execFileSync(process.execPath, [path.join(root, 'tools/import-physiology.mjs'), '--write', '--auto'], {
  cwd: root, stdio: 'inherit'
});
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const writeIfChanged = (relative, content) => {
  if (read(relative) !== content) fs.writeFileSync(path.join(root, relative), content, 'utf8');
};
const entries = JSON.parse(read('docs/reviews/2026-09-16_physiology-restoration/navigation.json'));
const seen = new Set();
for (const entry of entries) {
  if (!/^knowledge\/physiology\/reference\/[a-z0-9-]+\.qmd$/i.test(entry.source) || seen.has(entry.source)) {
    throw new Error('Invalid or duplicate generated physiology navigation entry: ' + entry.source);
  }
  if (!fs.existsSync(path.join(root, entry.source))) throw new Error('Missing imported chapter: ' + entry.source);
  seen.add(entry.source);
}
const navigation = JSON.parse(read('data/navigation.json'));
const group = navigation.find(section => section.group === 'T1D Physiology and Modelling');
if (!group) throw new Error('Missing physiology navigation group; no navigation changed.');
group.items = [...group.items.filter(item => !item.source?.startsWith('knowledge/physiology/reference/')), ...entries];

// Quarto og den lokale renderer skal pege på de samme referencekapitler.
// Redigér kun fysiologiblokken; resten af brugerens konfiguration bevares.
const quarto = read('_quarto.yml');
const expression = /(      - section: "T1D Physiology and Modelling"\r?\n)([\s\S]*?)(?=      - section:|\r?\nformat:)/;
if (!expression.test(quarto)) throw new Error('Cannot locate Quarto physiology section; no navigation changed.');
const updatedQuarto = quarto.replace(expression, (_whole, heading, block) => {
  const retained = block.replace(/^          - knowledge\/physiology\/reference\/[^\r\n]+\r?\n/gm, '').trimEnd();
  return heading + retained + '\n' + entries.map(entry => '          - ' + entry.source).join('\n') + '\n';
});
writeIfChanged('data/navigation.json', JSON.stringify(navigation, null, 2) + '\n');
writeIfChanged('_quarto.yml', updatedQuarto);
console.log(`Physiology navigation: ${entries.length} full reference chapters.`);
