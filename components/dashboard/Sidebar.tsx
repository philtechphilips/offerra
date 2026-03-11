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
    Sparkles,
    X,
    FileText,
    PenTool
} from "lucide-react";
import { cn } from "@/app/lib/utils";

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'Interviews', href: '/dashboard/interviews', icon: Clock },
];

const strategy = [
    { name: 'Profile', href: '/dashboard/profile', icon: FileText },
    { name: 'Optimize CV', href: '/dashboard/optimizer', icon: Sparkles },
    { name: 'Proposals', href: '/dashboard/proposals', icon: PenTool },
    { name: 'Practice', href: '/dashboard/prep', icon: Zap },
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
        <div className="flex h-full w-72 flex-col border-r border-zinc-100 bg-white relative overflow-hidden">
            {/* Soft Sidebar Accent */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -z-10" />

            <div className="flex h-20 items-center justify-between px-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shrink-0 bg-blue-50 group-hover:scale-110 transition-transform">
                        <img src="/logo.png" alt="Offerra Logo" className="h-full w-full object-contain p-1.5" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-brand-blue-black uppercase tracking-[-0.05em]">Offerra<span className="text-brand-blue">.</span></span>
                </Link>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden h-10 w-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-y-10 px-6 py-8 overflow-y-auto">
                <div>
                    <span className="px-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Your Jobs</span>
                    <nav className="mt-6 space-y-1.5">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all relative overflow-hidden",
                                    pathname === item.href
                                        ? "bg-brand-blue text-white"
                                        : "text-zinc-400 hover:bg-zinc-50 hover:text-brand-blue"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    pathname === item.href ? "text-white/70" : "text-zinc-300 group-hover:text-brand-blue"
                                )} />
                                {item.name === 'Overview' ? 'Summary' : item.name}
                                {item.name === 'Applications' && jobs.length > 0 && (
                                    <span className={cn(
                                        "ml-auto h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center text-[9px] font-black",
                                        pathname === item.href ? "bg-white/10 text-white" : "bg-brand-blue-light text-brand-blue"
                                    )}>
                                        {jobs.length}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <span className="px-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Tools</span>
                    <nav className="mt-6 space-y-1.5">
                        {strategy.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all",
                                    pathname === item.href
                                        ? "bg-brand-blue text-white"
                                        : "text-zinc-400 hover:bg-zinc-50 hover:text-brand-blue"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    pathname === item.href ? "text-white/70" : "text-zinc-300 group-hover:text-brand-blue"
                                )} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="mt-auto border-t border-zinc-100 p-6 space-y-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="h-11 w-11 rounded-2xl bg-[#1C4ED8] flex items-center justify-center font-black text-white text-[11px] uppercase shrink-0 border-2 border-white">
                        {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "PU"}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-black tracking-tight text-brand-blue-black truncate">{user?.name || "Pro User"}</span>
                        <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.15em] leading-none mt-1">Pro Plan</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-blue-600 transition-all"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
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
                        className="fixed inset-0 z-40 bg-brand-blue-black/30 backdrop-blur-sm lg:hidden"
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
