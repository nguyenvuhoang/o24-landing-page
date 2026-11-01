import Link from "next/link";
import {
    Activity,
    ArrowRight,
    Blocks,
    BookOpen,
    Braces,
    Building2,
    CheckCircle2,
    ChevronRight,
    Code2,
    GitBranch,
    Layers3,
    LockKeyhole,
    Server,
    Workflow,
} from "lucide-react";

const capabilities = [
    { label: "API Management", icon: Braces },
    { label: "Workflow Orchestration", icon: Workflow },
    { label: "Self-hosted Deployment", icon: Server },
    { label: "Integration Architecture", icon: Blocks },
];

const pipeline = [
    { title: "Client applications", detail: "Web · Mobile · Partners", icon: Code2 },
    { title: "API Gateway", detail: "Routing · Access control", icon: GitBranch },
    { title: "Workflow services", detail: "Orchestration · Integration", icon: Workflow },
];

/** Marketing illustration, not a connected or live O24 dashboard. */
function PlatformPreview() {
    return (
        <div className="relative mx-auto w-full max-w-[630px]" aria-label="Illustrative diagram of O24 API and integration architecture">
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0b1426] shadow-[0_30px_90px_-25px_rgba(0,0,0,0.7)]">
                <div className="flex items-center gap-2 border-b border-slate-700/70 bg-[#111d32] px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                    <span className="ml-3 text-xs font-medium tracking-wide text-slate-300">O24 / Platform architecture</span>
                    <span className="ml-auto rounded-md border border-slate-600/70 px-2 py-0.5 text-[10px] text-slate-400">CONCEPT PREVIEW</span>
                </div>
                <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[66px_1fr]">
                    <div className="flex flex-col items-center gap-5 border-r border-slate-700/60 bg-[#0e1a2e] py-6 text-slate-500" aria-hidden="true">
                        <Layers3 className="h-5 w-5 text-primary" />
                        <Braces className="h-4 w-4" />
                        <Workflow className="h-4 w-4" />
                        <Activity className="h-4 w-4" />
                        <LockKeyhole className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Integration overview</p>
                                <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">Connect systems with O24</h3>
                            </div>
                            <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary sm:inline-flex">Architecture</span>
                        </div>
                        <div className="mt-5 space-y-2.5">
                            {pipeline.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.title}>
                                        {index > 0 && <div className="ml-5 h-3 border-l border-dashed border-primary/50" aria-hidden="true" />}
                                        <div className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-[#14233a] px-3 py-3 sm:px-4">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white">{step.title}</p>
                                                <p className="text-[11px] leading-5 text-slate-400">{step.detail}</p>
                                            </div>
                                            <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                            <div className="rounded-lg border border-slate-700/70 bg-[#101d32] p-3">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400">Integration</p>
                                <p className="mt-1 text-xs font-semibold text-slate-100">Core systems</p>
                            </div>
                            <div className="rounded-lg border border-slate-700/70 bg-[#101d32] p-3">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400">Visibility</p>
                                <p className="mt-1 text-xs font-semibold text-slate-100">Observability</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-400">Illustrative architecture — not a live dashboard or measured performance data.</p>
        </div>
    );
}

export function Hero() {
    return (
        <section className="relative isolate overflow-hidden border-b border-border bg-slate-50 text-slate-950 dark:bg-[#070d1b] dark:text-white">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-50 dark:opacity-30" aria-hidden="true" style={{ backgroundImage: "linear-gradient(rgba(100,116,139,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,.09) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "linear-gradient(to bottom, black, transparent 95%)" }} />
            <div className="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
            <div className="container mx-auto max-w-[1320px] px-4 pb-16 pt-16 sm:px-6 lg:pb-24 lg:pt-24">
                <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)] lg:gap-12 xl:gap-20">
                    <div className="max-w-2xl">
                        <Link href="/features" className="group inline-flex max-w-full items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-primary">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>INTRODUCING O24 PLATFORM</span>
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <h1 className="mt-7 text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] sm:text-6xl xl:text-[4.5rem]">
                            Build. Integrate.
                            <span className="block bg-gradient-to-r from-amber-500 via-primary to-orange-600 bg-clip-text text-transparent dark:from-amber-300 dark:via-primary dark:to-orange-400">Scale.</span>
                        </h1>
                        <h2 className="mt-6 max-w-xl text-xl font-semibold leading-snug tracking-tight text-slate-800 sm:text-2xl dark:text-slate-100">
                            One Platform for Modern APIs and Enterprise Integration.
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400">
                            O24 brings API management, workflow orchestration, and integration capabilities together — giving developers the flexibility to build and enterprises the control to operate at scale.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <Link href="/solutions/developers" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                                <Code2 className="h-4 w-4" /> Start Building <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/enterprise" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-100 dark:hover:bg-slate-700">
                                <Building2 className="h-4 w-4" /> Explore Enterprise
                            </Link>
                        </div>
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <Link href="/demo" className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-primary hover:underline dark:hover:text-primary">Request a demo <ArrowRight className="h-3.5 w-3.5" /></Link>
                            <Link href="/features" className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-primary hover:underline dark:hover:text-primary"><BookOpen className="h-3.5 w-3.5" /> Explore capabilities</Link>
                        </div>
                    </div>
                    <PlatformPreview />
                </div>
                <div className="mt-16 border-t border-slate-200 pt-7 dark:border-slate-800 lg:mt-20">
                    <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 lg:text-left">Explore the platform capabilities</p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
                        {capabilities.map((capability) => {
                            const Icon = capability.icon;
                            return <div key={capability.label} className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300"><Icon className="h-4 w-4 shrink-0 text-primary dark:text-primary" /><span>{capability.label}</span></div>;
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
