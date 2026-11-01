import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Về chúng tôi - vKnight",
    description: "Câu chuyện của vKnight - Đơn vị tiên phong trong lĩnh vực OpenAPI & Open Banking Integration tại Việt Nam.",
    openGraph: {
        title: "Về chúng tôi - vKnight",
        description: "Câu chuyện của vKnight - Đơn vị tiên phong trong lĩnh vực OpenAPI & Open Banking Integration tại Việt Nam.",
        url: "/about",
        images: [
            {
                url: "/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "Về chúng tôi - vKnight",
            },
        ],
    },
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Câu chuyện của chúng tôi.</h1>
                <p className="text-xl text-muted-foreground">
                    vKnight là đơn vị tiên phong trong lĩnh vực Tích hợp OpenAPI & Open Banking tại Việt Nam. Chúng tôi tận tâm lấp đầy khoảng cách giữa các tổ chức tài chính và công nghệ hiện đại.
                </p>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p>
                        Được thành lập với tầm nhìn tinh gọn hóa kết nối tài chính, vKnight trao quyền cho các doanh nghiệp tích hợp dịch vụ ngân hàng vào ứng dụng của họ một cách liền mạch. Sứ mệnh của chúng tôi là dân chủ hóa quyền truy cập dữ liệu và dịch vụ tài chính thông qua các API an toàn, đáng tin cậy và thân thiện với lập trình viên.
                    </p>
                    <p>
                        Chúng tôi tin rằng tương lai của tài chính là sự cởi mở. Bằng cách cung cấp cơ sở hạ tầng và công cụ mạnh mẽ, chúng tôi cho phép các nhà đổi mới xây dựng thế hệ giải pháp fintech tiếp theo.
                    </p>
                    <h2 className="text-2xl font-semibold mt-8 mb-4">Giá trị của chúng tôi</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Đổi mới:</strong> Chúng tôi không ngừng mở rộng giới hạn của những gì có thể trong fintech.</li>
                        <li><strong>Bảo mật:</strong> Chúng tôi ưu tiên sự an toàn và quyền riêng tư của dữ liệu trên hết.</li>
                        <li><strong>Tin cậy:</strong> Chúng tôi xây dựng các hệ thống mà bạn có thể tin tưởng để vận hành doanh nghiệp của mình.</li>
                        <li><strong>Tập trung vào khách hàng:</strong> Sự thành công của bạn là sự thành công của chúng tôi. Chúng tôi ở đây để hỗ trợ bạn trên từng bước đường.</li>
                    </ul>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <Link href="/contact">
                        <Button size="lg" className="w-full sm:w-auto">
                            Liên hệ ngay <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/careers">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            Gia nhập đội ngũ
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
