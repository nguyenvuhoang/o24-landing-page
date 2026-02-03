import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogPage() {
    const posts = [
        {
            title: "Tương lai của Open Banking tại Việt Nam",
            excerpt: "Khám phá những thay đổi về quy định và tiến bộ công nghệ đang định hình bối cảnh tài chính như thế nào.",
            date: "15 Tháng 10, 2023",
            category: "Thị trường",
            slug: "#"
        },
        {
            title: "Tích hợp Cổng thanh toán: Hướng dẫn cho Lập trình viên",
            excerpt: "Các phương pháp hay nhất và những cạm bẫy thường gặp khi triển khai giải pháp thanh toán cho nền tảng thương mại điện tử của bạn.",
            date: "28 Tháng 9, 2023",
            category: "Kỹ thuật",
            slug: "#"
        },
        {
            title: "Bảo mật là trên hết: Bảo vệ Dữ liệu Tài chính",
            excerpt: "Cách vKnight đảm bảo các tiêu chuẩn cao nhất về tuân thủ bảo mật cho tất cả các đối tác API của chúng tôi.",
            date: "10 Tháng 9, 2023",
            category: "Bảo mật",
            slug: "#"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Cập nhật mới nhất</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Thông tin chi tiết, tin tức và hướng dẫn kỹ thuật từ đội ngũ vKnight.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary">{post.category}</Badge>
                                </div>
                                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                <div className="flex items-center text-sm text-muted-foreground mt-2">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {post.date}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Link href={post.slug} className="text-primary hover:underline inline-flex items-center text-sm font-medium">
                                    Đọc bài viết <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
