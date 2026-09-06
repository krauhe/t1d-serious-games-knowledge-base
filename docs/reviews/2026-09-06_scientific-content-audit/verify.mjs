/** Run existing validators with private audit scratch files excluded, without modifying them. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const directory=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(directory,'../../..');
const network=process.argv.includes('--links');
const script=network ? 'tools/check-external-links.mjs' : 'tools/validate.mjs';
let source=fs.readFileSync(path.join(root,script),'utf8');
source=source.replace(/const projectRoot = [^\n]+;/,`const projectRoot = ${JSON.stringify(root)};`);
if (network) {
  source=source.replace(/const reportDirectory = [^\n]+;/,"const reportDirectory = path.join(projectRoot, '.validation/review-2026-09-06/final-links');");
  source=source.replace(/const sourceFiles = listFiles[\s\S]*?\n\}\);/,`const sourceFiles = [${JSON.stringify(directory+'.md')}];`);
  console.log('Scope: exact external links in the completed audit report. Technical status is not scientific verification.');
} else {
  source=source.replace("['.git', 'node_modules', '_site']", "['.git', 'node_modules', '_site', '.validation']");
  for (const name of fs.readdirSync(directory).filter(n=>n.endsWith('.json'))) JSON.parse(fs.readFileSync(path.join(directory,name),'utf8'));
  console.log('Scope: existing repository structural checks, excluding ignored .validation scratch material. No validator source changed.');
}
try {
  execFileSync(process.execPath,['--input-type=module','-e',source],{cwd:root,stdio:'inherit'});
} catch (error) {
  process.exitCode=error.status || 1;
}
