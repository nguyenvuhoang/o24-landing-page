import {
    Shield,
    Lock,
    Smartphone,
    Key,
    UserRound,
    History,
    AlertTriangle,
    LogOut,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const securityOptions = [
    {
        title: "Change Password",
        description: "Ensure your account is using a strong, unique password.",
        icon: Key,
        action: "Manage",
    },
    {
        title: "Two-Factor Authentication",
        description: "Add an extra layer of security to your account.",
        icon: Smartphone,
        action: "Enable",
        status: "Disabled",
        statusColor: "text-amber-500",
    },
    {
        title: "Authorized Applications",
        description: "Review third-party apps with access to your account.",
        icon: Lock,
        action: "View All (4)",
    },
];

const sessions = [
    {
        device: "MacBook Pro - Chrome",
        location: "Ho Chi Minh, VN",
        ip: "14.232.xxx.xxx",
        status: "Current Session",
        current: true,
    },
    {
        device: "iPhone 15 - Mobile Safari",
        location: "Ho Chi Minh, VN",
        ip: "27.67.xxx.xxx",
        status: "Active 2 hours ago",
        current: false,
    },
];

export default function SecurityPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
                <p className="text-muted-foreground">Secure your account and manage active sessions.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Security</CardTitle>
                        <CardDescription>Primary tools to protect your account data.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {securityOptions.map((opt) => (
                                <div key={opt.title} className="flex items-center justify-between p-6 hover:bg-accent/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                            <opt.icon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{opt.title}</p>
                                            <p className="text-sm text-muted-foreground">{opt.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {opt.status && <span className={`text-xs font-semibold ${opt.statusColor}`}>{opt.status}</span>}
                                        <Button variant="outline" size="sm">{opt.action}</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Login Sessions</CardTitle>
                        <CardDescription>View and manage all devices currently logged into your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sessions.map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                                    <div className="flex items-center gap-4">
                                        <History className="h-6 w-6 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{session.device}</p>
                                            <p className="text-xs text-muted-foreground">{session.location} • {session.ip}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={session.current ? "default" : "secondary"}>
                                            {session.status}
                                        </Badge>
                                        {!session.current && (
                                            <Button variant="ghost" size="sm" className="text-destructive h-8 px-2">Log out</Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <Button variant="link" className="w-full text-xs text-destructive hover:text-destructive">
                                <LogOut className="h-3.5 w-3.5 mr-2" /> Sign out from all other devices
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-500/20 bg-red-500/5">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="text-sm">
                            <p className="font-semibold text-red-600">Delete Account</p>
                            <p className="text-muted-foreground">Permanently delete your account and all associated data. This action is irreversible.</p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
