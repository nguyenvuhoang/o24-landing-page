import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { solutions } from "@/data/solutions";

export function Solutions() {
    return (
        <section className="py-20 lg:py-32 bg-muted/30" id="solutions">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Giải pháp cho{" "}
                        <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                            mọi nhu cầu
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Dù bạn là ngân hàng, fintech startup hay doanh nghiệp, O24 đều có
                        giải pháp phù hợp.
                    </p>
                </div>

                {/* Solutions grid */}
                <div className="grid gap-8 md:grid-cols-3">
                    {solutions.map((solution) => (
                        <Card
                            key={solution.title}
                            className="group relative overflow-hidden"
                        >
                            <CardHeader className="pb-4">
                                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-white">
                                    <solution.icon className="h-7 w-7" />
                                </div>
                                <CardTitle className="text-xl">{solution.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">{solution.description}</p>
                                <ul className="space-y-2">
                                    {solution.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button variant="ghost" className="group/btn p-0 h-auto">
                                    {solution.cta}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
