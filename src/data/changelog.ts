export type ChangeType = "feature" | "fix" | "improvement" | "security";

export interface ChangelogItem {
    version: string;
    date: string;
    title: string;
    description: string;
    type: ChangeType;
    changes: string[];
}

export const changelogData: ChangelogItem[] = [
    {
        version: "v1.2.0",
        date: "2024-02-01",
        title: "Ra mắt tính năng Face Scan & Roadmap",
        description: "Bản cập nhật lớn tập trung vào tính năng bảo mật sinh trắc học và công khai lộ trình phát triển.",
        type: "feature",
        changes: [
            "Tích hợp hệ thống nhận diện khuôn mặt (Face Scan) với độ chính xác cao.",
            "Thêm trang Roadmap, cho phép người dùng theo dõi lộ trình phát triển sản phẩm.",
            "Cải thiện hiệu suất tải trang cho Dashboard.",
            "Nâng cấp giao diện Mobile cho trải nghiệm mượt mà hơn."
        ]
    },
    {
        version: "v1.1.5",
        date: "2024-01-15",
        title: "Tối ưu hóa API Gateway",
        description: "Cải thiện khả năng xử lý đồng thời và giảm độ trễ cho các dịch vụ cốt lõi.",
        type: "improvement",
        changes: [
            "Giảm 30% độ trễ trung bình cho các request API.",
            "Tối ưu hóa bộ nhớ cache cho các truy vấn dữ liệu tĩnh.",
            "Sửa lỗi hiển thị sai định dạng ngày tháng trên một số trình duyệt Safari.",
            "Cập nhật tài liệu API chi tiết hơn."
        ]
    },
    {
        version: "v1.1.0",
        date: "2023-12-20",
        title: "Bảo mật & Fix bugs",
        description: "Vá các lỗ hổng bảo mật quan trọng và sửa các lỗi người dùng đã báo cáo.",
        type: "security",
        changes: [
            "Nâng cấp thư viện xác thực lên phiên bản mới nhất để vá lỗ hổng JWT.",
            "Thêm lớp bảo mật 2 lớp (2FA) cho tài khoản quản trị viên.",
            "Sửa lỗi không gửi được email đặt lại mật khẩu.",
            "Sửa lỗi layout bị vỡ khi zoom màn hình 150%."
        ]
    },
    {
        version: "v1.0.0",
        date: "2023-11-01",
        title: "O24 Platform Official Release",
        description: "Phiên bản chính thức đầu tiên của nền tảng O24 - OpenAPI & Open Banking Integration.",
        type: "feature",
        changes: [
            "Ra mắt Core Banking Adapter hỗ trợ đa ngân hàng.",
            "Tích hợp module thanh toán QR Code.",
            "Dashboard quản lý tập trung với biểu đồ trực quan.",
            "Hỗ trợ Webhook cho các sự kiện thời gian thực."
        ]
    }
];
