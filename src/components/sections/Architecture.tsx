export function Architecture() {
    return (
        <section className="py-20 lg:py-32">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Kiến trúc{" "}
                        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            hiện đại & linh hoạt
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        O24 được thiết kế với kiến trúc microservices, dễ dàng scale và tích
                        hợp với hệ thống hiện có.
                    </p>
                </div>

                {/* Architecture diagram */}
                <div className="mx-auto max-w-5xl">
                    <div className="relative rounded-2xl border bg-muted/30 p-8">
                        {/* Top layer - Clients */}
                        <div className="mb-8">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                                Clients
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {["Web App", "Mobile App", "Partner API", "Admin Portal"].map(
                                    (client) => (
                                        <div
                                            key={client}
                                            className="rounded-xl border bg-background p-4 text-center text-sm font-medium"
                                        >
                                            {client}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Arrow down */}
                        <div className="flex justify-center mb-8">
                            <div className="h-8 w-px bg-border" />
                        </div>

                        {/* API Gateway layer */}
                        <div className="mb-8">
                            <div className="rounded-xl gradient-primary p-4 text-center text-white">
                                <p className="font-semibold">O24 API Gateway</p>
                                <p className="text-sm opacity-80">
                                    Authentication • Rate Limiting • Routing • Caching
                                </p>
                            </div>
                        </div>

                        {/* Arrow down */}
                        <div className="flex justify-center mb-8">
                            <div className="h-8 w-px bg-border" />
                        </div>

                        {/* Services layer */}
                        <div className="mb-8">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                                Core Services
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    "Account Service",
                                    "Transaction Service",
                                    "Payment Service",
                                    "Notification Service",
                                    "Reporting Service",
                                    "Workflow Engine",
                                ].map((service) => (
                                    <div
                                        key={service}
                                        className="rounded-xl border bg-primary/5 border-primary/20 p-4 text-center text-sm font-medium"
                                    >
                                        {service}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Arrow down */}
                        <div className="flex justify-center mb-8">
                            <div className="h-8 w-px bg-border" />
                        </div>

                        {/* Integration layer */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                                Integrations
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {["Core Banking", "Database", "Message Queue", "Observability"].map(
                                    (item) => (
                                        <div
                                            key={item}
                                            className="rounded-xl border bg-muted p-4 text-center text-sm font-medium text-muted-foreground"
                                        >
                                            {item}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
