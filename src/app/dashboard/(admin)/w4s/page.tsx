"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReportDashboard from "@/components/w4s/ReportDashboard";

export default function W4SProgressReport() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessKey, setAccessKey] = useState("");
    const [authError, setAuthError] = useState("");
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("w4s_auth_key");
        if (stored === "W4S-2026") {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessKey === "W4S-2026") {
            localStorage.setItem("w4s_auth_key", accessKey);
            setIsAuthenticated(true);
            setAuthError("");
        } else {
            setAuthError("Mã truy cập không hợp lệ. Vui lòng kiểm tra lại.");
        }
    };

    if (isChecking) {
        return <div className="min-h-[50vh] flex items-center justify-center text-slate-400">Checking credentials...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-50 animate-in fade-in duration-500 backdrop-blur-xl">
                <Card className="w-full max-w-sm bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent" />
                    <CardHeader className="text-center relative z-10 space-y-2 pb-4 pt-8">
                        <div className="mx-auto w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 mb-2">
                            <Lock className="w-5 h-5 text-orange-500" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-100 tracking-tight">
                            W4S Application
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-xs px-4">
                            Khu vực báo cáo chỉ dành cho đơn vị W4S. Vui lòng nhập mã truy cập.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 pb-8">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-400 text-xs">MÃ TRUY CẬP (ACCESS KEY)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                    className="bg-slate-950 border-slate-700 text-slate-50 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-11 shadow-inner text-center font-mono tracking-widest"
                                    placeholder="••••••••"
                                    autoFocus
                                />
                            </div>
                            {authError && <p className="text-red-400 text-xs font-medium text-center">{authError}</p>}
                            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 font-bold tracking-wide text-white h-11 shadow-[0_4px_20px_rgba(249,115,22,0.25)] transition-all">
                                TRUY CẬP BÁO CÁO
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <ReportDashboard projectSlug="w4s" />;
}
