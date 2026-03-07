"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useAuthStore } from "@/app/store/authStore";
import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/app/lib/api";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoggedIn, token, _hasHydrated, setAuth } = useAuthStore();
    const [resending, setResending] = useState(false);
    const [hasSynced, setHasSynced] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const handleResendVerification = async () => {
        if (resending) return;
        setResending(true);
        try {
            await api.post("/email/verification-notification");
            toast.success("Verification link sent to your email!");
        } catch (err) {
            toast.error("Failed to send verification link.");
        } finally {
            setResending(false);
        }
    };

    // Wait for hydration
    if (!_hasHydrated) return null;

    // Not logged in (handled by page.tsx too, but good for layout)
    if (!isLoggedIn || !token) return <>{children}</>;

    // Verification check
    if (user && !user.email_verified_at) {
        return (
            <div className="min-h-screen bg-zinc-50/10 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white border border-zinc-100 rounded-[3rem] p-10 text-center shadow-[0_40px_80px_rgba(0,0,0,0.03)]"
                >
                    <div className="h-20 w-20 rounded-3xl bg-amber-50 flex items-center justify-center mx-auto mb-8">
                        <Mail className="h-10 w-10 text-amber-500" />
                    </div>
                    <h2 className="text-4xl font-black text-brand-blue-black tracking-tight mb-4">Verify your email</h2>
                    <p className="text-zinc-500 mb-8 max-w-sm mx-auto font-medium">
                        We've sent a verification link to <br />
                        <span className="text-brand-blue-black font-bold">{user?.email}</span>
                        Please click it to get started.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleResendVerification}
                            disabled={resending}
                            className="w-full h-14 bg-[#1C4ED8] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {resending ? "Sending..." : "Resend Verification Link"}
                            <ArrowUpRight className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem('offerra-auth');
                                window.location.href = '/login';
                            }}
                            className="w-full h-14 bg-zinc-50 text-blue-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all border border-zinc-100"
                        >
                            Return to Login
                        </button>
                    </div>

                    <p className="mt-10 text-[10px] font-bold text-zinc-300 uppercase tracking-widest text-center">
                        Need help? hello@autofill.live
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50/20 p-4 sm:p-6 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
