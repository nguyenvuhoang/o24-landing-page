import Link from "next/link";
import {
    Activity,
    ArrowDown,
    ArrowUpRight,
    Blocks,
    Database,
    Globe2,
    Landmark,
    LockKeyhole,
    Network,
    ServerCog,
    Smartphone,
    Workflow,
} from "lucide-react";

const clients = [
    { label: "Web apps", icon: Globe2 },
    { label: "Mobile apps", icon: Smartphone },
    { label: "Partner APIs", icon: Network },
    { label: "Admin portals", icon: Blocks },
];

const services = [
    { label: "Account services", icon: Database },
    { label: "Transaction services", icon: ServerCog },
    { label: "Payment services", icon: Landmark },
    { label: "Workflow orchestration", icon: Workflow },
];

const integrations = ["Core banking", "Databases", "Message queues", "External APIs"];

function Connector() {
    return (
        <div aria-hidden="true" className="flex h-12 flex-col items-center justify-center gap-0.5">
            <span className="h-6 w-px bg-gradient-to-b from-primary/20 to-primary/60" />
            <ArrowDown className="h-3.5 w-3.5 text-primary/80" />
        </div>
    );
}

export function Architecture() {
    return (
        <section id="architecture" aria-labelledby="architecture-title" className="relative overflow-hidden border-y bg-muted/20 py-20 lg:py-28">
            <div className="container relative mx-auto px-4">
                <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Platform architecture
                    </span>
                    <h2 id="architecture-title" className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                        Connect your systems. <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">Keep control.</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                        Explore how client applications, API management, service workflows and existing infrastructure can fit together in an O24-based integration architecture.
                    </p>
                </div>

                <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-background shadow-xl shadow-primary/5">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-5 py-4 sm:px-8">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Network className="h-5 w-5" /></span>
                            <div>
                                <p className="text-sm font-bold">O24 Integration Architecture</p>
                                <p className="text-xs text-muted-foreground">Conceptual overview</p>
                            </div>
                        </div>
                        <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">Reference diagram</span>
                    </div>

                    <div className="px-4 py-7 sm:px-8 sm:py-10 lg:px-12">
                        <div>
                            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">01 / Client channels</p>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {clients.map(({ label, icon: Icon }) => (
                                    <div key={label} className="flex items-center gap-3 rounded-xl border bg-card p-3.5 shadow-sm sm:p-4">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                                        <span className="text-sm font-semibold">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Connector />

                        <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-amber-500/10 via-primary/10 to-primary/5 p-5 sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-white"><LockKeyhole className="h-5 w-5" /></span>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">02 / API management layer</p>
                                        <h3 className="mt-1 text-lg font-bold sm:text-xl">O24 API Gateway</h3>
                                    </div>
                                </div>
                                <span className="rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-semibold text-primary">Central entry point</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {["Request routing", "Authentication", "Access policies", "API governance"].map((item) => (
                                    <span key={item} className="rounded-lg border border-primary/15 bg-background/70 px-3 py-1.5 text-xs font-medium">{item}</span>
                                ))}
                            </div>
                        </div>

                        <Connector />

                        <div>
                            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">03 / Services & orchestration</p>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {services.map(({ label, icon: Icon }) => (
                                    <div key={label} className="rounded-xl border border-primary/15 bg-primary/[0.035] p-4">
                                        <Icon className="mb-3 h-5 w-5 text-primary" />
                                        <p className="text-sm font-semibold">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Connector />

                        <div>
                            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">04 / Enterprise integrations</p>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {integrations.map((item) => (
                                    <div key={item} className="rounded-xl border bg-muted/40 px-3 py-4 text-center text-sm font-semibold">{item}</div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-7 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-primary/25 bg-primary/[0.035] p-4 text-sm">
                            <Activity className="h-5 w-5 shrink-0 text-primary" />
                            <span className="font-semibold">Operational visibility</span>
                            <span className="text-muted-foreground">— logging, monitoring and diagnostics across services</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 border-t bg-muted/20 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
                            Illustrative reference architecture. Actual components and integrations depend on the deployment and configured O24 services.
                        </p>
                        <Link href="/solutions/enterprise" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                            Explore enterprise integration <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
