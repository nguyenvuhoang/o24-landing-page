import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "O24 có thể triển khai on-premise không?",
        answer:
            "Có, O24 hỗ trợ cả deployment on-premise và cloud. Bạn có thể chạy trên Kubernetes cluster của riêng mình hoặc sử dụng managed cloud của chúng tôi. Với gói Enterprise, chúng tôi cung cấp hỗ trợ deployment đầy đủ.",
    },
    {
        question: "O24 tích hợp được với những Core Banking nào?",
        answer:
            "O24 có sẵn adapter cho các Core Banking phổ biến như Temenos T24, Finacle, Flexcube, và nhiều hệ thống khác. Chúng tôi cũng cung cấp SDK để bạn tự xây dựng adapter cho các hệ thống đặc thù.",
    },
    {
        question: "Làm sao để đảm bảo bảo mật khi sử dụng O24?",
        answer:
            "O24 tuân thủ các chuẩn bảo mật cao nhất: OAuth2/OIDC, mTLS, encryption at rest và in transit. Chúng tôi tích hợp với Azure KeyVault và HashiCorp Vault để quản lý secrets. O24 cũng hỗ trợ audit logging chi tiết.",
    },
    {
        question: "Thời gian triển khai O24 mất bao lâu?",
        answer:
            "Với sandbox và môi trường development, bạn có thể bắt đầu trong vài phút. Triển khai production thường mất 2-4 tuần tùy thuộc vào độ phức tạp của tích hợp và yêu cầu bảo mật của tổ chức.",
    },
    {
        question: "O24 có hỗ trợ high availability không?",
        answer:
            "Có, O24 được thiết kế cho high availability từ đầu. Chúng tôi hỗ trợ multi-region deployment, automatic failover, và horizontal scaling. SLA của gói Business là 99.9%, Enterprise có thể customize theo yêu cầu.",
    },
    {
        question: "Làm sao để bắt đầu với O24?",
        answer:
            "Bạn có thể đăng ký tài khoản Starter miễn phí để trải nghiệm sandbox. Nếu muốn tư vấn chi tiết hơn, hãy đặt lịch demo với team của chúng tôi. Chúng tôi sẽ phân tích use case và đề xuất giải pháp phù hợp.",
    },
];

export function FAQ() {
    return (
        <section className="py-20 lg:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Câu hỏi{" "}
                        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            thường gặp
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Tìm câu trả lời cho những thắc mắc phổ biến về O24.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
