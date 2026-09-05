/**
 * Normalise catalogue facets while retaining the original, more specific labels.
 *
 * The explorer needs a small controlled vocabulary. Study design and access
 * details remain available in evidence.design_detail and
 * availability.status_detail so normalisation does not discard information.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cataloguePath = path.join(projectRoot, 'data', 'games.json');
const catalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));

const evidenceMap = new Map([
  ['controlled outcome study', 'controlled outcome study'],
  ['small randomised trial', 'controlled outcome study'],
  ['single-blind randomised controlled trial', 'controlled outcome study'],
  ['small comparative usability/learning study', 'controlled outcome study'],
  ['clinician-training trial', 'controlled outcome study'],

  ['pre/post or feasibility study', 'pre/post or feasibility study'],
  ['feasibility/usability study', 'pre/post or feasibility study'],
  ['development/feasibility description', 'pre/post or feasibility study'],
  ['pre/post evaluation', 'pre/post or feasibility study'],
  ['single-group pre/post feasibility study', 'pre/post or feasibility study'],
  ['single-group pre/post study', 'pre/post or feasibility study'],
  ['two-arm feasibility study', 'pre/post or feasibility study'],
  ['small quasi-experimental outcome study', 'pre/post or feasibility study'],
  ['small completed pilot', 'pre/post or feasibility study'],

  ['usability or participatory co-design study', 'usability or participatory co-design study'],
  ['participatory co-design and short feasibility/learning evaluation', 'usability or participatory co-design study'],
  ['participatory design/development', 'usability or participatory co-design study'],
  ['feasibility and participatory design', 'usability or participatory co-design study'],
  ['design/usability study', 'usability or participatory co-design study'],
  ['participatory co-design', 'usability or participatory co-design study'],
  ['protocol/qualitative co-design', 'usability or participatory co-design study'],

  ['development description or conceptual framework', 'development description or conceptual framework'],
  ['development history; no controlled product-specific outcome study located', 'development description or conceptual framework'],
  ['development description/viewpoint', 'development description or conceptual framework'],
  ['development/conceptual study', 'development description or conceptual framework'],
  ['development/conference evaluation', 'development description or conceptual framework'],
  ['qualitative/conceptual framework', 'development description or conceptual framework'],
  ['public product/development history', 'development description or conceptual framework'],

  ['public product without peer-reviewed evaluation', 'public product without peer-reviewed evaluation'],
  ['public product without peer-reviewed outcome evaluation located', 'public product without peer-reviewed evaluation'],
  ['public product; no peer-reviewed outcome evaluation located', 'public product without peer-reviewed evaluation'],
  ['public product without independent peer-reviewed outcome evaluation', 'public product without peer-reviewed evaluation'],
  ['public product without independent outcome evaluation', 'public product without peer-reviewed evaluation'],
  ['public product without peer-reviewed evaluation located', 'public product without peer-reviewed evaluation'],
  ['public product without product-specific outcome evidence located', 'public product without peer-reviewed evaluation'],
  ['public product without controlled evaluation located', 'public product without peer-reviewed evaluation'],
  ['public product with limited formal outcome evidence located', 'public product without peer-reviewed evaluation'],
  ['public product with limited related publication; independent educational efficacy not established', 'public product without peer-reviewed evaluation'],

  ['marketing or developer claim without independent evidence', 'marketing or developer claim without independent evidence']
]);

const availabilityMap = new Map([
  ['publicly available', 'publicly available'],
  ['publicly playable', 'publicly available'],
  ['Android listing public; iOS status not fully verified', 'publicly available'],
  ['public iOS listing', 'publicly available'],
  ['public web presence', 'publicly available'],

  ['availability incompletely verified', 'availability incompletely verified'],
  ['official web presence active; mobile-store status incompletely verified', 'availability incompletely verified'],
  ['current availability uncertain', 'availability incompletely verified'],
  ['availability uncertain; digital Rufus successor is active', 'availability incompletely verified'],
  ['current store availability uncertain', 'availability incompletely verified'],

  ['study or trial only', 'study or trial only'],
  ['study-only; public release not located', 'study or trial only'],
  ['study-only; public listing not located', 'study or trial only'],
  ['study-only', 'study or trial only'],
  ['trial-only', 'study or trial only'],
  ['trial-only; product not located', 'study or trial only'],
  ['trial/research access', 'study or trial only'],

  ['research prototype; not publicly available', 'research prototype; not publicly available'],
  ['research prototype; public distribution not located', 'research prototype; not publicly available'],
  ['prototype; unavailable', 'research prototype; not publicly available'],
  ['research prototype; unavailable', 'research prototype; not publicly available'],
  ['research-only; no public service located', 'research prototype; not publicly available'],
  ['research-only; unavailable', 'research prototype; not publicly available'],
  ['concept/research prototype', 'research prototype; not publicly available'],
  ['research prototype', 'research prototype; not publicly available'],
  ['research-only', 'research prototype; not publicly available'],

  ['discontinued', 'discontinued']
]);

for (const game of catalogue.games) {
  const evidenceDetail = game.evidence.design_detail || game.evidence.level;
  const evidenceLevel = evidenceMap.get(game.evidence.level);
  if (!evidenceLevel) throw new Error(`${game.title}: unmapped evidence level '${game.evidence.level}'.`);
  game.evidence.design_detail = evidenceDetail;
  game.evidence.level = evidenceLevel;

  const availabilityDetail = game.availability.status_detail || game.availability.status;
  const availabilityStatus = availabilityMap.get(game.availability.status);
  if (!availabilityStatus) throw new Error(`${game.title}: unmapped availability status '${game.availability.status}'.`);
  game.availability.status_detail = availabilityDetail;
  game.availability.status = availabilityStatus;
}

catalogue.catalogue_version = '2026-09-05-v3';
fs.writeFileSync(cataloguePath, `${JSON.stringify(catalogue, null, 2)}\n`, 'utf8');
console.log(`Normalised ${catalogue.games.length} catalogue records.`);
