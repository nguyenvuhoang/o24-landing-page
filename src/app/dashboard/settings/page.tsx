import {
    Settings,
    User,
    Bell,
    Globe,
    Monitor,
    Database,
    AppWindow,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your workspace configuration and personal preferences.</p>
                </div>
                <Button className="gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                </Button>
            </div>

            <div className="grid gap-8">
                {/* Workspace Settings */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <AppWindow className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Workspace Configuration</h2>
                    </div>
                    <Card>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="ws-name">Workspace Name</Label>
                                    <Input id="ws-name" defaultValue="My O24 Project" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ws-id">Project ID</Label>
                                    <Input id="ws-id" defaultValue="o24_prj_9921" readOnly className="bg-muted text-muted-foreground" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ws-url">Base URL</Label>
                                <div className="flex gap-2">
                                    <div className="flex items-center px-3 border rounded-lg bg-muted text-xs font-mono text-muted-foreground">
                                        https://api.o24.io/
                                    </div>
                                    <Input id="ws-url" defaultValue="my-project" className="flex-1" />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Changing the base URL will affect all your active workflow endpoints.</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* Notifications */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Notifications</h2>
                    </div>
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between lg:pr-12">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Critical Errors</p>
                                    <p className="text-xs text-muted-foreground">Get notified immediately when a workflow fails.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-primary uppercase">Active</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between lg:pr-12">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Monthly Usage Reports</p>
                                    <p className="text-xs text-muted-foreground">Receive a summary of your resource consumption.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-9 rounded-full bg-muted border-2"></div>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between lg:pr-12">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Platform Updates</p>
                                    <p className="text-xs text-muted-foreground">News about new features and improvements.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-9 rounded-full bg-primary relative">
                                        <div className="absolute right-1 top-1 h-3 w-3 rounded-full bg-white"></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* Region & Performance */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Deployment Region</h2>
                    </div>
                    <Card className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full border flex items-center justify-center shrink-0">
                                🇻🇳
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">Vietnam (SEA-North-1)</p>
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none">Latency: 12ms</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Your workflows are executed from our Ho Chi Minh City data center for optimal performance in Asia.</p>
                                <Button variant="link" size="sm" className="p-0 h-auto text-primary">Migrate region</Button>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
}
