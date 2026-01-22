import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/langgraph";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
        }

        // Convert raw message objects to LangChain message classes
        const langChainMessages: BaseMessage[] = messages.map((m: any) => {
            if (m.role === "user") return new HumanMessage(m.content);
            if (m.role === "assistant") return new AIMessage(m.content);
            return new HumanMessage(m.content); // Default
        });

        const response = await chat(langChainMessages);

        return NextResponse.json({
            role: "assistant",
            content: (response as AIMessage).content,
        });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
