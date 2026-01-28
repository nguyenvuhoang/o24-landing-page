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
import { ChevronDown, ChevronUp, CheckCircle2, Loader2 } from "lucide-react";

interface FormData {
    name: string;
    email: string;
    company: string;
    role: string;
    interest: string;
    deployment: string;
    message: string;
    timeline: string;
    openSource: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    company?: string;
    role?: string;
    interest?: string;
    deployment?: string;
    message?: string;
}

const roles = [
    { value: "cto", label: "CTO" },
    { value: "tech-lead", label: "Tech Lead" },
    { value: "developer", label: "Developer" },
    { value: "platform-engineer", label: "Platform Engineer" },
    { value: "product-owner", label: "Product Owner" },
    { value: "other", label: "Other" },
];

const interests = [
    { value: "api-management", label: "API Management" },
    { value: "product-service", label: "Product Service" },
    { value: "both", label: "Both" },
];

const deployments = [
    { value: "cloud", label: "Cloud-managed" },
    { value: "on-premise", label: "On-premise" },
    { value: "hybrid", label: "Hybrid" },
    { value: "not-decided", label: "Not decided" },
];

const timelines = [
    { value: "exploring", label: "Just exploring" },
    { value: "1-3-months", label: "Within 1-3 months" },
    { value: "scheduled", label: "Scheduled project" },
];

const openSourceOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "not-sure", label: "Not sure" },
];

export function DemoForm() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        company: "",
        role: "",
        interest: "",
        deployment: "",
        message: "",
        timeline: "",
        openSource: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showOptional, setShowOptional] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.company.trim()) {
            newErrors.company = "Company is required";
        }

        if (!formData.role) {
            newErrors.role = "Please select your role";
        }

        if (!formData.interest) {
            newErrors.interest = "Please select your interest";
        }

        if (!formData.deployment) {
            newErrors.deployment = "Please select deployment model";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Please describe your use case";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/demo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSuccess(true);
            }
        } catch {
            // Handle error silently for now
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

    // Success State
    if (isSuccess) {
        return (
            <div className="p-8 rounded-2xl border border-border bg-card text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Demo request received</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Thank you. Our team will review your request and respond within 1-2 business days.
                    You will receive an email with available time slots and a short pre-call questionnaire.
                </p>
                <div className="text-left max-w-sm mx-auto p-4 rounded-xl bg-muted/50">
                    <h3 className="font-medium mb-2">Next steps</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Check your inbox for confirmation</li>
                        <li>• Prepare any specific questions or integration scenarios</li>
                        <li>• Demo session typically runs 30-45 minutes</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Work email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="company">Company or Organization</Label>
                <Input
                    id="company"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={(e) => updateField("company", e.target.value)}
                    className={errors.company ? "border-destructive" : ""}
                />
                {errors.company && (
                    <p className="text-xs text-destructive">{errors.company}</p>
                )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Your role</Label>
                    <Select
                        value={formData.role}
                        onValueChange={(value) => updateField("role", value)}
                    >
                        <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.role && (
                        <p className="text-xs text-destructive">{errors.role}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>What are you evaluating?</Label>
                    <Select
                        value={formData.interest}
                        onValueChange={(value) => updateField("interest", value)}
                    >
                        <SelectTrigger className={errors.interest ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select interest" />
                        </SelectTrigger>
                        <SelectContent>
                            {interests.map((interest) => (
                                <SelectItem key={interest.value} value={interest.value}>
                                    {interest.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.interest && (
                        <p className="text-xs text-destructive">{errors.interest}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Expected deployment</Label>
                <Select
                    value={formData.deployment}
                    onValueChange={(value) => updateField("deployment", value)}
                >
                    <SelectTrigger className={errors.deployment ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select deployment model" />
                    </SelectTrigger>
                    <SelectContent>
                        {deployments.map((deployment) => (
                            <SelectItem key={deployment.value} value={deployment.value}>
                                {deployment.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.deployment && (
                    <p className="text-xs text-destructive">{errors.deployment}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Describe your use case or questions</Label>
                <Textarea
                    id="message"
                    placeholder="What problem are you solving? Any specific integration context?"
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                    <p className="text-xs text-destructive">{errors.message}</p>
                )}
            </div>

            {/* Optional Fields Toggle */}
            <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                {showOptional ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
                {showOptional ? "Hide optional fields" : "Show optional fields"}
            </button>

            {/* Optional Fields */}
            {showOptional && (
                <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30">
                    <div className="space-y-2">
                        <Label>Implementation timeline</Label>
                        <Select
                            value={formData.timeline}
                            onValueChange={(value) => updateField("timeline", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                                {timelines.map((timeline) => (
                                    <SelectItem key={timeline.value} value={timeline.value}>
                                        {timeline.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Interested in open-source version?</Label>
                        <Select
                            value={formData.openSource}
                            onValueChange={(value) => updateField("openSource", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                                {openSourceOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Microcopy */}
            <p className="text-xs text-muted-foreground">
                Your information is used only to prepare the demo session. We do not share your data with third parties.
                No automated follow-ups — expect a direct reply from our engineering team.
            </p>

            {/* Submit Button */}
            <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Request Technical Demo"
                )}
            </Button>
        </form>
    );
}
