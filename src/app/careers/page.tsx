import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tuyển dụng | Gia nhập đội ngũ vKnight",
    description: "Cơ hội nghề nghiệp hấp dẫn tại vKnight. Cùng chúng tôi xây dựng tương lai của kết nối tài chính tại Việt Nam.",
    openGraph: {
        title: "Tuyển dụng | Gia nhập đội ngũ vKnight",
        description: "Cơ hội nghề nghiệp hấp dẫn tại vKnight. Cùng chúng tôi xây dựng tương lai của kết nối tài chính tại Việt Nam.",
        url: "/careers",
    },
};

export default function CareersPage() {
    const positions = [
        {
            title: "Kỹ sư Backend Senior",
            department: "Kỹ thuật",
            location: "TP. Hồ Chí Minh",
            type: "Toàn thời gian",
        },
        {
            title: "Thiết kế Sản phẩm",
            department: "Thiết kế",
            location: "Từ xa / Hybrid",
            type: "Toàn thời gian",
        },
        {
            title: "Chuyên viên DevOps",
            department: "Cơ sở hạ tầng",
            location: "TP. Hồ Chí Minh",
            type: "Toàn thời gian",
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Gia nhập đội ngũ vKnight</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Chúng tôi đang tìm kiếm những cá nhân đam mê để cùng xây dựng tương lai của kết nối tài chính tại Việt Nam.
                    </p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Vị trí đang tuyển</h2>
                    {positions.map((job, index) => (
                        <Card key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:border-primary transition-colors">
                            <div className="space-y-2 mb-4 sm:mb-0">
                                <CardTitle>{job.title}</CardTitle>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                    <span className="flex items-center"><Badge variant="outline" className="mr-2">{job.department}</Badge></span>
                                    <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {job.location}</span>
                                    <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {job.type}</span>
                                </div>
                            </div>
                            <Button asChild>
                                <Link href="/contact">Ứng tuyển ngay <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </Card>
                    ))}
                </div>

                <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
                    <h3 className="text-xl font-semibold">Không tìm thấy vị trí phù hợp?</h3>
                    <p className="text-muted-foreground">
                        Chúng tôi luôn tìm kiếm nhân tài. Hãy gửi CV cho chúng tôi và cho biết lý do bạn muốn gia nhập.
                    </p>
                    <Button variant="outline" asChild>
                        <Link href="/contact">Liên hệ với chúng tôi</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
