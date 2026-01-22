import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { SystemMessage, HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

// Define the state for the graph
// We use MessagesAnnotation which simplifies handling a list of messages
const GraphState = MessagesAnnotation;

// Define the model
const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
});

// Define the function that calls the model
const callModel = async (state: typeof GraphState.State) => {
    const { messages } = state;

    // Add a system message if it's the start of the conversation
    const systemMessage = new SystemMessage(
        "You are a helpful assistant for O24 Platform (vKnight). " +
        "You help users learn about OpenAPI & Open Banking integration. " +
        "Be professional, concise, and helpful."
    );

    const response = await model.invoke([systemMessage, ...messages]);

    // We return the new message to be appended to the state
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
