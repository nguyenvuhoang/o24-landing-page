"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitHub } from "@/components/ui/Icons";
import { Chrome } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Provider } from "@supabase/supabase-js";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => setIsLoading(false), 2000);
    };

    const handleOAuthLogin = async (provider: Provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error logging in with OAuth:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none bg-background/80 backdrop-blur-xl">
                <div className="relative p-6 space-y-6">
                    {/* Header */}
                    <DialogHeader className="space-y-2 text-center">
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            Chào mừng trở lại!
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Đăng nhập để truy cập vào bảng điều khiển O24 của bạn.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="w-full gap-2 border-border/50 hover:bg-accent/50"
                            onClick={() => handleOAuthLogin("github")}
                        >
                            <GitHub className="h-4 w-4" />
                            GitHub
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full gap-2 border-border/50 hover:bg-accent/50"
                            onClick={() => handleOAuthLogin("google")}
                        >
                            <Chrome className="h-4 w-4" />
                            Google
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background/0 px-2 text-muted-foreground backdrop-blur-none">
                                Hoặc tiếp tục với email
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="bg-background/50 border-border/50 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Button variant="link" className="px-0 h-auto text-xs text-primary/80 hover:text-primary">
                                    Quên mật khẩu?
                                </Button>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                className="bg-background/50 border-border/50 focus:ring-primary"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full font-semibold"
                            variant="gradient"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground">
                        Chưa có tài khoản?{" "}
                        <Link
                            href="/demo"
                            className="text-primary hover:underline font-medium"
                            onClick={onClose}
                        >
                            Đăng ký Demo ngay
                        </Link>
                    </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -z-10 h-32 w-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 -z-10 h-32 w-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
            </DialogContent>
        </Dialog>
    );
}
