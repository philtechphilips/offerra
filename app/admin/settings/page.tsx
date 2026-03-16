"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import {
    Settings,
    Save,
    Zap,
    Loader2,
    Shield,
    AlertCircle,
    Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";

interface Setting {
    id: number;
    key: string;
    value: string;
    display_name: string;
    group: string;
    type: string;
}

export default function AdminSettings() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/settings");
            setSettings(response.data);
            // Initialize edited settings
            const initialMap: Record<string, string> = {};
            response.data.forEach((s: Setting) => {
                initialMap[s.key] = s.value;
            });
            setEditedSettings(initialMap);
        } catch (err) {
            console.error("Failed to fetch settings", err);
            toast.error("Error loading system settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (key: string, value: string) => {
        setEditedSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = Object.entries(editedSettings).map(([key, value]) => ({
                key,
                value
            }));

            await api.put("/admin/settings", { settings: payload });
            toast.success("System configurations updated successfully");
            fetchSettings();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const creditSettings = settings.filter(s => s.group === 'credits');
    const generalSettings = settings.filter(s => s.group !== 'credits');

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-10 w-10 text-brand-blue animate-spin" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">Platform <span className="text-brand-blue">Logic.</span></h1>
                    <p className="text-sm font-medium text-zinc-400 mt-1">Global feature costs, autonomous behavioral logic, and credit unit valuations.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 px-10 bg-zinc-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-zinc-200 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>Save Platform Logic</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-brand-blue rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20">
                        <Shield className="h-10 w-10 mb-6 opacity-80" />
                        <h3 className="text-xl font-black uppercase tracking-tight mb-2">Core Economy</h3>
                        <p className="text-xs font-bold opacity-80 leading-relaxed">
                            These values determine how many Credits are deducted from a user's balance when they trigger specific AI features.
                            <br /><br />
                            Avoid setting these too low to maintain profitability, or too high to prevent user churn.
                        </p>
                    </div>

                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 space-y-4">
                        <div className="flex items-center gap-3 text-zinc-900 mb-2">
                            <Info className="h-5 w-5 text-brand-blue" />
                            <h4 className="text-[11px] font-black uppercase tracking-widest">Pricing Strategy</h4>
                        </div>
                        <p className="text-[11px] font-medium text-zinc-400 leading-relaxed">
                            Currently, 1 credit is roughly equal to **$0.20 - $0.50** depending on the plan purchased.
                            <br /><br />
                            A CV Optimization costing **5 credits** costs the user approximately **$1.00 - $2.50**.
                        </p>
                    </div>
                </div>

                {/* Settings Editor */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Credit System Section */}
                    <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-zinc-900 uppercase">Feature Credit Costs</h2>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Autonomous Unit Deductions</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {creditSettings.map((setting) => (
                                <div key={setting.id} className="grid md:grid-cols-2 gap-6 items-center bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100/50 hover:border-zinc-200 transition-all">
                                    <div>
                                        <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">{setting.display_name}</p>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Deducted per execution</p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={editedSettings[setting.key] || ''}
                                            onChange={(e) => handleChange(setting.key, e.target.value)}
                                            className="w-full h-14 bg-white border border-zinc-100 rounded-2xl px-6 text-sm font-black text-brand-blue focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-brand-blue transition-all"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-300 uppercase">Credits</div>
                                    </div>
                                </div>
                            ))}

                            {creditSettings.length === 0 && (
                                <div className="text-center py-10 opacity-30">
                                    No credit settings found.
                                </div>
                            )}
                        </div>
                    </div>

                    {generalSettings.length > 0 && (
                        <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-sm">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-500">
                                    <Settings className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-zinc-900 uppercase">General System Config</h2>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Platform Specific Constants</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {generalSettings.map((setting) => (
                                    <div key={setting.id} className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">{setting.display_name}</label>
                                        <input
                                            type="text"
                                            value={editedSettings[setting.key] || ''}
                                            onChange={(e) => handleChange(setting.key, e.target.value)}
                                            className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-bold text-zinc-900 focus:outline-none focus:border-brand-blue transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
