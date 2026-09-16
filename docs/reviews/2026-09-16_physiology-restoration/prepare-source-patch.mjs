/** Produce (but never apply) a canonical-source patch for main-agent review. */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '../../..');
const sourceFile = path.resolve(root, '../Diabetes Simulator - Virtuel udforskning af din virkelighed/docs/BG-SCIENCE.md');
const original = fs.readFileSync(sourceFile, 'utf8').replaceAll('\r\n','\n');
const changes = JSON.parse(fs.readFileSync(path.join(directory,'editorial-corrections.json'),'utf8'));
const matches = [...original.matchAll(/<a name="([^"]+)"><\/a>\n## (\d+b?)\. ([^\n]+)/g)];
const counts = [];
let proposed = original.slice(0,matches[0].index);
for(let i=0;i<matches.length;i++) {
  const section = matches[i][2];
  let text = original.slice(matches[i].index,matches[i+1]?.index ?? original.length);
  for(const change of changes) {
    if(change.section!=='*' && change.section!==section) continue;
    let count=0;
    text=text.replace(new RegExp(change.pattern,change.flags||'g'),()=>{count++;return change.replacement});
    if(count) counts.push({id:change.id,section,count,reason:change.reason});
  }
  proposed+=text;
}
proposed=proposed.replace('doc-version: 2026-09-15-v1','doc-version: 2026-09-16-v1');
const working = path.join(root,'private-literature/physiology-restoration');
fs.mkdirSync(working,{recursive:true});
const before=path.join(working,'source-before.md');
const after=path.join(working,'source-proposed.md');
fs.writeFileSync(before,original);
fs.writeFileSync(after,proposed);
const diff=spawnSync('git',['diff','--no-index','--no-ext-diff','--',before,after],{encoding:'utf8',maxBuffer:10*1024*1024});
if(![0,1].includes(diff.status)) throw new Error(diff.stderr);
const lines=diff.stdout.split('\n');
const first=lines.findIndex(line=>line.startsWith('@@'));
if(first<0) throw new Error('No differences');
const hunks=lines.slice(first).map(line=>line.startsWith('@@')?'@@':line).filter(line=>!line.startsWith('\\ No newline')).join('\n').trimEnd();
const patch=`*** Begin Patch\n*** Update File: ${sourceFile.replaceAll('\\','/')}\n${hunks}\n*** End Patch\n`;
fs.writeFileSync(path.join(directory,'canonical-source.patch'),patch);
fs.writeFileSync(path.join(directory,'canonical-correction-log.json'),JSON.stringify({date:'2026-09-16',applied:false,scope:'Targeted inherited defects, not full-source review',changes:counts},null,2)+'\n');
console.log(JSON.stringify({patch:path.join(directory,'canonical-source.patch'),changes:counts,unmatched:changes.filter(change=>!counts.some(row=>row.id===change.id)).map(change=>change.id)},null,2));
