import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "@/data/features";

export function Features() {
    return (
        <section className="py-20 lg:py-32" id="features">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Tất cả những gì bạn cần
                        <span className="block mt-2 bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                            trong một nền tảng
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        O24 cung cấp đầy đủ công cụ để xây dựng hệ thống Banking & Fintech
                        hiện đại, từ API Gateway đến Security.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            className="group relative overflow-hidden border-muted hover:border-primary/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
