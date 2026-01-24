import { Building2, Code2, Landmark } from "lucide-react";

export const solutions = [
    {
        icon: Landmark,
        title: "Bank & Fintech",
        description:
            "Giải pháp tích hợp toàn diện cho ngân hàng và fintech. Kết nối Core Banking, xử lý giao dịch real-time, và tuân thủ quy định.",
        features: [
            "Tích hợp Core Banking",
            "Payment Gateway",
            "Compliance & Reporting",
        ],
        cta: "Tìm hiểu thêm",
    },
    {
        icon: Building2,
        title: "Enterprise",
        description:
            "Nền tảng API cho doanh nghiệp lớn. Quản lý microservices, orchestration, và monitoring tập trung.",
        features: ["Service Mesh", "API Management", "Enterprise SSO"],
        cta: "Liên hệ Sales",
    },
    {
        icon: Code2,
        title: "Developers",
        description:
            "SDK và công cụ mạnh mẽ cho developers. Tài liệu chi tiết, sandbox environment, và hỗ trợ kỹ thuật 24/7.",
        features: ["RESTful API", "SDK đa nền tảng", "Sandbox miễn phí"],
        cta: "Đọc Docs",
    },
];
