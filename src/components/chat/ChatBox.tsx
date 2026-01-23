"use client";

import { O24ChatBot } from "@vknight/o24-uikit";

export default function ChatBox() {
    return (
        <O24ChatBot
            title="O24 Assistant"
            botName="O24 Assistant"
            initialMessage="Xin chào! Tôi có thể giúp gì cho bạn?"
            placeholder="Nhập tin nhắn..."
            suggestionsLabel="Gợi ý cho bạn:"
            suggestedQuestions={[
                "O24 hỗ trợ những Core Banking nào?",
                "Kiến trúc của O24 là gì?",
                "O24 có triển khai on-premise được không?",
                "Bảo mật của hệ thống như thế nào?",
            ]}
            loadingText="Đang suy nghĩ..."
        />
    );
}
