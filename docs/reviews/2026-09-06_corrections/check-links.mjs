/**
 * Genbruger projektets lokale linkkontrol på de aktuelle navigerbare tekster.
 * Historiske auditcitater er ikke den reviderede prosa og indgår ikke i scope.
 * Tekniske HTTP-resultater erstatter aldrig kildeidentitet eller appraisal.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const sources = JSON.parse(fs.readFileSync(path.join(root, 'data/navigation.json'), 'utf8'))
  .flatMap(section => section.items).filter(item => item.source && !item.source.startsWith('docs/reviews/'))
  .map(item => path.join(root, item.source));
let source = fs.readFileSync(path.join(root, 'tools/check-external-links.mjs'), 'utf8');
source = source.replace(/const projectRoot = [^\n]+;/, 'const projectRoot = ' + JSON.stringify(root) + ';');
source = source.replace(/const reportDirectory = [^\n]+;/, "const reportDirectory = path.join(projectRoot, '.validation/corrections-2026-09-06-links');");
source = source.replace(/const sourceFiles = listFiles[\s\S]*?\n\}\);/, 'const sourceFiles = ' + JSON.stringify(sources) + ';');
if (process.argv.includes('--retry-failed')) {
  const previous = JSON.parse(fs.readFileSync(path.join(root, '.validation/corrections-2026-09-06-links/external-links-report.json'), 'utf8'));
  const failedUrls = previous.results.filter(result => ['broken', 'suspicious'].includes(result.classification)).map(result => result.url);
  source = source.replace(/const urls = [^\n]+;/, 'const urls = ' + JSON.stringify(failedUrls) + ';');
  source = source.replace("'.validation/corrections-2026-09-06-links'", "'.validation/corrections-2026-09-06-links-followup'");
}
try {
  execFileSync(process.execPath, ['--input-type=module','-e',source], {cwd:root, stdio:'inherit'});
} catch (error) {
  // Linkrapporten er allerede skrevet; undgå at dumpe hele det indlejrede script.
  process.exitCode = Number.isInteger(error.status) ? error.status : 1;
}
