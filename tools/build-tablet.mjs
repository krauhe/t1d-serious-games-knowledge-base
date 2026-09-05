/**
 * Create a single-file, offline tablet edition of the private knowledge base.
 *
 * The script deliberately consumes a completed private `_site` build rather
 * than the source documents. This keeps Markdown rendering identical across
 * the normal local edition and the tablet edition. CSS, JavaScript, original
 * figures, and review-only game images are embedded in the resulting HTML.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const siteDirectory = path.join(projectRoot, '_site');
const privateBuildMarker = path.join(siteDirectory, 'PRIVATE-IMAGE-BUILD.txt');
const outputDirectory = path.join(projectRoot, 'output', 'private');
const outputFile = path.join(outputDirectory, 'T1D-Serious-Games-Knowledge-Base-private.html');

if (!fs.existsSync(privateBuildMarker)) {
  throw new Error('A private site build is required. Run `node tools/build-site.mjs --private-images` first.');
}

const navigation = readJson(path.join(projectRoot, 'data', 'navigation.json'));
const pageEntries = navigation.flatMap(section => section.items.map(item => ({
  group: section.group,
  title: item.title,
  output: normaliseUrl(item.generated || item.source?.replace(/\.(?:qmd|md)$/i, '.html'))
}))).filter(item => item.output);
const pageIdByOutput = new Map(pageEntries.map(item => [item.output, pageId(item.output)]));

const chapters = [];
const searchIndex = [];
for (const entry of pageEntries) {
  const pagePath = resolveInsideSite(entry.output);
  if (!fs.existsSync(pagePath)) {
    throw new Error(`Required built page is missing: ${entry.output}`);
  }

  const pageHtml = fs.readFileSync(pagePath, 'utf8');
  const mainMatch = pageHtml.match(/<main\s+class="article"\s+id="main-content">([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    throw new Error(`Could not locate the article body in ${entry.output}`);
  }

  let body = mainMatch[1]
    .replace(/<div class="article-status">[\s\S]*?<\/div>/i, '')
    .replace(/<footer class="article-footer">[\s\S]*?<\/footer>/i, '');
  body = inlineLocalSources(body, entry.output);
  body = rewriteInternalLinks(body, entry.output);

  const identifier = pageIdByOutput.get(entry.output);
  chapters.push(`<section class="tablet-chapter" id="${identifier}" data-source-page="${escapeAttribute(entry.output)}">
    <div class="tablet-chapter-context">${escapeHtml(entry.group)} · Offline chapter</div>
    ${body}
    <p class="tablet-back-link"><a href="#${pageIdByOutput.get('index.html')}">Back to contents</a></p>
  </section>`);
  searchIndex.push({
    id: identifier,
    title: entry.title,
    text: plainText(body).slice(0, 16000)
  });
}

const headerMarkPath = path.join(projectRoot, 'figures', 'original', 't1d-serious-games-header-icon.png');
const backgroundPath = path.join(projectRoot, 'figures', 'original', 'pixel-biomes-background.png');
const pixelFontPath = path.join(projectRoot, 'assets', 'fonts', 'PressStart2P-Regular.ttf');
const headerMarkDataUri = dataUriForFile(headerMarkPath);
const backgroundDataUri = dataUriForFile(backgroundPath);
const pixelFontDataUri = dataUriForFile(pixelFontPath);
const baseStyles = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8')
  .replaceAll('figures/original/pixel-biomes-background.png', backgroundDataUri)
  .replaceAll('assets/fonts/PressStart2P-Regular.ttf', pixelFontDataUri);
const generatedAt = new Date().toISOString().slice(0, 10);
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Private, self-contained tablet edition of the T1D Serious Games Knowledge Base.">
  <title>T1D Serious Games Knowledge Base · Private tablet edition</title>
  <style>
${baseStyles}

/* Single-file tablet edition: all chapters share one scrollable document. */
.tablet-chapter { scroll-margin-top: 92px; }
.tablet-chapter + .tablet-chapter { margin-top: 76px; padding-top: 68px; border-top: 3px solid var(--line); }
.tablet-chapter-context { margin-bottom: 18px; color: var(--teal); font-size: 0.76rem; font-weight: 740; letter-spacing: 0.055em; text-transform: uppercase; }
.tablet-back-link { margin-top: 38px; font-size: 0.86rem; }
.tablet-export-status { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 42px; color: var(--muted); font-size: 0.78rem; letter-spacing: 0.035em; text-transform: uppercase; }
.tablet-export-status span:first-child { color: var(--teal); font-weight: 730; }
.site-sidebar a.current-chapter { color: #0b5e60; background: var(--teal-soft); font-weight: 680; }
@media print {
  .tablet-chapter + .tablet-chapter { break-before: page; margin-top: 0; padding-top: 0; border-top: 0; }
  .tablet-back-link { display: none; }
  .private-build-banner { display: block !important; border: 1px solid #edc87c; }
}
  </style>
</head>
<body data-root-prefix="">
  <a class="skip-link" href="#${pageIdByOutput.get('index.html')}">Skip to content</a>
  <div class="site-background" aria-hidden="true"></div>
  <header class="site-header">
    <button class="menu-button" type="button" aria-controls="site-sidebar" aria-expanded="false">Menu</button>
    <a class="site-brand" href="#${pageIdByOutput.get('index.html')}" aria-label="T1D Serious Games Knowledge Base, home"><span class="brand-mark-frame"><img class="brand-mark" src="${headerMarkDataUri}" alt="" aria-hidden="true"></span><span class="brand-title" aria-hidden="true">T1D Serious Games Knowledge Base</span></a>
    <button class="search-button" type="button" aria-controls="search-panel" aria-expanded="false">Search</button>
  </header>
  <div class="private-build-banner"><strong>Private tablet edition.</strong> This self-contained file includes third-party game images retained for private scholarly review. Do not publish or redistribute it.</div>
  <div class="site-shell">
    <aside class="site-sidebar" id="site-sidebar" aria-label="Knowledge-base navigation">${renderNavigation()}</aside>
    <main class="article" id="main-content">
      <div class="tablet-export-status"><span>Private offline edition</span><span>Generated ${generatedAt}</span><span>Evidence search closed 24 August 2026</span></div>
      ${chapters.join('\n')}
      <footer class="article-footer">
        <p>This knowledge base distinguishes measured evidence, adjacent evidence, public product information, and design inference. It does not provide individual medical advice.</p>
        <p>Original content, structured data, and original figures: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="license noopener noreferrer">CC BY 4.0</a> · Software: MIT License · © 2026 Kristian Rauhe Harreby</p>
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
  <script>
window.T1D_TABLET_SEARCH_INDEX = ${safeJsonForScript(searchIndex)};
${tabletScript()}
  </script>
</body>
</html>`;

assertSelfContained(html);
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputFile, html, 'utf8');

const sizeMiB = fs.statSync(outputFile).size / (1024 * 1024);
console.log(`Built ${pageEntries.length} chapters in ${outputFile}`);
console.log(`Self-contained private tablet edition: ${sizeMiB.toFixed(2)} MiB`);
console.log('This file contains review-only third-party images and must not be published.');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normaliseUrl(value) {
  return String(value || '').replaceAll('\\', '/').replace(/^\.\//, '');
}

function pageId(output) {
  return `page-${output.toLowerCase().replace(/\.html$/i, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

function resolveInsideSite(relativeUrl) {
  const decoded = decodeURIComponent(relativeUrl.split(/[?#]/, 1)[0]);
  const resolved = path.resolve(siteDirectory, ...normaliseUrl(decoded).split('/'));
  const expectedPrefix = `${path.resolve(siteDirectory)}${path.sep}`;
  if (resolved !== path.resolve(siteDirectory) && !resolved.startsWith(expectedPrefix)) {
    throw new Error(`Refusing to read outside the built site: ${relativeUrl}`);
  }
  return resolved;
}

function inlineLocalSources(fragment, currentOutput) {
  return fragment.replace(/\bsrc=(['"])([^'"]+)\1/gi, (match, quote, source) => {
    if (/^(?:data:|https?:|\/\/)/i.test(source)) return match;
    const relativeAsset = normaliseUrl(path.posix.join(path.posix.dirname(currentOutput), source.split(/[?#]/, 1)[0]));
    const assetPath = resolveInsideSite(relativeAsset);
    if (!fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
      throw new Error(`Local asset referenced by ${currentOutput} is missing: ${source}`);
    }
    const mimeType = mimeTypeFor(assetPath);
    const data = fs.readFileSync(assetPath).toString('base64');
    return `src=${quote}data:${mimeType};base64,${data}${quote}`;
  });
}

function rewriteInternalLinks(fragment, currentOutput) {
  return fragment.replace(/\bhref=(['"])([^'"]+)\1/gi, (match, quote, target) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) return match;
    const pathPart = target.split(/[?#]/, 1)[0];
    const resolvedOutput = normaliseUrl(path.posix.join(path.posix.dirname(currentOutput), pathPart));
    const targetId = pageIdByOutput.get(resolvedOutput);
    if (targetId) return `href=${quote}#${targetId}${quote}`;

    const linkedFile = resolveInsideSite(resolvedOutput);
    if (fs.existsSync(linkedFile) && fs.statSync(linkedFile).isFile()) {
      const mimeType = mimeTypeFor(linkedFile);
      const data = fs.readFileSync(linkedFile).toString('base64');
      return `href=${quote}data:${mimeType};base64,${data}${quote} download="${escapeAttribute(path.basename(linkedFile))}"`;
    }
    return match;
  });
}

function mimeTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const types = {
    '': 'text/plain',
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain',
    '.webp': 'image/webp'
  };
  if (!types[extension]) throw new Error(`Unsupported embedded asset type: ${filePath}`);
  return types[extension];
}

function dataUriForFile(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(`Required embedded asset is missing: ${filePath}`);
  }
  return `data:${mimeTypeFor(filePath)};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

function renderNavigation() {
  return navigation.map(section => {
    const links = section.items.map(item => {
      const output = normaliseUrl(item.generated || item.source?.replace(/\.(?:qmd|md)$/i, '.html'));
      const identifier = pageIdByOutput.get(output);
      return identifier ? `<li><a href="#${identifier}" data-chapter-link="${identifier}">${escapeHtml(item.title)}</a></li>` : '';
    }).join('');
    return `<nav class="nav-group"><h2>${escapeHtml(section.group)}</h2><ul>${links}</ul></nav>`;
  }).join('');
}

function tabletScript() {
  return `(function () {
    'use strict';
    const menuButton = document.querySelector('.menu-button');
    const sidebar = document.getElementById('site-sidebar');
    const searchButton = document.querySelector('.search-button');
    const searchPanel = document.getElementById('search-panel');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.getElementById('site-search');
    const searchResults = document.getElementById('search-results');
    const navigationLinks = [...document.querySelectorAll('[data-chapter-link]')];
    const backgroundLayer = document.querySelector('.site-background');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let parallaxFrame = 0;

    function updateBackgroundPosition() {
      parallaxFrame = 0;
      if (!backgroundLayer || reducedMotion.matches) {
        document.documentElement.style.setProperty('--landscape-position', '0%');
        return;
      }
      const scrollableHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = Math.min(1, Math.max(0, window.scrollY / scrollableHeight));
      document.documentElement.style.setProperty('--landscape-position', (scrollProgress * 100).toFixed(3) + '%');
    }

    function requestBackgroundUpdate() {
      if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateBackgroundPosition);
    }

    window.addEventListener('scroll', requestBackgroundUpdate, { passive: true });
    window.addEventListener('resize', requestBackgroundUpdate);
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', requestBackgroundUpdate);
    }
    updateBackgroundPosition();

    menuButton?.addEventListener('click', function () {
      const isOpen = document.body.classList.toggle('sidebar-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    sidebar?.addEventListener('click', function (event) {
      if (!event.target.closest('a')) return;
      document.body.classList.remove('sidebar-open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });

    function openSearch() {
      searchPanel.hidden = false;
      searchButton?.setAttribute('aria-expanded', 'true');
      window.setTimeout(function () { searchInput?.focus(); }, 0);
    }

    function closeSearch() {
      searchPanel.hidden = true;
      searchButton?.setAttribute('aria-expanded', 'false');
    }

    searchButton?.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', closeSearch);
    searchPanel?.addEventListener('click', function (event) {
      if (event.target === searchPanel) closeSearch();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !searchPanel?.hidden) closeSearch();
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
      }
    });

    searchInput?.addEventListener('input', function () {
      const terms = searchInput.value.toLowerCase().trim().split(/\\s+/).filter(Boolean);
      if (!terms.length) {
        searchResults.innerHTML = '<p>Enter one or more terms. Search covers the complete offline edition.</p>';
        return;
      }
      const matches = (window.T1D_TABLET_SEARCH_INDEX || []).map(function (entry) {
        const haystack = (entry.title + ' ' + entry.text).toLowerCase();
        const score = terms.reduce(function (sum, term) { return sum + (haystack.includes(term) ? 1 : 0); }, 0);
        return Object.assign({}, entry, { score: score });
      }).filter(function (entry) { return entry.score === terms.length; }).slice(0, 20);
      searchResults.innerHTML = matches.length ? matches.map(function (entry) {
        return '<a href="#' + entry.id + '" data-search-result><strong>' + escapeHtml(entry.title) + '</strong><span>' + escapeHtml(snippet(entry.text, terms[0])) + '</span></a>';
      }).join('') : '<p>No matching chapters. Try a broader term.</p>';
    });

    searchResults?.addEventListener('click', function (event) {
      if (event.target.closest('[data-search-result]')) closeSearch();
    });

    function setCurrentChapter(identifier) {
      navigationLinks.forEach(function (link) {
        link.classList.toggle('current-chapter', link.dataset.chapterLink === identifier);
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        const visible = entries.filter(function (entry) { return entry.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        if (visible[0]) setCurrentChapter(visible[0].target.id);
      }, { rootMargin: '-12% 0px -72% 0px', threshold: [0, 0.05, 0.2] });
      document.querySelectorAll('.tablet-chapter').forEach(function (chapter) { observer.observe(chapter); });
    }

    function snippet(text, term) {
      const clean = String(text).replace(/\\s+/g, ' ');
      const position = clean.toLowerCase().indexOf(term);
      const start = Math.max(0, position - 90);
      const end = Math.min(clean.length, start + 240);
      return (start ? '…' : '') + clean.slice(start, end) + (end < clean.length ? '…' : '');
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (character) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
      });
    }
  }());`;
}

function plainText(htmlFragment) {
  return htmlFragment.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[A-Za-z0-9#]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeJsonForScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

function assertSelfContained(documentHtml) {
  const externalAsset = documentHtml.match(/<(?:img|script|link)\b[^>]*(?:src|href)=(['"])(?!data:|https?:|\/\/|#)(.*?)\1/i);
  if (externalAsset) throw new Error(`Tablet export still contains a local asset dependency: ${externalAsset[2]}`);
  const unresolvedLocalLink = documentHtml.match(/<a\b[^>]*href=(['"])(?![a-z][a-z0-9+.-]*:|\/\/|#)(.*?)\1/i);
  if (unresolvedLocalLink) throw new Error(`Tablet export still contains an unresolved local link: ${unresolvedLocalLink[2]}`);
  const chaptersWritten = (documentHtml.match(/class="tablet-chapter"/g) || []).length;
  if (chaptersWritten !== pageEntries.length) {
    throw new Error(`Expected ${pageEntries.length} chapters, wrote ${chaptersWritten}.`);
  }
  if (!documentHtml.includes('data:image/')) {
    throw new Error('Tablet export does not contain embedded images; refusing to label it as the private image edition.');
  }
  for (const scriptMatch of documentHtml.matchAll(/<script>([\s\S]*?)<\/script>/gi)) {
    try {
      new Function(scriptMatch[1]);
    } catch (error) {
      throw new Error(`Tablet export contains invalid inline JavaScript: ${error.message}`);
    }
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/\r?\n/g, ' ');
}
