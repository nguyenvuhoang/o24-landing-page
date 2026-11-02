import fs from 'node:fs';
import path from 'node:path';

const file = 'src/app/enterprise/EnterpriseForm.tsx';
if (!fs.existsSync(file)) throw new Error(`Missing ${file}; run from project root`);
const original = fs.readFileSync(file, 'utf8');
const eol = original.includes('\r\n') ? '\r\n' : '\n';
const normalized = original.replace(/\r\n/g, '\n');
const stateRe = /const\s*\[isSuccess\s*,\s*setIsSuccess\]\s*=\s*useState\(false\)\s*;/;
const handlerRe = /(^[ \t]*)const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?^\1\};(?=\s*const updateField\s*=)/m;
const formRe = /<form\s+onSubmit=\{handleSubmit\}[^>]*>/;

if (!stateRe.test(normalized) || !handlerRe.test(normalized) || !formRe.test(normalized)) {
  throw new Error('Cannot safely identify form state / submit handler / JSX; no changes written');
}
const match = normalized.match(handlerRe);
const priorHandler = match[0];
if (!priorHandler.includes('fetch("/api/enterprise"') && !priorHandler.includes("fetch('/api/enterprise'")) {
  throw new Error('Unexpected submit endpoint; no changes written');
}
if (!priorHandler.includes('validateForm()')) {
  throw new Error('Form validation pattern changed; no changes written');
}
const stateExists = /const\s*\[submitError\s*,\s*setSubmitError\]\s*=/.test(normalized);
const alertExists = /\{submitError\s*&&/.test(normalized);
const patchedHandler = priorHandler.includes('result.success === true') && priorHandler.includes('setSubmitError(');
if (stateExists && alertExists && patchedHandler) {
  console.log('UNCHANGED: Step 31.10 form patch already applied');
  process.exit(0);
}
// Only replace a simple, recognizable handler. Stop rather than overwrite local custom logic.
if (!patchedHandler && !/if\s*\(response\.ok\)\s*\{\s*setIsSuccess\(true\);?\s*\}/.test(priorHandler)) {
  throw new Error('Submit handler contains custom success logic; no changes written. Use the manual patch in README.');
}
let next = normalized;
if (!stateExists) next = next.replace(stateRe, m => m + '\n    const [submitError, setSubmitError] = useState("");');
if (!patchedHandler) {
  const replacement = `    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitError("");
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/enterprise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result: { success?: boolean } = await response.json().catch(() => ({}));
            if (response.ok && result.success === true) {
                setIsSuccess(true);
            } else {
                setSubmitError("We could not submit your request. Please try again.");
            }
        } catch {
            setSubmitError("A network error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };`;
  next = next.replace(handlerRe, replacement);
}
if (!alertExists) {
  next = next.replace(formRe, m => m + '\n            {submitError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{submitError}</p>}');
}
if (next === normalized) {
  console.log('UNCHANGED: no patch necessary');
  process.exit(0);
}
if (!(/const\s*\[submitError\s*,\s*setSubmitError\]/.test(next) && /\{submitError\s*&&/.test(next) && next.includes('result.success === true'))) {
  throw new Error('Post-patch validation failed; no files written');
}
const backup = `${file}.step31-10.bak`;
if (!fs.existsSync(backup)) fs.writeFileSync(backup, original);
fs.writeFileSync(file, next.replace(/\n/g,eol));
console.log(`UPDATED ${file} (backup: ${backup})`);
