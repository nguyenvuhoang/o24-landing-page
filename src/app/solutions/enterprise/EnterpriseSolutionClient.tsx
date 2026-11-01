import Link from "next/link";
import { EnterpriseForm } from "@/app/enterprise/EnterpriseForm";
import {
    ArrowRight,
    ArrowUpRight,
    Building2,
    Check,
    ChevronRight,
    Cloud,
    Code2,
    Database,
    GitBranch,
    Layers3,
    LockKeyhole,
    Network,
    Server,
    ShieldCheck,
    Workflow,
} from "lucide-react";

const highlights = [
    {
        icon: Network,
        label: "API connectivity",
        title: "Connect existing systems",
        description: "Explore integration patterns across internal services, partner APIs, and existing enterprise platforms.",
    },
    {
        icon: Workflow,
        label: "Orchestration",
        title: "Coordinate complex workflows",
        description: "Bring API interactions and business process requirements into a more manageable architecture.",
    },
    {
        icon: ShieldCheck,
        label: "Governance",
        title: "Plan for controlled access",
        description: "Evaluate identity, access policies, auditability, and operational controls for your environment.",
    },
    {
        icon: Layers3,
        label: "Architecture",
        title: "Modernize incrementally",
        description: "Consider phased integration approaches rather than replacing mission-critical systems all at once.",
    },
] as const;

const useCases = [
    { number: "01", title: "Banking & financial services", detail: "Connect digital channels and existing banking platforms through a structured integration layer." },
    { number: "02", title: "Enterprise API modernization", detail: "Organize integration touchpoints when applications, teams, and platforms evolve." },
    { number: "03", title: "Workflow automation", detail: "Map service interactions and business processes that span multiple applications." },
] as const;

const considerations = [
    { icon: Server, title: "On-premises", detail: "Evaluate hosting within organization-managed infrastructure." },
    { icon: Cloud, title: "Cloud environments", detail: "Discuss infrastructure and operational requirements for cloud deployment." },
    { icon: GitBranch, title: "Hybrid integration", detail: "Plan connectivity between existing and newer environments." },
] as const;

function SectionEyebrow({ children }: { children: React.ReactNode }) {
    return <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{children}</span>;
}

export default function EnterpriseSolutionClient() {
    return (
        <main className="min-h-screen bg-background">
            <section className="relative isolate overflow-hidden border-b border-border/60 bg-gradient-to-b from-orange-50/70 via-background to-background pb-20 pt-20 dark:from-orange-950/10 dark:via-background lg:pb-28 lg:pt-28">
                <div aria-hidden="true" className="pointer-events-none absolute -right-36 -top-48 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-3xl" />
                <div className="container relative mx-auto px-4">
                    <Link href="/#solutions" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                        <ChevronRight className="h-4 w-4 rotate-180" aria-hidden="true" /> Back to solutions
                    </Link>
                    <div className="grid items-center gap-12 lg:grid-cols-[1.07fr_0.93fr] lg:gap-16">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
                                <Building2 className="h-4 w-4" aria-hidden="true" /> Enterprise solutions
                            </div>
                            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                                Modern integration. <span className="bg-gradient-to-r from-amber-500 via-primary to-orange-600 bg-clip-text text-transparent">Enterprise control.</span>
                            </h1>
                            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
                                Explore how O24 can fit into your API modernization and system integration strategy, from architecture assessment to deployment planning.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link href="#contact-sales" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/15 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                                    Talk to our team <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                                <Link href="/demo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                                    Request a demo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </div>
                            <p className="mt-5 text-xs text-muted-foreground">Architecture and deployment options are reviewed against your requirements.</p>
                        </div>
                        <div className="relative rounded-3xl border border-border bg-card p-5 shadow-2xl shadow-primary/5 sm:p-7">
                            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                                <div className="flex items-center gap-2 text-sm font-bold"><Network className="h-5 w-5 text-primary" /> Integration overview</div>
                                <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Conceptual</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:gap-3">
                                {["Web apps", "Mobile", "Partners"].map((item) => <div key={item} className="rounded-xl border border-border bg-muted/40 px-2 py-4 font-medium">{item}</div>)}
                            </div>
                            <div className="mx-auto h-7 w-px bg-primary/50" aria-hidden="true" />
                            <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-center">
                                <LockKeyhole className="mx-auto mb-2 h-6 w-6 text-primary" aria-hidden="true" />
                                <p className="font-bold">API & integration layer</p>
                                <p className="mt-1 text-xs text-muted-foreground">Access · Routing · Orchestration</p>
                            </div>
                            <div className="mx-auto h-7 w-px bg-primary/50" aria-hidden="true" />
                            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:gap-3">
                                {[
                                    { label: "Services", icon: Code2 },
                                    { label: "Data", icon: Database },
                                    { label: "Core systems", icon: Server },
                                ].map(({ label, icon: Icon }) => (
                                    <div key={label} className="rounded-xl border border-border bg-muted/40 p-3 font-medium sm:p-4">
                                        <Icon className="mx-auto mb-2 h-5 w-5 text-primary" aria-hidden="true" />{label}
                                    </div>
                                ))}
                            </div>
                            <p className="mt-5 text-center text-[11px] text-muted-foreground">Illustrative architecture — not a live production dashboard.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-28" aria-labelledby="enterprise-benefits">
                <div className="container mx-auto px-4">
                    <div className="mb-12 max-w-2xl"><SectionEyebrow>Why an integration platform</SectionEyebrow><h2 id="enterprise-benefits" className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Built around real enterprise challenges.</h2><p className="mt-4 text-muted-foreground">Start with the system boundaries, controls, and workflows that matter to your organization.</p></div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {highlights.map(({ icon: Icon, label, title, description }) => (
                            <article key={title} className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{label}</span>
                                <h3 className="mt-2 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-border/60 bg-muted/30 py-20 lg:py-28" aria-labelledby="enterprise-cases">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                        <div><SectionEyebrow>Use cases</SectionEyebrow><h2 id="enterprise-cases" className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Modernize with a clear integration strategy.</h2><p className="mt-5 max-w-md leading-7 text-muted-foreground">Different teams start with different needs. Use an architectural assessment to define scope and implementation priorities.</p><Link href="/solutions/bank-fintech" className="mt-7 inline-flex items-center gap-2 font-semibold text-primary hover:underline">Explore banking solutions <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>
                        <div className="space-y-4">
                            {useCases.map((item) => <article key={item.number} className="flex gap-5 rounded-2xl border border-border bg-card p-5 sm:p-6"><span className="text-xl font-bold text-primary">{item.number}</span><div><h3 className="text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.detail}</p></div></article>)}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-28" aria-labelledby="enterprise-deployment">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-12 max-w-2xl text-center"><SectionEyebrow>Deployment planning</SectionEyebrow><h2 id="enterprise-deployment" className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">An architecture that fits your environment.</h2><p className="mt-4 text-muted-foreground">Explore infrastructure, operational responsibilities, connectivity, and security requirements before selecting a deployment model.</p></div>
                    <div className="grid gap-5 md:grid-cols-3">{considerations.map(({ icon: Icon, title, detail }) => <article key={title} className="rounded-2xl border border-border bg-card p-7"><Icon className="mb-5 h-7 w-7 text-primary" aria-hidden="true" /><h3 className="text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{detail}</p></article>)}</div>
                    <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">{["Architecture review", "Security requirements", "Integration scope", "Operational ownership"].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-primary" aria-hidden="true" />{item}</span>)}</div>
                </div>
            </section>

            <section id="contact-sales" className="scroll-mt-24 border-t border-border bg-muted/30 py-20 lg:py-28" aria-labelledby="enterprise-contact-heading">
                <div className="container mx-auto px-4">
                    <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-primary/5 lg:grid-cols-[0.8fr_1.2fr]">
                        <div className="gradient-primary p-8 text-white sm:p-10 lg:p-12">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/80">Let's connect</span>
                            <h2 id="enterprise-contact-heading" className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">Tell us about your integration challenge.</h2>
                            <p className="mt-5 leading-7 text-white/85">Share your goals and requirements. Our team can discuss the appropriate next steps for your project.</p>
                            <div className="mt-10 space-y-5 text-sm">{["Current architecture or systems", "Business and technical priorities", "Security and deployment requirements"].map((item) => <div key={item} className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><span>{item}</span></div>)}</div>
                            <p className="mt-12 border-t border-white/25 pt-6 text-xs leading-6 text-white/75">Information submitted through this form is handled according to our <Link href="/privacy" className="font-semibold text-white underline underline-offset-4">Privacy Policy</Link>.</p>
                        </div>
                        <div className="min-w-0 p-6 sm:p-10 lg:p-12"><EnterpriseForm /></div>
                    </div>
                </div>
            </section>
        </main>
    );
}
