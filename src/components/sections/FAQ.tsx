import Link from "next/link";
import { ArrowUpRight, HelpCircle } from "lucide-react";
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
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
    };

    return (
        <section id="faq" aria-labelledby="faq-title" className="bg-muted/30 py-20 lg:py-28">
            <JsonLd data={faqSchemaData} />
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" /> Common questions
                    </span>
                    <h2 id="faq-title" className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                        Frequently asked <span className="bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">questions.</span>
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                        Practical answers to help you evaluate O24 for development and enterprise integration.
                    </p>
                </div>
                <div className="mx-auto max-w-4xl rounded-3xl border bg-card px-5 py-2 shadow-sm sm:px-8">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={faq.question} value={`faq-${index}`}>
                                <AccordionTrigger className="py-5 text-left text-sm font-semibold hover:text-primary hover:no-underline sm:text-base">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="max-w-3xl pb-5 text-sm leading-7 text-muted-foreground sm:text-base">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Still have a question?{" "}
                    <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline">
                        Contact vKnight <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </p>
            </div>
        </section>
    );
}
