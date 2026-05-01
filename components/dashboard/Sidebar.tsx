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
    Settings,
    LogOut,
    Command,
    Zap,
    Sparkles,
    X,
    FileText,
    PenTool,
    CreditCard,
    ShieldCheck
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
    { name: 'Cover Letter', href: '/dashboard/cover-letter', icon: Command },
    { name: 'Proposals', href: '/dashboard/proposals', icon: FileText },
    { name: 'Practice', href: '/dashboard/prep', icon: Zap },
    { name: 'DocSign', href: '/dashboard/docsign', icon: PenTool },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
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
                    <span className="text-xl font-black tracking-tighter text-brand-blue-black tracking-[-0.05em]">Offerra<span className="text-brand-blue">.</span></span>
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

            <div className="flex flex-1 flex-col gap-y-7 px-4 py-6 overflow-y-auto">
                <div>
                    <span className="px-3 text-[11px] font-semibold text-zinc-400">Your jobs</span>
                    <nav className="mt-3 space-y-0.5">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all",
                                    pathname === item.href
                                        ? "bg-blue-600 text-white"
                                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    pathname === item.href ? "text-white/80" : "text-zinc-400 group-hover:text-zinc-600"
                                )} />
                                {item.name === 'Overview' ? 'Summary' : item.name}
                                {item.name === 'Applications' && jobs.length > 0 && (
                                    <span className={cn(
                                        "ml-auto h-5 min-w-5 px-1 rounded-full flex items-center justify-center text-[9px] font-black",
                                        pathname === item.href ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                                    )}>
                                        {jobs.length}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <span className="px-3 text-[11px] font-semibold text-zinc-400">Tools</span>
                    <nav className="mt-3 space-y-0.5">
                        {strategy.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all",
                                    pathname === item.href
                                        ? "bg-blue-600 text-white"
                                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    pathname === item.href ? "text-white/80" : "text-zinc-400 group-hover:text-zinc-600"
                                )} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {user?.role === 'admin' && (
                    <div>
                        <span className="px-3 text-[11px] font-semibold text-zinc-400">Management</span>
                        <nav className="mt-3 space-y-0.5">
                            <Link
                                href="/admin"
                                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                Admin Portal
                            </Link>
                        </nav>
                    </div>
                )}
            </div>

            <div className="mt-auto border-t border-zinc-100 p-4">
                <div className="rounded-3xl bg-zinc-50/50 border border-zinc-100 p-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-brand-blue flex items-center justify-center font-black text-white text-[10px] shrink-0 shadow-sm">
                            {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "PU"}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-bold tracking-tight text-brand-blue-black truncate">{user?.name || "User account"}</span>
                            <span className="text-[11px] font-medium text-zinc-400 truncate">{user?.plan?.name || "Starter pack"}</span>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/billing"
                        className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-white border border-zinc-100 hover:border-blue-200 transition-all group/credit"
                    >
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <Zap className="h-3 w-3 text-emerald-600 fill-emerald-600" />
                            </div>
                            <span className="text-[11px] font-bold text-zinc-500 group-hover/credit:text-emerald-600 transition-colors">Mode</span>
                        </div>
                        <span className="text-[11px] font-black text-emerald-600">
                            Free Active
                        </span>
                    </Link>
                </div>

                <div className="mt-3 px-1 space-y-0.5">
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                    >
                        <Settings className="h-4 w-4 text-zinc-400" />
                        Settings
                    </Link>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-zinc-500 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        <LogOut className="h-4 w-4 text-zinc-400" />
                        Sign out
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
