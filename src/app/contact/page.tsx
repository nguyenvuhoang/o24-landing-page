import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Facebook, Phone, Mail, Send, Building2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Liên hệ | vKnight O24 Support",
    description: "Kết nối với đội ngũ vKnight để được tư vấn và hỗ trợ về giải pháp Open Banking & API Management.",
    openGraph: {
        title: "Liên hệ | vKnight O24 Support",
        description: "Kết nối với đội ngũ vKnight để được tư vấn và hỗ trợ về giải pháp Open Banking & API Management.",
        url: "/contact",
    },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-20 pb-16">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 gradient-hero z-0 pointer-events-none" />
                <div className="container relative z-10 px-4 mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600">
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin hoặc ghé thăm văn phòng của chúng tôi.
                    </p>
                </div>
            </section>

            <div className="container px-4 mx-auto -mt-10 relative z-20">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* Contact Info Column */}
                    <div className="space-y-6">
                        <Card className="glass border-0 shadow-xl overflow-hidden">
                            <CardContent className="p-8 space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-primary">
                                        <Building2 className="w-5 h-5" />
                                        Thông Tin Liên Hệ
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                                <MapPin className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground mb-1">Địa chỉ</p>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    <span className="font-semibold text-foreground">Khu nhà cao cấp C13/19</span>
                                                    <br />
                                                    thuộc Cư xá Phú Lâm B, Quận 6, TP.HCM
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href="https://www.facebook.com/p/Khu-nh%C3%A0-cao-c%E1%BA%A5p-C1319-C%C6%B0-X%C3%A1-Ph%C3%BA-L%C3%A2m-B-100057549295179/"
                                            target="_blank"
                                            className="flex items-start gap-4 group cursor-pointer"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                                <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground mb-1">Fanpage</p>
                                                <p className="text-blue-600 dark:text-blue-400 group-hover:underline">
                                                    Khu nhà cao cấp C13/19 - Cư Xá Phú Lâm B
                                                </p>
                                            </div>
                                        </Link>

                                        <div className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                                <Phone className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground mb-1">Điện thoại</p>
                                                <p className="text-muted-foreground">+84 36 860 9876</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                                <Mail className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground mb-1">Email</p>
                                                <p className="text-muted-foreground">support@vknight.io.vn</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Map Placeholder or Image */}
                                <div className="relative h-48 rounded-xl overflow-hidden bg-muted/50 mt-8 group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                                        <MapPin className="w-12 h-12 mb-2 opacity-20" />
                                    </div>
                                    {/* Here we could embed a real Google Map iframe if the URL was provided, 
                       for now using a stylish placeholder or text suggesting a map */}
                                    <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/50">
                                        <p className="text-xs text-center font-medium">Xem vị trí trên bản đồ</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form Column */}
                    <div>
                        <Card className="h-full border-0 shadow-xl bg-card">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold mb-6">Gửi tin nhắn</h3>
                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Họ và tên</Label>
                                            <Input id="name" placeholder="Nhập họ tên của bạn" className="bg-muted/30" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Số điện thoại</Label>
                                            <Input id="phone" placeholder="Nhập số điện thoại" className="bg-muted/30" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="example@gmail.com" className="bg-muted/30" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Nội dung</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Bạn cần hỗ trợ gì?"
                                            className="min-h-[150px] bg-muted/30 resize-none"
                                        />
                                    </div>

                                    <Button asChild className="w-full h-12 text-lg font-medium gradient-primary hover:opacity-90 transition-opacity">
                                        <Link href="https://zalo.me/1395583898690757064" target="_blank">
                                            <Send className="w-5 h-5 mr-2" />
                                            Gửi tin nhắn qua Zalo
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
