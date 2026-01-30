import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { O24_KNOWLEDGE } from "@/lib/knowledge";

export async function GET(req: NextRequest) {
    try {
        const embeddings = new OpenAIEmbeddings();

        const supabase = await createClient();

        for (const item of O24_KNOWLEDGE) {
            const content = `${item.title}: ${item.content}`;
            const embedding = await embeddings.embedQuery(content);

            const { error } = await supabase
                .from("documents")
                .insert({
                    content: content,
                    metadata: { title: item.title },
                    embedding: embedding
                });

            if (error) {
                console.error(`Error inserting ${item.title}:`, error);
                throw error;
            }

            console.log(`Inserted: ${item.title}`);
        }

        return NextResponse.json({ message: "Ingestion successful" });
    } catch (error: any) {
        console.error("Ingestion Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
