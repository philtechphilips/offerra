"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, Sparkles, ChevronDown, Menu, XCircle } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";
import { useJobStore } from "@/app/store/jobStore";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { motion } from "framer-motion";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuthStore();
    const { search, setSearch, fetchJobs } = useJobStore();
    const [localSearch, setLocalSearch] = useState(search);
    const inputRef = useRef<HTMLInputElement>(null);

    const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "PU";
    const displayName = user?.name || "Pro User";

    // Keyboard shortcut Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Keep the local input in sync when another component (e.g. the
    // Applications page filter bar) updates the shared search term.
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    // Debounced push from this input to the shared store. Only fires when the
    // local value actually differs from the store, so it never clobbers an
    // external update with stale text.
    useEffect(() => {
        if (localSearch === search) return;
        const timer = setTimeout(() => {
            setSearch(localSearch);
            fetchJobs(true);
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch, search, setSearch, fetchJobs]);

    return (
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-zinc-100 bg-white/70 backdrop-blur-xl px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-4 lg:gap-10">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden h-11 w-11 rounded-2xl flex items-center justify-center text-zinc-500 bg-zinc-50 border border-zinc-100 hover:text-blue-600 transition-all"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Search */}
                <div className="relative hidden md:block w-72 lg:w-[420px] group">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search for jobs, companies..."
                        className="h-12 w-full rounded-2xl bg-zinc-50/50 pl-11 pr-12 text-xs font-bold border border-transparent focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:outline-none transition-all placeholder:text-zinc-300"
                    />
                    {localSearch ? (
                        <button
                            onClick={() => { setLocalSearch(""); setSearch(""); fetchJobs(true); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
                        >
                            <XCircle className="h-4 w-4" />
                        </button>
                    ) : (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                            <kbd className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-[9px] font-black border border-zinc-200">⌘</kbd>
                            <kbd className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-[9px] font-black border border-zinc-200">K</kbd>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                {/* Pro Mode badge */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="hidden sm:flex items-center gap-2.5 rounded-2xl bg-zinc-50 border border-zinc-100 px-5 py-2.5 transition-all group"
                    onClick={() => window.location.href = "/dashboard/billing"}
                >
                    <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                    <span className="text-[11px] font-black text-zinc-900">
                        Free Mode Active
                    </span>
                </motion.button>

                <div className="hidden sm:block h-6 w-px bg-zinc-100" />
 
                <NotificationDropdown />
 
                <button
                    onClick={() => window.location.href = "/dashboard/profile"}
                    className="flex items-center gap-3 rounded-2xl border border-zinc-100 p-1.5 pr-2 sm:pr-4 transition-all hover:bg-white hover:border-blue-200 group"
                >
                    <div className="h-9 w-9 rounded-xl bg-[#1C4ED8] flex items-center justify-center font-black text-white text-[10px] uppercase">
                        {initials}
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-[11px] font-black tracking-tight text-brand-blue-black group-hover:text-brand-blue transition-colors">{displayName}</div>
                        <div className="text-[11px] font-bold text-zinc-300 leading-none mt-0.5">{user?.plan?.name || "Starter pack"}</div>
                    </div>
                    <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 text-zinc-300 group-hover:text-blue-600 transition-colors" />
                </button>
            </div>
        </header>
    );
}
