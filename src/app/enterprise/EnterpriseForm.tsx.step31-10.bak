"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, CheckCircle2, Loader2, Send } from "lucide-react";

interface FormData {
    name: string;
    email: string;
    company: string;
    jobTitle: string;
    teamSize: string;
    useCase: string;
    deployment: string;
    message: string;
    timeline: string;
    budget: string;
    sla: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    company?: string;
    jobTitle?: string;
    teamSize?: string;
    useCase?: string;
    deployment?: string;
    message?: string;
}

const jobTitles = [
    { value: "cto", label: "CTO / VP of Engineering" },
    { value: "tech-lead", label: "Tech Lead / Architect" },
    { value: "engineering-manager", label: "Engineering Manager" },
    { value: "product-owner", label: "Product Owner / PM" },
    { value: "devops", label: "DevOps / Platform Engineer" },
    { value: "director", label: "Director / C-Level" },
    { value: "other", label: "Khác" },
];

const teamSizes = [
    { value: "1-10", label: "1 – 10 người" },
    { value: "11-50", label: "11 – 50 người" },
    { value: "51-200", label: "51 – 200 người" },
    { value: "201-500", label: "201 – 500 người" },
    { value: "500+", label: "500+ người" },
];

const useCases = [
    { value: "api-gateway", label: "API Gateway & Management" },
    { value: "open-banking", label: "Open Banking / Fintech" },
    { value: "microservices", label: "Microservices Orchestration" },
    { value: "integration", label: "System Integration / iPaaS" },
    { value: "product-api", label: "API-as-a-Product" },
    { value: "migration", label: "Legacy Migration" },
    { value: "other", label: "Khác" },
];

const deployments = [
    { value: "on-premise", label: "On-premise" },
    { value: "private-cloud", label: "Private Cloud" },
    { value: "hybrid", label: "Hybrid Cloud" },
    { value: "managed-cloud", label: "Managed Cloud (SaaS)" },
    { value: "not-decided", label: "Chưa quyết định" },
];

const timelines = [
    { value: "immediate", label: "Ngay lập tức (< 1 tháng)" },
    { value: "1-3-months", label: "1 – 3 tháng" },
    { value: "3-6-months", label: "3 – 6 tháng" },
    { value: "exploring", label: "Đang tìm hiểu" },
];

const budgets = [
    { value: "under-10m", label: "Dưới 10 triệu/tháng" },
    { value: "10-50m", label: "10 – 50 triệu/tháng" },
    { value: "50-100m", label: "50 – 100 triệu/tháng" },
    { value: "100m+", label: "Trên 100 triệu/tháng" },
    { value: "discuss", label: "Cần trao đổi thêm" },
];

const slaOptions = [
    { value: "99.9", label: "99.9% uptime" },
    { value: "99.95", label: "99.95% uptime" },
    { value: "99.99", label: "99.99% uptime" },
    { value: "custom", label: "Custom SLA" },
    { value: "none", label: "Chưa có yêu cầu cụ thể" },
];

export function EnterpriseForm() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        company: "",
        jobTitle: "",
        teamSize: "",
        useCase: "",
        deployment: "",
        message: "",
        timeline: "",
        budget: "",
        sla: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showOptional, setShowOptional] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }
        if (!formData.company.trim()) newErrors.company = "Vui lòng nhập tên công ty";
        if (!formData.jobTitle) newErrors.jobTitle = "Vui lòng chọn chức danh";
        if (!formData.teamSize) newErrors.teamSize = "Vui lòng chọn quy mô";
        if (!formData.useCase) newErrors.useCase = "Vui lòng chọn use case";
        if (!formData.deployment) newErrors.deployment = "Vui lòng chọn mô hình triển khai";
        if (!formData.message.trim()) newErrors.message = "Vui lòng mô tả yêu cầu";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/enterprise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setIsSuccess(true);
            }
        } catch {
            // Handle error silently
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    if (isSuccess) {
        return (
            <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Yêu cầu đã được ghi nhận!</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Cảm ơn bạn đã quan tâm đến O24 Enterprise. Đội ngũ tư vấn sẽ liên hệ trong vòng 1-2 ngày làm việc.
                </p>
                <div className="text-left max-w-sm mx-auto p-4 rounded-xl bg-background/80">
                    <h3 className="font-medium mb-2">Bước tiếp theo</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Kiểm tra email xác nhận</li>
                        <li>• Đội ngũ sẽ gọi điện hoặc email trao đổi chi tiết</li>
                        <li>• Sắp xếp buổi demo kỹ thuật 1:1</li>
                        <li>• Nhận proposal tùy chỉnh cho doanh nghiệp bạn</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ent-name">Họ và tên *</Label>
                    <Input
                        id="ent-name"
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ent-email">Email công việc *</Label>
                    <Input
                        id="ent-email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
            </div>

            {/* Company */}
            <div className="space-y-2">
                <Label htmlFor="ent-company">Tên công ty / Tổ chức *</Label>
                <Input
                    id="ent-company"
                    placeholder="Tên công ty của bạn"
                    value={formData.company}
                    onChange={(e) => updateField("company", e.target.value)}
                    className={errors.company ? "border-destructive" : ""}
                />
                {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
            </div>

            {/* Job Title & Team Size */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Chức danh *</Label>
                    <Select value={formData.jobTitle} onValueChange={(v) => updateField("jobTitle", v)}>
                        <SelectTrigger className={errors.jobTitle ? "border-destructive" : ""}>
                            <SelectValue placeholder="Chọn chức danh" />
                        </SelectTrigger>
                        <SelectContent>
                            {jobTitles.map((item) => (
                                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Quy mô team *</Label>
                    <Select value={formData.teamSize} onValueChange={(v) => updateField("teamSize", v)}>
                        <SelectTrigger className={errors.teamSize ? "border-destructive" : ""}>
                            <SelectValue placeholder="Chọn quy mô" />
                        </SelectTrigger>
                        <SelectContent>
                            {teamSizes.map((item) => (
                                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.teamSize && <p className="text-xs text-destructive">{errors.teamSize}</p>}
                </div>
            </div>

            {/* Use Case & Deployment */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Use case chính *</Label>
                    <Select value={formData.useCase} onValueChange={(v) => updateField("useCase", v)}>
                        <SelectTrigger className={errors.useCase ? "border-destructive" : ""}>
                            <SelectValue placeholder="Chọn use case" />
                        </SelectTrigger>
                        <SelectContent>
                            {useCases.map((item) => (
                                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.useCase && <p className="text-xs text-destructive">{errors.useCase}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Mô hình triển khai *</Label>
                    <Select value={formData.deployment} onValueChange={(v) => updateField("deployment", v)}>
                        <SelectTrigger className={errors.deployment ? "border-destructive" : ""}>
                            <SelectValue placeholder="Chọn mô hình" />
                        </SelectTrigger>
                        <SelectContent>
                            {deployments.map((item) => (
                                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.deployment && <p className="text-xs text-destructive">{errors.deployment}</p>}
                </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
                <Label htmlFor="ent-message">Mô tả yêu cầu & bài toán cần giải quyết *</Label>
                <Textarea
                    id="ent-message"
                    placeholder="Mô tả ngắn gọn về hệ thống hiện tại, bài toán cần giải quyết, và kỳ vọng với O24..."
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    className={`min-h-[120px] resize-none ${errors.message ? "border-destructive" : ""}`}
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>

            {/* Optional Fields Toggle */}
            <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showOptional ? "Ẩn thông tin bổ sung" : "Thêm thông tin bổ sung (tùy chọn)"}
            </button>

            {showOptional && (
                <div className="grid sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="space-y-2">
                        <Label>Timeline triển khai</Label>
                        <Select value={formData.timeline} onValueChange={(v) => updateField("timeline", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn timeline" />
                            </SelectTrigger>
                            <SelectContent>
                                {timelines.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Ngân sách dự kiến</Label>
                        <Select value={formData.budget} onValueChange={(v) => updateField("budget", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn ngân sách" />
                            </SelectTrigger>
                            <SelectContent>
                                {budgets.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Yêu cầu SLA</Label>
                        <Select value={formData.sla} onValueChange={(v) => updateField("sla", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn SLA" />
                            </SelectTrigger>
                            <SelectContent>
                                {slaOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Privacy note */}
            <p className="text-xs text-muted-foreground">
                Thông tin của bạn chỉ được sử dụng để tư vấn giải pháp phù hợp. Chúng tôi không chia sẻ dữ liệu với bên thứ ba.
            </p>

            {/* Submit */}
            <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto gradient-primary text-white hover:opacity-90 transition-opacity"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang gửi...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4 mr-2" />
                        Gửi yêu cầu tư vấn Enterprise
                    </>
                )}
            </Button>
        </form>
    );
}
