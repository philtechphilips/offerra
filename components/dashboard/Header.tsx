"use client";

import { Search, Bell, Sparkles, ChevronDown, Menu } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuthStore();
    const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "PU";
    const displayName = user?.name || "Pro User";

    return (
        <header className="flex h-16 lg:h-20 items-center justify-between border-b border-zinc-100 bg-white px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-4 lg:gap-10">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden h-10 w-10 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-black transition-all"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Search - hidden on small screens, visible on md+ */}
                <div className="relative hidden md:block w-64 lg:w-96">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300" />
                    <input
                        type="text"
                        placeholder="Search roles, companies, or tasks..."
                        className="h-11 w-full rounded-2xl bg-zinc-50 pl-11 pr-4 text-xs font-bold border border-transparent focus:border-zinc-200 focus:bg-white focus:outline-none transition-all placeholder:text-zinc-300"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                {/* Pro Mode badge - hidden on small screens */}
                <button className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 transition-all hover:bg-blue-100 group">
                    <Sparkles className="h-4 w-4 text-[#1C4ED8] group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1C4ED8]">Pro Mode Active</span>
                </button>

                <div className="hidden sm:block h-8 w-px bg-zinc-100" />

                <button className="relative rounded-xl p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-black">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
                </button>

                <button className="flex items-center gap-3 rounded-2xl border border-zinc-100 p-1.5 pr-2 sm:pr-4 transition-all hover:bg-zinc-50 group">
                    <div className="h-9 w-9 rounded-xl bg-[#1C4ED8] flex items-center justify-center font-black text-white text-xs shadow-lg shadow-blue-600/10 uppercase">
                        {initials}
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-[11px] font-black tracking-tight text-black group-hover:text-[#1C4ED8] transition-colors">{displayName}</div>
                        <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Premium Tier</div>
                    </div>
                    <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 text-zinc-300 hidden sm:block" />
                </button>
            </div>
        </header>
    );
}
