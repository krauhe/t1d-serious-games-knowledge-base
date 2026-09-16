/**
 * Inventory existing physiology reading copies without downloading duplicates.
 * Metadata/body tests identify candidates, not scientific claim verification.
 * All private files remain ignored; public records contain provenance and gaps.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const directory=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(directory,'../../..');
const originalDirectory=path.resolve(root,'../Diabetes Simulator - Virtuel udforskning af din virkelighed/docs/references');
const targetDirectory=path.join(root,'private-literature/articles');
const citations=JSON.parse(fs.readFileSync(path.join(directory,'inherited-citations.json'),'utf8'));
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const records=[];
const existingHashes=new Map();
for(const name of fs.readdirSync(targetDirectory)) {
  const file=path.join(targetDirectory,name);
  if(fs.statSync(file).isFile()) existingHashes.set(hash(fs.readFileSync(file)),file);
}
const plain=text=>text.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const identifiers=url=>{
  const pmid=url.match(/pubmed(?:\.ncbi\.nlm\.nih\.gov|\/[^/]+)\/(\d+)/i)?.[1];
  const pmc=url.match(/PMC\d+/i)?.[0]?.toUpperCase();
  const doi=url.match(/(?:doi\.org\/|\/doi\/(?:full\/|abs\/|pdf\/)?)(10\.[^?#]+)/i)?.[1]?.toLowerCase();
  return {pmid,pmc,doi};
};
for(const name of fs.readdirSync(originalDirectory)) {
  if(!/\.(pdf|html|xml)$/i.test(name)) continue;
  const file=path.join(originalDirectory,name), bytes=fs.readFileSync(file), sha256=hash(bytes), text=bytes.toString('utf8');
  const meta={};
  for(const match of text.matchAll(/<meta\b[^>]*>/gi)) {
    const tag=match[0], key=tag.match(/(?:name|property)=["']([^"']+)/i)?.[1]?.toLowerCase(),value=tag.match(/content="([^"]*)"|content='([^']*)'/i);
    if(key&&value) meta[key]=value[1]||value[2];
  }
  const pdf=bytes.subarray(0,5).toString()==='%PDF-';
  const pmid=meta.citation_pmid || null;
  const doi=meta.citation_doi?.toLowerCase() || null;
  const canonical=meta.citation_fulltext_html_url || meta.citation_abstract_html_url || null;
  const pmc=canonical?.match(/PMC\d+/i)?.[0]?.toUpperCase() || null;
  const title=meta.citation_title || text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || null;
  const articleText=text.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
  const bodyPresent=!!(articleText && plain(articleText).length>12000 && /references|bibliography/i.test(articleText));
  const xmlBody=/<body>[\s\S]{12000,}<\/body>/i.test(text);
  const contentKind=pdf?'pdf-signature-verified-content-unappraised':bodyPresent||xmlBody?'article-body-candidate':'abstract-note-or-unvalidated-file';
  const matches=citations.filter(citation=>{
    const id=identifiers(citation.url);
    return (pmid&&id.pmid===pmid)||(pmc&&id.pmc===pmc)||(doi&&id.doi===doi);
  });
  // PDF documents without embedded HTML identifiers are retained as candidates
  // only when the author/year filename is represented in the cited text.
  const authorYear=name.match(/^([^_]+)_(\d{4})/);
  const byName=authorYear&&citations.filter(citation=>citation.labels.some(label=>label.toLowerCase().includes(authorYear[1].toLowerCase())&&label.includes(authorYear[2])));
  const used=matches.length?matches:(byName||[]);
  if(!used.length) continue;
  let retained=existingHashes.get(sha256);
  let action=retained?'reused-identical-hash':'not-copied-not-full-text-candidate';
  if(!retained&&(pdf||bodyPresent||xmlBody)) {
    retained=path.join(targetDirectory,name);
    if(fs.existsSync(retained)) retained=path.join(targetDirectory,`${path.parse(name).name}-${sha256.slice(0,10)}${path.extname(name)}`);
    fs.copyFileSync(file,retained);existingHashes.set(sha256,retained);action='copied-existing-authorised-reading-candidate';
  }
  records.push({source_file:`T1D Simulator/docs/references/${name}`,retained_file:retained?path.relative(root,retained).replaceAll('\\','/'):null,sha256,title:title?plain(title):null,pmid,doi,pmcid:pmc,canonical_url:canonical,content_kind:contentKind,identity_status:matches.length?'Own-document metadata matches a cited identifier; independent bibliographic appraisal pending':'Filename author/year candidate only; identity not verified',body_inspection:'Automated structure only; no full scientific appraisal',action,linked_urls:used.map(item=>item.url),copy_date:'2026-09-16',original_retrieval_date:'Not re-established; existing local collection',http_status:'Not applicable to local reuse'});
}
const gaps=[];
for(const citation of citations) {
  const candidates=records.filter(record=>record.linked_urls.includes(citation.url)&&record.retained_file);
  citation.local_candidates=candidates.map(record=>({path:record.retained_file,sha256:record.sha256,identity_status:record.identity_status,content_kind:record.content_kind}));
  citation.acquisition_status=candidates.length?'Existing reading candidate retained; identity/claim appraisal pending':'No matched full-text copy established in inspected local collections';
  citation.next_action=candidates.length?'Inspect title/author/identifiers and cited result in retained candidate':'Try publisher open text, PMC/author/institutional manuscript or institutional library access; do not infer paywall from absence';
  if(!candidates.length) gaps.push(citation);
}
fs.writeFileSync(path.join(directory,'local-literature-register.json'),JSON.stringify({date:'2026-09-16',scope:'Existing local file reuse only; no new full-text download or full scientific appraisal',records},null,2)+'\n');
fs.writeFileSync(path.join(directory,'citation-acquisition-register.json'),JSON.stringify({date:'2026-09-16',deduplication:'Exact URL and SHA-256 file hash; work-level DOI/PMID reconciliation remains incomplete for unmatched records',records:citations},null,2)+'\n');
const escape=text=>text.replaceAll('|','\\|').replaceAll('\n',' ');
let wishlist='# Physiology Full-Text Reconciliation Backlog\n\nThe restored reference contains '+citations.length+' distinct linked source URLs. URLs are not publication counts: one work may have several identifiers. This inventory reuses existing local reading copies; it does not establish independent appraisal of every cited result. A missing match is not evidence of a paywall.\n\n## Unmatched acquisition records\n\n'+gaps.length+' URLs have no matched full-text copy in the inspected local collection. For each, the next lawful route is the publisher’s open text, PubMed Central, an author/institutional manuscript, or library access. These are **not yet retrieved or reconciled**, not confirmed subscription barriers.\n\n| Source label / identifier | Used in reference chapter(s) | Status |\n|---|---|---|\n';
for(const row of gaps) {
  const labels=row.labels.filter(label=>!['PubMed','PMC','DOI','Full text'].includes(label));
  wishlist+=`| [${escape(labels[0]||row.url)}](${row.url}) | ${row.used_in.map(file=>path.basename(file).split('-')[0]).join(', ')} | Full text not established; identity and acquisition pending |\n`;
}
wishlist+='\n## Retained candidates requiring inspection\n\n'+(citations.length-gaps.length)+' URL records have a matched local reading candidate. This is not a claim that all are correct full texts: PDF signatures and article-body structure are technical checks, and filename-only matches remain explicitly unverified. Exact candidate paths, hashes and match bases are in the [acquisition register](citation-acquisition-register.json).\n';
fs.writeFileSync(path.join(directory,'full-text-backlog.md'),wishlist);
console.log(JSON.stringify({records:records.length,reused:records.filter(row=>row.action==='reused-identical-hash').length,copied:records.filter(row=>row.action==='copied-existing-authorised-reading-candidate').length,unmatched_source_urls:gaps.length,matched_candidate_urls:citations.length-gaps.length},null,2));
