"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatBox() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi there! How can I help you today?" },
    ]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    if (!mounted) return null;

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl sm:w-[400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                        <div className="flex items-center gap-2">
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                <Bot size={18} className="animate-pulse" />
                                <Sparkles size={10} className="absolute -top-1 -right-1 text-yellow-400 animate-bounce" />
                            </div>
                            <span className="font-semibold">O24 Assistant</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1 hover:bg-white/20 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                    >
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex",
                                    m.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-2xl p-3 text-sm",
                                        m.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-white/10 text-white border border-white/10"
                                    )}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-3 text-sm text-white border border-white/10">
                                    <Loader2 size={16} className="animate-spin" />
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 rounded-full bg-white/5 border border-white/10 p-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isLoading}
                                size="icon"
                                className="rounded-full bg-blue-600 hover:bg-blue-700"
                            >
                                <Send size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "relative h-14 w-14 rounded-full bg-blue-600 text-white shadow-xl transition-all hover:scale-105 active:scale-95 overflow-visible",
                    isOpen && "rotate-90"
                )}
            >
                {isOpen ? (
                    <X size={24} />
                ) : (
                    <>
                        <div className="absolute inset-0 rounded-full bg-blue-500/50 animate-ping" />
                        <Bot size={28} className="relative z-10" />
                        <Sparkles size={14} className="absolute top-2 right-2 text-yellow-300 animate-pulse z-20" />
                    </>
                )}
            </Button>
        </div>
    );
}
