#!/usr/bin/env node
/** O24 public website read-only release audit. Node >= 20. No dependencies. */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const arg = (flag) => { const n = process.argv.indexOf(flag); return n >= 0 ? process.argv[n + 1] : null; };
const output = arg('--output');
const strict = process.argv.includes('--strict');
const liveBase = arg('--url');
const files = [];
const findings = [];
const record = (severity, id, detail, file = '') => findings.push({ severity, id, detail, ...(file ? { file } : {}) });
const exists = (p) => fs.existsSync(path.join(root, p));
const read = (p) => exists(p) ? fs.readFileSync(path.join(root, p), 'utf8') : '';
const crawl = (directory) => {
  if (!exists(directory)) return;
  for (const item of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const rel = path.posix.join(directory, item.name);
    if (item.isDirectory()) crawl(rel);
    else if (/\.(?:tsx?|jsx?|mjs)$/.test(item.name)) files.push(rel);
  }
};

const publicRoutes = ['/', '/features', '/solutions', '/solutions/bank-fintech', '/solutions/enterprise', '/solutions/developers', '/developers', '/developers/getting-started', '/developers/api-explorer', '/developers/guides', '/security', '/enterprise', '/enterprise/deployment', '/enterprise/security-review', '/pricing', '/about', '/contact', '/demo', '/privacy', '/terms', '/careers', '/roadmap'];
const appPath = (route) => `src/app${route === '/' ? '' : route}/page.tsx`;
const routeExists = (route) => route === '/' ? (exists('src/app/page.tsx') || exists('src/app/page.jsx')) : (exists(appPath(route)) || exists(appPath(route).replace('.tsx','.jsx')));

async function audit() {
  if (!exists('package.json') || !exists('src/app/layout.tsx')) {
    record('ERROR', 'PROJECT_ROOT', 'Run from the o24-landing-page project root');
  }
  crawl('src/app'); crawl('src/components'); crawl('src/data');
  const sitemap = read('src/app/sitemap.ts');
  const robots = read('src/app/robots.ts');
  for (const route of publicRoutes) {
    if (!routeExists(route)) record('ERROR', 'ROUTE_MISSING', `Missing page for ${route}`, appPath(route));
    // Verify literal sitemap entries: no need to rewrite canonical lists.
    if (!sitemap.includes(`"${route}"`) && !sitemap.includes(`'${route}'`)) record('WARN', 'SITEMAP_ROUTE', `Route ${route} not found as a static sitemap entry`, 'src/app/sitemap.ts');
  }
  if (!robots.includes('/dashboard')) record('WARN', 'ROBOTS_DASHBOARD', 'robots does not explicitly disallow /dashboard', 'src/app/robots.ts');
  if (!read('src/app/dashboard/layout.tsx').includes('index: false')) record('WARN', 'DASHBOARD_NOINDEX', 'Dashboard layout does not clearly specify noindex', 'src/app/dashboard/layout.tsx');
  for (const route of ['/features','/solutions','/security','/enterprise/deployment','/enterprise/security-review','/pricing','/about','/contact','/demo','/privacy','/terms','/careers']) {
    const p = appPath(route), data = read(p);
    if (data && !data.includes('metadata')) record('WARN', 'METADATA', `${route} has no visible metadata declaration`, p);
    if (data && !data.includes('canonical')) record('WARN', 'CANONICAL', `${route} has no explicit canonical`, p);
  }
  const source = files.map(p => ({ path:p, content:read(p) }));
  // Static local hrefs. This does not claim the live route is healthy.
  const linkRe = /\bhref\s*=\s*["'`]((?:\/)(?!\/)[^"'`?#]*)(?:[?#][^"'`]*)?["'`]/g;
  for (const f of source) {
    let match;
    while ((match = linkRe.exec(f.content))) {
      const url = match[1].replace(/\/$/, '') || '/';
      if (/^\/(?:api|auth|dashboard)(?:\/|$)/.test(url)) continue;
      if (routeExists(url)) continue;
      // Route groups / dynamic pages are checked through the actual app tree.
      const dynamic = /^\/blog\/[^/]+$/.test(url) || /^\/developers\/guides\/[^/]+$/.test(url);
      if (dynamic) continue;
      record('WARN','LINK_UNRESOLVED',`Static href ${url} has no matching public page`,f.path);
    }
  }
  const enterpriseApi = read('src/app/api/enterprise/route.ts');
  if (!enterpriseApi) record('ERROR','ENTERPRISE_API','Enterprise POST route is missing');
  else {
    if (/console\.(?:log|info|debug)\s*\(\s*["'`]Enterprise inquiry received/.test(enterpriseApi) || /console\.log\(\s*["'`][^"'`]*request[^"'`]*["'`]\s*,\s*\{\s*\.\.\.body/is.test(enterpriseApi)) record('ERROR','PII_LOG','Enterprise route appears to log request data','src/app/api/enterprise/route.ts');
    if (/success:\s*true/.test(enterpriseApi) && !/email|send|resend/i.test(enterpriseApi)) record('WARN','EMAIL_SUCCESS','Review success semantics with Resend','src/app/api/enterprise/route.ts');
    if (/onboarding@resend\.dev|nguyenvuhoangz@gmail\.com/.test(enterpriseApi)) record('ERROR','EMAIL_FALLBACK','Unsafe email fallback still present','src/app/api/enterprise/route.ts');
  }
  const enterpriseForm = read('src/app/enterprise/EnterpriseForm.tsx');
  if (/if\s*\(response\.ok\)\s*\{\s*setIsSuccess\(true\)/.test(enterpriseForm)) record('WARN','FORM_SUCCESS','EnterpriseForm still treats any HTTP 2xx as success; verify payload.success','src/app/enterprise/EnterpriseForm.tsx');
  const privacy = read('src/app/privacy/page.tsx');
  if (/TLS\s*1\.3|AES[- ]256|Penetration Testing\).*định kỳ/i.test(privacy)) record('ERROR','PRIVACY_CLAIMS','Unverified technical security guarantees found','src/app/privacy/page.tsx');
  for (const route of ['/privacy','/terms']) {
    if (/15\/10\/2023/.test(read(appPath(route)))) record('WARN','STALE_LEGAL_DATE',`Old date appears in ${route}`,appPath(route));
  }
  if (/positions\s*=\s*\[/.test(read('src/app/careers/page.tsx'))) record('WARN','CAREERS_POSITIONS','Review job opening list for confirmed status','src/app/careers/page.tsx');
  for (const f of source) {
    if (/(?:href\s*=\s*["']#(?:["'])|href:\s*["']#(?:["']))/.test(f.content)) record('WARN','PLACEHOLDER_LINK','Placeholder href # found',f.path);
    if (f.path.startsWith('src/app/') && /99\.99% uptime|response time < 1|hỗ trợ 24\/7/i.test(f.content)) record('WARN','MARKETING_CLAIM','Review unsupported availability/support statements',f.path);
  }
  if (liveBase) await auditLive(liveBase);
  const counts = { ERROR:0,WARN:0,INFO:0 };
  for (const f of findings) counts[f.severity]++;
  const report = { generatedAt:new Date().toISOString(), root, checkedRoutes:publicRoutes.length, scannedFiles:files.length, liveBase:liveBase||null, counts, findings, limitations:['Static checks cannot prove WCAG, responsive layout, JavaScript interactions or Lighthouse scores','Live mode checks public HTTP GET pages only; it never sends forms or reads private content','Legal and privacy policies require authorized human review','Successful email API acceptance does not prove inbox delivery'] };
  const human = `Step 31.11 — Final Production Release Audit\nChecked routes: ${report.checkedRoutes}; files scanned: ${report.scannedFiles}\nERROR: ${counts.ERROR}, WARN: ${counts.WARN}\n${findings.length?findings.map(f=>`[${f.severity}] ${f.id}: ${f.detail}${f.file?' ('+f.file+')':''}`).join('\n'):'No issues detected by implemented checks.'}\n\n${report.limitations.join('\n')}\n`;
  if (output) { const out = path.resolve(root,output); fs.mkdirSync(path.dirname(out),{recursive:true}); fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n'); console.log(`Report saved: ${out}`); }
  console.log(human);
  process.exitCode = counts.ERROR ? 2 : strict && counts.WARN ? 1 : 0;
}
async function auditLive(base) {
  let parsed;
  try { parsed = new URL(base); if(!['https:','http:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') throw Error('base URL only'); }
  catch { record('ERROR','INVALID_URL','--url must be a plain http(s) origin, e.g. https://vknight.io.vn/'); return; }
  const livePaths = ['/', '/features', '/solutions', '/security', '/pricing', '/about', '/contact', '/demo', '/privacy', '/terms', '/careers', '/enterprise/deployment', '/enterprise/security-review', '/robots.txt', '/sitemap.xml'];
  for (const p of livePaths) {
    const url = new URL(p,parsed);
    try {
      const controller = new AbortController();
      const timer = setTimeout(()=>controller.abort(),9000);
      let response;
      try { response = await fetch(url,{method:'GET',redirect:'follow',signal:controller.signal,headers:{'user-agent':'O24-Public-Audit/1.0'}}); }
      finally { clearTimeout(timer); }
      if (!response.ok) record('ERROR','LIVE_HTTP',`${p} returned HTTP ${response.status}`);
      else if (p !== '/robots.txt' && p !== '/sitemap.xml') {
        const html = await response.text();
        if (!/<title[ >]/i.test(html)) record('WARN','LIVE_TITLE',`${p} response has no HTML title`);
        if (!/rel=["']canonical["']/i.test(html)) record('WARN','LIVE_CANONICAL',`${p} response lacks canonical link`);
        if (/\bnoindex\b/i.test(html)) record('WARN','LIVE_NOINDEX',`${p} HTML contains noindex directive`);
      }
    } catch (e) { record('ERROR','LIVE_FETCH',`${p}: ${e instanceof Error ? e.message : 'network error'}`); }
  }
}
await audit();
