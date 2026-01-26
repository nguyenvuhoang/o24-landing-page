import {
    CheckCircle2,
    Clock,
    Calendar,
    ListTodo,
    AlertCircle,
    Globe,
    Database,
    Workflow,
    Activity,
    Shield,
    Code2,
    Smartphone,
    BrainCircuit
} from "lucide-react";

export type RoadmapStatus = 'live' | 'in_progress' | 'planned' | 'backlog' | 'deprecated';
export type RoadmapImpact = 'low' | 'med' | 'high';

export interface RoadmapItem {
    id: string;
    title: string;
    group: 'OpenAPI Platform' | 'Integration & Core Banking' | 'Workflow / CQRS / Eventing' | 'Observability & Logging' | 'Security & IAM' | 'Developer Experience' | 'Channels (Web/Mobile)' | 'AI & Knowledge';
    status: RoadmapStatus;
    quarter: string;
    eta?: string;
    description: string;
    details: string;
    tags: string[];
    impact: RoadmapImpact;
    owner: string;
    links?: { docs?: string; demo?: string };
    dependencies?: string[];
    risks?: string[];
    deliverables?: string[];
}

export const roadmapData: RoadmapItem[] = [
    // 2025-Q4 (Live)
    {
        id: "R-001",
        title: "Auth/JWT base implementation",
        group: "Security & IAM",
        status: "live",
        quarter: "2025-Q4",
        eta: "2025-11-15",
        description: "Hệ thống xác thực cơ bản sử dụng JWT và OAuth2.",
        details: "Triển khai cơ chế cấp phát và xác thực token JWT, tích hợp với Identity Provider cơ bản. Hỗ trợ các luồng Client Credentials và Authorization Code.",
        tags: ["Auth", "Security", "JWT"],
        impact: "high",
        owner: "Security Team",
        links: { docs: "/docs/security/auth" },
        deliverables: ["JWT Provider Service", "Middleware validation", "Login UI components"]
    },
    {
        id: "R-002",
        title: "Config-driven mapping engine",
        group: "OpenAPI Platform",
        status: "live",
        quarter: "2025-Q4",
        eta: "2025-12-01",
        description: "Engine ánh xạ dữ liệu động thông qua cấu hình JSON/YAML.",
        details: "Cho phép người dùng định nghĩa quy tắc chuyển đổi dữ liệu giữa các định dạng khác nhau (JSON to SOAP, v.v.) mà không cần viết code lại.",
        tags: ["Core", "Mapping", "Config"],
        impact: "high",
        owner: "Platform Team",
        deliverables: ["Mapping DSL parser", "Runtime transformer", "Validation schema"]
    },
    {
        id: "R-003",
        title: "Admin portal base UI",
        group: "Developer Experience",
        status: "live",
        quarter: "2025-Q4",
        eta: "2025-12-20",
        description: "Giao diện quản trị cơ bản dành cho O24.",
        details: "Cung cấp dashboard tổng quan, quản lý API proxy cơ bản và theo dõi trạng thái hệ thống.",
        tags: ["UI", "Admin", "Dashboard"],
        impact: "med",
        owner: "Frontend Team",
        deliverables: ["Dashboard layout", "API Management lists", "Status widget"]
    },

    // 2026-Q1 (In Progress)
    {
        id: "R-004",
        title: "Transaction monitoring dashboard",
        group: "Observability & Logging",
        status: "in_progress",
        quarter: "2026-Q1",
        eta: "2026-02-15",
        description: "Dashboard theo dõi giao dịch thời gian thực.",
        details: "Hiển thị chi tiết các giao dịch đang diễn ra, trạng thái thành công/thất bại và độ trễ trung bình.",
        tags: ["Monitoring", "Real-time", "Analytics"],
        impact: "high",
        owner: "Ops Team",
        deliverables: ["Real-time stream integration", "Metric aggregation", "Alerting UI"]
    },
    {
        id: "R-005",
        title: "Settings inline edit experience",
        group: "Developer Experience",
        status: "in_progress",
        quarter: "2026-Q1",
        eta: "2026-03-01",
        description: "Trải nghiệm chỉnh sửa cấu hình trực tiếp trên UI.",
        details: "Cho phép admin cập nhật các tham số hệ thống mà không cần reload trang hoặc vào trang cấu hình phức tạp.",
        tags: ["DX", "UI", "Editor"],
        impact: "low",
        owner: "Frontend Team",
        deliverables: ["Inline edit components", "Draft save mechanism", "Audit log integration"]
    },
    {
        id: "R-006",
        title: "Dynamic renderer cTableDynamic",
        group: "Channels (Web/Mobile)",
        status: "in_progress",
        quarter: "2026-Q1",
        eta: "2026-03-20",
        description: "Thành phần hiển thị bảng dữ liệu động từ API.",
        details: "Một component mạnh mẽ có khả năng render bảng dựa trên schema trả về từ backend, hỗ trợ filter, sort và pagination tự động.",
        tags: ["Frontend", "Dynamic", "Component"],
        impact: "med",
        owner: "SDK Team",
        dependencies: ["R-002"],
        deliverables: ["Generic Table component", "Schema interpreter", "Sort/Filter logic"]
    },

    // 2026-Q2 (Planned)
    {
        id: "R-007",
        title: "Region failover (SG/SYD)",
        group: "OpenAPI Platform",
        status: "planned",
        quarter: "2026-Q2",
        description: "Hệ thống tự động chuyển vùng khi có sự cố.",
        details: "Triển khai kiến trúc multi-region tại Singapore và Sydney, tự động chuyển đổi traffic khi một vùng gặp sự cố.",
        tags: ["Infrastructure", "HA", "DR"],
        impact: "high",
        owner: "Cloud Team",
        risks: ["Data latency between regions", "Complex sync logic"],
        deliverables: ["Multi-region setup", "Traffic manager config", "Database replication"]
    },
    {
        id: "R-008",
        title: "Distributed tracing integration",
        group: "Observability & Logging",
        status: "planned",
        quarter: "2026-Q2",
        description: "Tích hợp tracing phân tán qua nhiều microservices.",
        details: "Sử dụng OpenTelemetry để theo dõi vết yêu cầu từ Gateway xuyên suốt qua các service nội bộ.",
        tags: ["Observability", "OpenTelemetry", "Tracing"],
        impact: "high",
        owner: "Ops Team",
        deliverables: ["Trace ID propagation", "Collector setup", "Tracing UI"]
    },
    {
        id: "R-009",
        title: "Policy engine for API access",
        group: "Security & IAM",
        status: "planned",
        quarter: "2026-Q2",
        description: "Engine quản lý chính sách truy cập linh hoạt.",
        details: "Cho phép định nghĩa các chính sách dựa trên ABAC (Attribute-Based Access Control) cho từng endpoint cụ thể.",
        tags: ["Security", "Policy", "ABAC"],
        impact: "high",
        owner: "Security Team",
        deliverables: ["Policy evaluator", "O24-Rego support", "Admin UI for policies"]
    },

    // 2026-Q3 (Planned / Backlog)
    {
        id: "R-010",
        title: "SDK generator for multiple languages",
        group: "Developer Experience",
        status: "planned",
        quarter: "2026-Q3",
        description: "Tự động tạo SDK từ OpenAPI spec.",
        details: "Hỗ trợ generate code TypeScript, Go, Java trực tiếp từ định nghĩa Swagger/OpenAPI.",
        tags: ["DX", "Automation", "SDK"],
        impact: "med",
        owner: "Platform Team",
        deliverables: ["CLI Generator tool", "Template engine", "GitHub action plugin"]
    },
    {
        id: "R-011",
        title: "RAG knowledge pack for Core Banking",
        group: "AI & Knowledge",
        status: "planned",
        quarter: "2026-Q3",
        description: "Tích hợp AI hỗ trợ tra cứu tài liệu nghiệp vụ ngân hàng.",
        details: "Sử dụng kỹ thuật RAG (Retrieval-Augmented Generation) để cung cấp câu trả lời chính xác từ documentation của Core Banking.",
        tags: ["AI", "RAG", "Banking"],
        impact: "high",
        owner: "AI Team",
        deliverables: ["Vector database sync", "AI Agent interface", "Knowledge indexer"]
    },
    {
        id: "R-012",
        title: "Distributed Event Mesh",
        group: "Workflow / CQRS / Eventing",
        status: "planned",
        quarter: "2026-Q3",
        description: "Hệ thống truyền tin sự kiện phân tán.",
        details: "Thay thế cơ chế giao tiếp synchronous bằng asynchronous thông qua Event Mesh, tối ưu hóa cho kiến trúc Event-Driven.",
        tags: ["Event-driven", "Architecture", "Scaling"],
        impact: "high",
        owner: "Architecture Team",
        deliverables: ["Event Broker setup", "Schema Registry", "Pub/Sub SDK"]
    },

    // 2026-Q4 (Planned / Backlog)
    {
        id: "R-013",
        title: "Fraud signal detection service",
        group: "Security & IAM",
        status: "backlog",
        quarter: "2026-Q4",
        description: "Dịch vụ phát hiện tín hiệu gian lận sớm.",
        details: "Phân tích hành vi người dùng bằng ML để phát hiện các dấu hiệu bất thường trong giao dịch.",
        tags: ["Security", "Fraud", "ML"],
        impact: "high",
        owner: "Security Team",
        risks: ["False positives", "Performance overhead"],
    },
    {
        id: "R-014",
        title: "Face recognition evaluation",
        group: "Channels (Web/Mobile)",
        status: "backlog",
        quarter: "2026-Q4",
        description: "Đánh giá tích hợp nhận diện khuôn mặt cho eKYC.",
        details: "Nghiên cứu và đánh giá các giải pháp Face ID để tích hợp vào luồng onboarding trên mobile.",
        tags: ["eKYC", "Biometric", "Research"],
        impact: "med",
        owner: "Mobile Team"
    },
    {
        id: "R-015",
        title: "Multi-cloud deployment orchestrator",
        group: "OpenAPI Platform",
        status: "backlog",
        quarter: "2026-Q4",
        description: "Công cụ điều phối triển khai đa đám mây.",
        details: "Quản lý deployment đồng bộ trên AWS, Azure và on-premise datacenter.",
        tags: ["Cloud", "Deployment", "K8s"],
        impact: "med",
        owner: "Cloud Team"
    }
];

export const statusConfig = {
    live: { label: 'Live', color: 'bg-green-500', icon: CheckCircle2 },
    in_progress: { label: 'In Progress', color: 'bg-blue-500', icon: Clock },
    planned: { label: 'Planned', color: 'bg-purple-500', icon: Calendar },
    backlog: { label: 'Backlog', color: 'bg-slate-500', icon: ListTodo },
    deprecated: { label: 'Deprecated', color: 'bg-red-500', icon: AlertCircle },
};

export const groupConfig = {
    'OpenAPI Platform': { icon: Globe },
    'Integration & Core Banking': { icon: Database },
    'Workflow / CQRS / Eventing': { icon: Workflow },
    'Observability & Logging': { icon: Activity },
    'Security & IAM': { icon: Shield },
    'Developer Experience': { icon: Code2 },
    'Channels (Web/Mobile)': { icon: Smartphone },
    'AI & Knowledge': { icon: BrainCircuit }
};
