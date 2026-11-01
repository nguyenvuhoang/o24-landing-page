import Link from "next/link";
import { ArrowRight, Check, Layers3, Sparkles } from "lucide-react";
import { features } from "@/data/features";

export function Features() {
    return (
        <section
            id="features"
            aria-labelledby="features-heading"
            className="relative isolate overflow-hidden border-t border-border/60 bg-background py-20 sm:py-24 lg:py-28"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.07),transparent_55%)]"
            />
            <div className="container relative mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        Platform capabilities
                    </div>
                    <h2
                        id="features-heading"
                        className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        Everything you need to{" "}
                        <span className="bg-gradient-to-r from-amber-500 via-primary to-orange-600 bg-clip-text text-transparent">
                            connect and build.
                        </span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                        From API infrastructure to banking integration, O24 brings core
                        capabilities together for the teams building and operating modern services.
                    </p>
                </div>

                <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <article
                                key={feature.title}
                                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 sm:p-7"
                            >
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl transition-colors group-hover:bg-primary/10"
                                />
                                <div className="relative flex items-start justify-between gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <span className="font-mono text-xs font-semibold text-muted-foreground/60">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                <div className="relative mt-6 flex flex-1 flex-col">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                                        {feature.category}
                                    </span>
                                    <h3 className="mt-2 text-xl font-bold tracking-tight text-card-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground sm:text-[15px]">
                                        {feature.description}
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {feature.highlights.map((highlight) => (
                                            <span
                                                key={highlight}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground"
                                            >
                                                <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 border-t border-border/70 pt-4 text-xs font-medium text-muted-foreground">
                                        <Layers3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                                        {feature.audience}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-6">
                    <Link
                        href="/features"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        Explore all features
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link
                        href="/solutions/developers"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        For developers
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
