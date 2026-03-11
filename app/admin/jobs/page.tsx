"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Building2,
    Globe,
    MapPin,
    Briefcase,
    Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface Distribution {
    status: string;
    total: number;
}

interface Company {
    company: string;
    total: number;
}

export default function JobAnalytics() {
    const [distribution, setDistribution] = useState<Distribution[]>([]);
    const [topCompanies, setTopCompanies] = useState<Company[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/stats");
                setStats(response.data.stats);
                setDistribution(response.data.distribution);
                setTopCompanies(response.data.top_companies);
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

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">Job <span className="text-indigo-600">Analytics.</span></h1>
                <p className="text-sm font-medium text-zinc-400 mt-1">Deep dive into market trends and user application patterns.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Detailed Status Breakdown */}
                <div className="bg-white border border-zinc-100 rounded-[3rem] p-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h4 className="text-xl font-black text-zinc-900 uppercase">Status Lifecycle</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {distribution.map((item, i) => (
                            <motion.div
                                key={item.status}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[2rem] bg-zinc-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-900/5 transition-all"
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">{item.status}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-zinc-900">{item.total}</span>
                                    <span className="text-xs font-bold text-zinc-400">Total</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Company Volume */}
                <div className="bg-white border border-zinc-100 rounded-[3rem] p-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <h4 className="text-xl font-black text-zinc-900 uppercase">Top Destinations</h4>
                    </div>

                    <div className="space-y-4">
                        {topCompanies.map((company, i) => {
                            const percentage = Math.round((company.total / (stats?.total_jobs || 1)) * 100);
                            return (
                                <div key={company.company} className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-emerald-600">0{i + 1}.</span>
                                            <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">{company.company}</span>
                                        </div>
                                        <span className="text-[11px] font-black text-zinc-400">{company.total} Hits</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Global Market Insight Mockup */}
            <div className="bg-zinc-900 rounded-[3rem] p-12 text-white overflow-hidden relative border border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Globe size={180} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-indigo-400" />
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tight">Market Expansion Insights</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Top Locations</span>
                            </div>
                            <div className="space-y-2">
                                {["Lagos, NG", "Remote", "London, UK", "New York, US"].map(loc => (
                                    <div key={loc} className="flex items-center justify-between text-sm font-bold opacity-80">
                                        <span>{loc}</span>
                                        <span className="text-xs text-indigo-400">Active</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Briefcase className="h-4 w-4 text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Job Types</span>
                            </div>
                            <div className="space-y-2">
                                {["Full-time", "Contract", "Freelance", "Part-time"].map(type => (
                                    <div key={type} className="flex items-center justify-between text-sm font-bold opacity-80">
                                        <span>{type}</span>
                                        <span className="text-xs text-emerald-400">Popular</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-indigo-600/20 border border-indigo-500/20 rounded-3xl p-8 flex flex-col justify-center">
                            <h5 className="text-xl font-black mb-2 uppercase italic text-indigo-300">Strategic Tip</h5>
                            <p className="text-sm font-medium text-indigo-100/80 leading-relaxed">
                                Users are migrating towards high-tech hubs and remote-first companies. Prioritize LinkedIn sync features for these regions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
