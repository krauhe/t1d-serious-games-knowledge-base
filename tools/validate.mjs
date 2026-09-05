/**
 * Validate the structured catalogue, navigation, and local source references.
 * The checks are intentionally deterministic and do not depend on live URLs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const findings = [];
const notes = [];
let games = [];

const navigation = readJson('data/navigation.json');
const navigationItems = navigation.flatMap(section => section.items || []);

for (const item of navigationItems) {
  if (!item.source) continue;
  const sourcePath = path.join(projectRoot, item.source);
  if (!fs.existsSync(sourcePath)) {
    findings.push(`Navigation source is missing: ${item.source}`);
    continue;
  }
  const content = fs.readFileSync(sourcePath, 'utf8');
  if (!/^#\s+\S/m.test(content) && !/^title:\s*\S/m.test(content)) {
    findings.push(`Page lacks a title: ${item.source}`);
  }
}

const cataloguePath = path.join(projectRoot, 'data', 'games.json');
if (!fs.existsSync(cataloguePath)) {
  findings.push('Structured catalogue is missing: data/games.json');
} else {
  const catalogue = readJson('data/games.json');
  games = Array.isArray(catalogue) ? catalogue : catalogue.games;
  if (!Array.isArray(games) || !games.length) {
    findings.push('data/games.json must contain a non-empty games array.');
  } else {
    const required = [
      'id', 'title', 'target_population', 'platforms', 'genre',
      'learning_objectives', 'core_gameplay_loop', 'game_mechanisms',
      'pedagogical_mechanisms', 'developer', 'evidence', 'availability',
      'links', 'screenshot', 'playtest_status'
    ];
    const evidenceLevels = new Set([
      'controlled outcome study',
      'pre/post or feasibility study',
      'usability or participatory co-design study',
      'development description or conceptual framework',
      'public product without peer-reviewed evaluation',
      'marketing or developer claim without independent evidence'
    ]);
    const availabilityStatuses = new Set([
      'publicly available',
      'availability incompletely verified',
      'study or trial only',
      'research prototype; not publicly available',
      'discontinued'
    ]);
    const identifiers = new Set();
    for (const [index, game] of games.entries()) {
      const label = game.title || `record ${index + 1}`;
      for (const field of required) {
        if (!(field in game)) findings.push(`${label}: missing required field '${field}'.`);
      }
      if (game.id && identifiers.has(game.id)) findings.push(`Duplicate game id: ${game.id}`);
      if (game.id) identifiers.add(game.id);
      if (game.playtest_status !== 'not_playtested') {
        findings.push(`${label}: playtest_status must remain 'not_playtested' during this desk-research phase.`);
      }
      if (!game.availability?.verified_on) findings.push(`${label}: availability verification date is missing.`);
      if (!game.availability?.confidence) findings.push(`${label}: availability confidence is missing.`);
      if (!game.availability?.status_detail) findings.push(`${label}: detailed availability status is missing.`);
      if (!availabilityStatuses.has(game.availability?.status)) findings.push(`${label}: unrecognised normalised availability status.`);
      if (!game.developer?.classification) findings.push(`${label}: developer classification is missing.`);
      if (!game.evidence?.level) findings.push(`${label}: evidence level is missing.`);
      if (!game.evidence?.design_detail) findings.push(`${label}: detailed evidence design is missing.`);
      if (!evidenceLevels.has(game.evidence?.level)) findings.push(`${label}: unrecognised normalised evidence level.`);
      const allLinks = Object.values(game.links || {}).flat().filter(Boolean);
      for (const link of allLinks) {
        if (!/^https:\/\//i.test(link)) findings.push(`${label}: link is not HTTPS: ${link}`);
      }
      if (game.screenshot?.file && !game.screenshot?.source_url) {
        findings.push(`${label}: local screenshot filename has no source URL.`);
      }
      if (game.screenshot?.file && !game.screenshot?.captured_on) {
        findings.push(`${label}: local screenshot filename has no capture or retrieval date.`);
      }
      if (game.screenshot?.file && !game.screenshot?.copyright_holder) {
        findings.push(`${label}: local screenshot filename has no documented copyright holder.`);
      }
    }
    notes.push(`${games.length} structured game records checked.`);
  }
}

for (const sourceFile of listFiles(projectRoot, file => /\.(qmd|md)$/i.test(file))) {
  const relative = path.relative(projectRoot, sourceFile).replaceAll('\\', '/');
  if (relative.startsWith('private-literature/') || relative.startsWith('_site/')) continue;
  const content = fs.readFileSync(sourceFile, 'utf8');
  const localLinks = [...content.matchAll(/\]\((?!https?:|mailto:|#)([^)]+)\)/g)];
  for (const match of localLinks) {
    const targetText = match[1].split('#')[0].trim().replace(/^<|>$/g, '');
    if (!targetText || targetText.includes('{{') || targetText.endsWith('.html')) continue;
    const resolved = path.resolve(path.dirname(sourceFile), targetText);
    if (!fs.existsSync(resolved)) findings.push(`${relative}: unresolved local link '${targetText}'.`);
  }
}

for (const svgFile of listFiles(path.join(projectRoot, 'figures', 'original'), file => /\.svg$/i.test(file))) {
  const relative = path.relative(projectRoot, svgFile).replaceAll('\\', '/');
  const content = fs.readFileSync(svgFile, 'utf8');
  if (!/<svg(?:\s|>)/i.test(content) || !/<\/svg>/i.test(content)) {
    findings.push(`${relative}: incomplete SVG document.`);
  }
  if (!/<title(?:\s|>)[\s\S]*?<\/title>/i.test(content)) {
    findings.push(`${relative}: SVG lacks an accessible <title>.`);
  }
  if (!/<desc(?:\s|>)[\s\S]*?<\/desc>/i.test(content)) {
    findings.push(`${relative}: SVG lacks an accessible <desc>.`);
  }
}

const builtSite = path.join(projectRoot, '_site');
if (fs.existsSync(builtSite)) {
  const htmlFiles = listFiles(builtSite, file => /\.html$/i.test(file));
  for (const htmlFile of htmlFiles) {
    const relative = path.relative(projectRoot, htmlFile).replaceAll('\\', '/');
    const content = fs.readFileSync(htmlFile, 'utf8');
    if (!/<h1(?:\s|>)/i.test(content)) findings.push(`${relative}: rendered page lacks an H1.`);
    if (/^:::/m.test(content)) findings.push(`${relative}: unrendered Quarto callout markup remains.`);

    for (const match of content.matchAll(/\b(?:href|src)="([^"]+)"/gi)) {
      const target = match[1].trim();
      if (!target || /^(?:https?:|mailto:|data:|javascript:|#)/i.test(target)) continue;
      const pathOnly = target.split('#')[0].split('?')[0];
      let decoded = pathOnly;
      try { decoded = decodeURIComponent(pathOnly); } catch { /* The unresolved target is reported below. */ }
      const resolved = path.resolve(path.dirname(htmlFile), decoded);
      if (!fs.existsSync(resolved)) findings.push(`${relative}: broken rendered link or asset '${target}'.`);
    }
  }

  const privateMarker = path.join(builtSite, 'PRIVATE-IMAGE-BUILD.txt');
  if (fs.existsSync(privateMarker)) {
    const localReviewDirectory = path.join(projectRoot, 'figures', 'game-images-review-only');
    const expectedImages = fs.existsSync(localReviewDirectory)
      ? fs.readdirSync(localReviewDirectory, { withFileTypes: true }).filter(entry => entry.isFile()).map(entry => entry.name)
      : [];
    const privateImageDirectory = path.join(builtSite, 'assets', 'game-images');
    const builtImages = fs.existsSync(privateImageDirectory)
      ? fs.readdirSync(privateImageDirectory, { withFileTypes: true }).filter(entry => entry.isFile()).map(entry => entry.name)
      : [];
    for (const imageName of expectedImages) {
      if (!builtImages.includes(imageName)) findings.push(`Private HTML build is missing catalogued image '${imageName}'.`);
    }
    notes.push(`${builtImages.length} private review images checked in the local HTML build.`);
  }
  notes.push(`${htmlFiles.length} rendered HTML pages checked for headings, markup, links, and assets.`);
}

try {
  const trackedPrivateFiles = execFileSync('git', [
    '-C', projectRoot, 'ls-files', 'private-literature', 'figures/game-images-review-only'
  ], { encoding: 'utf8' }).trim();
  if (trackedPrivateFiles) findings.push(`Private files are tracked by Git:\n${trackedPrivateFiles}`);
} catch (error) {
  notes.push(`Git privacy check skipped: ${error.message}`);
}

if (findings.length) {
  console.error('Knowledge-base validation failed:');
  findings.forEach(finding => console.error(`  - ${finding}`));
  process.exit(1);
}

console.log('Knowledge-base validation: OK');
notes.forEach(note => console.log(`  - ${note}`));
console.log(`  - ${navigationItems.filter(item => item.source).length} navigable source pages checked.`);

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), 'utf8'));
}

function listFiles(directory, predicate) {
  const results = [];
  if (!fs.existsSync(directory)) return results;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', '_site'].includes(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...listFiles(fullPath, predicate));
    else if (predicate(fullPath)) results.push(fullPath);
  }
  return results;
}
