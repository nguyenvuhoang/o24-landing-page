import {
    Key,
    Plus,
    Search,
    ShieldCheck,
    ExternalLink,
    Trash2,
    Lock,
    Eye,
    Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const credentials = [
    {
        id: "cred-1",
        name: "Production API Key",
        provider: "System",
        type: "REST API",
        lastUsed: "2 mins ago",
        status: "active",
    },
    {
        id: "cred-2",
        name: "GitHub OAuth",
        provider: "GitHub",
        type: "OAuth2",
        lastUsed: "1 day ago",
        status: "active",
    },
    {
        id: "cred-3",
        name: "AWS S3 Access",
        provider: "AWS",
        type: "Access Key",
        lastUsed: "Never",
        status: "inactive",
    },
];

export default function CredentialsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Credentials</h1>
                    <p className="text-muted-foreground">Manage your API keys and service integrations securely.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Credential
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Connected Services</CardTitle>
                        <CardDescription>Accounts and services integrated with your O24 workspace.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y border rounded-lg">
                            {credentials.map((cred) => (
                                <div key={cred.id} className="flex items-center justify-between p-4 bg-background hover:bg-accent/5 transition-colors first:rounded-t-lg last:rounded-b-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                            <Key className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{cred.name}</span>
                                                <Badge variant={cred.status === "active" ? "default" : "secondary"} className="text-[10px] h-4">
                                                    {cred.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{cred.provider} • {cred.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] uppercase font-semibold text-muted-foreground">Last used</p>
                                            <p className="text-sm">{cred.lastUsed}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Security Tip</CardTitle>
                            <CardDescription>Always use environment variables for keys and rotate them every 90 days for maximum security.</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                                <Lock className="h-5 w-5" />
                            </div>
                            <CardTitle>VPC Proxy</CardTitle>
                            <CardDescription>Connect O24 to your private infrastructure securely using our VPC proxy agents.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" size="sm" className="w-full gap-2">
                                Learn More <ExternalLink className="h-3 w-3" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
