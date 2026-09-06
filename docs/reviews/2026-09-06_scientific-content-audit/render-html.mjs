/** Render the audit independently of the public website; no chapter rebuild. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '../../..');
const input = `${directory}.md`;
const output = path.join(root, 'output/reviews/2026-09-06_scientific-content-audit.html');
const source = fs.readFileSync(input, 'utf8');
const headings = [];
const renderer = new marked.Renderer();
renderer.heading = function ({ tokens, depth }) {
  const label = this.parser.parseInline(tokens);
  const id = label.replace(/<[^>]*>/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (depth === 2 && /^\d/.test(label)) headings.push({ label, id });
  return `<h${depth} id="${id}">${label}</h${depth}>\n`;
};
renderer.link = function ({ href, tokens }) {
  let target = href;
  if (!/^(https?:|mailto:|#)/.test(target)) {
    const absolute = path.resolve(path.dirname(input), decodeURI(target));
    if (!fs.existsSync(absolute)) throw new Error(`Missing audit link: ${target}`);
    target = path.relative(path.dirname(output), absolute).split(path.sep).map(encodeURIComponent).join('/');
  }
  return `<a href="${target.replaceAll('&', '&amp;').replaceAll('"','&quot;')}">${this.parser.parseInline(tokens)}</a>`;
};
const body = marked.parse(source, { renderer });
const nav = headings.map(h => `<a href="#${h.id}">${h.label}</a>`).join('\n');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Scientific Content Audit - T1D Serious Games Knowledge Base</title>
<style>
:root{color-scheme:light;--ink:#233b4d;--accent:#087d77;--paper:#fff;--muted:#596d7b}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#eaf0f3;color:var(--ink);font:17px/1.7 Georgia,serif}
header{background:#15384b;color:white;padding:30px 5vw;border-bottom:5px solid #4ec4b4;font:600 15px/1.5 system-ui,sans-serif;letter-spacing:.06em}
.layout{max-width:1450px;margin:auto;display:grid;grid-template-columns:240px minmax(0,1fr);gap:30px;padding:35px 30px}
nav{position:sticky;top:22px;align-self:start;font:14px/1.5 system-ui,sans-serif;max-height:92vh;overflow:auto}nav strong{display:block;color:var(--accent);margin-bottom:16px;font-size:12px;letter-spacing:.13em}nav a{display:block;margin-bottom:12px;color:var(--ink);text-decoration:none}nav a:hover{color:var(--accent);text-decoration:underline}
main{background:var(--paper);padding:50px 65px;min-width:0;border:1px solid #dbe4ea;border-radius:8px;box-shadow:0 10px 40px #12334809}
h1,h2,h3{font-family:system-ui,sans-serif;line-height:1.25;scroll-margin-top:25px}h1{font-size:43px;letter-spacing:-.035em;color:#163f55;margin:0 0 12px}h1+h2{font-size:22px;color:var(--muted);margin:0 0 28px;border:0;padding:0}h2{font-size:27px;margin:52px 0 23px;padding-top:24px;border-top:2px solid #e5efee}h3{font-size:20px;margin:34px 0 15px;color:#176c71}p{margin:0 0 18px}strong{font-weight:700}a{color:#176ba5;text-decoration-thickness:1px;text-underline-offset:3px;overflow-wrap:anywhere}code{font:13px/1.6 ui-monospace,Consolas,monospace;overflow-wrap:anywhere;background:#eff3f5;padding:1px 4px;border-radius:3px}li{margin:0 0 12px;padding-left:4px}table{border-collapse:collapse;width:100%;font:14px/1.5 system-ui,sans-serif;margin:25px 0}th{background:#1b4c5c;color:white;text-align:left}th,td{padding:11px 12px;border:1px solid #d7e0e5;vertical-align:top}tbody tr:nth-child(even){background:#f1f6f7}footer{font:13px/1.6 system-ui,sans-serif;color:var(--muted);padding:20px 0}
@media(max-width:950px){.layout{display:block;padding:18px}nav{position:static;max-height:none;margin:15px 8px 25px;columns:2}nav strong{column-span:all}main{padding:30px 25px}h1{font-size:35px}}@media(max-width:560px){nav{columns:1}main{padding:24px 18px}body{font-size:16px}h1{font-size:29px}table{font-size:11px}th,td{padding:6px}h3{font-size:18px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{header,nav{display:none}.layout{display:block;padding:0}main{box-shadow:none;border:0;padding:0}h2,h3{break-after:avoid}a{color:inherit}}
</style></head><body><header>T1D SERIOUS GAMES KNOWLEDGE BASE / SCIENTIFIC AUDIT / 06 SEPTEMBER 2026</header>
<div class="layout"><nav aria-label="Report contents"><strong>CONTENTS</strong>${nav}</nav><main>${body}<footer>End of report. Scientific content corrections remain proposals; source-verification limits are specified above.</footer></main></div></body></html>`;
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, 'utf8');
console.log(output);
