import Link from "next/link";
import { ArrowRight, Building2, Code2, Sparkles } from "lucide-react";

export function CTA() {
    return (
        <section aria-labelledby="cta-title" className="py-20 lg:py-28">
            <div className="container mx-auto px-4">
                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#101827] px-6 py-12 text-white shadow-2xl shadow-primary/10 sm:px-10 lg:px-16 lg:py-16">
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
                        <div className="absolute -bottom-36 -left-16 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
                        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
                    </div>

                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">
                            <Sparkles className="h-4 w-4" /> Your next step with O24
                        </span>
                        <h2 id="cta-title" className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                            Ready to <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">build what&apos;s next?</span>
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                            Whether you are exploring integration patterns or planning an enterprise rollout, find the right path to get started with O24.
                        </p>
                    </div>

                    <div className="relative z-10 mt-10 grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-7">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-orange-300"><Code2 className="h-5 w-5" /></span>
                            <h3 className="mt-5 text-xl font-bold">For Developers</h3>
                            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">Explore O24 architecture, development patterns and technical resources for your next integration.</p>
                            <Link href="/solutions/developers" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                                Explore Developer Resources <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="flex flex-col rounded-2xl border border-primary/40 bg-primary/[0.09] p-6 backdrop-blur-sm sm:p-7">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-orange-300"><Building2 className="h-5 w-5" /></span>
                            <h3 className="mt-5 text-xl font-bold">For Enterprises</h3>
                            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">Discuss API modernization, banking integrations and deployment requirements with the vKnight team.</p>
                            <Link href="/demo" className="gradient-primary mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                                Book a Demo <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
