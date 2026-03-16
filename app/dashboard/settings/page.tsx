"use client";

import { useState } from "react";
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
    ExternalLink
} from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";

type Tab = "account" | "integrations" | "ai" | "notifications";

export default function SettingsPage() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<Tab>("account");
    const [isSaving, setIsSaving] = useState(false);

    const tabs = [
        { id: "account", label: "Account", icon: User },
        { id: "integrations", label: "Integrations", icon: Link2 },
        { id: "ai", label: "AI Prefs", icon: Sparkles },
    ];

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Settings updated successfully!");
        }, 1000);
    };

    return (
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
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                                                    defaultValue={user?.name}
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
                                                    placeholder="e.g. Senior Software Engineer"
                                                    className="w-full h-12 rounded-2xl bg-zinc-50 border border-zinc-100 px-4 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </SettingCard>

                                    <div className="p-8 rounded-[2.5rem] border border-red-100 bg-red-50/20 text-center space-y-4">
                                        <h3 className="text-sm font-black text-red-600 uppercase tracking-widest">Danger Zone</h3>
                                        <p className="text-[11px] font-medium text-zinc-500 max-w-sm mx-auto">Once you delete your account, all your AI-optimized resumes and tracking history will be permanently removed.</p>
                                        <button className="flex items-center gap-2 mx-auto px-6 py-3 rounded-2xl bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all">
                                            <Trash2 className="h-4 w-4" />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "integrations" && (
                                <div className="grid gap-6">
                                    <IntegrationCard
                                        name="Gmail Autopilot"
                                        status="connected"
                                        icon={Mail}
                                        color="text-red-500"
                                        bg="bg-red-50"
                                        desc="Scans your inbox for interview invites and application status updates."
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
                                                            className={cn(
                                                                "px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                                                tone === "Professional" ? "bg-brand-blue text-white border-brand-blue shadow-lg shadow-blue-500/10" : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
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

function IntegrationCard({ name, status, icon: Icon, color, bg, desc }: { name: string; status: 'connected' | 'disconnected'; icon: any; color: string; bg: string; desc: string }) {
    return (
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-100 transition-all group">
            <div className="flex items-center gap-5">
                <div className={cn("h-14 w-14 rounded-3xl flex items-center justify-center shrink-0 border border-zinc-50 shadow-sm", bg, color)}>
                    <Icon className="h-6 w-6" />
                </div>
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
                    <p className="text-[11px] font-medium text-zinc-400 mt-1 max-w-sm line-clamp-2 md:line-clamp-none">{desc}</p>
                </div>
            </div>
            <button className={cn(
                "h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all w-full md:w-auto",
                status === 'connected' ? "bg-zinc-50 text-zinc-400 hover:bg-zinc-100" : "bg-brand-blue text-white hover:shadow-lg hover:shadow-blue-500/20"
            )}>
                {status === 'connected' ? "Configure" : "Connect Now"}
            </button>
        </div>
    );
}

function ToggleOption({ title, desc, active }: { title: string; desc: string; active: boolean }) {
    return (
        <div className="flex items-center justify-between py-6 first:pt-0 last:pb-0">
            <div className="text-left">
                <p className="text-[11px] font-black text-brand-blue-black uppercase tracking-widest">{title}</p>
                <p className="text-[11px] font-medium text-zinc-400 mt-1">{desc}</p>
            </div>
            <button className={cn(
                "h-6 w-11 rounded-full relative transition-colors shrink-0",
                active ? "bg-brand-blue" : "bg-zinc-100"
            )}>
                <div className={cn(
                    "absolute top-1 h-4 w-4 bg-white rounded-full transition-all shadow-sm",
                    active ? "right-1" : "left-1"
                )} />
            </button>
        </div>
    );
}
