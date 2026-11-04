import { readFileSync, existsSync } from 'node:fs';
const required = [
  'src/app/projects/ips/page.tsx',
  'src/components/projects/ips/IPSReadinessDashboard.tsx',
  'src/data/projects/ips-status.ts',
];
let failed = false;
for (const file of required) {
  if (!existsSync(file)) { console.error(`ERROR missing: ${file}`); failed = true; }
  else console.log(`PASS: ${file}`);
}
if (!failed) {
  const status = readFileSync(required[2], 'utf8');
  const page = readFileSync(required[0], 'utf8');
  const ui = readFileSync(required[1], 'utf8');
  const checks = [
    ['target date', status.includes('2026-11-30T00:00:00+07:00')],
    ['UAT phase', status.includes('UAT Testing')],
    ['three workstreams', ['id: "production"', 'id: "migration"', 'id: "uat"'].every(x => status.includes(x))],
    ['both test teams', status.includes('team-a') && status.includes('team-b')],
    ['public route /projects/ips', page.includes('"/projects/ips"')],
    ['go / no-go gate', ui.includes('Go / No-Go')],
    ['no authentication dependency', !page.includes('requireAdmin') && !ui.includes('requireAdmin')],
  ];
  for (const [name, pass] of checks) { console.log(`${pass ? 'PASS' : 'ERROR'}: ${name}`); if (!pass) failed = true; }
}
console.log(failed ? 'IPS report audit failed' : 'IPS report static audit passed');
if (failed) process.exitCode = 1;
