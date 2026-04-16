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
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface Plan {
    id: string;
    name: string;
    description: string;
    price_usd: number;
    price_ngn: number;
    features: string[];
    is_popular: boolean;
    is_active: boolean;
    btn_text: string;
    credits: number;
    polar_product_id?: string;
    paystack_plan_id?: string;
}

export default function AdminBilling() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeletingPlan, setIsDeletingPlan] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ title: string; description: string; confirmLabel?: string; onConfirm: () => void } | null>(null);

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

    const doDeletePlan = async (id: string) => {
        setConfirmModal(null);
        setIsDeletingPlan(true);
        try {
            await api.delete(`/admin/plans/${id}`);
            toast.success("Plan deleted");
            fetchPlans();
        } catch (err) {
            toast.error("Failed to delete plan");
        } finally {
            setIsDeletingPlan(false);
        }
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            title: "Delete Plan",
            description: "Are you sure you want to delete this plan? This action cannot be undone.",
            confirmLabel: "Delete Plan",
            onConfirm: () => doDeletePlan(id),
        });
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
        <div className="flex items-center justify-center min-h-60">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Plan <span className="text-blue-600">Architecture</span></h1>
                    <p className="text-sm text-zinc-400 mt-0.5">Configure pricing tiers, regional costs, and feature sets.</p>
                </div>
                <button
                    onClick={() => setEditingPlan({
                        id: "",
                        name: "",
                        description: "",
                        price_usd: 0,
                        price_ngn: 0,
                        features: [],
                        is_popular: false,
                        is_active: true,
                        btn_text: "Buy Credits",
                        credits: 0,
                        polar_product_id: "",
                        paystack_plan_id: ""
                    })}
                    className="h-10 px-5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all"
                >
                    <Plus className="h-3.5 w-3.5" />
                    New Tier
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Plan Cards */}
                <div className="space-y-4">
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            layout
                            className={cn(
                                "group bg-white border rounded-2xl p-6 transition-all relative overflow-hidden",
                                plan.is_active ? "border-zinc-100" : "border-zinc-100 opacity-60 grayscale"
                            )}
                        >
                            {plan.is_popular && (
                                <div className="absolute top-5 right-5 h-7 px-3 bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest rounded-full flex items-center gap-1">
                                    <Star className="h-2.5 w-2.5 fill-current" />
                                    Popular
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tight mb-1">{plan.name}</h3>
                                        <p className="text-xs text-zinc-400 leading-relaxed">{plan.description}</p>
                                    </div>

                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-0.5">USD</p>
                                            <p className="text-xl font-black text-zinc-900">${plan.price_usd}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-0.5">NGN</p>
                                            <p className="text-xl font-black text-zinc-900">₦{Number(plan.price_ngn).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-0.5">Credits</p>
                                            <p className="text-xl font-black text-blue-600">{plan.credits}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between gap-4">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Features</p>
                                        {plan.features.slice(0, 3).map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-zinc-600">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                                                {f}
                                            </div>
                                        ))}
                                        {plan.features.length > 3 && (
                                            <p className="text-[10px] text-zinc-400">+{plan.features.length - 3} more</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingPlan(plan)}
                                            className="flex-1 h-9 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(plan)}
                                            className={cn(
                                                "h-9 w-9 rounded-xl border flex items-center justify-center transition-all",
                                                plan.is_active ? "border-emerald-100 bg-emerald-50 text-emerald-600" : "border-zinc-100 bg-zinc-50 text-zinc-400"
                                            )}
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(plan.id)}
                                            className="h-9 w-9 border border-red-50 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
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
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 16 }}
                                className="bg-white border border-zinc-100 rounded-2xl p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <CreditCard className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h4 className="text-sm font-black text-zinc-900">{editingPlan.id ? 'Edit' : 'New'} Plan</h4>
                                    </div>
                                    <button onClick={() => setEditingPlan(null)} className="h-8 w-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-50">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <form onSubmit={handleSave} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Plan Name</label>
                                            <input
                                                required
                                                value={editingPlan.name}
                                                onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                                className="w-full h-10 bg-zinc-50 border border-zinc-100 rounded-xl px-3 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-600 transition-all"
                                                placeholder="e.g. Pro Track"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Button Text</label>
                                            <input
                                                required
                                                value={editingPlan.btn_text}
                                                onChange={e => setEditingPlan({ ...editingPlan, btn_text: e.target.value })}
                                                className="w-full h-10 bg-zinc-50 border border-zinc-100 rounded-xl px-3 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-600 transition-all"
                                                placeholder="e.g. Go Pro"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label>
                                        <textarea
                                            required
                                            value={editingPlan.description}
                                            onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                                            className="w-full h-20 bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-600 transition-all resize-none"
                                            placeholder="Short value prop..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">AI Credits</label>
                                        <input
                                            type="number"
                                            required
                                            value={editingPlan.credits}
                                            onChange={e => setEditingPlan({ ...editingPlan, credits: Number(e.target.value) })}
                                            className="w-full h-10 bg-zinc-50 border border-zinc-100 rounded-xl px-3 text-sm font-bold text-zinc-900 focus:outline-none focus:border-blue-600 transition-all"
                                            placeholder="e.g. 50"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                                                <Globe className="h-3 w-3" /> Price (USD)
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={editingPlan.price_usd}
                                                onChange={e => setEditingPlan({ ...editingPlan, price_usd: Number(e.target.value) })}
                                                className="w-full h-10 bg-zinc-50 border border-zinc-100 rounded-xl px-3 text-sm font-bold text-zinc-900 focus:outline-none focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                🇳🇬 Price (NGN)
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={editingPlan.price_ngn}
                                                onChange={e => setEditingPlan({ ...editingPlan, price_ngn: Number(e.target.value) })}
                                                className="w-full h-10 bg-zinc-50 border border-zinc-100 rounded-xl px-3 text-sm font-bold text-zinc-900 focus:outline-none focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Features (one per line)</label>
                                        <textarea
                                            required
                                            value={editingPlan.features.join('\n')}
                                            onChange={e => setEditingPlan({ ...editingPlan, features: e.target.value.split('\n') })}
                                            className="w-full h-28 bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-600 transition-all resize-none"
                                            placeholder="Unlimited tracking&#10;AI Optimization&#10;Interview Practice"
                                        />
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div
                                            onClick={() => setEditingPlan({ ...editingPlan, is_popular: !editingPlan.is_popular })}
                                            className={cn(
                                                "h-5 w-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer",
                                                editingPlan.is_popular ? "bg-blue-600 border-blue-600" : "bg-white border-zinc-200"
                                            )}
                                        >
                                            <Check className={cn("h-3 w-3 text-white", editingPlan.is_popular ? "opacity-100" : "opacity-0")} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Mark as Popular</span>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full h-11 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 hover:bg-blue-700 transition-all disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                                        {editingPlan.id ? 'Save Changes' : 'Create Tier'}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <div className="border-2 border-dashed border-zinc-100 rounded-2xl flex flex-col items-center justify-center p-12 text-center min-h-64 opacity-40">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
                                    <Zap size={24} className="text-zinc-300" />
                                </div>
                                <p className="text-sm font-black text-zinc-900">Select a plan to edit</p>
                                <p className="text-xs text-zinc-400 mt-1">Or create a new tier above.</p>
                            </div>
                        )}
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
            isLoading={isDeletingPlan}
        />
        </>
    );
}
