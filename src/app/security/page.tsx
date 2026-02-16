import { ShieldCheck, Lock, Server, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "An ninh & Bảo mật | Bảo vệ bởi vKnight O24",
    description: "Khám phá cách vKnight bảo vệ dữ liệu tài chính của bạn với các tiêu chuẩn an ninh hàng đầu: AES-256, TLS 1.3, và RBAC.",
    openGraph: {
        title: "An ninh & Bảo mật | Bảo vệ bởi vKnight O24",
        description: "Khám phá cách vKnight bảo vệ dữ liệu tài chính của bạn với các tiêu chuẩn an ninh hàng đầu: AES-256, TLS 1.3, và RBAC.",
        url: "/security",
    },
};

export default function SecurityPage() {
    const features = [
        {
            icon: Lock,
            title: "Mã hóa Dữ liệu",
            description: "Tất cả dữ liệu nhạy cảm được mã hóa khi lưu trữ và khi truyền tải bằng các giao thức AES-256 và TLS 1.3 theo tiêu chuẩn ngành."
        },
        {
            icon: ShieldCheck,
            title: "Tuân thủ",
            description: "Chúng tôi tuân thủ các quy định nghiêm ngặt về ngân hàng và các tiêu chuẩn tuân thủ để đảm bảo hoạt động của bạn luôn nằm trong khuôn khổ pháp lý."
        },
        {
            icon: Server,
            title: "Bảo mật Cơ sở hạ tầng",
            description: "Hạ tầng của chúng tôi chạy trên các nhà cung cấp đám mây bảo mật với các đánh giá lỗ hổng và kiểm thử xâm nhập thường xuyên."
        },
        {
            icon: Eye,
            title: "Giám sát & Kiểm toán",
            description: "Giám sát nội bộ 24/7 và nhật ký kiểm toán toàn diện mang lại cho bạn khả năng hiển thị và kiểm soát hoàn toàn truy cập dữ liệu của bạn."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">An ninh là Ưu tiên của Chúng tôi</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Chúng tôi xây dựng vKnight với tư duy đặt bảo mật lên hàng đầu để bảo vệ dữ liệu tài chính của bạn và niềm tin của khách hàng.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="prose prose-gray dark:prose-invert max-w-none mx-auto">
                    <h3>Báo cáo Lỗ hổng</h3>
                    <p>
                        Nếu bạn tin rằng mình đã tìm thấy lỗ hổng bảo mật trong dịch vụ của chúng tôi, vui lòng báo cáo ngay cho chúng tôi tại security@vknight.io.vn. Chúng tôi đánh giá cao sự giúp đỡ của bạn trong việc giữ an toàn cho nền tảng của chúng tôi.
                    </p>
                </div>
            </div>
        </div>
    );
}
