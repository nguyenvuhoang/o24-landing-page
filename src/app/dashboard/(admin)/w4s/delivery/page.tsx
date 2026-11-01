"use client";

import { useState, useEffect } from "react";
import { Lock, Box } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DeliveryDashboard from "@/components/w4s/DeliveryDashboard";

export default function W4SDeliveryPage() {
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

  const handleLogout = () => {
    localStorage.removeItem("w4s_auth_key");
    setIsAuthenticated(false);
    setAccessKey("");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Checking credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.06),transparent_70%)] pointer-events-none" />

        <div className="relative w-full max-w-sm">
          {/* Logo / brand mark */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-[0_8px_32px_rgba(249,115,22,0.4)] mb-4">
              <Box className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-300 tracking-wide">O24 API</span>
          </div>

          <Card className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/8 to-transparent pointer-events-none" />
            <CardHeader className="text-center relative z-10 space-y-2 pb-4 pt-8">
              <div className="mx-auto w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 mb-1">
                <Lock className="w-4.5 h-4.5 text-orange-500" size={18} />
              </div>
              <CardTitle className="text-xl font-bold text-slate-100 tracking-tight">
                Restricted Access
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs px-4">
                Khu vực <span className="text-orange-400 font-semibold">Software &amp; Hardware Delivery</span> chỉ dành cho đội kỹ thuật W4S.
                Vui lòng nhập mã truy cập.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pb-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery-key" className="text-slate-400 text-xs font-semibold tracking-wider uppercase">
                    Access Key
                  </Label>
                  <Input
                    id="delivery-key"
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-slate-50 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-11 shadow-inner text-center font-mono tracking-widest"
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>

                {authError && (
                  <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    <p className="text-red-400 text-xs font-medium">{authError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 font-bold tracking-wide text-white h-11 shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all hover:shadow-[0_4px_28px_rgba(249,115,22,0.45)] hover:-translate-y-px active:translate-y-0"
                >
                  TRUY CẬP BÁO CÁO
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-[11px] text-slate-600 mt-6">
            Software &amp; Hardware Delivery — O24 API Deployment Spec
          </p>
        </div>
      </div>
    );
  }

  return <DeliveryDashboard onLogout={handleLogout} />;
}
