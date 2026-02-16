import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { faqs } from "@/data/faqs";
import { JsonLd } from "@/components/seo/JsonLd";

export function FAQ() {
    const faqSchemaData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="py-20 lg:py-32 bg-muted/30">
            <JsonLd data={faqSchemaData} />
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Câu hỏi{" "}
                        <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
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
