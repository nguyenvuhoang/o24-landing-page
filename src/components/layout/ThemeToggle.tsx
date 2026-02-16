"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative group flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-accent hover:border-primary/30 transition-all duration-300"
            aria-label={resolvedTheme === "dark" ? "Chuyển sang sáng" : "Chuyển sang tối"}
        >
            {/* Sun icon */}
            <Sun
                className={`h-4 w-4 transition-all duration-500 ${resolvedTheme === "dark"
                        ? "rotate-0 scale-100 text-amber-400"
                        : "rotate-90 scale-0 absolute"
                    }`}
            />
            {/* Moon icon */}
            <Moon
                className={`h-4 w-4 transition-all duration-500 ${resolvedTheme === "dark"
                        ? "-rotate-90 scale-0 absolute"
                        : "rotate-0 scale-100 text-slate-700"
                    }`}
            />

            {/* Glow effect on hover */}
            <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-400/15 dark:to-yellow-400/15" />
        </button>
    );
}
