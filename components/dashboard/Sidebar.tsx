"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    Clock,
    LineChart,
    Target,
    Compass,
    Settings,
    LogOut,
    Command,
    Zap
} from "lucide-react";
import { cn } from "@/app/lib/utils";

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'Interviews', href: '/dashboard/interviews', icon: Clock },
    { name: 'Analytics', href: '/dashboard/analytics', icon: LineChart },
];

const strategy = [
    { name: 'Market Insights', href: '/dashboard/insights', icon: Compass },
    { name: 'Salary Engine', href: '/dashboard/salary', icon: Target },
    { name: 'Interview Prep', href: '/dashboard/prep', icon: Zap },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-72 flex-col border-r border-zinc-100 bg-zinc-50/30">
            <div className="flex h-20 items-center px-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1C4ED8] shadow-lg shadow-blue-600/20">
                        <Command className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-black tracking-tight text-black">ApplyTrack</span>
                </Link>
            </div>

            <div className="flex flex-1 flex-col gap-y-8 px-6 py-4">
                <div>
                    <span className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Inventory</span>
                    <nav className="mt-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all",
                                    pathname === item.href
                                        ? "bg-white text-[#1C4ED8] shadow-sm border border-zinc-100"
                                        : "text-zinc-500 hover:bg-zinc-100/50 hover:text-black"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    pathname === item.href ? "text-[#1C4ED8]" : "text-zinc-400 group-hover:text-black"
                                )} />
                                {item.name}
                                {item.name === 'Applications' && (
                                    <span className="ml-auto rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black text-[#1C4ED8]">142</span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <span className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Strategy</span>
                    <nav className="mt-4 space-y-1">
                        {strategy.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all",
                                    pathname === item.href
                                        ? "bg-white text-[#1C4ED8] shadow-sm border border-zinc-100"
                                        : "text-zinc-500 hover:bg-zinc-100/50 hover:text-black"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    pathname === item.href ? "text-[#1C4ED8]" : "text-zinc-400 group-hover:text-black"
                                )} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="mt-auto border-t border-zinc-100 p-6 space-y-4">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-2 text-xs font-bold text-zinc-500 hover:text-black transition-colors"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
                <button className="flex w-full items-center gap-3 px-2 text-xs font-bold text-zinc-500 hover:text-red-600 transition-colors">
                    <LogOut className="h-4 w-4" />
                    Log Out
                </button>
            </div>
        </div>
    );
}
