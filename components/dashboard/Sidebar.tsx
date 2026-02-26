"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { useJobStore } from "@/app/store/jobStore";
import { useEffect } from "react";
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
    Zap,
    X
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

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { clearAuth, user } = useAuthStore();
    const { jobs, fetchJobs } = useJobStore();

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    // Close mobile sidebar on navigation
    useEffect(() => {
        if (onClose) onClose();
    }, [pathname]);

    const logout = () => {
        clearAuth();
        window.location.href = "/login";
    };

    const sidebarContent = (
        <div className="flex h-full w-72 flex-col border-r border-zinc-100 bg-white">
            <div className="flex h-20 items-center justify-between px-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden shrink-0">
                        <img src="/logo.png" alt="Offerra Logo" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-base font-black tracking-tight text-black">Offerra</span>
                </Link>
                {/* Close button only on mobile */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden h-8 w-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-y-8 px-6 py-4 overflow-y-auto">
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
                                    <span className="ml-auto rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black text-[#1C4ED8]">{jobs.length}</span>
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
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="h-9 w-9 rounded-xl bg-[#1C4ED8] flex items-center justify-center font-black text-white text-[10px] uppercase shadow-lg shadow-blue-600/10 shrink-0">
                        {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "PU"}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black tracking-tight text-black truncate">{user?.name || "Pro User"}</span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{user?.role || "User"} Tier</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 rounded-lg px-2 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-100/50 hover:text-black transition-all"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-xs font-bold text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );

    // Mobile: overlay sidebar
    if (typeof isOpen !== 'undefined') {
        return (
            <>
                {/* Backdrop */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                        onClick={onClose}
                    />
                )}
                {/* Slide-in drawer */}
                <div className={cn(
                    "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    {sidebarContent}
                </div>
                {/* Desktop: static sidebar */}
                <div className="hidden lg:block">
                    {sidebarContent}
                </div>
            </>
        );
    }

    // Fallback (shouldn't happen with updated layout)
    return sidebarContent;
}
