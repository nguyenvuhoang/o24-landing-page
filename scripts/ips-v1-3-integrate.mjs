import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "src/data/projects/ips-status.ts");
const viewPath = path.join(root, "src/components/projects/ips/IPSReadinessDashboard.tsx");
const read = (p) => fs.readFileSync(p, "utf8");
const assert = (condition, message) => { if (!condition) throw new Error(message); };
assert(fs.existsSync(sourcePath) && fs.existsSync(viewPath), "Run from the O24 Next.js project root; required source not found");
let data = read(sourcePath);
let view = read(viewPath);
const originalData = data;
const originalView = view;
const replaceOne = (source, a, b, name) => {
  assert(source.includes(a), `Safe patch stopped: ${name} anchor not found; no files written`);
  assert(source.indexOf(a) === source.lastIndexOf(a), `Safe patch stopped: duplicate ${name} anchor`);
  return source.replace(a, b);
};

if (!view.includes('import { IPSProductionOverview }')) {
  view = replaceOne(view,
    'import { ipsProject, type IPSWorkstream, type WorkStatus } from "@/data/projects/ips-status";',
    'import { ipsProject, type IPSWorkstream, type WorkStatus } from "@/data/projects/ips-status";\nimport { IPSProductionOverview } from "@/components/projects/ips/IPSProductionOverview";',
    "dashboard import");
  view = replaceOne(view,
    '<section className="pt-10" aria-labelledby="workstreams-heading">',
    '<IPSProductionOverview />\n          <section className="pt-10" aria-labelledby="workstreams-heading">',
    "dashboard workstreams section");
}
// Replace escaped \n with real line endings in the source injected above.
view = view.replace('from "@/data/projects/ips-status";\\nimport { IPSProductionOverview }', 'from "@/data/projects/ips-status";\nimport { IPSProductionOverview }');

// These replacements deliberately require the original V1/V1.2 wording; if the
// user's data differs, the script stops rather than rewriting their project history.
if (data.includes('status: "not_complete",\n      owner: "Đang xác nhận",\n      nextAction: "Hoàn tất triển khai và xác nhận checklist Production readiness."')) {
  data = replaceOne(data,
    'status: "not_complete",\n      owner: "Đang xác nhận",\n      nextAction: "Hoàn tất triển khai và xác nhận checklist Production readiness."',
    'status: "complete",\n      owner: "VKNIGHT",\n      nextAction: "Xác nhận smoke test, kết nối API và quy trình vận hành trước khi phê duyệt Production readiness."',
    "production workstream state");
} else {
  assert(data.includes('status: "complete"') && data.includes('id: "production"'), "Production status differs from supplied V1 data; please update manually");
}
if (data.includes('summary: "Cài đặt và kiểm tra môi trường vận hành chính thức."')) {
  data = data.replace('summary: "Cài đặt và kiểm tra môi trường vận hành chính thức."','summary: "Hạ tầng LIVE và các dịch vụ đã được cài đặt; chờ smoke test và xác nhận vận hành."');
}
if (data.includes('updatedAt: "2026-11-04"')) data = data.replace('updatedAt: "2026-11-04"','updatedAt: "2026-11-05"');
if (data.includes('gồm chuẩn bị Production, backup')) data = data.replace('gồm chuẩn bị Production, backup','gồm xác minh Production readiness sau khi đã cài đặt, backup');
if (data.includes('Production và migration chưa sẵn sàng')) data = data.replace('Production và migration chưa sẵn sàng','Production readiness và migration chưa được nghiệm thu');
if (data.includes('detail: "Chưa hoàn tất", state: "upcoming"')) data = data.replace('detail: "Chưa hoàn tất", state: "upcoming"','detail: "Đã cài đặt LIVE; chờ kiểm tra readiness và migration", state: "upcoming"');

if (data === originalData && view === originalView) { console.log("UNCHANGED — IPS V1.3 integration already applied"); process.exit(0); }
// Atomic-ish two-file patch: validate all anchors before any write, then save backups.
for (const [p,content] of [[sourcePath,originalData],[viewPath,originalView]]) fs.writeFileSync(`${p}.ips-v13.bak`,content,"utf8");
if (data !== originalData) fs.writeFileSync(sourcePath,data,"utf8");
if (view !== originalView) fs.writeFileSync(viewPath,view,"utf8");
console.log("UPDATED — IPS V1.3 production snapshot integrated");
console.log("Backups: *.ips-v13.bak (do not commit)");
