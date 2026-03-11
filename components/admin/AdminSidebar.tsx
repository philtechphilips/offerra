"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ShieldCheck,
    X,
    Briefcase,
    CreditCard
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useAuthStore } from "@/app/store/authStore";

const adminNavigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Job Analytics', href: '/admin/jobs', icon: BarChart3 },
    { name: 'Billing Management', href: '/admin/billing', icon: CreditCard },
];

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { clearAuth, user } = useAuthStore();

    const logout = () => {
        clearAuth();
        window.location.href = "/login";
    };

    const sidebarContent = (
        <div className="flex h-full w-72 flex-col border-r border-zinc-100 bg-white relative overflow-hidden">
            {/* Admin Theme Accent */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl -z-10" />

            <div className="flex h-20 items-center justify-between px-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shrink-0 bg-indigo-50 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-zinc-900 uppercase">Admin<span className="text-indigo-600">.</span></span>
                </Link>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden h-10 w-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-indigo-600 hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-y-10 px-6 py-8 overflow-y-auto">
                <div>
                    <span className="px-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Control Panel</span>
                    <nav className="mt-6 space-y-1.5">
                        {adminNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all relative overflow-hidden",
                                    pathname === item.href
                                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                                        : "text-zinc-400 hover:bg-zinc-50 hover:text-indigo-600"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    pathname === item.href ? "text-white/70" : "text-zinc-300 group-hover:text-indigo-600"
                                )} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="mt-auto border-t border-zinc-100 p-6 space-y-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="h-11 w-11 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-[11px] uppercase shrink-0 border-2 border-white">
                        {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "AD"}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-black tracking-tight text-zinc-900 truncate">{user?.name || "Administrator"}</span>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.15em] leading-none mt-1 group-hover/plan:text-indigo-700 transition-colors">System Admin</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-blue-600 transition-all"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        User Portal
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

    return (
        <>
            {/* Mobile Sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-900/10 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {sidebarContent}
            </div>
        </>
    );
}
