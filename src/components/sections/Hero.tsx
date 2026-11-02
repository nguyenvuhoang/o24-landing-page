import Link from "next/link";
import {
  ArrowRight, Blocks, BookOpen, Braces, Building2, ChevronRight,
  Code2, Server, Workflow,
} from "lucide-react";
import { O24ProductPreview } from "./O24ProductPreview";

const capabilities = [
  { label: "API Management", icon: Braces },
  { label: "Workflow Orchestration", icon: Workflow },
  { label: "Self-hosted Deployment", icon: Server },
  { label: "Integration Architecture", icon: Blocks },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-slate-50 text-slate-950 dark:bg-[#070d1b] dark:text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50 dark:opacity-30" aria-hidden="true" style={{ backgroundImage: "linear-gradient(rgba(100,116,139,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,.09) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "linear-gradient(to bottom, black, transparent 95%)" }} />
      <div className="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div className="container mx-auto max-w-[1420px] px-4 pb-16 pt-16 sm:px-6 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-10 xl:gap-16">
          <div className="max-w-2xl">
            <Link href="/features" className="group inline-flex max-w-full items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>INTRODUCING O24 PLATFORM</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <h1 className="mt-7 text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] sm:text-6xl xl:text-[4.5rem]">
              Build. Integrate.
              <span className="block bg-gradient-to-r from-amber-500 via-primary to-orange-600 bg-clip-text text-transparent dark:from-amber-300 dark:via-primary dark:to-orange-400">Scale.</span>
            </h1>
            <h2 className="mt-6 max-w-xl text-xl font-semibold leading-snug tracking-tight text-slate-800 sm:text-2xl dark:text-slate-100">One Platform for Modern APIs and Enterprise Integration.</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400">O24 brings API management, workflow orchestration, and integration capabilities together — giving developers the flexibility to build and enterprises the control to operate at scale.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/solutions/developers" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Code2 className="h-4 w-4" /> Start Building <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/enterprise" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-100 dark:hover:bg-slate-700"><Building2 className="h-4 w-4" /> Explore Enterprise</Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <Link href="/demo" className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-primary hover:underline dark:hover:text-primary">Request a demo <ArrowRight className="h-3.5 w-3.5" /></Link>
              <Link href="/features" className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-primary hover:underline dark:hover:text-primary"><BookOpen className="h-3.5 w-3.5" /> Explore capabilities</Link>
            </div>
          </div>
          <O24ProductPreview />
        </div>
        <div className="mt-16 border-t border-slate-200 pt-7 dark:border-slate-800 lg:mt-20">
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 lg:text-left">Explore the platform capabilities</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
            {capabilities.map(({label,icon:Icon})=><div key={label} className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300"><Icon className="h-4 w-4 shrink-0 text-primary"/><span>{label}</span></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
