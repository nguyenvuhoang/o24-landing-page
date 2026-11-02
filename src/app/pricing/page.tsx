import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { plans } from "@/data/pricing";
import { createPageMetadata } from "@/lib/seo";
export const metadata: Metadata = createPageMetadata({
  title: "O24 Pricing & Plans | Starter, Business & Enterprise",
  description: "Compare O24 evaluation paths for individual developers, growing teams and enterprise integrations. Confirm pricing and service terms with vKnight.",
  path: "/pricing",
  ogTitle: "O24 Pricing & Plans | vKnight",
  ogDescription: "Explore Starter, Business and Enterprise engagement paths.",
});
const questions = [
  { q: "Are prices and entitlements fixed?", a: "No public contractual pricing is displayed here. Licensing, capacity, support and deployment scope are confirmed during consultation." },
  { q: "Can we evaluate an integration before production?", a: "Discuss a proof-of-concept scope and environment requirements with the team. Access and availability are confirmed on a project basis." },
  { q: "Can O24 run on existing infrastructure?", a: "On-premises, private-cloud and hybrid architecture options can be evaluated with your infrastructure and security teams." },
  { q: "Where can developers start?", a: "The public Developer Hub contains getting-started materials, technical guides and simulated API examples." },
] as const;
export default function PricingPage() {
  return <main className="min-h-screen bg-background"><section className="border-b bg-[#0b1527] text-white"><div className="container mx-auto max-w-[1320px] px-4 py-20 text-center sm:px-6 lg:py-24"><p className="text-xs font-bold uppercase tracking-widest text-amber-400">O24 Pricing</p><h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold sm:text-5xl">Choose the right <span className="text-amber-400">starting point.</span></h1><p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">Explore engagement paths for prototypes, growing teams and enterprise integrations. Pricing, usage limits and contractual entitlements are confirmed with our team.</p></div></section>
  <section className="container mx-auto max-w-[1320px] px-4 py-20 sm:px-6"><div className="grid gap-5 lg:grid-cols-3">{plans.map(plan => <article key={plan.name} className={`flex flex-col rounded-2xl border bg-card p-7 ${plan.popular?"border-primary/60 shadow-lg shadow-primary/10":""}`}><p className="text-xs font-bold uppercase tracking-widest text-primary">{plan.eyebrow}</p><h2 className="mt-4 text-2xl font-bold">{plan.name}</h2><p className="mt-2 text-2xl font-bold text-primary">{plan.price}</p><p className="mt-4 min-h-20 text-sm leading-7 text-muted-foreground">{plan.description}</p><ul className="mt-6 flex-1 space-y-4 border-t pt-6">{plan.features.map(f=><li key={f} className="flex items-start gap-3 text-sm"><Check size={17} className="mt-0.5 shrink-0 text-primary"/>{f}</li>)}</ul><Link href={plan.href} className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">{plan.cta}<ArrowRight size={16}/></Link></article>)}</div>
  <div className="mt-8 flex items-start gap-3 rounded-xl border bg-muted/25 p-5 text-sm leading-7 text-muted-foreground"><ShieldCheck size={20} className="mt-1 shrink-0 text-primary"/>This comparison describes evaluation paths, not a binding offer or a commitment to a particular feature, SLA, service tier or price.</div></section>
  <section className="border-y bg-muted/20"><div className="container mx-auto max-w-[1000px] px-4 py-20 sm:px-6"><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-8 space-y-3">{questions.map(item=><details key={item.q} className="group rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-primary">{item.q}</summary><p className="mt-3 text-sm leading-7 text-muted-foreground">{item.a}</p></details>)}</div><div className="mt-10 flex flex-wrap gap-4 text-sm font-semibold text-primary"><Link href="/developers" className="hover:underline">Developer resources →</Link><Link href="/enterprise/deployment" className="hover:underline">Deployment options →</Link><Link href="/demo" className="hover:underline">Request a demo →</Link></div></div></section>
  </main>;
}
