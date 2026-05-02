"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import {
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
                const data = response.data ?? {};
                setStats(data.stats ?? null);
                setDistribution(Array.isArray(data.distribution) ? data.distribution : []);
                setTopCompanies(Array.isArray(data.top_companies) ? data.top_companies : []);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-60">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Job <span className="text-blue-600">Analytics</span></h1>
                <p className="text-sm text-zinc-400 mt-0.5">Deep dive into market trends and user application patterns.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Breakdown */}
                <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-blue-600" />
                        </div>
                        <h4 className="text-sm font-black text-zinc-900">Status Lifecycle</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {distribution.map((item, i) => (
                            <motion.div
                                key={item.status}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.06 }}
                                className="p-4 rounded-xl bg-zinc-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-sm transition-all"
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{item.status}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black text-zinc-900">{item.total}</span>
                                    <span className="text-xs font-bold text-zinc-400">total</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Company Volume */}
                <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-emerald-600" />
                        </div>
                        <h4 className="text-sm font-black text-zinc-900">Top Destinations</h4>
                    </div>

                    <div className="space-y-4">
                        {topCompanies.map((company, i) => {
                            const percentage = Math.round((company.total / (stats?.total_jobs || 1)) * 100);
                            return (
                                <div key={company.company} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-emerald-600">0{i + 1}.</span>
                                            <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">{company.company}</span>
                                        </div>
                                        <span className="text-[11px] font-black text-zinc-400">{company.total} hits</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className="h-full bg-emerald-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Market Insights */}
            <div className="bg-zinc-900 rounded-2xl p-6 text-white overflow-hidden relative border border-white/5">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Globe size={140} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-blue-400" />
                        </div>
                        <h4 className="text-base font-black">Market Expansion Insights</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Top Locations</span>
                            </div>
                            <div className="space-y-2">
                                {["Lagos, NG", "Remote", "London, UK", "New York, US"].map(loc => (
                                    <div key={loc} className="flex items-center justify-between text-xs font-bold text-zinc-300">
                                        <span>{loc}</span>
                                        <span className="text-[10px] text-blue-400">Active</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Job Types</span>
                            </div>
                            <div className="space-y-2">
                                {["Full-time", "Contract", "Freelance", "Part-time"].map(type => (
                                    <div key={type} className="flex items-center justify-between text-xs font-bold text-zinc-300">
                                        <span>{type}</span>
                                        <span className="text-[10px] text-emerald-400">Popular</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-600/20 border border-blue-500/20 rounded-2xl p-5 flex flex-col justify-center">
                            <h5 className="text-sm font-black mb-2 text-blue-300">Strategic Tip</h5>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Users are migrating towards high-tech hubs and remote-first companies. Prioritize LinkedIn sync features for these regions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
