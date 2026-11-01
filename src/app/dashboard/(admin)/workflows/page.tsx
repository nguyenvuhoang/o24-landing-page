import {
    Workflow,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Play,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const workflows = [
    {
        id: "wf-1",
        name: "Social Media Automation",
        description: "Automatically post news to Twitter and Facebook",
        status: "active",
        lastRun: "5 mins ago",
        successRate: "99.2%",
    },
    {
        id: "wf-2",
        name: "Data Sync Service",
        description: "Synchronize customer data between CRM and Database",
        status: "active",
        lastRun: "1 hour ago",
        successRate: "98.5%",
    },
    {
        id: "wf-3",
        name: "Email Notification Engine",
        description: "Send alerts for critical system events",
        status: "paused",
        lastRun: "2 days ago",
        successRate: "100%",
    },
    {
        id: "wf-4",
        name: "Report Generator",
        description: "Bi-weekly financial report generation",
        status: "error",
        lastRun: "3 hours ago",
        successRate: "92.1%",
    },
];

export default function WorkflowsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
                    <p className="text-muted-foreground">Manage and monitor your automated processes.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Create Workflow
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search workflows..." className="pl-10" />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
            </div>

            <div className="grid gap-4">
                {workflows.map((wf) => (
                    <Card key={wf.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${wf.status === "active" ? "bg-green-500/10 text-green-500" :
                                            wf.status === "paused" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                                        }`}>
                                        <Workflow className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{wf.name}</h3>
                                        <p className="text-sm text-muted-foreground">{wf.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium">Last Run</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                            <Clock className="h-3 w-3" /> {wf.lastRun}
                                        </p>
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium">Success Rate</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                            <CheckCircle2 className="h-3 w-3 text-green-500" /> {wf.successRate}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Play className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
