"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
export function CodeExample({ title, language, source }: { title:string; language:string; source:string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(source); setCopied(true); }
    catch { setCopied(false); }
  }
  return <div className="my-6 min-w-0 overflow-hidden rounded-2xl border border-slate-700 bg-[#0b1426] text-slate-100 shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#121f35] px-4 py-3">
      <div className="min-w-0"><p className="truncate font-mono text-xs font-semibold">{title}</p><p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">{language} · illustrative example</p></div>
      <button type="button" onClick={copy} aria-label={`Copy ${title}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">{copied?<Check size={14}/>:<Copy size={14}/>} {copied?"Copied":"Copy"}</button>
    </div>
    <pre className="max-h-[420px] overflow-auto p-4 text-[12px] leading-6 sm:p-5"><code>{source}</code></pre>
  </div>;
}
