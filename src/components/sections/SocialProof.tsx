const logos = [
    { name: "TechBank", initials: "TB" },
    { name: "VietFintech", initials: "VF" },
    { name: "DigiPay", initials: "DP" },
    { name: "CloudBank", initials: "CB" },
    { name: "PayLink", initials: "PL" },
    { name: "FinCore", initials: "FC" },
];

export function SocialProof() {
    return (
        <section className="border-y bg-muted/30 py-12">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-medium text-muted-foreground mb-8">
                    Được tin dùng bởi các tổ chức tài chính hàng đầu
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
                    {logos.map((logo) => (
                        <div
                            key={logo.name}
                            className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                                {logo.initials}
                            </div>
                            <span className="font-semibold hidden sm:inline">{logo.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
