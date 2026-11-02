import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Code2, Mail, ShieldCheck } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";
export const metadata: Metadata = createPageMetadata({
  title: "Contact vKnight | O24 Platform",
  description: "Contact the vKnight team to discuss O24 APIs, enterprise integrations, security review or a technical demonstration.",
  path: "/contact",
  ogTitle: "Contact vKnight",
  ogDescription: "Find the right next step for your O24 integration requirements.",
});
const paths = [
  { title: "Request a technical demo", desc: "Discuss API and integration requirements with a guided walkthrough.", href: "/demo", label: "Request Demo", icon: Code2 },
  { title: "Enterprise consultation", desc: "Describe a project spanning deployment, architecture, compliance or operations.", href: "/enterprise", label: "Enterprise Inquiry", icon: Building2 },
  { title: "Security review", desc: "Explore security questions and prepare an enterprise review checklist.", href: "/enterprise/security-review", label: "Security Review", icon: ShieldCheck },
] as const;
export default function ContactPage() {
  return <main className="min-h-screen bg-background"><section className="border-b bg-[#0b1527] text-white"><div className="container mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:py-24"><p className="text-xs font-bold uppercase tracking-widest text-amber-400">Contact vKnight</p><h1 className="mt-5 max-w-3xl text-4xl font-extrabold sm:text-5xl">Let's discuss your <span className="text-amber-400">integration goals.</span></h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">Choose the best path to connect with our team. For a structured request, use the live Demo or Enterprise form so your inquiry can be reviewed.</p></div></section>
  <section className="container mx-auto max-w-[1320px] px-4 py-20 sm:px-6"><div className="grid gap-5 md:grid-cols-3">{paths.map(p=>{const Icon=p.icon;return <article key={p.href} className="flex flex-col rounded-2xl border bg-card p-7"><Icon size={26} className="text-primary"/><h2 className="mt-5 text-xl font-bold">{p.title}</h2><p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{p.desc}</p><Link href={p.href} className="mt-7 inline-flex min-h-11 items-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">{p.label}<ArrowRight size={16}/></Link></article>;})}</div><div className="mt-10 rounded-2xl border bg-muted/25 p-6"><div className="flex items-center gap-3"><Mail size={22} className="text-primary"/><h2 className="text-lg font-bold">General inquiries</h2></div><p className="mt-3 text-sm leading-7 text-muted-foreground">For general inquiries, contact <a href="mailto:support@vknight.io.vn" className="font-semibold text-primary underline underline-offset-4">support@vknight.io.vn</a>. Please avoid including credentials or sensitive customer data in email.</p></div></section>
  </main>;
}
