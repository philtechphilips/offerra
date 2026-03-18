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
    Star
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
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [region, setRegion] = useState<"global" | "nigeria">("global");
    const [isLoading, setIsLoading] = useState(true);
    const [isDetecting, setIsDetecting] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [idempotencyKey, setIdempotencyKey] = useState<string>('');

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

    useEffect(() => {
        const status = searchParams.get('status') || searchParams.get('success');
        if (status === 'success' || status === 'true') {
            toast.success("Payment successful! Your plan has been updated.");
            refreshUser();
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [searchParams]);

    // ... (rest of the logic)

    // Find the current plan in the card
    const userCurrentPlan = user?.plan?.name || "Starter Pack";

    const handlePayment = async () => {
        if (!activePlan) return;

        setIsProcessing(true);
        // Use the stable idempotency key generated when the plan was selected
        try {
            const response = await api.post("/payments/initiate", {
                plan_id: activePlan.id,
                region: region
            }, {
                headers: {
                    'X-Idempotency-Key': idempotencyKey
                }
            });

            if (response.data.authorization_url) {
                window.location.href = response.data.authorization_url;
            } else if (response.data.status === 'success') {
                toast.success("Plan updated!");
                refreshUser();
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

    useEffect(() => {
        fetchPlans();

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

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        </div>
    );

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

                {/* Region Switcher Tabs */}
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
                {/* Left: Plan Selection */}
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

                    {/* Summary / Order Review */}
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
                                            Encrypted payments via {region === 'nigeria' ? 'Paystack' : 'Stripe'}. Your details are never stored on our servers.
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
                                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                            <>
                                                Complete Payment
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar / Info */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Active Plan Mini Card */}
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

                    {/* Payment methods */}
                    <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-10">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-8">Supported Methods</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 group hover:border-blue-200 transition-colors">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 opacity-40 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                            </div>
                            <div className="h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 group hover:border-blue-200 transition-colors">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Mastercard-logo.svg" alt="Mastercard" className="h-8 opacity-40 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                            </div>
                            <div className="h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 group hover:border-blue-200 transition-colors">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Stripe_logo%2C_revised_2016.svg" alt="Stripe" className="h-6 opacity-40 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                            </div>
                            <div className="h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 group hover:border-blue-200 transition-colors">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-4 opacity-40 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <p className="text-[11px] font-bold text-zinc-500">Verified Secure Checkout</p>
                        </div>
                    </div>

                    {/* FAQ Mini */}
                    <div className="rounded-[2.5rem] border border-zinc-100 bg-zinc-50/50 p-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Need Help?</p>
                        <div className="space-y-6">
                            {[
                                "Can I switch plans later?",
                                "What is the refund policy?",
                                "Can I pay annually?"
                            ].map((q) => (
                                <div key={q} className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-xs font-bold text-zinc-600 group-hover:text-blue-600 transition-colors">{q}</span>
                                    <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-blue-600 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
