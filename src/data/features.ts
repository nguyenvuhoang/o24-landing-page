import {
    Workflow,
    Database,
    Shield,
    Activity,
    Smartphone,
    Globe,
} from "lucide-react";

export const features = [
    {
        icon: Globe,
        title: "API Gateway",
        description:
            "Gateway thông minh với rate limiting, caching, và routing linh hoạt. Hỗ trợ REST, SOAP, GraphQL, và gRPC.",
    },
    {
        icon: Database,
        title: "Open Banking Integration",
        description:
            "Kết nối trực tiếp với các Core Banking phổ biến: T24, Finastra, Flexcube, Optimal9. Chuẩn hóa dữ liệu tự động.",
    },
    {
        icon: Workflow,
        title: "Workflow & CQRS",
        description:
            "Engine xử lý workflow mạnh mẽ với pattern CQRS/Event Sourcing. Đảm bảo consistency và audit trail.",
    },
    {
        icon: Activity,
        title: "Observability",
        description:
            "Logs, Metrics, Tracing tích hợp sẵn với OpenTelemetry. Dashboard real-time và cảnh báo thông minh.",
    },
    {
        icon: Shield,
        title: "Security",
        description:
            "OAuth2, JWT, mTLS. Tích hợp O24 KeyVault, Azure KeyVault & HashiCorp Vault. Tuân thủ PCI-DSS và các chuẩn bảo mật.",
    },
    {
        icon: Smartphone,
        title: "Multi-channel",
        description:
            "SDK cho Web, iOS, Android. Hỗ trợ omni-channel với trải nghiệm nhất quán trên mọi nền tảng.",
    },
];
