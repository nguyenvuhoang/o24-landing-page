// Read-only internal link inventory; use with --json to export references.
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const dirs=['src/app','src/components/sections','src/components/layout'];
const out=[];
function scan(p){if(!fs.existsSync(p))return;for(const ent of fs.readdirSync(p,{withFileTypes:true})){const full=path.join(p,ent.name);if(ent.isDirectory())scan(full);else if(/\.tsx?$/.test(ent.name)){const s=fs.readFileSync(full,'utf8');for(const m of s.matchAll(/\bhref\s*=\s*["'](\/[\w/#-]+)["']/g))out.push({file:path.relative(root,full).replaceAll('\\','/'),href:m[1]});}}}
for(const d of dirs)scan(path.join(root,d));
if(process.argv.includes('--json'))console.log(JSON.stringify(out,null,2));
else{for(const r of out)console.log(`${r.href.padEnd(38)} ${r.file}`);console.log(`Total static internal link references: ${out.length}`);}
