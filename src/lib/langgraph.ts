import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { SystemMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { supabase } from "./supabase";

// Embeddings instance
const embeddings = new OpenAIEmbeddings();

async function logMissingKnowledge(question: string, metadata: any) {
    try {
        await supabase.from("missing_knowledge").insert({
            question,
            metadata
        });
        console.log("Logged missing knowledge:", question);
    } catch (error) {
        console.error("Error logging missing knowledge:", error);
    }
}

async function retrieveContext(query: string, topK: number = 3) {
    try {
        const queryVector = await embeddings.embedQuery(query);

        // Use the match_documents RPC we created in Supabase
        const { data, error } = await supabase.rpc("match_documents", {
            query_embedding: queryVector,
            match_threshold: 0.5,
            match_count: topK,
        });

        if (error) throw error;

        // If no match found or similarity is low, log it
        if (!data || data.length === 0) {
            await logMissingKnowledge(query, { type: "no_match" });
            return { context: "", hasMatch: false };
        }

        const context = data
            .map((d: any) => d.content)
            .join("\n\n");

        return { context, hasMatch: true };
    } catch (error) {
        console.error("Retrieval Error:", error);
        return { context: "", hasMatch: false };
    }
}

// Define the state for the graph
const GraphState = MessagesAnnotation;

// Define the model
const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7, // Increased for a bit more natural general conversation
});

// Define the function that calls the model
const callModel = async (state: typeof GraphState.State) => {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1];

    // RAG: Retrieve context from Supabase
    const { context, hasMatch } = await retrieveContext(lastMessage.content as string);

    // Dynamic System Message
    let systemInstruction =
        "You are a helpful and professional AI Assistant for the O24 Platform (vKnight). " +
        "O24 is a powerful OpenAPI & Open Banking integration platform. " +
        "Your primary goal is to help users understand O24's features, architecture, and security. ";

    if (hasMatch) {
        systemInstruction +=
            "\n\nUse the following retrieved context to answer the user's question accurately. " +
            "If the context provides a specific answer, prioritize it.\n" +
            "CONTEXT:\n" + context;
    } else {
        systemInstruction +=
            "\n\nThe user's question might be outside your specific O24 knowledge base or about general topics. " +
            "If the question is about O24 but you don't have specific details, acknowledge that and suggest contacting vKnight support. " +
            "If the question is general (e.g., greetings, programming, general fintech), be helpful using your general knowledge, but try to relate it back to O24 or vKnight if possible.";
    }

    const response = await model.invoke([
        new SystemMessage(systemInstruction),
        ...messages
    ]);

    return { messages: [response] };
};

// Create the graph
const workflow = new StateGraph(GraphState)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addEdge("agent", "__end__");

// Compile the graph
export const app = workflow.compile();

/**
 * Process a message through the LangGraph agent
 */
export async function chat(messages: BaseMessage[]) {
    const initialState = { messages };
    const result = await app.invoke(initialState);
    return result.messages[result.messages.length - 1];
}
