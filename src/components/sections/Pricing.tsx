import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans } from "@/data/pricing";

export function Pricing() {
    return (
        <section id="pricing" aria-labelledby="pricing-title" className="relative overflow-hidden py-20 lg:py-28">
            <div className="pointer-events-none absolute -right-40 top-12 h-80 w-80 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
            <div className="container relative mx-auto px-4">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Flexible plans
                    </span>
                    <h2 id="pricing-title" className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                        Find the right <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">starting point.</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                        From developer exploration to enterprise integration, choose a path that fits your goals. Final features, limits, and commercial terms are confirmed during consultation.
                    </p>
                </div>

                <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <article
                            key={plan.name}
                            className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-7 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${plan.popular ? "border-primary/60 shadow-primary/10" : "border-border hover:border-primary/30"
                                }`}
                        >
                            {plan.popular && <div className="absolute inset-x-0 top-0 h-1 gradient-primary" aria-hidden="true" />}
                            <div className="flex min-h-6 items-center justify-between gap-2">
                                <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{plan.eyebrow}</span>
                                {plan.popular && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Popular choice</span>}
                            </div>
                            <h3 className="mt-5 text-2xl font-bold tracking-tight">{plan.name}</h3>
                            <p className="mt-2 min-h-[52px] text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
                            <p className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">{plan.price}</p>
                            <div className="my-7 h-px bg-border" />
                            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">What to explore</p>
                            <ul className="mb-8 space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed">
                                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                        </span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button variant={plan.popular ? "gradient" : "outline"} className="mt-auto w-full" asChild>
                                <Link href={plan.href}>
                                    {plan.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                </Link>
                            </Button>
                        </article>
                    ))}
                </div>
                <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted-foreground">
                    Need help choosing an approach? <Link href="/enterprise" className="font-semibold text-primary underline-offset-4 hover:underline">Discuss your requirements with our team</Link>.
                </p>
            </div>
        </section>
    );
}
