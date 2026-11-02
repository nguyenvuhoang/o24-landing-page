import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=(p)=>{try{return fs.readFileSync(path.join(root,p),'utf8')}catch{return null}};
const checks=[];
function check(label, condition, detail=''){checks.push({label,status:condition?'PASS':'REVIEW',detail});}
const routes={
 '/':'src/app/page.tsx', '/features':'src/app/features/page.tsx', '/solutions':'src/app/solutions/page.tsx',
 '/solutions/bank-fintech':'src/app/solutions/bank-fintech/page.tsx', '/solutions/enterprise':'src/app/solutions/enterprise/page.tsx',
 '/developers':'src/app/developers/page.tsx', '/developers/getting-started':'src/app/developers/getting-started/page.tsx',
 '/developers/guides':'src/app/developers/guides/page.tsx', '/developers/api-explorer':'src/app/developers/api-explorer/page.tsx',
 '/security':'src/app/security/page.tsx', '/enterprise':'src/app/enterprise/page.tsx',
 '/enterprise/deployment':'src/app/enterprise/deployment/page.tsx', '/enterprise/security-review':'src/app/enterprise/security-review/page.tsx',
 '/pricing':'src/app/pricing/page.tsx','/about':'src/app/about/page.tsx','/contact':'src/app/contact/page.tsx','/demo':'src/app/demo/page.tsx',
};
for(const [url,file] of Object.entries(routes))check(`Route ${url}`,read(file)!==null,file);
const sitemap=read('src/app/sitemap.ts')||'';
for(const url of Object.keys(routes).filter(v=>v!=='/'))check(`Sitemap ${url}`,sitemap.includes(`"${url}"`));
for(const [name,file,canonical] of [['About','src/app/about/page.tsx','/about'],['Pricing','src/app/pricing/page.tsx','/pricing'],['Contact','src/app/contact/page.tsx','/contact'],['Demo','src/app/demo/page.tsx','/demo'],['Security','src/app/security/page.tsx','/security']]){
 const content=read(file)||'';
 check(`Metadata ${name}`,content.includes('metadata')&&content.includes(`canonical: "${canonical}"`));
}
const nav=read('src/data/navigation.ts')||'';
for(const route of ['/features','/solutions','/developers','/pricing','/contact'])check(`Nav ${route}`,nav.includes(`href: "${route}"`));
const footer=read('src/components/layout/Footer.tsx')||'';
check('Footer no placeholder links',!footer.includes('href: "#"'));
check('Contact no misleading inert form',!(read('src/app/contact/page.tsx')||'').includes('<Input'));
check('Contact directs to working form routes',(read('src/app/contact/page.tsx')||'').includes('href: "/demo"')&&(read('src/app/contact/page.tsx')||'').includes('href: "/enterprise"'));
check('DemoForm present',!!read('src/app/demo/DemoForm.tsx'));
check('EnterpriseForm present',!!read('src/app/enterprise/EnterpriseForm.tsx'));
check('Robots route',!!read('src/app/robots.ts'));
check('Social image exists',fs.existsSync(path.join(root,'public/images/og-image.png')));
const results={generatedAt:new Date().toISOString(),counts:{pass:checks.filter(x=>x.status==='PASS').length,review:checks.filter(x=>x.status==='REVIEW').length},checks};
if(process.argv.includes('--json'))console.log(JSON.stringify(results,null,2));
else{for(const c of checks)console.log(`${c.status.padEnd(6)} ${c.label}${c.detail?' — '+c.detail:''}`);console.log(`\n${results.counts.pass} PASS, ${results.counts.review} REVIEW`);console.log('NOTE: Static checks do not prove production availability, WCAG or Lighthouse scores.');}
if(results.counts.review)process.exitCode=1;
