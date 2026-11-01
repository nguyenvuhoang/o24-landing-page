import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    ArrowUpRight,
    Building2,
    CheckCircle2,
    Database,
    GitBranch,
    Landmark,
    Layers3,
    LockKeyhole,
    Network,
    Route,
    ShieldCheck,
    Smartphone,
    Workflow,
} from "lucide-react";

const capabilities = [
    {
        icon: Database,
        eyebrow: "CONNECTIVITY",
        title: "Core banking integration",
        description:
            "Design integration layers between existing core systems and modern digital channels, with clear data contracts and service boundaries.",
        points: ["Interface and data mapping", "Service abstraction", "Integration lifecycle planning"],
    },
    {
        icon: Workflow,
        eyebrow: "ORCHESTRATION",
        title: "Transaction workflows",
        description:
            "Coordinate business operations across services, define failure-handling strategies, and design for traceable execution.",
        points: ["Workflow orchestration", "Error and retry strategies", "Operational traceability"],
    },
    {
        icon: ShieldCheck,
        eyebrow: "GOVERNANCE",
        title: "Security by design",
        description:
            "Plan authentication, authorization, auditability, and deployment controls around your institution’s specific requirements.",
        points: ["Access control planning", "Audit and monitoring", "Security architecture review"],
    },
];

const useCases = [
    {
        icon: Smartphone,
        title: "Digital banking channels",
        description: "Connect web and mobile experiences to service APIs without tightly coupling channels to core systems.",
    },
    {
        icon: GitBranch,
        title: "Partner integrations",
        description: "Structure external API access and partner workflows through explicit interfaces and governance.",
    },
    {
        icon: Layers3,
        title: "Legacy modernization",
        description: "Introduce integration boundaries while retaining existing systems and business processes.",
    },
];

function ArchitectureNode({
    icon: Icon,
    title,
    subtitle,
    highlight = false,
}: {
    icon: typeof Database;
    title: string;
    subtitle?: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl border p-4 sm:p-5 ${highlight
                    ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                    : "border-border bg-background"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                    <p className="font-semibold">{title}</p>
                    {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
}

export default function BankFintechClient() {
    return (
        <main className="min-h-screen bg-background">
            <section className="relative overflow-hidden border-b border-border/60 gradient-hero">
                <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
                <div className="container relative mx-auto px-4 py-20 sm:py-24 lg:py-28">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
                        <div>
                            <Link href="/#solutions" className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                                <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
                                All solutions
                            </Link>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
                                <Landmark className="h-4 w-4" aria-hidden="true" />
                                Banking & Fintech Solutions
                            </div>
                            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                Connect banking systems.
                                <span className="mt-2 block bg-gradient-to-r from-amber-500 via-primary to-orange-600 bg-clip-text text-transparent">
                                    Build what comes next.
                                </span>
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                Explore API-led integration approaches for financial institutions and fintech teams—from core banking connectivity to workflow orchestration and secure service access.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild variant="gradient" size="lg" className="min-h-12">
                                    <Link href="/enterprise">Discuss your integration <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="min-h-12">
                                    <Link href="/demo">Request a demo <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative rounded-3xl border border-primary/20 bg-card/85 p-5 shadow-xl shadow-primary/5 sm:p-7" aria-label="Illustrative banking integration flow">
                            <div className="mb-5 flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Integration overview</span>
                                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">Conceptual diagram</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <ArchitectureNode icon={Smartphone} title="Digital channels" subtitle="Web · Mobile" />
                                <ArchitectureNode icon={Network} title="Partner systems" subtitle="External APIs" />
                            </div>
                            <div className="flex justify-center py-3"><div className="h-7 w-px bg-primary/50" /></div>
                            <ArchitectureNode icon={Route} title="API & integration layer" subtitle="Access · Routing · Service contracts" highlight />
                            <div className="flex justify-center py-3"><div className="h-7 w-px bg-primary/50" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <ArchitectureNode icon={Workflow} title="Workflows" subtitle="Service orchestration" />
                                <ArchitectureNode icon={Database} title="Core systems" subtitle="Banking · Data services" />
                            </div>
                            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Illustrative architecture only. Actual integration topology and capabilities depend on project requirements.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-28" id="capabilities">
                <div className="container mx-auto px-4">
                    <div className="mb-12 max-w-3xl">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Integration capabilities</span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A clearer path from legacy to modern services.</h2>
                        <p className="mt-4 text-muted-foreground">Explore the architectural building blocks that help teams plan and implement complex financial integrations.</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {capabilities.map(({ icon: Icon, eyebrow, title, description, points }) => (
                            <article key={title} className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40 sm:p-7">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></div>
                                <span className="text-[11px] font-bold tracking-widest text-primary">{eyebrow}</span>
                                <h3 className="mt-2 text-xl font-bold">{title}</h3>
                                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                                <ul className="mt-6 space-y-3 border-t pt-5">
                                    {points.map((point) => <li key={point} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{point}</li>)}
                                </ul>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y bg-muted/30 py-20 lg:py-28">
                <div className="container mx-auto px-4">
                    <div className="mb-12 max-w-2xl">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Common use cases</span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Designed around real integration challenges.</h2>
                    </div>
                    <div className="grid gap-5 md:grid-cols-3">
                        {useCases.map(({ icon: Icon, title, description }) => (
                            <article key={title} className="rounded-2xl border bg-background p-6">
                                <Icon className="mb-5 h-7 w-7 text-primary" aria-hidden="true" />
                                <h3 className="text-lg font-semibold">{title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-28">
                <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Plan for production</span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Integration is more than connecting endpoints.</h2>
                        <p className="mt-5 leading-relaxed text-muted-foreground">Financial services projects must consider system boundaries, change management, observability, access controls, and operational responsibilities. We can discuss an architecture aligned with your existing infrastructure.</p>
                        <Button asChild variant="outline" className="mt-7"><Link href="/solutions/enterprise">Explore enterprise integration <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            { icon: Building2, title: "Deployment context", desc: "Infrastructure and environment boundaries" },
                            { icon: LockKeyhole, title: "Access & audit", desc: "Security and review requirements" },
                            { icon: Network, title: "Service interfaces", desc: "Contracts and integration ownership" },
                            { icon: ShieldCheck, title: "Operations planning", desc: "Monitoring and support responsibilities" },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="rounded-xl border bg-card p-5"><Icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" /><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{desc}</p></div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="pb-20 lg:pb-28">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white sm:p-12 lg:p-16">
                        <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                        <div className="relative z-10 mx-auto max-w-3xl text-center">
                            <span className="text-xs font-semibold uppercase tracking-widest text-orange-300">Let’s talk architecture</span>
                            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Modernize integration at your own pace.</h2>
                            <p className="mx-auto mt-5 max-w-xl text-slate-300">Share your banking or fintech integration requirements and explore an implementation approach with vKnight.</p>
                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Button asChild variant="gradient" size="lg"><Link href="/enterprise">Contact enterprise team <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
                                <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"><Link href="/demo">Request a demo</Link></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
