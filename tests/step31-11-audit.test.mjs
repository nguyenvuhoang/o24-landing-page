import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const script = new URL('../scripts/step31-11-audit.mjs', import.meta.url).pathname;
test('audit reports missing required routes without modifying the project', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(),'o24-audit-'));
  try {
    fs.writeFileSync(path.join(dir,'package.json'),'{}');
    const p = spawnSync(process.execPath,[script],{cwd:dir,encoding:'utf8'});
    assert.equal(p.status,2);
    assert.match(p.stdout,/ROUTE_MISSING/);
    assert.equal(fs.readdirSync(dir).length,1);
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
