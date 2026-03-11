"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Header } from "@/components/dashboard/Header";
import { useAuthStore } from "@/app/store/authStore";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/app/lib/api";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoggedIn, token, _hasHydrated, setAuth } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasSynced, setHasSynced] = useState(false);

    useEffect(() => {
        if (!_hasHydrated || !isLoggedIn || !token || hasSynced) return;

        const syncUser = async () => {
            try {
                const response = await api.get("/user");
                if (response.data && token) {
                    setAuth(response.data, token);
                }
                setHasSynced(true);
            } catch (err) {
                console.error("Failed to refresh user data:", err);
                setHasSynced(true);
            }
        };

        syncUser();
    }, [_hasHydrated, isLoggedIn, token, hasSynced, setAuth]);

    // Wait for hydration
    if (!_hasHydrated) return null;

    // Protection: Must be logged in and must be an admin
    if (!isLoggedIn || !token || (user && user.role !== 'admin')) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white border border-zinc-100 rounded-[3rem] p-12 shadow-2xl shadow-zinc-200">
                    <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-8">
                        <ShieldAlert className="h-10 w-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-4 uppercase">Restricted Area</h2>
                    <p className="text-zinc-500 mb-10 font-medium">
                        You do not have the required permissions to access the management panel. Please return to the user area.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex h-14 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest px-8 items-center gap-3 hover:bg-black transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50/20 p-6 sm:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
