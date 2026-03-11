"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import {
    CreditCard,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    Zap,
    Star,
    Shield,
    Globe,
    ArrowRight,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";

interface Plan {
    id: number;
    name: string;
    description: string;
    price_usd: number;
    price_ngn: number;
    features: string[];
    is_popular: boolean;
    is_active: boolean;
    btn_text: string;
    polar_product_id?: string;
    paystack_plan_id?: string;
}

export default function AdminBilling() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/plans");
            setPlans(response.data);
        } catch (err) {
            console.error("Failed to fetch plans", err);
            toast.error("Error loading plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlan) return;

        setIsSaving(true);
        try {
            if (editingPlan.id) {
                await api.put(`/admin/plans/${editingPlan.id}`, editingPlan);
                toast.success("Plan updated successfully");
            } else {
                await api.post("/admin/plans", editingPlan);
                toast.success("Plan created successfully");
            }
            fetchPlans();
            setEditingPlan(null);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save plan");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this plan?")) return;
        try {
            await api.delete(`/admin/plans/${id}`);
            toast.success("Plan deleted");
            fetchPlans();
        } catch (err) {
            toast.error("Failed to delete plan");
        }
    };

    const toggleStatus = async (plan: Plan) => {
        try {
            await api.put(`/admin/plans/${plan.id}`, { is_active: !plan.is_active });
            setPlans(plans.map(p => p.id === plan.id ? { ...p, is_active: !p.is_active } : p));
            toast.success(`Plan ${!plan.is_active ? 'activated' : 'deactivated'}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">Plan <span className="text-indigo-600">Architecture.</span></h1>
                    <p className="text-sm font-medium text-zinc-400 mt-1">Configure pricing tiers, regional costs, and feature sets.</p>
                </div>
                <button
                    onClick={() => setEditingPlan({
                        id: 0,
                        name: "",
                        description: "",
                        price_usd: 0,
                        price_ngn: 0,
                        features: [],
                        is_popular: false,
                        is_active: true,
                        btn_text: "Subscribe",
                        polar_product_id: "",
                        paystack_plan_id: ""
                    })}
                    className="h-14 px-8 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                    <Plus className="h-4 w-4" />
                    New Tier
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Plan Cards */}
                <div className="space-y-6">
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            layout
                            className={cn(
                                "group bg-white border rounded-[3rem] p-10 transition-all relative overflow-hidden",
                                plan.is_active ? "border-zinc-100 shadow-sm" : "border-zinc-100 opacity-60 grayscale"
                            )}
                        >
                            {plan.is_popular && (
                                <div className="absolute top-8 right-8 h-8 px-4 bg-indigo-600 text-[10px] font-black text-white uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg shadow-indigo-100">
                                    <Star className="h-3 w-3 fill-current" />
                                    Popular
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tight mb-2">{plan.name}</h3>
                                        <p className="text-sm text-zinc-400 font-medium leading-relaxed">{plan.description}</p>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">Global Cost</p>
                                            <p className="text-2xl font-black text-zinc-900">${plan.price_usd}<span className="text-xs text-zinc-400 font-bold">/mo</span></p>
                                        </div>
                                        <div className="h-8 w-px bg-zinc-100" />
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">Nigeria Cost</p>
                                            <p className="text-2xl font-black text-zinc-900">₦{Number(plan.price_ngn).toLocaleString()}<span className="text-xs text-zinc-400 font-bold">/mo</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between gap-8">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-3">Core Value</p>
                                        {plan.features.slice(0, 3).map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-zinc-600">
                                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                                {f}
                                            </div>
                                        ))}
                                        {plan.features.length > 3 && (
                                            <p className="text-[10px] font-bold text-zinc-400">+{plan.features.length - 3} more features</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setEditingPlan(plan)}
                                            className="flex-1 h-12 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all group/btn"
                                        >
                                            <Edit2 className="h-3 w-3 group-hover/btn:scale-110 transition-transform" />
                                            Edit Architecture
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(plan)}
                                            className={cn(
                                                "h-12 w-12 rounded-2xl border flex items-center justify-center transition-all",
                                                plan.is_active ? "border-emerald-100 bg-emerald-50 text-emerald-600" : "border-zinc-100 bg-zinc-50 text-zinc-400"
                                            )}
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(plan.id)}
                                            className="h-12 w-12 border border-red-50 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Editor Sidebar */}
                <div className="xl:sticky xl:top-6 h-fit">
                    <AnimatePresence mode="wait">
                        {editingPlan ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-2xl shadow-indigo-900/5"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <h4 className="text-xl font-black text-zinc-900 uppercase">{editingPlan.id ? 'Edit' : 'Configure'} Plan</h4>
                                    </div>
                                    <button onClick={() => setEditingPlan(null)} className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSave} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">Plan Name</label>
                                                <input
                                                    required
                                                    value={editingPlan.name}
                                                    onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all"
                                                    placeholder="e.g. Pro Track"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">Button Text</label>
                                                <input
                                                    required
                                                    value={editingPlan.btn_text}
                                                    onChange={e => setEditingPlan({ ...editingPlan, btn_text: e.target.value })}
                                                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all"
                                                    placeholder="e.g. Go Pro"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">Tagline (Description)</label>
                                            <textarea
                                                required
                                                value={editingPlan.description}
                                                onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                                                className="w-full h-24 bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all resize-none"
                                                placeholder="Short, punchy value prop..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2 flex items-center gap-2">
                                                    <Globe className="h-3 w-3" /> Price (USD)
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={editingPlan.price_usd}
                                                    onChange={e => setEditingPlan({ ...editingPlan, price_usd: Number(e.target.value) })}
                                                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-bold text-zinc-900"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2 flex items-center gap-2">
                                                    🇳🇬 Price (NGN)
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={editingPlan.price_ngn}
                                                    onChange={e => setEditingPlan({ ...editingPlan, price_ngn: Number(e.target.value) })}
                                                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-bold text-zinc-900"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2 flex items-center gap-2">
                                                    Polar Product ID (USD)
                                                </label>
                                                <input
                                                    value={editingPlan.polar_product_id || ""}
                                                    onChange={e => setEditingPlan({ ...editingPlan, polar_product_id: e.target.value })}
                                                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-bold text-zinc-900 focus:outline-none focus:border-indigo-600 transition-all"
                                                    placeholder="e.g. prod_..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2 flex items-center gap-2">
                                                    Paystack Plan ID (NGN)
                                                </label>
                                                <input
                                                    value={editingPlan.paystack_plan_id || ""}
                                                    onChange={e => setEditingPlan({ ...editingPlan, paystack_plan_id: e.target.value })}
                                                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-bold text-zinc-900 focus:outline-none focus:border-indigo-600 transition-all"
                                                    placeholder="e.g. PLN_..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">Key Features (One per line)</label>
                                            <textarea
                                                required
                                                value={editingPlan.features.join('\n')}
                                                onChange={e => setEditingPlan({ ...editingPlan, features: e.target.value.split('\n') })}
                                                className="w-full h-32 bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all resize-none"
                                                placeholder="Unlimited tracking&#10;AI Optimization&#10;Interview Practice"
                                            />
                                        </div>

                                        <div className="flex items-center gap-6 pt-4 px-2">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={editingPlan.is_popular}
                                                    onChange={e => setEditingPlan({ ...editingPlan, is_popular: e.target.checked })}
                                                    className="w-6 h-6 rounded-lg border-zinc-200 text-indigo-600 focus:ring-indigo-600 hidden"
                                                />
                                                <div className={cn(
                                                    "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                                    editingPlan.is_popular ? "bg-indigo-600 border-indigo-600" : "bg-white border-zinc-100"
                                                )}>
                                                    <Check className={cn("h-4 w-4 text-white", editingPlan.is_popular ? "opacity-100" : "opacity-0")} />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-indigo-600 transition-colors">Mark as Popular</span>
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full h-16 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-zinc-200 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                                        {editingPlan.id ? 'Push Updates' : 'Launch Tier'}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-zinc-100 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center opacity-40">
                                <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center mb-6">
                                    <Zap size={32} className="text-zinc-300" />
                                </div>
                                <h5 className="text-xl font-black text-zinc-900 uppercase">Configuration Logic</h5>
                                <p className="text-sm font-medium text-zinc-400 mt-2">Select a plan to edit its architecture or create a new tier to expand your offering.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
