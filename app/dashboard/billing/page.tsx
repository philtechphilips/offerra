"use client";

import { motion } from "framer-motion";
import {
    CheckCircle2,
    CreditCard,
    ShieldCheck,
    Zap,
    Sparkles,
    Clock,
    ChevronRight,
    Lock,
    ArrowRight,
    Star,
    Rocket,
    Gift,
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/app/lib/utils";
import api from "@/app/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/authStore";
import { useSearchParams } from "next/navigation";

interface Plan {
    id: string;
    name: string;
    description: string;
    price_usd: number;
    price_ngn: number;
    credits: number;
    features: string[];
    not_included?: string[];
    is_popular: boolean;
    is_active: boolean;
    btn_text: string;
}

export default function BillingPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-10 w-10 text-blue-600 animate-spin" /></div>}>
            <BillingContent />
        </Suspense>
    );
}

function BillingContent() {
    const { user, setUser } = useAuthStore();
    const searchParams = useSearchParams();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [creditLogs, setCreditLogs] = useState<any[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [region, setRegion] = useState<"global" | "nigeria">("global");
    const [isLoading, setIsLoading] = useState(true);
    const [isDetecting, setIsDetecting] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [idempotencyKey, setIdempotencyKey] = useState<string>('');
    const [activeHistoryTab, setActiveHistoryTab] = useState<"payments" | "usage">("payments");
    const [isFreeMode, setIsFreeMode] = useState(false);
    const [billingStatusLoaded, setBillingStatusLoaded] = useState(false);

    useEffect(() => {
        setIdempotencyKey(`pay_${crypto.randomUUID()}`);
    }, [selectedPlanId]);

    const refreshUser = async () => {
        try {
            const response = await api.get("/user");
            setUser(response.data);
        } catch (err) {
            console.error("Failed to refresh user", err);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await api.get("/user/transactions");
            setTransactions(response.data.transactions || []);
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        }
    };

    const fetchCreditLogs = async () => {
        try {
            const response = await api.get("/user/credit-logs");
            setCreditLogs(response.data.logs || []);
        } catch (err) {
            console.error("Failed to fetch credit logs", err);
        }
    };

    useEffect(() => {
        const status = searchParams.get('status') || searchParams.get('success');
        if (status === 'success' || status === 'true') {
            toast.success("Payment successful! Your plan has been updated.");
            refreshUser();
            fetchTransactions();
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [searchParams]);

    useEffect(() => {
        if (activeHistoryTab === 'usage') {
            fetchCreditLogs();
        } else {
            fetchTransactions();
        }
    }, [activeHistoryTab]);

    const handlePayment = async () => {
        if (!activePlan) return;

        setIsProcessing(true);
        try {
            const response = await api.post("/payments/initiate", {
                plan_id: activePlan.id,
                region: region
            }, {
                headers: {
                    'X-Idempotency-Key': idempotencyKey
                }
            });

            if (response.data.status === 'disabled') {
                toast.info(response.data.message || "Offerra is fully free for now.");
                return;
            }

            if (response.data.authorization_url) {
                window.location.href = response.data.authorization_url;
            } else if (response.data.status === 'success') {
                toast.success("Plan updated!");
                refreshUser();
                fetchTransactions();
            } else {
                toast.error("Failed to get checkout URL");
            }
        } catch (err: any) {
            console.error("Payment failed", err);
            toast.error(err.response?.data?.error || "Payment initialization failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchPlans = async () => {
        try {
            const response = await api.get("/plans");
            setPlans(response.data);
            if (response.data.length > 0) {
                const pro = response.data.find((p: Plan) => p.name.includes("Pro") || p.is_popular);
                setSelectedPlanId(pro ? pro.id : response.data[0].id);
            }
        } catch (err) {
            console.error("Failed to fetch plans", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBillingStatus = async () => {
        try {
            const response = await api.get("/settings/billing-status");
            setIsFreeMode(!response.data?.billing_enabled);
        } catch (err) {
            console.error("Failed to fetch billing status", err);
        } finally {
            setBillingStatusLoaded(true);
        }
    };

    useEffect(() => {
        fetchPlans();
        fetchTransactions();
        fetchBillingStatus();

        const detectLocation = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                if (data.country_code === 'NG') {
                    setRegion("nigeria");
                }
            } catch (err) {
                console.error("Location detection failed", err);
            } finally {
                setIsDetecting(false);
            }
        };
        detectLocation();
    }, []);

    const activePlan = plans.find(p => p.id === selectedPlanId);
    const getPrice = (plan: Plan) => region === "nigeria" ? plan.price_ngn : plan.price_usd;
    const getSymbol = () => region === "nigeria" ? "₦" : "$";

    if (isLoading || !billingStatusLoaded) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        </div>
    );

    if (isFreeMode) {
        return (
            <div className="space-y-10 pb-20">
                <header>
                    <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                            Free Mode Active
                        </span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-brand-blue-black uppercase">
                        Plans & Billing <span className="text-blue-600">— Coming Soon.</span>
                    </h1>
                    <p className="mt-2 text-sm font-medium text-zinc-400 max-w-xl">
                        We're polishing the billing experience. While we're at it, every Offerra feature is fully free for you — no credits, no caps, no card needed.
                    </p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-[2.5rem] border border-zinc-100 bg-white p-10 md:p-14 overflow-hidden"
                >
                    <div className="absolute -top-20 -right-20 h-64 w-64 bg-blue-100/40 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-emerald-100/40 rounded-full blur-[80px]" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-7 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200">
                                    <Rocket className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">In the works</p>
                                    <h2 className="text-2xl font-black tracking-tight text-zinc-900 mt-1">Pricing is taking a short break</h2>
                                </div>
                            </div>

                            <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                                Paid plans, top-ups, and AI credits are temporarily disabled while we rebuild the experience. There is nothing for you to do — just keep using Offerra. We'll let you know when plans go live again.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { icon: Sparkles, title: "Unlimited AI features", desc: "CV match, autofill, cover letters, prep — all unlocked." },
                                    { icon: Gift, title: "No credits required", desc: "Use everything without spending a single credit." },
                                    { icon: ShieldCheck, title: "No card on file", desc: "Nothing is being charged. We promise." },
                                    { icon: Clock, title: "We'll keep you posted", desc: "You'll see a heads-up here before billing returns." },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                        <div className="h-9 w-9 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shrink-0">
                                            <item.icon className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-zinc-900 tracking-tight">{item.title}</p>
                                            <p className="text-[11px] font-medium text-zinc-500 mt-1 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="rounded-[2rem] bg-zinc-900 p-8 text-white relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Star size={80} className="fill-current" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Your account</p>
                                <h4 className="text-3xl font-black tracking-tight mb-2">Free Tier</h4>
                                <p className="text-xs font-medium text-white/60 leading-relaxed mb-8">
                                    Hi {user?.name?.split(' ')[0] || 'there'} — your account is on the house while plans are paused.
                                </p>

                                <div className="space-y-3 mb-8">
                                    {[
                                        "Track unlimited applications",
                                        "AI status detection",
                                        "CV match & rewrites",
                                        "Cover letter & interview prep",
                                    ].map((feature) => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                            <span className="text-xs font-bold text-white/90">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/10 text-emerald-400">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Powering your search</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-brand-blue-black uppercase">
                        AI Credits <span className="text-blue-600">& Top-ups.</span>
                    </h1>
                    <p className="mt-2 text-sm font-medium text-zinc-400">
                        Purchase credits to power your job search. Use credits for AI status detection and CV optimizations.
                    </p>
                </div>

                <div className="flex bg-zinc-100 p-1 rounded-2xl border border-zinc-200 shadow-inner">
                    <button
                        onClick={() => setRegion("nigeria")}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            region === "nigeria"
                                ? "bg-white text-blue-600 shadow-sm border border-zinc-200/50"
                                : "text-zinc-400 hover:text-zinc-600"
                        )}
                    >
                        🇳🇬 Nigeria
                    </button>
                    <button
                        onClick={() => setRegion("global")}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            region === "global"
                                ? "bg-white text-blue-600 shadow-sm border border-zinc-200/50"
                                : "text-zinc-400 hover:text-zinc-600"
                        )}
                    >
                        🌐 Global
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <motion.div
                                key={plan.name}
                                whileHover={{ y: -5 }}
                                className={cn(
                                    "relative rounded-[2.5rem] border p-8 flex flex-col transition-all cursor-pointer",
                                    selectedPlanId === plan.id
                                        ? "border-blue-600 bg-white ring-4 ring-blue-50/50 shadow-2xl shadow-blue-100"
                                        : "border-zinc-100 bg-white hover:border-blue-200"
                                )}
                                onClick={() => setSelectedPlanId(plan.id)}
                            >
                                {plan.is_popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                                        Best Value
                                    </div>
                                )}

                                <div className="mb-8">
                                    <p className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.2em] mb-4",
                                        selectedPlanId === plan.id ? "text-blue-600" : "text-zinc-400"
                                    )}>
                                        {plan.name}
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-zinc-900">{getSymbol()}{Number(getPrice(plan)).toLocaleString()}</span>
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{plan.credits} Credits</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <CheckCircle2 className={cn(
                                                "h-4 w-4 shrink-0",
                                                selectedPlanId === plan.id ? "text-blue-600" : "text-emerald-500"
                                            )} />
                                            <span className="text-[11px] font-bold text-zinc-700 leading-tight">{feature}</span>
                                        </li>
                                    ))}
                                    {plan.not_included?.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 opacity-30">
                                            <div className="h-1 w-1 rounded-full bg-zinc-400 ml-1.5 mr-1" />
                                            <span className="text-[11px] font-bold text-zinc-400 leading-tight">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-10 opacity-5 -z-10 rotate-12">
                            <CreditCard size={200} />
                        </div>
                        <div className="flex flex-col md:flex-row gap-12">
                            <div className="flex-grow">
                                <h3 className="text-2xl font-black text-zinc-900 mb-6">Order Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-4 border-b border-zinc-50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                                <Sparkles className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-zinc-900">{activePlan?.name || "Selected"} Pack</p>
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{activePlan?.credits || 0} Credits Included</p>
                                            </div>
                                        </div>
                                        <span className="text-lg font-black text-zinc-900">
                                            {activePlan ? `${getSymbol()}${Number(getPrice(activePlan)).toLocaleString()}` : '...'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-zinc-400">
                                        <span className="text-[11px] font-black uppercase tracking-widest">Processing Fee</span>
                                        <span className="text-xs font-black">{getSymbol()}0.00</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                        <span className="text-base font-black text-zinc-900 uppercase tracking-widest">Total to Pay</span>
                                        <span className="text-3xl font-black text-blue-600">
                                            {activePlan ? `${getSymbol()}${Number(getPrice(activePlan)).toLocaleString()}` : '...'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-80 shrink-0 bg-zinc-50 p-8 rounded-[2rem]">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Security Check</h4>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                                        <p className="text-[11px] font-bold text-zinc-500 leading-relaxed">
                                            Encrypted payments via {region === 'nigeria' ? 'Paystack' : 'Stripe/Polar'}. Your details are never stored on our servers.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-zinc-400 shrink-0" />
                                        <p className="text-[11px] font-bold text-zinc-500 leading-relaxed">
                                            Credits never expire. Use them whenever you need an edge in your job hunt.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handlePayment}
                                        disabled={isProcessing || !activePlan}
                                        className="w-full h-14 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black shadow-xl shadow-zinc-200 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Complete Payment"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <h3 className="text-2xl font-black text-zinc-900">Activity History</h3>
                            <div className="flex bg-zinc-50 p-1 rounded-xl border border-zinc-100">
                                <button
                                    onClick={() => setActiveHistoryTab("payments")}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                        activeHistoryTab === "payments" ? "bg-white text-blue-600 shadow-sm border border-zinc-100" : "text-zinc-400"
                                    )}
                                >
                                    Payments
                                </button>
                                <button
                                    onClick={() => setActiveHistoryTab("usage")}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                        activeHistoryTab === "usage" ? "bg-white text-blue-600 shadow-sm border border-zinc-100" : "text-zinc-400"
                                    )}
                                >
                                    AI Usage
                                </button>
                            </div>
                        </div>

                        {activeHistoryTab === 'payments' ? (
                            <div className="overflow-x-auto">
                                {transactions.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-zinc-50">
                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</th>
                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</th>
                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Amount</th>
                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Reference</th>
                                                <th className="pb-4 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-50 font-bold">
                                            {transactions.map((tx) => (
                                                <tr key={tx.id} className="group">
                                                    <td className="py-5 text-xs text-zinc-900 whitespace-nowrap">
                                                        {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td className="py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-zinc-900">{tx.plan?.name || "Credits Top-up"}</span>
                                                            <span className="text-[9px] text-zinc-400 uppercase tracking-tight">{tx.provider}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 text-xs text-zinc-900">
                                                        {tx.currency} {Number(tx.amount).toLocaleString()}
                                                    </td>
                                                    <td className="py-5">
                                                        <code className="text-[10px] text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md">{tx.reference.substring(0, 8)}...</code>
                                                    </td>
                                                    <td className="py-5 text-right">
                                                        <span className={cn(
                                                            "text-[9px] uppercase tracking-widest px-3 py-1 rounded-full",
                                                            tx.status === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                                        )}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-20 text-center">
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No payment history found</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                {creditLogs.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-zinc-50">
                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date/Time</th>
                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Action</th>
                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Credits</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-50 font-bold">
                                            {creditLogs.map((log) => (
                                                <tr key={log.id} className="group">
                                                    <td className="py-5 text-xs text-zinc-400 whitespace-nowrap">
                                                        {new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        <span className="ml-2 opacity-50 text-[10px]">
                                                            {new Date(log.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </td>
                                                    <td className="py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-zinc-900">{log.description || "Credit Change"}</span>
                                                            <span className={cn(
                                                                "text-[9px] uppercase tracking-widest",
                                                                log.type === 'top-up' ? "text-emerald-500" : "text-zinc-400"
                                                            )}>
                                                                {log.type}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 text-right">
                                                        <span className={cn(
                                                            "text-sm font-black",
                                                            log.amount > 0 ? "text-emerald-500" : "text-red-500"
                                                        )}>
                                                            {log.amount > 0 ? `+${log.amount}` : log.amount}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-20 text-center">
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No AI usage logged yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Sidebar / Info */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="rounded-[2.5rem] bg-zinc-900 p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Star size={80} className="fill-current" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Authenticated Account</p>
                        <h4 className="text-2xl font-black tracking-tight mb-8">Balance: {user?.credits || 0}</h4>
                        <div className="space-y-4 mb-10">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">AI Usage</span>
                                <span className="text-[10px] font-bold text-white/80 uppercase">
                                    {user?.credits || 0} Credits Left
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className={cn(
                                    "h-full bg-blue-500 transition-all duration-1000",
                                    (user?.credits || 0) > 0 ? "w-full" : "w-0"
                                )} />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-400">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Powering your search</span>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-10">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-8">Supported Methods</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 group hover:border-blue-200 transition-colors">
                                <img src="https://cdn.simpleicons.org/mastercard" alt="Mastercard" className="h-6 opacity-50 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                            </div>
                            <div className="h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 group hover:border-blue-200 transition-colors">
                                <img src="https://cdn.simpleicons.org/stripe" alt="Stripe" className="h-6 opacity-50 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                            </div>
                            <div className="h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 group hover:border-blue-200 transition-colors">
                                <img src="https://cdn.simpleicons.org/visa" alt="Visa" className="h-5 opacity-50 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                            </div>
                            <div className="h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 group hover:border-blue-200 transition-colors">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">+ More</span>
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <p className="text-[11px] font-bold text-zinc-500">Verified Secure Checkout</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
