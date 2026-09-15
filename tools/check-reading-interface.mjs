/** Deterministic interaction and generated-output checks; not a visual browser test. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderCatalogue} from './catalogue.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root,file), 'utf8');
const games = JSON.parse(read('data/games.json')).games;

// A small DOM test double drives the actual shared scripts, without a browser dependency.
class Element {
  constructor() { this.events = {}; this.attrs = {}; this.dataset = {}; this.value = ''; this.hidden = false; }
  addEventListener(type,handler) { (this.events[type] ||= []).push(handler); }
  emit(type,event = {}) { for (const handler of this.events[type] || []) handler({...event,target:event.target || this}); }
  setAttribute(key,value) { this.attrs[key] = value; }
  getAttribute(key) { return this.attrs[key]; }
  focus() { this.focused = true; }
  contains(target) { return target === this; }
}
const elements = Object.fromEntries(['game-table','game-search','availability-filter','evidence-filter','platform-filter','language-filter','game-result-count','catalogue-empty','catalogue-reset'].map(id => { const e=new Element(); e.id=id; return [id,e]; }));
const table = elements['game-table'];
const rows = games.map(game => {
  const row = new Element(); row.id = 'game-' + game.id;
  row.dataset = { title:game.title, year:game.catalogue_date.year ?? '', language:game.languages.join('; '), platform:game.platforms.join('; '), audience:game.target_population.age_range, objectives:game.learning_objectives.join('; '), availability:game.availability.status, evidence:game.evidence.level, price:game.availability.price, platforms:game.platforms.join('|'), languages:game.languages.join('|'), search:[game.title,game.description,...game.languages,...game.learning_objectives].join(' ').toLowerCase() };
  row.toggle = new Element(); row.toggle.setAttribute('aria-expanded','false');
  row.detail = new Element(); row.detail.hidden = true; row.label = new Element();
  row.toggle.closest = selector => selector === '.game-entry' ? row : selector === '.game-toggle' ? row.toggle : null;
  row.querySelector = selector => selector === '.game-toggle' ? row.toggle : selector === '.game-detail-row' ? row.detail : row.label;
  row.scrollIntoView = () => { row.scrolled = true; };
  return row;
});
const headers = ['title','year','language','platform','audience','objectives','evidence','availability','price'].map(key => {
  const button = new Element(); button.dataset.sort = key; button.th = new Element(); button.indicator = new Element();
  button.closest = selector => selector === 'th' ? button.th : selector === '[data-sort]' ? button : null;
  button.querySelector = () => button.indicator;
  return button;
});
// Dækker både billeder, der allerede er fejlet, og senere indlæsningsfejl.
function imageFixture(complete, naturalWidth) {
  const figure = {removed:false,remove(){this.removed=true;}};
  return {tagName:'IMG',complete,naturalWidth,figure,closest:selector=>selector === '.game-figure' ? figure : null};
}
const cachedFailure = imageFixture(true,0), loadedImage = imageFixture(true,400), pendingImage = imageFixture(false,0);
table.querySelectorAll = selector => selector === '.game-entry' ? rows : selector === '[data-sort]' ? headers : selector === '.game-figure img' ? [cachedFailure,loadedImage,pendingImage] : [];
let order = [...rows];
table.append = row => { order = order.filter(item => item !== row); order.push(row); };
const window = new Element(); window.location = {hash:''};
const document = {getElementById:id => elements[id]};
vm.runInNewContext(read('tools/catalogue.js'), {window,document});
assert.equal(cachedFailure.figure.removed,true);
assert.equal(loadedImage.figure.removed,false);
assert.equal(pendingImage.figure.removed,false);
table.emit('error',{target:pendingImage});
assert.equal(pendingImage.figure.removed,true);
// Andre ressourcers fejl må ikke fjerne spilelementer.
table.emit('error',{target:{tagName:'SCRIPT'}});
assert.equal(rows.filter(row => !row.hidden).length,46);
elements['game-search'].value = 'Danish'; elements['game-search'].emit('input');
assert.ok(rows.some(row => !row.hidden && row.id === 'game-t1d-simulator'));
assert.ok(rows.filter(row => !row.hidden).every(row => row.dataset.search.includes('danish')));
elements['catalogue-reset'].emit('click');
elements['language-filter'].value = 'French'; elements['language-filter'].emit('input');
assert.ok(rows.filter(row => !row.hidden).every(row => row.dataset.languages.split('|').includes('French')));
elements['availability-filter'].value = 'publicly available'; elements['availability-filter'].emit('input');
assert.equal(rows.filter(row => !row.hidden).length,games.filter(g => g.languages.includes('French') && g.availability.status === 'publicly available').length);
elements['game-search'].value = 'zzzzno-such-game'; elements['game-search'].emit('input');
assert.equal(elements['catalogue-empty'].hidden,false);
assert.equal(rows.filter(row => !row.hidden).length,0);
elements['catalogue-reset'].emit('click');
const yearHeader = headers.find(h => h.dataset.sort === 'year');
table.emit('click',{target:yearHeader});
let known = order.filter(row => row.dataset.year !== '');
assert.deepEqual(known.map(row => +row.dataset.year),known.map(row => +row.dataset.year).sort((a,b) => a-b));
assert.equal(order.at(-1).dataset.year,'');
table.emit('click',{target:yearHeader});
known = order.filter(row => row.dataset.year !== '');
assert.deepEqual(known.map(row => +row.dataset.year),known.map(row => +row.dataset.year).sort((a,b) => b-a));
assert.equal(order.at(-1).dataset.year,'');
assert.equal(yearHeader.th.attrs['aria-sort'],'descending');
const row = rows.find(row => row.id === 'game-dextro-dash-2000');
table.emit('click',{target:row.toggle}); assert.equal(row.detail.hidden,false);
table.emit('click',{target:row.toggle}); assert.equal(row.detail.hidden,true);
elements['game-search'].value='no-such-game'; elements['game-search'].emit('input');
window.location.hash='#game-dextro-dash-2000'; window.emit('hashchange');
assert.equal(row.hidden,false); assert.equal(row.detail.hidden,false); assert.equal(row.scrolled,true);
assert.equal(elements['game-search'].value,'');

function sidebarTest({compact=false,saved=null,denyStorage=false}={}) {
  const button=new Element(),sidebar=new Element(),doc=new Element(),win=new Element(),media=new Element();
  const classes=new Set(); let persisted=saved;
  media.matches=compact;
  win.matchMedia=()=>media;
  win.localStorage={getItem(){ if(denyStorage)throw Error('Blocked'); return persisted; },setItem(key,value){ if(denyStorage)throw Error('Blocked'); persisted=value; }};
  doc.querySelector=()=>button; doc.getElementById=()=>sidebar;
  doc.body={classList:{toggle(name,enabled){if(enabled)classes.add(name);else classes.delete(name);}}};
  vm.runInNewContext(read('tools/sidebar.js'),{document:doc,window:win});
  return {button,sidebar,doc,media,classes,getSaved:()=>persisted};
}
let menu=sidebarTest(); assert.equal(menu.sidebar.hidden,false);
menu.button.emit('click'); assert.equal(menu.sidebar.hidden,true); assert.equal(menu.getSaved(),'false');
assert.ok(menu.classes.has('sidebar-collapsed')); assert.equal(menu.button.attrs['aria-expanded'],'false');
menu=sidebarTest({saved:'false'}); assert.equal(menu.sidebar.hidden,true);
menu=sidebarTest({compact:true,denyStorage:true}); assert.equal(menu.sidebar.hidden,true);
menu.button.emit('click'); assert.equal(menu.sidebar.hidden,false);
menu.doc.emit('keydown',{key:'Escape'}); assert.equal(menu.sidebar.hidden,true); assert.equal(menu.button.focused,true);
menu.button.emit('click'); menu.doc.emit('click',{target:new Element()}); assert.equal(menu.sidebar.hidden,true);
menu=sidebarTest(); menu.media.matches=true; menu.media.emit('change'); assert.equal(menu.sidebar.hidden,true);

const html=read('_site/explorer.html');
const renderWithoutImage = game => renderCatalogue([game],{renderStudyDetails:()=>'',imageFor:()=>'',studies:[]});
const sourceGame = games.find(game=>game.id==='level-one');
const noImage = renderWithoutImage(sourceGame);
assert.doesNotMatch(noImage,/<figure\b|<img\b/,'No reserved image area without an image');
assert.ok(noImage.includes(`href="${sourceGame.screenshot.source_url}"`),'Missing image-source link');
const sharedLinkGame = games.find(game=>game.id==='rufus');
const sharedLinks = [...renderWithoutImage(sharedLinkGame).matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
assert.equal(sharedLinks.filter(url=>url===sharedLinkGame.screenshot.source_url).length,1,'Duplicated source/product link');
const withoutSource = renderWithoutImage({...sourceGame,screenshot:{}});
assert.doesNotMatch(withoutSource,/<figure\b|<img\b|>Image source</,'No invented image or link without a source');
for (const figure of html.matchAll(/<figure class="game-figure">([\s\S]*?)<\/figure>/g)) assert.match(figure[1],/<img\b[^>]*src="[^"]+"/);
if (!fs.existsSync(path.join(root,'_site/PRIVATE-IMAGE-BUILD.txt'))) assert.doesNotMatch(html,/<figure class="game-figure">/,'Public build must not reserve private-image space');
assert.equal((html.match(/class="game-entry"/g)||[]).length,games.length);
assert.equal((html.match(/class="game-description"/g)||[]).length,games.length);
assert.equal((html.match(/class="game-profile"/g)||[]).length,games.length);
assert.equal((html.match(/class="product-record"/g)||[]).length,games.length);
// Alle profiler skal have samme korte struktur; de detaljerede studier bevares nedenunder.
for (const profile of html.matchAll(/<div class="game-profile">([\s\S]*?)<\/div>/g)) {
  assert.match(profile[1], /<strong>Play and learning\.<\/strong>[\s\S]*<strong>Development\.<\/strong>[\s\S]*<strong>Evidence\.<\/strong>[\s\S]*<strong>Access\.<\/strong>/);
}
assert.equal((html.match(/class="study-appraisal"/g)||[]).length,23);
assert.equal((html.match(/class="game-table"/g)||[]).length,1);
assert.doesNotMatch(html,/Image not reproduced|Open verified access link|\[object Object\]|undefined/);
assert.match(html,/Mentioned in Reinders et al\. \(2024\) — review/);
assert.match(html,/No current public game-access link verified/);
for(const game of games) {
  assert.ok(html.includes('id="game-'+game.id+'"'));
  assert.ok(html.includes('id="details-'+game.id+'" hidden'));
  assert.ok(game.description.split(/(?<=[.!?])\s+/).length>=2,game.id+': description too short');
}
for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);
for(const file of ['tools/site.js','tools/sidebar.js','tools/catalogue.js']) new vm.Script(read(file));
const tabletPath='output/private/T1D-Serious-Games-Knowledge-Base-private.html';
if(process.argv.includes('--tablet')) {
  const tablet=read(tabletPath);
  assert.equal((tablet.match(/class="game-entry"/g)||[]).length,games.length);
  assert.equal((tablet.match(/class="game-profile"/g)||[]).length,games.length);
  const ids=[...tablet.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'Duplicate offline anchors');
  const gameLinks=[...tablet.matchAll(/href="#(game-[^"]+)"/g)].map(m=>m[1]);
  assert.ok(gameLinks.length>46,'Cross-chapter game links lost');
  gameLinks.forEach(id=>assert.ok(ids.includes(id),'Missing game anchor '+id));
  assert.match(tablet,/t1d-kb-navigation-open/);
  assert.match(tablet,/id="game-search"/);
  assert.match(tablet,/data:image\//);
}
console.log('Reading interface: filters, compound filters, empty results, both year-sort directions, unknown dates, expansion, deep links, menu persistence, tablet defaults, denied storage and Escape passed.');
console.log('Static output checks passed. No browser rendering or visual inspection performed.');
