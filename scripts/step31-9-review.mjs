import fs from 'node:fs';
const targets=['src/app/privacy/page.tsx','src/app/terms/page.tsx','src/app/careers/page.tsx'];
const failures=[];
for (const file of targets){
 const s=fs.readFileSync(file,'utf8');
 for(const [label,re] of [['obsolete 2023 date',/15\/10\/2023/],['unsupported cryptography claim',/TLS\s*1\.3|AES[- ]?256/i],['unsupported testing claim',/penetration testing.*(?:regular|periodic)|pentest.*(?:regular|periodic)/i]])if(re.test(s))failures.push(`${file}: ${label}`);
 console.log(`CHECK ${file}: ${s.length} chars`);
}
const enterprise='src/app/api/enterprise/route.ts';
if(fs.existsSync(enterprise)){
 const s=fs.readFileSync(enterprise,'utf8');
 if(/console\.log\([\s\S]*?\.\.\.body/.test(s))console.warn('REVIEW HIGH: enterprise API logs full submitted form, including personal data.');
 if(s.includes('${data.message.replaceAll('))console.warn('REVIEW HIGH: enterprise email HTML interpolates message without HTML escaping.');
 if(s.includes('if (!emailSent)') && s.includes('success: true'))console.warn('REVIEW HIGH: enterprise API may return success even when notification fails.');
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else console.log('PASS: published-page static content safety checks.');
console.log('MANUAL: confirm privacy policy with legal counsel, data retention/providers and recruitment status before publication.');
