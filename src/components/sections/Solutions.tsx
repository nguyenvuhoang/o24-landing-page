import Link from "next/link";
import { ArrowRight, Check, Code2, Building2 } from "lucide-react";
import { solutions } from "@/data/solutions";

export function Solutions() {
  return (
    <section
      id="solutions"
      aria-labelledby="solutions-heading"
      className="relative overflow-hidden border-y border-border/60 bg-muted/30 py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
      />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Solutions built around your goals
          </div>
          <h2
            id="solutions-heading"
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Built for teams that <span className="bg-gradient-to-r from-amber-500 via-primary to-orange-600 bg-clip-text text-transparent">build and scale.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Whether you are modernizing financial services, connecting enterprise systems,
            or developing APIs, find an O24 path suited to your team.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <article
                key={solution.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/5 sm:p-7"
              >
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-primary to-orange-600 opacity-70 transition-opacity group-hover:opacity-100" />
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-border bg-muted/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {solution.audience}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">
                  {solution.title}
                </h3>
                <p className="mt-3 min-h-[5.25rem] text-sm leading-7 text-muted-foreground">
                  {solution.description}
                </p>

                <div className="my-6 h-px bg-border" />
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Explore capabilities
                </p>
                <ul className="mb-8 space-y-3">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-card-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={solution.href}
                  className="mt-auto inline-flex min-h-11 items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {solution.cta}
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
          <Link href="/enterprise" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
            Need an enterprise consultation?
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
          <Link href="/solutions/developers" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Code2 className="h-4 w-4 text-primary" aria-hidden="true" />
            Explore developer resources
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
