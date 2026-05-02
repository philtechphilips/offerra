"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Link2,
    Sparkles,
    Bell,
    Shield,
    Mail,
    Chrome,
    Smartphone,
    Target,
    DollarSign,
    Save,
    Trash2,
    Download,
    Globe,
    ExternalLink,
    Loader2
} from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

type Tab = "account" | "integrations" | "ai" | "notifications";

export default function SettingsPage() {
    const { user, setUser, clearAuth } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("account");
    const [isSaving, setIsSaving] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ title: string; description: string; confirmLabel?: string; onConfirm: () => void } | null>(null);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    
    // Form States
    const [name, setName] = useState(user?.name || "");
    const [headline, setHeadline] = useState(user?.professional_headline || "");
    const [aiTone, setAiTone] = useState(user?.ai_tone || "Professional");
    const [notifications, setNotifications] = useState(user?.notifications_enabled ?? true);

    // Sync from store if user changes
    useEffect(() => {
        if (user) {
            setName(user.name);
            setHeadline(user.professional_headline || "");
            setAiTone(user.ai_tone || "Professional");
            setNotifications(user.notifications_enabled ?? true);
        }
    }, [user]);

    const tabs = [
        { id: "account", label: "Account", icon: User },
        { id: "integrations", label: "Integrations", icon: Link2 },
        { id: "ai", label: "AI Prefs", icon: Sparkles },
    ];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await api.put("/user/settings", {
                name,
                professional_headline: headline,
                ai_tone: aiTone,
                notifications_enabled: notifications
            });
            setUser(response.data.user);
            toast.success("Settings updated successfully!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setConfirmModal(null);
        setIsDeletingAccount(true);
        try {
            await api.delete("/user");
            toast.success("Account deleted. Good luck with your journey!");
            clearAuth();
            router.push("/");
        } catch (err: any) {
            toast.error("Failed to delete account");
        } finally {
            setIsDeletingAccount(false);
        }
    };

    const handleToggleGmail = async () => {
        if (user?.google_account) {
            // Disconnect
            try {
                const response = await api.post("/auth/google/disconnect");
                setUser(response.data.user);
                toast.success("Gmail disconnected");
            } catch (err) {
                toast.error("Failed to disconnect Gmail");
            }
        } else {
            // Connect
            try {
                const response = await api.get("/auth/google/redirect");
                window.location.href = response.data.url;
            } catch (err) {
                toast.error("Failed to initiate Google connection");
            }
        }
    };

    return (
        <>
        <div className="w-full max-w-6xl mx-auto space-y-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-brand-blue-black uppercase">Settings</h1>
                    <p className="mt-2 text-sm font-medium text-zinc-400">
                        Manage your account preferences and autonomous AI agents.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary h-12 px-8 flex items-center gap-2"
                >
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Navigation Sidebar */}
                <aside className="w-full lg:w-64 shrink-0">
                    <nav className="flex lg:flex-col gap-2 bg-white/50 p-2 rounded-[2rem] border border-zinc-100 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={cn(
                                    "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shrink-0",
                                    activeTab === tab.id
                                        ? "bg-brand-blue text-white shadow-lg shadow-blue-500/20"
                                        : "text-zinc-400 hover:bg-zinc-50 hover:text-brand-blue"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content Sections */}
                <div className="flex-1 min-w-0 pb-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {activeTab === "account" && (
                                <div className="max-w-2xl space-y-8">
                                    <SettingCard title="Basic Information" icon={User}>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    className="w-full h-12 rounded-2xl bg-zinc-50 border border-zinc-100 px-4 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    defaultValue={user?.email}
                                                    disabled
                                                    className="w-full h-12 rounded-2xl bg-zinc-100 border border-zinc-200 px-4 text-xs font-bold text-zinc-400 cursor-not-allowed outline-none"
                                                />
                                                <p className="text-[9px] font-bold text-zinc-400 mt-1 px-1">Email cannot be changed for security reasons.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Professional Headline</label>
                                                <input
                                                    type="text"
                                                    value={headline}
                                                    onChange={e => setHeadline(e.target.value)}
                                                    placeholder="e.g. Senior Software Engineer"
                                                    className="w-full h-12 rounded-2xl bg-zinc-50 border border-zinc-100 px-4 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </SettingCard>

                                    {/*
                                    Danger Zone (account deletion) is temporarily disabled.
                                    Re-enable this block when self-serve account deletion is ready.

                                    <div className="p-8 rounded-[2.5rem] border border-red-100 bg-red-50/20 text-center space-y-4">
                                        <h3 className="text-sm font-black text-red-600 uppercase tracking-widest">Danger Zone</h3>
                                        <p className="text-[11px] font-medium text-zinc-500 max-w-sm mx-auto">Once you delete your account, all your AI-optimized resumes and tracking history will be permanently removed.</p>
                                        <button
                                            onClick={() => setConfirmModal({
                                                title: "Delete Account",
                                                description: "This will permanently delete your account and all data including resumes and tracking history. This action cannot be undone.",
                                                confirmLabel: "Delete Account",
                                                onConfirm: handleDeleteAccount,
                                            })}
                                            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-2xl bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Account
                                        </button>
                                    </div>
                                    */}
                                </div>
                            )}

                            {activeTab === "integrations" && (
                                <div className="grid gap-6">
                                    <IntegrationCard
                                        name="Gmail Autopilot"
                                        status={user?.google_account ? "connected" : "disconnected"}
                                        icon={Mail}
                                        color="text-red-500"
                                        bg="bg-red-50"
                                        desc="Scans your inbox for interview invites and application status updates."
                                        onAction={handleToggleGmail}
                                        isGoogle={true}
                                    />
                                    <div className="p-8 rounded-[2.5rem] bg-zinc-50/50 border border-dashed border-zinc-200 text-center">
                                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">More integrations coming soon</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === "ai" && (
                                <div className="max-w-2xl">
                                    <SettingCard title="AI Persona & Tone" icon={Sparkles}>
                                        <div className="space-y-6 text-left">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Proposal Tone</label>
                                                <p className="text-[11px] font-medium text-zinc-400 mb-4 px-1">Select the personality style the AI should use when generating your proposals and communications.</p>
                                                <div className="grid grid-cols-2 gap-3 mt-2">
                                                    {["Professional", "Aggressive", "Creative", "Concise"].map(tone => (
                                                        <button
                                                            key={tone}
                                                            onClick={() => setAiTone(tone as any)}
                                                            className={cn(
                                                                "px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                                                tone === aiTone ? "bg-brand-blue text-white border-brand-blue shadow-lg shadow-blue-500/10" : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
                                                            )}
                                                        >
                                                            {tone}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </SettingCard>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
        <ConfirmModal
            isOpen={!!confirmModal}
            onClose={() => setConfirmModal(null)}
            onConfirm={() => confirmModal?.onConfirm()}
            title={confirmModal?.title ?? ""}
            description={confirmModal?.description ?? ""}
            confirmLabel={confirmModal?.confirmLabel}
            isLoading={isDeletingAccount}
        />
        </>
    );
}

function SettingCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
    return (
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-shadow h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-900 border border-zinc-100">
                    <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-black text-brand-blue-black uppercase tracking-widest">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function IntegrationCard({ name, status, icon: Icon, color, bg, desc, onAction, isGoogle }: { 
    name: string; 
    status: 'connected' | 'disconnected'; 
    icon: any; 
    color: string; 
    bg: string; 
    desc: string;
    onAction: () => void;
    isGoogle?: boolean;
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async () => {
        setIsLoading(true);
        try {
            await onAction();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn(
            "rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all group border",
            isGoogle && status === 'disconnected' ? "bg-white border-zinc-200 shadow-sm" : "bg-white border-zinc-100 hover:border-blue-100 shadow-sm"
        )}>
            <div className="flex items-center gap-5">
                {!isGoogle && (
                    <div className={cn("h-14 w-14 rounded-3xl flex items-center justify-center shrink-0 border border-zinc-50 shadow-sm transition-all group-hover:scale-105", bg, color)}>
                        <Icon className="h-6 w-6" />
                    </div>
                )}
                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-black text-brand-blue-black uppercase tracking-tight">{name}</h3>
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                            status === 'connected' ? "bg-emerald-50 text-emerald-600" : "bg-zinc-50 text-zinc-400"
                        )}>
                            {status}
                        </span>
                    </div>
                    <p className="text-[11px] font-medium text-zinc-400 mt-1 max-w-sm line-clamp-2 md:line-clamp-none leading-relaxed">{desc}</p>
                </div>
            </div>

            {isGoogle && status === 'disconnected' ? (
                <button 
                    onClick={handleAction}
                    disabled={isLoading}
                    className="flex items-center gap-3 bg-white border border-zinc-200 px-6 py-3 rounded-xl hover:bg-zinc-50 transition-all font-medium text-zinc-600 text-sm shadow-sm active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                    )}
                    <span>Connect with Google</span>
                </button>
            ) : (
                <button 
                    onClick={handleAction}
                    disabled={isLoading}
                    className={cn(
                        "h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all w-full md:w-auto flex items-center justify-center gap-2",
                        status === 'connected' 
                            ? "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-red-500" 
                            : "bg-brand-blue text-white hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : status === 'connected' ? (
                        <Trash2 className="h-3 w-3" />
                    ) : (
                        <ExternalLink className="h-3 w-3" />
                    )}
                    {status === 'connected' ? "Disconnect" : "Connect Now"}
                </button>
            )}
        </div>
    );
}
