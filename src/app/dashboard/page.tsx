import {
    Workflow,
    Key,
    Activity,
    Zap,
    ArrowUpRight,
    TrendingUp,
    Clock,
    CheckCircle2,
    Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
    {
        title: "Total Workflows",
        value: "12",
        change: "+2 this month",
        icon: Workflow,
        color: "text-blue-500",
    },
    {
        title: "Active API Keys",
        value: "4",
        change: "No change",
        icon: Key,
        color: "text-green-500",
    },
    {
        title: "Total Requests",
        value: "1.2k",
        change: "+15% vs last week",
        icon: Zap,
        color: "text-purple-500",
    },
    {
        title: "Average Latency",
        value: "45ms",
        change: "-5ms improvement",
        icon: Activity,
        color: "text-orange-500",
    },
];

const recentActivities = [
    {
        id: 1,
        action: "Workflow executed",
        target: "Social Media Automation",
        time: "2 minutes ago",
        status: "success",
    },
    {
        id: 2,
        action: "New API Key created",
        target: "Production Environment",
        time: "1 hour ago",
        status: "success",
    },
    {
        id: 3,
        action: "Workflow error",
        target: "Data Synchronization",
        time: "3 hours ago",
        status: "error",
    },
    {
        id: 4,
        action: "Plan upgraded",
        target: "Pro Subscription",
        time: "5 hours ago",
        status: "success",
    },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, Hoang!</h1>
                <p className="text-muted-foreground">
                    Here is what&apos;s happening with your projects today.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 transition-all">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your latest actions across the platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${activity.status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                            }`}>
                                            <Activity className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{activity.target}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {activity.time}
                                        </span>
                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-6">View All Activity</Button>
                    </CardContent>
                </Card>

                <Card className="col-span-3 transition-all">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Start a new task immediately.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full justify-start gap-3 h-12" variant="outline">
                            <div className="h-7 w-7 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <Workflow className="h-4 w-4" />
                            </div>
                            Create New Workflow
                        </Button>
                        <Button className="w-full justify-start gap-3 h-12" variant="outline">
                            <div className="h-7 w-7 rounded bg-green-500/10 text-green-500 flex items-center justify-center">
                                <Key className="h-4 w-4" />
                            </div>
                            Add New Credentials
                        </Button>
                        <Button className="w-full justify-start gap-3 h-12" variant="outline">
                            <div className="h-7 w-7 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <Users className="h-4 w-4" />
                            </div>
                            Invite Team Member
                        </Button>

                        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <span className="text-sm font-semibold">Account Setup</span>
                            </div>
                            <div className="w-full bg-accent/30 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[85%]"></div>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2 text-right">85% complete</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
