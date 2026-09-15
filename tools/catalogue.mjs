/** Render the single game catalogue. Product data and report appraisals remain separate. */
import fs from 'node:fs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const list = values => esc((values || []).join('; ') || 'Not established');
const external = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
const evidenceLabels = {
  'controlled outcome study': 'Controlled study',
  'pre/post or feasibility study': 'Pre/post / feasibility',
  'usability or participatory co-design study': 'Usability / co-design',
  'development description or conceptual framework': 'Development / concept',
  'public product without peer-reviewed evaluation': 'No evaluation located',
  'marketing or developer claim without independent evidence': 'Developer claims only'
};
const accessLabels = {
  'publicly available': 'Public',
  'availability incompletely verified': 'Access uncertain',
  'study or trial only': 'Study only',
  'research prototype; not publicly available': 'Research prototype',
  'discontinued': 'Discontinued'
};

export function renderCatalogue(games, { renderStudyDetails, imageFor, studies }) {
  const option = (field, getter, labels = {}) => `<label>${field}<select id="${field.toLowerCase()}-filter"><option value="">All</option>${[...new Set(games.flatMap(getter).filter(Boolean))].sort().map(v => `<option value="${esc(v)}">${esc(labels[v] || v)}</option>`).join('')}</select></label>`;
  const headers = [['title', 'Game'], ['year', 'Year¹'], ['language', 'Language'], ['platform', 'Platform'], ['audience', 'Audience'], ['objectives', 'Learning goals'], ['evidence', 'Evidence'], ['availability', 'Access'], ['price', 'Price']];
  return `<h1>Game catalogue</h1>
    <p class="lead">Compare ${games.length} games and related interventions. Select a game for its description, developer, access links and study results.</p>
    <div class="explorer-controls" aria-label="Catalogue filters">
      <label>Search<input id="game-search" type="search" placeholder="Game, language, audience or learning goal"></label>
      ${option('Availability', g => g.availability.status, accessLabels)}
      ${option('Evidence', g => g.evidence.level, evidenceLabels)}
      ${option('Platform', g => g.platforms)}
      ${option('Language', g => g.languages)}
      <button type="button" id="catalogue-reset">Clear filters</button>
    </div>
    <p id="game-result-count" class="result-count" role="status"></p>
    <p class="catalogue-note" id="catalogue-help">¹ Release year where known; otherwise the date is explicitly labelled as a study, report or review listing. “Not established” does not mean a 2026 release. Availability and prices are dated observations; open a game for region and verification details. Descriptions are desk research, not playtests.</p>
    <div class="catalogue-scroll" role="region" aria-label="Game comparison table; scroll horizontally for all columns" tabindex="0">
    <table class="game-table" id="game-table" aria-describedby="catalogue-help">
      <caption>Games, platforms, learning objectives and access</caption>
      <thead><tr>${headers.map(([key,label]) => `<th scope="col" aria-sort="${key === 'title' ? 'ascending' : 'none'}"><button type="button" data-sort="${key}">${label}<span aria-hidden="true"> ${key === 'title' ? '↑' : '↕'}</span></button></th>`).join('')}</tr></thead>
      ${[...games].sort((a,b) => a.title.localeCompare(b.title)).map(game => renderGame(game, {renderStudyDetails, imageFor, studies})).join('\n')}
    </table></div>
    <p id="catalogue-empty" hidden>No matching games. Clear a filter or try a broader term.</p>
    <script>${fs.readFileSync(new URL('./catalogue.js', import.meta.url), 'utf8')}</script>`;
}

function renderGame(game, {renderStudyDetails, imageFor, studies}) {
  const date = game.catalogue_date;
  const data = {title:game.title, year:date.year ?? '', language:game.languages.join('; '), platform:game.platforms.join('; '), audience:game.target_population.age_range, objectives:game.learning_objectives.join('; '), evidence:game.evidence.level, availability:game.availability.status, price:game.availability.price};
  const search = [game.title, game.description, ...(game.aliases || []), ...Object.values(data), game.target_population.diabetes_specificity, ...game.target_population.roles, ...game.game_mechanisms, ...game.pedagogical_mechanisms, ...game.developer.names].join(' ').toLowerCase();
  const attrs = Object.entries(data).map(([key,value]) => `data-${key}="${esc(value)}"`).join(' ');
  const image = imageFor(game);
  const detailsId = `details-${game.id}`;
  const facts = [
    ['Lived-experience involvement', game.developer.lived_experience_involvement],
    ['Audience', `${game.target_population.age_range}; ${game.target_population.roles.join('; ')}. ${game.target_population.diabetes_specificity}`],
    ['Release and reporting history', game.release_history.join('; ')],
    ['Language', game.languages.join('; ')],
    ['Platform / hardware', `${game.platforms.join('; ')}. ${game.availability.hardware_dependencies}`],
    ['Game mechanisms', game.game_mechanisms.join('; ')],
    ['Learning objectives (intended)', game.learning_objectives.join('; ')],
    ['Pedagogical mechanisms (proposed)', game.pedagogical_mechanisms.join('; ')],
    ['Price / monetisation', `${game.availability.price}. ${game.availability.monetisation}`],
    ['Regions / account', `${[].concat(game.availability.regions || []).join('; ')}. ${game.availability.account_requirements}`]
  ];
  return `<tbody class="game-entry" id="game-${esc(game.id)}" ${attrs} data-search="${esc(search)}" data-platforms="${esc(game.platforms.join('|'))}" data-languages="${esc(game.languages.join('|'))}">
    <tr class="game-summary">
      <th scope="row"><button class="game-toggle" type="button" aria-expanded="false" aria-controls="${detailsId}">${esc(game.title)}<span class="facet-detail">Description &amp; sources +</span></button>${game.development_status ? `<span class="facet-detail">${esc(game.development_status)}</span>` : ''}</th>
      <td>${esc(date.label)}</td><td>${list(game.languages)}</td><td>${list(game.platforms)}</td>
      <td>${esc(game.target_population.age_range)}<span class="facet-detail">${esc(game.target_population.diabetes_specificity)}</span></td>
      <td>${list(game.learning_objectives)}</td><td>${esc(evidenceLabels[game.evidence.level])}</td>
      <td>${esc(accessLabels[game.availability.status])}</td><td>${esc(game.availability.price)}</td>
    </tr>
    <tr class="game-detail-row" id="${detailsId}" hidden><td colspan="9">
      <div class="game-detail-body">
        <h2>${esc(game.title)}</h2>
        <div class="game-profile">
          <p class="game-description"><strong>Play and learning.</strong> ${esc(game.description)}</p>
          <p class="profile-development"><strong>Development.</strong> ${esc(game.developer.names.join('; '))} (${esc(game.developer.classification)}).${game.developer.affiliation ? ` ${esc(game.developer.affiliation)}` : ''}</p>
          <p class="evidence-summary"><strong>Evidence.</strong> ${esc(game.evidence.summary)}</p>
          <p class="profile-access"><strong>Access.</strong> ${esc(game.availability.status_detail)}. Availability checked: ${esc(game.availability.verified_on)} (${esc(game.availability.confidence)}).</p>
        </div>
        ${image ? `<figure class="game-figure">${image}</figure>` : ''}
        <div class="product-links">${renderLinks(game, studies)}</div>
        <details class="product-record"><summary>Product details and study reports</summary>
        <dl class="game-facts">${facts.map(([label,value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value || 'Not established')}</dd></div>`).join('')}</dl>
        <h3>Study reports</h3>
        <p class="facet-detail">${esc(game.evidence.level)}. ${esc(game.evidence.design_detail)}</p>
        ${renderStudyDetails(game)}
        <details class="design-notes"><summary>Design strengths and limitations — interpretation</summary><p>${esc(game.design_assessment.evidence_basis)}</p><dl><dt>Strengths</dt><dd>${list(game.design_assessment.strengths)}</dd><dt>Limitations</dt><dd>${list(game.design_assessment.limitations)}</dd><dt>Design relevance</dt><dd>${list(game.design_assessment.design_relevance)}</dd></dl></details>
        <p class="facet-detail">Scientific appraisal: ${esc(game.evidence.appraisal_date)}. ${esc(game.evidence.search_scope)} Not playtested.</p>
        </details>
        <a class="game-permalink" href="#game-${esc(game.id)}">Link to this game</a>
      </div>
    </td></tr></tbody>`;
}

function renderLinks(game, studies) {
  const links = [];
  const seen = new Set();
  const imageSource = game.screenshot?.source_url;
  // Kildelinket står uden for billedrammen, så det også findes uden et billede.
  // Genbrug et eksisterende produkt-/artikellink, når det er samme destination.
  const add = (url,label) => { if (!seen.has(url)) { links.push(external(url, url === imageSource && label !== 'Image source' ? `${label} · image source` : label)); seen.add(url); } };
  for (const url of game.links.official || []) {
    const label = /clinicaltrials\.gov/.test(url) ? 'Trial registration' : /github\.com/.test(url) ? 'Source repository' : /itch\.io/.test(url) ? 'Game distribution page' : /github\.io/.test(url) && game.availability.status === 'publicly available' ? 'Play in browser' : 'Official website';
    add(url,label);
  }
  for (const url of game.links.stores || []) add(url, /apps\.apple\.com/.test(url) ? 'App Store' : /play\.google\.com/.test(url) ? 'Google Play' : 'Game distribution page');
  for (const url of game.links.publications || []) {
    const report = studies.find(study => study.report_urls.includes(url));
    let label = report ? report.report_citation : 'Research article';
    if (url.includes('10.1016/j.diabres.2024.111833')) label = 'Mentioned in Reinders et al. (2024) — review';
    if (url.includes('10.2196/games.3930')) label = 'Described in Kamel Boulos et al. (2015)';
    add(url,label);
  }
  for (const url of game.links.archives || []) add(url, 'Historical product information');
  if (imageSource) add(imageSource, 'Image source');
  if (!game.links.official?.some(url => !url.includes('clinicaltrials.gov')) && !game.links.stores?.length) links.unshift('<span>No current public game-access link verified.</span>');
  return links.join(' <span aria-hidden="true">·</span> ');
}
