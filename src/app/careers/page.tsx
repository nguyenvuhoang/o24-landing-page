import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, Network, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers & Opportunities | vKnight",
  description: "Explore vKnight engineering and integration focus areas, and ask about verified career opportunities.",
  alternates: { canonical: "/careers" },
  openGraph: { title: "Careers & Opportunities | vKnight", description: "Learn about vKnight and enquire about current opportunities.", url: "/careers", type: "website" },
};

const areas = [
  { icon: Code2, title: "Platform engineering", text: "API design, backend systems and service integration." },
  { icon: Network, title: "Integration architecture", text: "Workflows, messaging patterns and enterprise connectivity." },
  { icon: ShieldCheck, title: "Reliability & operations", text: "Deployment, observability and secure operations practices." },
];

export default function CareersPage() {
  return <main className="min-h-screen bg-background text-foreground">
    <section className="border-b bg-[#0b1527] text-white"><div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">vKnight team</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Build with people who care about integration.</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">Our work covers API management, workflow orchestration and complex integrations for enterprise environments.</p>
    </div></section>
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="rounded-2xl border bg-card p-6 sm:p-8"><div className="flex items-start gap-3"><Users className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" /><div>
        <h2 className="text-2xl font-bold">Current openings</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">No vacancies have been verified for publication on this page. Please contact the team to ask whether there are active opportunities. We do not currently offer a dedicated application form on this website.</p>
      </div></div></div>
      <h2 className="mt-12 text-2xl font-bold">Areas of work</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">{areas.map(area => <section key={area.title} className="rounded-2xl border bg-card p-6">
        <area.icon className="h-7 w-7 text-primary" aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold">{area.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{area.text}</p>
      </section>)}</div>
      <div className="mt-10 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90">Contact the team <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        <Link href="/about" className="inline-flex min-h-11 items-center rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-accent">About vKnight</Link></div>
    </div>
  </main>;
}
