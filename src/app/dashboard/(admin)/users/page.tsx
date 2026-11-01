"use client";

import {
    Users,
    UserPlus,
    Mail,
    BadgeCheck,
    ShieldAlert,
    MoreVertical,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface TeamMember {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
    role: string;
    status: string;
}

export default function UsersPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("profiles")
                .select("id, full_name, email, avatar_url");

            if (!error && data) {
                const members = data.map((d: any) => ({
                    id: d.id,
                    full_name: d.full_name || "Unknown User",
                    email: d.email || "",
                    avatar_url: d.avatar_url || "",
                    role: "Admin", // Placeholder role as it's not in profiles yet
                    status: "Active",
                }));
                setTeamMembers(members);
            }
            setIsLoading(false);
        };
        fetchUsers();
    }, [supabase]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                    <p className="text-muted-foreground">Manage your team members and their access levels.</p>
                </div>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" /> Invite Member
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or email..." className="pl-10" />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Members</CardTitle>
                    <CardDescription>A list of everyone in your workspace and their roles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="grid grid-cols-12 bg-muted/50 p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <div className="col-span-5 px-3">Member</div>
                            <div className="col-span-3">Role</div>
                            <div className="col-span-3 text-center">Status</div>
                            <div className="col-span-1"></div>
                        </div>
                        <div className="divide-y text-sm">
                            {isLoading ? (
                                <div className="p-8 text-center text-muted-foreground">Loading team members...</div>
                            ) : teamMembers.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">No team members found.</div>
                            ) : (
                                teamMembers.map((member) => (
                                    <div key={member.id} className="grid grid-cols-12 items-center p-4 hover:bg-accent/5 transition-colors">
                                        <div className="col-span-5 flex items-center gap-3">
                                            {member.avatar_url ? (
                                                <img src={member.avatar_url} alt={member.full_name} className="h-10 w-10 rounded-full object-cover border border-border/50" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                    {member.full_name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="font-medium truncate">{member.full_name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <div className="flex items-center gap-1.5">
                                                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                                                {member.role}
                                            </div>
                                        </div>
                                        <div className="col-span-3 text-center">
                                            <Badge variant={member.status === "Active" ? "default" : "outline"} className="px-2">
                                                {member.status}
                                            </Badge>
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <Mail className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold">Join Requests</h3>
                    </div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Pending approval</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center">
                            <Users className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold">Active Seats</h3>
                    </div>
                    <p className="text-2xl font-bold">{teamMembers.length} / 10</p>
                    <p className="text-xs text-muted-foreground mt-1">{10 - teamMembers.length} seats remaining</p>
                </Card>
                <Card className="p-6 border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <ShieldAlert className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold">Audit Logs</h3>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-amber-600">View logs →</Button>
                </Card>
            </div>
        </div>
    );
}
