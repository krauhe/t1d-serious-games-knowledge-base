/**
 * Build a dependency-light local HTML edition of the knowledge base.
 *
 * Quarto remains the canonical publication target. This builder exists so the
 * private working edition can be opened directly from disk without installing
 * Quarto or starting a web server. It deliberately copies uncleared game
 * images only when --private-images is supplied; the entire output directory
 * is gitignored.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const outputDirectory = path.join(projectRoot, '_site');
const expectedOutputDirectory = path.resolve(projectRoot, '_site');
const includePrivateImages = process.argv.includes('--private-images');

if (path.resolve(outputDirectory) !== expectedOutputDirectory || path.basename(outputDirectory) !== '_site') {
  throw new Error(`Refusing to replace unexpected output directory: ${outputDirectory}`);
}

const navigation = readJson('data/navigation.json');
const flattenedNavigation = navigation.flatMap(section => section.items);

marked.setOptions({
  gfm: true,
  breaks: false
});

// A synchronisation client may briefly hold the directory node after a build.
// Keep the validated _site directory and remove only its direct children; this
// avoids replacing the watched root while still preventing stale pages.
try {
  clearOutputDirectory(outputDirectory);
} catch (error) {
  // Overlaying an already ignored private build is safe during a temporary
  // filesystem lock. A public build must still fail closed because an
  // overlay could leave uncleared private images from an earlier build.
  if (includePrivateImages && error?.code === 'EPERM') {
    console.warn('Generated output is temporarily locked; continuing with a private-build overlay.');
  } else {
    throw error;
  }
}

copyFileIfPresent('styles.css', 'styles.css');
copyFileIfPresent('tools/site.js', 'site.js');
copyFileIfPresent('data/games.json', 'data/games.json');
copyFileIfPresent('data/studies.json', 'data/studies.json');
copyFileIfPresent('docs/reviews/2026-09-06_scientific-content-audit/source-access-register.json', 'docs/reviews/2026-09-06_scientific-content-audit/source-access-register.json');
copyFileIfPresent('docs/reviews/2026-09-06_corrections/source-access.json', 'docs/reviews/2026-09-06_corrections/source-access.json');
copyFileIfPresent('LICENSE', 'LICENSE');
copyDirectoryIfPresent('figures/original', 'figures/original');
copyDirectoryIfPresent('figures/game-images-cleared', 'figures/game-images-cleared');
copyDirectoryIfPresent('assets/fonts', 'assets/fonts');

if (includePrivateImages) {
  copyDirectoryIfPresent('figures/game-images-review-only', 'assets/game-images');
  fs.writeFileSync(
    path.join(outputDirectory, 'PRIVATE-IMAGE-BUILD.txt'),
    'This local build contains third-party images retained for private scholarly review. Do not publish this directory.\n',
    'utf8'
  );
}

const searchIndex = [];
for (const item of flattenedNavigation) {
  if (!item.source) continue;
  const sourcePath = path.join(projectRoot, item.source);
  if (!fs.existsSync(sourcePath)) continue;

  const parsed = parseDocument(fs.readFileSync(sourcePath, 'utf8'), item.title);
  const outputRelativePath = item.source.replace(/\.(?:qmd|md)$/i, '.html');
  const outputPath = path.join(outputDirectory, outputRelativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  let renderedBody = renderMarkdown(parsed.body);
  if (!/<h1(?:\s|>)/i.test(renderedBody)) {
    renderedBody = `<h1>${escapeHtml(parsed.title)}</h1>\n${renderedBody}`;
  }
  const pageHtml = renderPage({
    title: parsed.title,
    description: parsed.description,
    body: renderedBody,
    currentOutput: outputRelativePath,
    privateImageBuild: includePrivateImages
  });
  fs.writeFileSync(outputPath, pageHtml, 'utf8');

  searchIndex.push({
    title: parsed.title,
    url: outputRelativePath.replaceAll('\\', '/'),
    text: plainText(renderedBody).slice(0, 12000)
  });
}

const explorer = buildExplorer();
fs.writeFileSync(path.join(outputDirectory, 'explorer.html'), explorer.html, 'utf8');
searchIndex.push({ title: 'Game explorer', url: 'explorer.html', text: explorer.searchText });

fs.writeFileSync(
  path.join(outputDirectory, 'search-index.js'),
  `window.T1D_KB_SEARCH_INDEX = ${JSON.stringify(searchIndex)};\n`,
  'utf8'
);

console.log(`Built ${searchIndex.length} pages in ${outputDirectory}`);
console.log(includePrivateImages
  ? 'Private image mode: ON. The output must not be published.'
  : 'Private image mode: OFF. Uncleared third-party images were not copied.');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), 'utf8'));
}

function clearOutputDirectory(directory) {
  const resolvedRoot = path.resolve(directory);
  if (resolvedRoot !== expectedOutputDirectory || path.basename(resolvedRoot) !== '_site') {
    throw new Error(`Refusing to clear unexpected output directory: ${resolvedRoot}`);
  }
  fs.mkdirSync(resolvedRoot, { recursive: true });
  if (fs.lstatSync(resolvedRoot).isSymbolicLink()) throw new Error('Refusing to clear a linked output root.');
  clearGeneratedChildren(resolvedRoot);
}

// Dropbox kan låse selve mappeknuden, selv når dens genererede filer kan fjernes.
// Ryd derfor filer først. En tom, låst mappe er harmløs; en ulæselig mappe eller
// en fil, som ikke kunne fjernes, skal stadig blokere den offentlige bygning.
function clearGeneratedChildren(directory) {
  const relative = path.relative(expectedOutputDirectory, directory);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing to clear output outside _site: ${directory}`);
  }
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.resolve(directory, entry.name);
    if (path.dirname(target) !== directory) throw new Error(`Unexpected output entry: ${target}`);
    if (entry.isDirectory() && !entry.isSymbolicLink()) {
      clearGeneratedChildren(target);
      try {
        fs.rmdirSync(target);
      } catch (error) {
        if (!['EPERM', 'EBUSY'].includes(error?.code) || fs.readdirSync(target).length !== 0) throw error;
      }
    } else {
      // Følg ikke symbolske links ud af den validerede outputmappe.
      fs.unlinkSync(target);
    }
  }
}

function copyFileIfPresent(sourceRelativePath, targetRelativePath) {
  const source = path.join(projectRoot, sourceRelativePath);
  if (!fs.existsSync(source)) return;
  const target = path.join(outputDirectory, targetRelativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyDirectoryIfPresent(sourceRelativePath, targetRelativePath) {
  const source = path.join(projectRoot, sourceRelativePath);
  if (!fs.existsSync(source)) return;
  const target = path.join(outputDirectory, targetRelativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
}

function parseDocument(source, fallbackTitle) {
  let body = source.replace(/^\uFEFF/, '');
  const metadata = {};

  if (body.startsWith('---')) {
    const closing = body.indexOf('\n---', 3);
    if (closing !== -1) {
      const frontMatter = body.slice(3, closing).trim();
      body = body.slice(closing + 4).replace(/^\r?\n/, '');
      for (const line of frontMatter.split(/\r?\n/)) {
        const match = line.match(/^([A-Za-z0-9_-]+):\s*["']?(.*?)["']?\s*$/);
        if (match) metadata[match[1]] = match[2];
      }
    }
  }

  const firstHeading = body.match(/^#\s+(.+)$/m)?.[1];
  const title = metadata.title || firstHeading || fallbackTitle;
  return { title, description: metadata.description || '', body };
}

function renderMarkdown(markdown) {
  const withCallouts = markdown.replace(
    /:::\s*\{\.callout-([a-z-]+)(?:\s+title=["']([^"']+)["'])?\}\s*\r?\n([\s\S]*?)\r?\n:::/g,
    (_match, type, title, content) => `<aside class="callout callout-${type}">${title ? `<h3>${escapeHtml(title)}</h3>` : ''}${marked.parse(content)}</aside>`
  );
  const withHighlights = withCallouts.replace(/==([^=\n]+)==/g, '<mark>$1</mark>');
  return marked.parse(withHighlights)
    .replace(/href="([^"]+)\.(?:qmd|md)(#[^"]*)?"/g, 'href="$1.html$2"')
    .replace(/<a href="(https?:\/\/[^\"]+)"/g, '<a target="_blank" rel="noopener noreferrer" href="$1"');
}

function renderPage({ title, description, body, currentOutput, privateImageBuild }) {
  const depth = currentOutput.split('/').length - 1;
  const rootPrefix = '../'.repeat(depth);
  const sidebar = renderNavigation(currentOutput, rootPrefix);
  const privateNotice = privateImageBuild
    ? '<div class="private-build-banner"><strong>Private scholarly review build.</strong> Third-party game images in this output are not cleared for republication.</div>'
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeAttribute(description || 'Scientific knowledge base for serious games relevant to type 1 diabetes.')}">
  <title>${escapeHtml(title)} | T1D Serious Games Knowledge Base</title>
  <link rel="icon" type="image/png" href="${rootPrefix}figures/original/t1d-serious-games-header-icon.png">
  <link rel="stylesheet" href="${rootPrefix}styles.css">
</head>
<body data-root-prefix="${rootPrefix}">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <div class="site-background" aria-hidden="true"></div>
  <header class="site-header">
    <button class="menu-button" type="button" aria-controls="site-sidebar" aria-expanded="false">Menu</button>
    <a class="site-brand" href="${rootPrefix}index.html" aria-label="T1D Serious Games Knowledge Base, home"><span class="brand-mark-frame"><img class="brand-mark" src="${rootPrefix}figures/original/t1d-serious-games-header-icon.png" alt="" aria-hidden="true"></span><span class="brand-title" aria-hidden="true">T1D Serious Games Knowledge Base</span></a>
    <button class="search-button" type="button" aria-controls="search-panel" aria-expanded="false">Search</button>
  </header>
  ${privateNotice}
  <div class="site-shell">
    <aside class="site-sidebar" id="site-sidebar" aria-label="Knowledge-base navigation">${sidebar}</aside>
    <main class="article" id="main-content">
      <div class="article-status"><span>Scientific working edition</span><span>Historical search: 24 August 2026</span><span>Targeted corrections: 6 September 2026</span></div>
      ${body}
      <footer class="article-footer">
        <p>This knowledge base distinguishes measured evidence, adjacent evidence, public product information, and design inference. It does not provide individual medical advice.</p>
        <p>Original content, structured data, and original figures: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="license noopener noreferrer">CC BY 4.0</a> · Software: <a href="${rootPrefix}LICENSE" rel="license">MIT License</a> · © 2026 Kristian Rauhe Harreby</p>
      </footer>
    </main>
  </div>
  <section class="search-panel" id="search-panel" hidden aria-label="Search the knowledge base">
    <div class="search-dialog">
      <div class="search-row"><label for="site-search">Search</label><button class="search-close" type="button">Close</button></div>
      <input id="site-search" type="search" autocomplete="off" placeholder="Try: retrieval practice, HbA1c, Captain Novolin">
      <div id="search-results" class="search-results" aria-live="polite"></div>
    </div>
  </section>
  <script src="${rootPrefix}search-index.js"></script>
  <script src="${rootPrefix}site.js"></script>
</body>
</html>`;
}

function renderNavigation(currentOutput, rootPrefix) {
  return navigation.map(section => {
    const links = section.items.map(item => {
      const output = item.generated || item.source?.replace(/\.(?:qmd|md)$/i, '.html');
      if (!output) return '';
      const active = output.replaceAll('\\', '/') === currentOutput.replaceAll('\\', '/');
      return `<li><a${active ? ' class="active" aria-current="page"' : ''} href="${rootPrefix}${output.replaceAll('\\', '/')}">${escapeHtml(item.title)}</a></li>`;
    }).join('');
    return `<nav class="nav-group"><h2>${escapeHtml(section.group)}</h2><ul>${links}</ul></nav>`;
  }).join('');
}

function buildExplorer() {
  const cataloguePath = path.join(projectRoot, 'data', 'games.json');
  if (!fs.existsSync(cataloguePath)) {
    const body = '<h1>Game explorer</h1><p>The structured game catalogue is being assembled. This page will become available when <code>data/games.json</code> has been validated.</p>';
    return {
      html: renderPage({ title: 'Game explorer', description: '', body, currentOutput: 'explorer.html', privateImageBuild: includePrivateImages }),
      searchText: 'Game explorer structured catalogue'
    };
  }

  const catalogue = readJson('data/games.json');
  const games = Array.isArray(catalogue) ? catalogue : catalogue.games || [];
  const cards = games.map(game => renderGameCard(game)).join('\n');
  const body = `
    <h1>Game explorer</h1>
    <p class="lead">Compare intended audiences, platforms, learning objectives, evidence, provenance, cost, and current availability. Absence of evaluation is shown explicitly; public availability is not treated as evidence of effectiveness.</p>
    <div class="explorer-summary"><strong>${games.length}</strong><span>catalogued games and game-like interventions</span></div>
    <div class="explorer-controls" aria-label="Catalogue filters">
      <label>Search<input id="game-search" type="search" placeholder="Title, mechanism, learning objective"></label>
      <label>Availability<select id="availability-filter"><option value="">All</option>${optionsFor(games, game => game.availability?.status)}</select></label>
      <label>Evidence<select id="evidence-filter"><option value="">All</option>${optionsFor(games, game => game.evidence?.level)}</select></label>
      <label>Platform<select id="platform-filter"><option value="">All</option>${optionsFor(games, game => game.platforms, true)}</select></label>
    </div>
    <p id="game-result-count" class="result-count" aria-live="polite"></p>
    <div class="game-grid" id="game-grid">${cards}</div>
    <script>${explorerScript()}</script>`;

  return {
    html: renderPage({ title: 'Game explorer', description: 'Structured comparison of serious games relevant to type 1 diabetes.', body, currentOutput: 'explorer.html', privateImageBuild: includePrivateImages }),
    searchText: games.map(game => `${game.title} ${game.genre || ''} ${(game.learning_objectives || []).join(' ')}`).join(' ')
  };
}

function renderGameCard(game) {
  const screenshot = game.screenshot || {};
  // Private images are discovered locally by stable game ID. Their filenames
  // and storage details do not belong in the public catalogue.
  const localImageName = findPrivateImageName(game.id);
  const localImagePath = localImageName ? path.join(projectRoot, 'figures', 'game-images-review-only', localImageName) : '';
  const canShowPrivateImage = includePrivateImages && localImagePath && fs.existsSync(localImagePath);
  const image = canShowPrivateImage
    ? `<img src="assets/game-images/${encodeURIComponent(localImageName)}" alt="Representative image for ${escapeAttribute(game.title)}">`
    : `<div class="game-image-placeholder" aria-label="Image not reproduced"><span>Image not reproduced</span></div>`;
  const sourceLink = screenshot.source_url
    ? `<a class="image-source-link" href="${escapeAttribute(screenshot.source_url)}" target="_blank" rel="noopener noreferrer">Image source</a>`
    : '';
  const officialUrl = game.links?.official?.[0] || game.links?.stores?.[0] || game.links?.publications?.[0] || '';
  const evidenceLevel = game.evidence?.level || 'Evidence status not classified';
  const evidenceDetail = game.evidence?.design_detail || '';
  // Vis appraisal pr. rapport; et spils evidenskategori er ikke en kvalitetsdom.
  const studyDetails = renderStudyDetails(game);
  const availability = game.availability?.status || 'Availability uncertain';
  const availabilityDetail = game.availability?.status_detail || '';
  const price = game.availability?.price || 'Price not verified';
  const linkLabel = availability === 'publicly available'
    ? 'Open verified access link'
    : availability === 'availability incompletely verified'
      ? 'Open recorded link (availability uncertain)'
      : 'Open documented source link';
  const platforms = game.platforms || [];
  const objectives = game.learning_objectives || [];
  const searchable = plainText([
    game.title,
    ...(game.aliases || []),
    game.genre,
    game.core_gameplay_loop,
    ...(game.platforms || []),
    ...(game.languages || []),
    ...(game.learning_objectives || []),
    ...(game.game_mechanisms || []),
    ...(game.pedagogical_mechanisms || []),
    game.developer?.classification,
    ...(game.developer?.names || []),
    game.evidence?.level,
    game.evidence?.summary,
    game.availability?.status
  ].filter(Boolean).join(' ')).toLowerCase();

  return `<article class="game-card" data-search="${escapeAttribute(searchable)}" data-availability="${escapeAttribute(availability)}" data-evidence="${escapeAttribute(evidenceLevel)}" data-platforms="${escapeAttribute(platforms.join('|'))}">
    <div class="game-image">${image}${sourceLink}</div>
    <div class="game-card-body">
      <div class="game-card-kicker">${escapeHtml(game.target_population?.diabetes_specificity || game.scope_group || 'Diabetes-related')}</div>
      <h2>${escapeHtml(game.title || 'Untitled game')}</h2>
      <p>${escapeHtml(game.core_gameplay_loop || game.genre || 'Gameplay description not available.')}</p>
      <dl class="game-facts">
        <div><dt>Platform</dt><dd>${escapeHtml(platforms.join(', ') || 'Not verified')}</dd></div>
        <div><dt>Evidence</dt><dd>${escapeHtml(evidenceLevel)}${evidenceDetail && evidenceDetail !== evidenceLevel ? `<span class="facet-detail">${escapeHtml(evidenceDetail)}</span>` : ''}</dd></div>
        <div><dt>Availability</dt><dd>${escapeHtml(availability)}${availabilityDetail && availabilityDetail !== availability ? `<span class="facet-detail">${escapeHtml(availabilityDetail)}</span>` : ''}<span class="facet-detail">${escapeHtml(price)}</span></dd></div>
        <div><dt>Provenance</dt><dd>${escapeHtml(game.developer?.classification || 'Not classified')}${game.developer?.names?.length ? `<span class="facet-detail">${escapeHtml(game.developer.names.join('; '))}</span>` : ''}</dd></div>
      </dl>
      <p class="evidence-summary">${escapeHtml(game.evidence?.summary || 'No evidence summary extracted.')}</p>
      <p class="facet-detail">Availability checked: ${escapeHtml(game.availability?.verified_on || 'unknown')}. Scientific appraisal: ${escapeHtml(game.evidence?.appraisal_date || 'not recorded')}. Not playtested.</p>
      ${studyDetails}
      ${objectives.length ? `<div class="tag-list">${objectives.slice(0, 6).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>` : ''}
      <div class="game-card-links">${officialUrl ? `<a href="${escapeAttribute(officialUrl)}" target="_blank" rel="noopener noreferrer">${linkLabel}</a>` : '<span>No active access link verified</span>'}</div>
    </div>
  </article>`;
}

function findPrivateImageName(gameId) {
  if (!includePrivateImages || !gameId) return '';
  const directory = path.join(projectRoot, 'figures', 'game-images-review-only');
  if (!fs.existsSync(directory)) return '';
  // AR-figurens arkivnavn afviger fra katalog-id'et; bevar den hentede fil.
  const imageStem = gameId === 'ar-food-game' ? 'ar-diabetes-game' : gameId;
  const expectedPrefix = `${String(imageStem).toLowerCase()}_`;
  return fs.readdirSync(directory).find(name => name.toLowerCase().startsWith(expectedPrefix)) || '';
}

// Hent fra det fælles register, så web- og tabletbygninger viser samme data.
function renderStudyDetails(game) {
  const register = readJson('data/studies.json');
  return (game.evidence?.study_ids || []).map(id => {
    const study = register.studies.find(item => item.id === id && item.game_id === game.id);
    if (!study) throw new Error('Missing study link: ' + id);
    const outcomes = study.outcomes.map(outcome =>
      '<li><strong>' + escapeHtml(outcome.construct) + ':</strong> ' +
      escapeHtml(outcome.reported_result) + ' <span class="facet-detail">Instrument: ' +
      escapeHtml(outcome.instrument || 'not extracted') + '; follow-up: ' +
      escapeHtml(outcome.follow_up || 'not extracted') + '; denominator: ' +
      escapeHtml(String(outcome.denominator ?? 'not extracted')) + '.</span></li>'
    ).join('');
    const domains = Object.entries(study.appraisal).map(([domain, concern]) =>
      '<li><strong>' + escapeHtml(domain.replaceAll('_', ' ')) + ':</strong> ' + escapeHtml(concern) + '</li>'
    ).join('');
    const sources = study.report_urls.map((url, index) =>
      '<a href="' + escapeAttribute(url) + '" target="_blank" rel="noopener noreferrer">Report source ' + (index + 1) + '</a>'
    ).join(' · ');
    return '<details class="study-appraisal"><summary>' + escapeHtml(study.report_citation) +
      '</summary><p><strong>Extraction:</strong> ' + escapeHtml(study.extraction_status) +
      '. ' + escapeHtml(study.support_depth) + '.</p><p><strong>Design/purpose:</strong> ' +
      escapeHtml(study.design) + '; ' + escapeHtml(study.purpose) +
      '.</p><p><strong>Population:</strong> ' + escapeHtml(study.population) +
      '.</p><p><strong>Sample:</strong> ' + escapeHtml(String(study.sample.reported ?? 'not extracted')) +
      '.</p><p><strong>Version:</strong> ' + escapeHtml(study.intervention_version) +
      '.</p><ul>' + outcomes + '</ul><h3>Methodological concerns</h3><ul>' + domains +
      '</ul><p>' + sources + '</p></details>';
  }).join('');
}

function optionsFor(games, accessor, flatten = false) {
  const values = games.flatMap(game => {
    const value = accessor(game);
    return flatten && Array.isArray(value) ? value : [value];
  }).filter(Boolean);
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
    .map(value => `<option value="${escapeAttribute(value)}">${escapeHtml(value)}</option>`).join('');
}

function explorerScript() {
  return `(function () {
    const cards = [...document.querySelectorAll('.game-card')];
    const search = document.getElementById('game-search');
    const availability = document.getElementById('availability-filter');
    const evidence = document.getElementById('evidence-filter');
    const platform = document.getElementById('platform-filter');
    const count = document.getElementById('game-result-count');
    function update() {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      for (const card of cards) {
        const matches = (!query || card.dataset.search.includes(query))
          && (!availability.value || card.dataset.availability === availability.value)
          && (!evidence.value || card.dataset.evidence === evidence.value)
          && (!platform.value || card.dataset.platforms.split('|').includes(platform.value));
        card.hidden = !matches;
        if (matches) visible += 1;
      }
      count.textContent = visible + ' of ' + cards.length + ' records shown';
    }
    [search, availability, evidence, platform].forEach(control => control.addEventListener('input', update));
    update();
  }());`;
}

function plainText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[A-Za-z0-9#]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/\r?\n/g, ' ');
}
