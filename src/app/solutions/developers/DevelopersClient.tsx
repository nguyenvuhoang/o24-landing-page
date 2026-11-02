import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Braces,
    Building2,
    CheckCircle2,
    Code2,
    Database,
    GitBranch,
    Layers3,
    LockKeyhole,
    Network,
    Server,
    Terminal,
    Workflow,
} from "lucide-react";

const topics = [
    {
        icon: Network,
        category: "API INFRASTRUCTURE",
        title: "API management",
        description: "Understand how to organize API entry points, access policies, and integrations within a platform architecture.",
        points: ["Gateway architecture", "Routing concepts", "API lifecycle"],
    },
    {
        icon: Workflow,
        category: "APPLICATION ARCHITECTURE",
        title: "Workflows & CQRS",
        description: "Explore patterns for coordinating business processes and separating commands from queries.",
        points: ["Workflow patterns", "CQRS concepts", "Service boundaries"],
    },
    {
        icon: Database,
        category: "ENTERPRISE SYSTEMS",
        title: "System integration",
        description: "Learn architectural considerations for connecting modern services to established business systems.",
        points: ["Integration boundaries", "Data contracts", "Reliable messaging"],
    },
];

const learningPath = [
    { number: "01", title: "Explore the architecture", description: "Learn how clients, gateways, services, and downstream systems fit together.", href: "/features", action: "View overview" },
    { number: "02", title: "Review platform capabilities", description: "Explore the major O24 feature areas before planning an integration.", href: "/features", action: "Explore features" },
    { number: "03", title: "Discuss your use case", description: "Ask about supported environments, integration approaches, and access to technical resources.", href: "/contact", action: "Contact the team" },
];

const architectureSteps = [
    { icon: Code2, title: "Client apps", detail: "Web · Mobile · Partners" },
    { icon: LockKeyhole, title: "API entry point", detail: "Authentication · Policies" },
    { icon: GitBranch, title: "Business services", detail: "Workflows · Domain services" },
    { icon: Server, title: "External systems", detail: "Core systems · APIs · Data" },
];

export default function DevelopersClient() {
    return (
        <main className="min-h-screen bg-background">
            <section className="relative isolate overflow-hidden border-b border-border/70 bg-gradient-to-br from-amber-50/90 via-background to-orange-50/50 py-20 dark:from-[#12100d] dark:via-background dark:to-[#16100c] lg:py-28">
                <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="container relative mx-auto grid items-center gap-14 px-4 lg:grid-cols-[1.05fr_.95fr]">
                    <div>
                        <Link href="/solutions" className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                            <ArrowLeft className="h-4 w-4" /> Back to solutions
                        </Link>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-primary">
                            <Terminal className="h-4 w-4" /> O24 DEVELOPER HUB
                        </div>
                        <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                            Build with clarity. <span className="bg-gradient-to-r from-amber-500 via-primary to-orange-600 bg-clip-text text-transparent">Integrate with confidence.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                            Explore O24 architecture, integration concepts, and developer-oriented resources to plan your next API or enterprise integration project.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href="/features" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                                Explore capabilities <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background/80 px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                                Ask a technical question <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-muted-foreground">
                            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Architecture-first</span>
                            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Integration-focused</span>
                            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Enterprise-aware</span>
                        </div>
                    </div>
                    <div className="relative rounded-3xl border border-slate-700/80 bg-[#0d1424] p-4 text-slate-100 shadow-2xl shadow-slate-950/20 sm:p-6">
                        <div className="mb-5 flex items-center justify-between border-b border-slate-700/80 pb-4">
                            <div className="flex items-center gap-2 text-sm font-semibold"><Layers3 className="h-4 w-4 text-orange-400" /> Integration overview</div>
                            <span className="rounded-full border border-orange-400/30 bg-orange-400/10 px-2 py-1 text-[10px] font-medium text-orange-300">ILLUSTRATIVE</span>
                        </div>
                        <div className="space-y-3">
                            {architectureSteps.map((step, index) => (
                                <div key={step.title}>
                                    <div className={`flex items-center gap-3 rounded-xl border p-4 ${index === 1 ? "border-orange-400/50 bg-orange-400/10" : "border-slate-700 bg-slate-800/50"}`}>
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-400/10 text-orange-300"><step.icon className="h-5 w-5" /></div>
                                        <div className="min-w-0"><p className="text-sm font-semibold">{step.title}</p><p className="text-xs text-slate-400">{step.detail}</p></div>
                                        <span className="ml-auto text-xs text-slate-500">0{index + 1}</span>
                                    </div>
                                    {index < architectureSteps.length - 1 && <div aria-hidden="true" className="mx-auto h-3 w-px bg-orange-400/40" />}
                                </div>
                            ))}
                        </div>
                        <p className="mt-5 text-xs text-slate-400">Conceptual system flow — not a live environment or production dashboard.</p>
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-24" id="developer-topics">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <span className="text-xs font-bold tracking-[.2em] text-primary">EXPLORE THE PLATFORM</span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Understand the building blocks</h2>
                        <p className="mt-4 text-muted-foreground">Start with the concepts that matter most for integration and distributed applications.</p>
                    </div>
                    <div className="grid gap-5 md:grid-cols-3">
                        {topics.map((topic) => (
                            <article key={topic.title} className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-primary/[0.02]">
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><topic.icon className="h-6 w-6" /></div>
                                <p className="text-[11px] font-bold tracking-widest text-primary">{topic.category}</p>
                                <h3 className="mt-2 text-xl font-bold">{topic.title}</h3>
                                <p className="mt-3 min-h-24 text-sm leading-relaxed text-muted-foreground">{topic.description}</p>
                                <ul className="mt-5 space-y-3 border-t border-border pt-5">
                                    {topic.points.map((point) => <li key={point} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{point}</li>)}
                                </ul>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-border bg-muted/30 py-20 lg:py-24" id="developer-path">
                <div className="container mx-auto px-4">
                    <div className="mb-12 max-w-2xl">
                        <span className="text-xs font-bold tracking-[.2em] text-primary">GET ORIENTED</span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Your path to O24</h2>
                        <p className="mt-4 text-muted-foreground">A practical route from understanding the architecture to discussing a real integration.</p>
                    </div>
                    <div className="grid gap-5 lg:grid-cols-3">
                        {learningPath.map((step) => (
                            <article key={step.number} className="flex h-full flex-col rounded-2xl border border-border bg-background p-6">
                                <span className="text-3xl font-extrabold text-primary/60">{step.number}</span>
                                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                                <Link href={step.href} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{step.action}<ArrowRight className="h-4 w-4" /></Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-24">
                <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2">
                    <div>
                        <span className="text-xs font-bold tracking-[.2em] text-primary">DESIGN FOR REAL SYSTEMS</span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Think beyond a single API.</h2>
                        <p className="mt-5 leading-relaxed text-muted-foreground">Enterprise integrations involve authentication, service contracts, asynchronous processing, and operational visibility. Explore these concerns early in the architecture process.</p>
                        <div className="mt-7 flex flex-wrap gap-2">
                            {["API contracts", "Authentication", "CQRS", "Messaging", "Observability", "Deployment"].map((tag) => <span key={tag} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground">{tag}</span>)}
                        </div>
                        <Link href="/solutions/enterprise" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Explore enterprise solutions <ArrowUpRight className="h-4 w-4" /></Link>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                        <div className="mb-5 flex items-center gap-2 text-sm font-semibold"><Braces className="h-5 w-5 text-primary" /> Integration design checklist</div>
                        <div className="space-y-4">
                            {[
                                { icon: LockKeyhole, title: "Secure the boundary", text: "Define authentication and access requirements." },
                                { icon: GitBranch, title: "Choose reliable workflows", text: "Plan retries, errors, and state transitions." },
                                { icon: Database, title: "Clarify data contracts", text: "Model systems of record and integration payloads." },
                                { icon: BookOpen, title: "Document operations", text: "Specify monitoring and deployment expectations." },
                            ].map((item) => (
                                <div key={item.title} className="flex gap-3 rounded-xl border border-border bg-muted/30 p-4">
                                    <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <div><h3 className="text-sm font-semibold">{item.title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-20 lg:pb-28">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-[#101827] px-7 py-12 text-white sm:px-12 lg:px-16">
                        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
                        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                            <div className="max-w-2xl">
                                <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-orange-300"><Building2 className="h-4 w-4" /> NEXT STEP</div>
                                <h2 className="text-3xl font-bold sm:text-4xl">Have an integration challenge?</h2>
                                <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">Tell us about your architecture, platform requirements, or development goals. We can help you identify an appropriate next step.</p>
                            </div>
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
                                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600">Contact the team <ArrowRight className="h-4 w-4" /></Link>
                                <Link href="/demo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Request a demo <ArrowUpRight className="h-4 w-4" /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
