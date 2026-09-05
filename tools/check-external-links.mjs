/**
 * Validate every external URL used by the knowledge base from the local computer.
 *
 * This network-dependent audit complements tools/validate.mjs, which deliberately
 * remains deterministic and checks only repository structure and local links.
 * Results are written to the gitignored .validation directory for manual review.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportDirectory = path.join(projectRoot, '.validation');
const excludedDirectories = new Set([
  '.git', '.validation', 'node_modules', 'output', 'private-literature'
]);
const sourceExtensions = new Set([
  '.cff', '.html', '.json', '.md', '.qmd', '.svg', '.yaml', '.yml'
]);
const timeoutMilliseconds = 30_000;
const minimumHostIntervalMilliseconds = 300;
const configuredPrivateRepository = verifyConfiguredPrivateRepository();

const sourceFiles = listFiles(projectRoot, file => {
  const relative = path.relative(projectRoot, file).replaceAll('\\', '/');
  if (relative === 'pnpm-lock.yaml') return false;
  return sourceExtensions.has(path.extname(file).toLowerCase());
});

const locationsByUrl = new Map();
for (const sourceFile of sourceFiles) {
  const relative = path.relative(projectRoot, sourceFile).replaceAll('\\', '/');
  const content = fs.readFileSync(sourceFile, 'utf8');
  for (const url of extractUrls(content, path.extname(sourceFile).toLowerCase())) {
    if (!locationsByUrl.has(url)) locationsByUrl.set(url, new Set());
    locationsByUrl.get(url).add(relative);
  }
}

const urls = [...locationsByUrl.keys()].sort((left, right) => left.localeCompare(right));
const results = new Array(urls.length);
const urlsByHost = new Map();
for (const [index, url] of urls.entries()) {
  const host = new URL(url).hostname.toLowerCase();
  if (!urlsByHost.has(host)) urlsByHost.set(host, []);
  urlsByHost.get(host).push({ index, url });
}
let completedCount = 0;

// Hosts run in parallel, but each host is contacted sequentially and gently.
// This prevents a large PubMed or DOI list from creating its own false 429s.
await Promise.all([...urlsByHost.values()].map(async hostEntries => {
  for (const { index, url } of hostEntries) {
    results[index] = await inspectUrl(url, [...locationsByUrl.get(url)].sort());
    completedCount += 1;
    const marker = results[index].classification === 'working' ? 'OK' : results[index].classification.toUpperCase();
    process.stdout.write(`[${completedCount}/${urls.length}] ${marker} ${url}\n`);
    await delay(minimumHostIntervalMilliseconds);
  }
}));

const generatedAt = new Date().toISOString();
const counts = results.reduce((summary, result) => {
  summary[result.classification] = (summary[result.classification] || 0) + 1;
  return summary;
}, {});

fs.mkdirSync(reportDirectory, { recursive: true });
fs.writeFileSync(
  path.join(reportDirectory, 'external-links-report.json'),
  `${JSON.stringify({ generated_at: generatedAt, computer: os.hostname(), counts, results }, null, 2)}\n`,
  'utf8'
);
fs.writeFileSync(
  path.join(reportDirectory, 'external-links-report.md'),
  renderMarkdownReport(generatedAt, counts, results),
  'utf8'
);

console.log('\nExternal-link validation complete.');
console.log(`  - ${urls.length} unique URLs tested from this computer.`);
for (const classification of ['working', 'restricted', 'suspicious', 'broken']) {
  console.log(`  - ${classification}: ${counts[classification] || 0}`);
}
console.log('  - Reports: .validation/external-links-report.{md,json}');

if ((counts.broken || 0) > 0 || (counts.suspicious || 0) > 0) process.exitCode = 1;

function listFiles(directory, includeFile) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(absolute, includeFile));
    else if (entry.isFile() && includeFile(absolute)) files.push(absolute);
  }
  return files;
}

function extractUrls(content, extension) {
  const candidates = new Set();
  const htmlAttributes = /(?:href|src)=["'](https?:\/\/[^"']+)["']/gi;
  const markdownTargets = /\]\((https?:\/\/(?:[^()\s]|\([^)]*\))+?)\)/gi;
  const strictBareUrls = /https?:\/\/[^\s<>"'`()\[\]]+/gi;
  const quotedValues = /["'](https?:\/\/[^"'\s]+)["']/gi;
  const patterns = extension === '.html'
    ? [htmlAttributes]
    : extension === '.svg'
      ? [htmlAttributes]
      : ['.md', '.qmd'].includes(extension)
        ? [markdownTargets, htmlAttributes, strictBareUrls]
        : [quotedValues, strictBareUrls];
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const candidate = normaliseCandidate(match[1] || match[0]);
      if (candidate) candidates.add(candidate);
    }
  }
  return [...candidates].filter(candidate => ![...candidates].some(other =>
    other !== candidate && other.startsWith(`${candidate}(`)
  ));
}

function normaliseCandidate(candidate) {
  let value = candidate.replaceAll('&amp;', '&').trim();
  value = value.replace(/[\],.;:}]+$/g, '');
  while (value.endsWith(')') && count(value, ')') > count(value, '(')) value = value.slice(0, -1);
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    parsed.hash = '';
    return parsed.href;
  } catch {
    return '';
  }
}

function count(value, character) {
  return [...value].filter(item => item === character).length;
}

async function inspectUrl(url, sources, attempt = 0) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMilliseconds);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8',
        'accept-language': 'en-GB,en;q=0.9',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) T1D-Serious-Games-Knowledge-Base-Link-Audit/1.0'
      }
    });
    if ([429, 503].includes(response.status) && attempt < 2) {
      await response.body?.cancel().catch(() => {});
      await delay(2_000 * (attempt + 1));
      return inspectUrl(url, sources, attempt + 1);
    }
    const contentType = response.headers.get('content-type') || '';
    const sample = await readBodySample(response, 131_072);
    const title = extractTitle(sample, contentType);
    const finalUrl = response.url || url;
    const restriction = restrictionReason(response.status, finalUrl, title, sample);
    const suspicious = suspiciousReason(response.status, title, sample);
    let classification = 'working';
    let note = response.redirected ? 'Redirect followed and final destination retrieved.' : 'Destination retrieved.';

    if (response.status === 404 && isConfiguredPrivateRepositoryUrl(url)) {
      classification = 'restricted';
      note = 'Private GitHub repository verified through the authenticated local Git remote; anonymous HTTP access returns 404.';
    } else if (restriction) {
      classification = 'restricted';
      note = restriction;
    } else if (!response.ok) {
      classification = 'broken';
      note = `HTTP ${response.status} ${response.statusText}`.trim();
    } else if (suspicious) {
      classification = 'suspicious';
      note = suspicious;
    }

    return {
      url,
      classification,
      status: response.status,
      final_url: finalUrl,
      redirected: response.redirected,
      content_type: contentType,
      title,
      note,
      elapsed_ms: Date.now() - startedAt,
      sources
    };
  } catch (error) {
    return {
      url,
      classification: 'broken',
      status: null,
      final_url: null,
      redirected: false,
      content_type: null,
      title: null,
      note: error.name === 'AbortError' ? `Timed out after ${timeoutMilliseconds / 1000} seconds.` : error.message,
      elapsed_ms: Date.now() - startedAt,
      sources
    };
  } finally {
    clearTimeout(timeout);
  }
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function verifyConfiguredPrivateRepository() {
  try {
    const remoteUrl = execFileSync('git', ['-C', projectRoot, 'config', '--get', 'remote.origin.url'], {
      encoding: 'utf8',
      timeout: 10_000,
      windowsHide: true
    }).trim();
    const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?$/i);
    if (!match) return null;
    execFileSync('git', ['-C', projectRoot, 'ls-remote', '--exit-code', 'origin', 'HEAD'], {
      encoding: 'utf8',
      stdio: 'ignore',
      timeout: 30_000,
      windowsHide: true
    });
    return { owner: match[1].toLowerCase(), repository: match[2].toLowerCase() };
  } catch {
    return null;
  }
}

function isConfiguredPrivateRepositoryUrl(value) {
  if (!configuredPrivateRepository) return false;
  try {
    const parsed = new URL(value);
    const pathParts = parsed.pathname.split('/').filter(Boolean).map(part => part.toLowerCase());
    if (parsed.hostname === 'github.com') {
      return pathParts[0] === configuredPrivateRepository.owner && pathParts[1] === configuredPrivateRepository.repository;
    }
    if (parsed.hostname === 'raw.githubusercontent.com') {
      return pathParts[0] === configuredPrivateRepository.owner && pathParts[1] === configuredPrivateRepository.repository;
    }
  } catch {
    return false;
  }
  return false;
}

async function readBodySample(response, maximumBytes) {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks = [];
  let byteCount = 0;
  try {
    while (byteCount < maximumBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      const remaining = maximumBytes - byteCount;
      chunks.push(value.subarray(0, remaining));
      byteCount += Math.min(value.byteLength, remaining);
      if (value.byteLength > remaining) break;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(concatenate(chunks, byteCount));
}

function concatenate(chunks, totalLength) {
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return combined;
}

function extractTitle(sample, contentType) {
  if (!/html|xhtml/i.test(contentType) && !/<(?:html|title)\b/i.test(sample)) return '';
  const match = sample.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeEntities(match[1]).replace(/\s+/g, ' ').trim().slice(0, 300) : '';
}

function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function restrictionReason(status, finalUrl, title, sample) {
  if ([401, 403, 407, 429, 451].includes(status)) return `Access restricted or automated requests refused (HTTP ${status}).`;
  if (/\/(?:login|signin|sign-in|oauth)(?:[/?#]|$)/i.test(finalUrl)) return 'Redirected to an authentication page.';
  const challengeTitle = /captcha|verify you are human|checking your browser|access denied|just a moment|attention required/i.test(title);
  const openingContent = sample.slice(0, 3000);
  const explicitChallenge = /verify you are human|checking your browser before accessing|access denied.{0,100}(?:request|reference|ray id)/i.test(openingContent);
  if (challengeTitle || explicitChallenge) {
    return 'Automated access challenge detected; requires manual browser verification.';
  }
  return '';
}

function suspiciousReason(status, title, sample) {
  if (status < 200 || status >= 300) return '';
  const evidence = `${title}\n${sample.slice(0, 12_000)}`;
  if (/\b(?:404|410)\b.{0,35}(?:not found|gone)|page not found|domain (?:is )?for sale|website is parked|site (?:is )?unavailable/i.test(evidence)) {
    return 'The server returned success, but the page content resembles an error or parked-domain page.';
  }
  return '';
}

function renderMarkdownReport(generatedAt, summary, auditResults) {
  const lines = [
    '# External-link validation report',
    '',
    `Generated: ${generatedAt}`,
    '',
    `Unique URLs tested from the local computer: **${auditResults.length}**.`,
    '',
    `- Working: ${summary.working || 0}`,
    `- Access-restricted or automation-blocked: ${summary.restricted || 0}`,
    `- Suspicious successful responses: ${summary.suspicious || 0}`,
    `- Broken: ${summary.broken || 0}`,
    '',
    'A working response establishes technical reachability, not scientific validity or permission to reproduce third-party material.',
    ''
  ];

  for (const classification of ['broken', 'suspicious', 'restricted', 'working']) {
    const matching = auditResults.filter(result => result.classification === classification);
    lines.push(`## ${classification[0].toUpperCase()}${classification.slice(1)} (${matching.length})`, '');
    if (!matching.length) {
      lines.push('None.', '');
      continue;
    }
    for (const result of matching) {
      lines.push(`### ${result.url}`, '');
      lines.push(`- Result: ${result.status ?? 'network error'}; ${result.note}`);
      if (result.final_url && result.final_url !== result.url) lines.push(`- Final destination: ${result.final_url}`);
      if (result.title) lines.push(`- Page title: ${result.title}`);
      lines.push(`- Referenced by: ${result.sources.join(', ')}`, '');
    }
  }
  return `${lines.join('\n')}\n`;
}
