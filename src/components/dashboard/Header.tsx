"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Bell,
    Search,
    User,
    LogOut,
    Settings as SettingsIcon,
    HelpCircle
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [profile, setProfile] = useState<{ full_name: string; email: string; avatar_url: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("full_name, email, avatar_url")
                    .eq("id", user.id)
                    .single();

                if (!error && data) {
                    setProfile(data);
                } else {
                    // Fallback to auth metadata if profile table fetch fails
                    setProfile({
                        full_name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
                        email: user.email || "",
                        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
                    });
                }
            }
        };
        fetchProfile();
    }, [supabase]);

    const getBreadcrumb = () => {
        const parts = pathname.split("/").filter(Boolean);
        return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" / ");
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="flex h-full items-center justify-between px-6">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold italic tracking-tighter">O24</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden md:inline-block">O24 Page</span>
                    </div>

                    <nav className="hidden lg:flex items-center text-sm font-medium text-muted-foreground">
                        {getBreadcrumb()}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative hidden md:block w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder="Search anything..."
                            className="w-full rounded-full border border-border bg-accent/20 h-9 pl-8 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-shadow"
                        />
                    </div>

                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background"></span>
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-accent/50 ml-2 overflow-hidden border border-border/50">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-5 w-5" />
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2" align="end">
                            <div className="px-2 py-1.5 mb-2 border-b border-border">
                                <p className="text-sm font-medium truncate">{profile?.full_name || "Loading..."}</p>
                                <p className="text-xs text-muted-foreground truncate">{profile?.email || ""}</p>
                            </div>
                            <div className="space-y-1 text-sm">
                                <Link href="/dashboard/profile" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent">
                                    <User className="h-4 w-4" /> Profile
                                </Link>
                                <Link href="/dashboard/settings" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent">
                                    <SettingsIcon className="h-4 w-4" /> Settings
                                </Link>
                                <Link href="/dashboard/support" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent">
                                    <HelpCircle className="h-4 w-4" /> Support
                                </Link>
                            </div>
                            <div className="mt-2 pt-2 border-t border-border">
                                <button
                                    onClick={handleSignOut}
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                                >
                                    <LogOut className="h-4 w-4" /> Sign out
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
    );
}
