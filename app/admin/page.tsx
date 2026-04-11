"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import {
    Users,
    Briefcase,
    TrendingUp,
    TrendingDown,
    Clock,
    Activity,
    Building2,
    DollarSign,
    PieChart as PieChartIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface Stats {
    total_users: number;
    total_jobs: number;
    recent_users_7d: number;
    active_users: number;
    total_revenue: number;
    monthly_revenue: number;
    growth: {
        users_30d: number;
        jobs_30d: number;
    };
}

interface Distribution {
    status: string;
    total: number;
}

interface Company {
    company: string;
    total: number;
}

interface PopularPlan {
    id: string;
    name: string;
    price_usd: number;
    credits: number;
    transactions_count: number;
}

interface DailyRevenue {
    date: string;
    total: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [distribution, setDistribution] = useState<Distribution[]>([]);
    const [topCompanies, setTopCompanies] = useState<Company[]>([]);
    const [popularPlans, setPopularPlans] = useState<PopularPlan[]>([]);
    const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/stats");
                setStats(response.data.stats);
                setDistribution(response.data.distribution);
                setTopCompanies(response.data.top_companies || []);
                setPopularPlans(response.data.popular_plans || []);
                setDailyRevenue(response.data.daily_revenue || []);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const statCards = [
        { label: "Total Revenue", value: stats?.total_revenue, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", prefix: "$" },
        { label: "Monthly Revenue", value: stats?.monthly_revenue, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", prefix: "$" },
        { label: "Total Users", value: stats?.total_users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Jobs", value: stats?.total_jobs, icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    const valueFormatter = (val: number | undefined, prefix?: string) => {
        if (val === undefined) return "0";
        return `${prefix || ""}${val.toLocaleString()}`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-zinc-900 tracking-tight">System <span className="text-blue-600">Overview</span></h1>
                <p className="text-sm text-zinc-400 mt-0.5">Real-time platform insights and growth analytics.</p>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white border border-zinc-100 rounded-2xl p-5 hover:shadow-sm transition-all"
                    >
                        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center mb-4", card.bg)}>
                            <card.icon className={cn("h-4 w-4", card.color)} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{card.label}</p>
                        <h3 className="text-2xl font-black text-zinc-900">{valueFormatter(card.value, card.prefix)}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Job Distribution by Status */}
                <div className="lg:col-span-12 xl:col-span-7 bg-white border border-zinc-100 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-zinc-50 flex items-center justify-center">
                                <PieChartIcon className="h-4 w-4 text-zinc-400" />
                            </div>
                            <h4 className="text-sm font-black text-zinc-900">Application Funnel</h4>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {distribution.map((item) => {
                            const percentage = Math.round((item.total / (stats?.total_jobs || 1)) * 100);
                            return (
                                <div key={item.status} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">{item.status}</span>
                                        <span className="text-xs font-black text-zinc-900">{item.total} ({percentage}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className="h-full bg-blue-600 rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Popular Plans */}
                <div className="lg:col-span-12 xl:col-span-5 bg-white border border-zinc-100 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-zinc-50 flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-zinc-400" />
                            </div>
                            <h4 className="text-sm font-black text-zinc-900">Popular Plans</h4>
                        </div>
                        <button
                            onClick={() => window.location.href = "/admin/billing"}
                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                            Manage
                        </button>
                    </div>

                    <div className="space-y-3">
                        {popularPlans.map((plan) => (
                            <div key={plan.id} className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-transparent hover:border-zinc-100 hover:bg-white transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 bg-white border border-zinc-100 rounded-xl flex items-center justify-center text-[10px] font-black text-emerald-600">
                                        ${plan.price_usd}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-zinc-900 uppercase truncate max-w-35">{plan.name}</p>
                                        <p className="text-[10px] font-bold text-zinc-400">{plan.credits} Credits</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-black text-zinc-900">{plan.transactions_count}</span>
                                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Sales</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Revenue Trend */}
            {dailyRevenue.length > 0 && (
                <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-zinc-50 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-zinc-400" />
                            </div>
                            <h4 className="text-sm font-black text-zinc-900">Revenue Velocity</h4>
                        </div>
                        <button
                            onClick={() => window.location.href = "/admin/billing"}
                            className="h-8 px-4 bg-zinc-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                        >
                            History
                        </button>
                    </div>

                    <div className="flex items-end gap-2 h-40">
                        {dailyRevenue.slice(-14).map((day) => {
                            const maxRev = Math.max(...dailyRevenue.map(d => d.total));
                            const height = (day.total / maxRev) * 100;
                            return (
                                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            className="w-full bg-blue-100 group-hover:bg-blue-600 rounded-t-lg transition-colors min-h-1"
                                        />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                            ${day.total}
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-zinc-300 uppercase rotate-45 mt-3">{day.date.split('-').slice(1).join('/')}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Growth Section */}
            <div className="bg-zinc-900 rounded-2xl p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={160} />
                </div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h4 className="text-lg font-black mb-2">Recent Growth</h4>
                        <p className="text-sm text-zinc-400 mb-6 max-w-sm">Platform engagement has increased this month. Monitor these metrics for system load.</p>
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
                                <Activity className="h-4 w-4 text-blue-400" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">System performance optimal</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">+30d Users</p>
                            <h5 className="text-3xl font-black">+{stats?.growth.users_30d}</h5>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">+30d Jobs</p>
                            <h5 className="text-3xl font-black">+{stats?.growth.jobs_30d}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
