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
            <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const statCards = [
        { label: "Total Revenue", value: stats?.total_revenue, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", prefix: "$" },
        { label: "Monthly Revenue", value: stats?.monthly_revenue, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", prefix: "$" },
        { label: "Total Users", value: stats?.total_users, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Total Jobs", value: stats?.total_jobs, icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    const valueFormatter = (val: number | undefined, prefix?: string) => {
        if (val === undefined) return "0";
        return `${prefix || ""}${val.toLocaleString()}`;
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">System <span className="text-indigo-600">Overview.</span></h1>
                <p className="text-sm font-medium text-zinc-400 mt-1">Real-time platform insights and growth analytics.</p>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all border-b-4 border-b-transparent hover:border-b-indigo-500"
                    >
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6", card.bg)}>
                            <card.icon className={cn("h-7 w-7", card.color)} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{card.label}</p>
                        <h3 className="text-4xl font-black text-zinc-900">{valueFormatter(card.value, card.prefix)}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Job Distribution by Status */}
                <div className="lg:col-span-12 xl:col-span-7 bg-white border border-zinc-100 rounded-[3rem] p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center">
                                <PieChartIcon className="h-6 w-6 text-zinc-400" />
                            </div>
                            <h4 className="text-xl font-black text-zinc-900 uppercase">Application Funnel</h4>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {distribution.map((item) => {
                            const percentage = Math.round((item.total / (stats?.total_jobs || 1)) * 100);
                            return (
                                <div key={item.status} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">{item.status}</span>
                                        <span className="text-xs font-black text-zinc-900">{item.total} applications ({percentage}%)</span>
                                    </div>
                                    <div className="h-3 w-full bg-zinc-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className="h-full bg-indigo-600 rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Popular Plans */}
                <div className="lg:col-span-12 xl:col-span-5 bg-white border border-zinc-100 rounded-[3rem] p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-zinc-400" />
                            </div>
                            <h4 className="text-xl font-black text-zinc-900 uppercase">Popular Plans</h4>
                        </div>
                        <button 
                            onClick={() => window.location.href = "/admin/billing"}
                            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                        >
                            Manage
                        </button>
                    </div>

                    <div className="space-y-4">
                        {popularPlans.map((plan, i) => (
                            <div key={plan.id} className="flex items-center justify-between p-5 bg-zinc-50/50 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-white transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-white border border-zinc-100 rounded-xl flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-sm">
                                        ${plan.price_usd}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-zinc-900 uppercase truncate max-w-[150px]">{plan.name}</p>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mt-1">
                                            {plan.credits} Credits per Pack
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-black text-zinc-900">{plan.transactions_count}</span>
                                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Sales</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Revenue Trend (Simple visualization) */}
            {dailyRevenue.length > 0 && (
                <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 mt-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-zinc-400" />
                            </div>
                            <h4 className="text-xl font-black text-zinc-900 uppercase">Revenue Velocity</h4>
                        </div>
                        <button 
                            onClick={() => window.location.href = "/admin/billing"} // To be updated to transactions page
                            className="bg-zinc-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                        >
                            History
                        </button>
                    </div>

                    <div className="flex items-end gap-2 h-48">
                        {dailyRevenue.slice(-14).map((day, i) => {
                            const maxRev = Math.max(...dailyRevenue.map(d => d.total));
                            const height = (day.total / maxRev) * 100;
                            return (
                                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full">
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            className="w-full bg-indigo-100 group-hover:bg-indigo-600 rounded-t-lg transition-colors min-h-[4px]"
                                        />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                            ${day.total}
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-zinc-300 uppercase rotate-45 mt-4">{day.date.split('-').slice(1).join('/')}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Growth Section */}
            <div className="bg-indigo-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <TrendingUp size={200} />
                </div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h4 className="text-3xl font-black mb-4 uppercase tracking-tight">Recent Growth</h4>
                        <p className="text-indigo-100 mb-8 max-w-sm font-medium">Platform engagement velocity has increased this month. Monitor these metrics for system load.</p>
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Activity className="h-8 w-8 text-indigo-300" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-200">System performance optimal</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">+30 Days Users</p>
                            <h5 className="text-4xl font-black">+{stats?.growth.users_30d}</h5>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">+30 Days Jobs</p>
                            <h5 className="text-4xl font-black">+{stats?.growth.jobs_30d}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
