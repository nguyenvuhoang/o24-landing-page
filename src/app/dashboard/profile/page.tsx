"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Camera, Mail, Briefcase, MapPin } from "lucide-react";

export default function ProfilePage() {
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                setProfile(data || user.user_metadata);
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, [supabase]);

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and preferences.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="relative mx-auto w-32 h-32">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-full object-cover border-4 border-background shadow-xl" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-xl">
                                    <User className="h-12 w-12 text-primary" />
                                </div>
                            )}
                            <button className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform active:scale-95">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{profile?.full_name || "New User"}</h3>
                            <p className="text-sm text-muted-foreground">{profile?.email}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your public profile details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" defaultValue={profile?.full_name} placeholder="Your full name" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" defaultValue={profile?.email} readOnly className="bg-muted text-muted-foreground" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <textarea
                                id="bio"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tell us a bit about yourself..."
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button className="px-8">Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
