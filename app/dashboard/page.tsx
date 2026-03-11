"use client";

import { motion } from "framer-motion";
import {
    Briefcase,
    Clock,
    Sparkles,
    TrendingUp,
    CheckCircle2,
    ArrowUpRight,
    ExternalLink,
    Calendar,
    Zap,
    MoreVertical,
    Search,
    MapPin,
    DollarSign
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/app/store/authStore";
import { useJobStore } from "@/app/store/jobStore";

export default function DashboardPage() {
    const { user, isLoggedIn, token, _hasHydrated } = useAuthStore();
    const { jobs, fetchJobs, isLoading } = useJobStore();
    const router = useRouter();
    const [userName, setUserName] = useState("Pro User");

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!isLoggedIn || !token) {
            router.push("/login");
            return;
        }
        fetchJobs();
        if (user) {
            setUserName(user.name.split(' ')[0]);
        }
    }, [isLoggedIn, token, user, router, _hasHydrated, fetchJobs]);

    // Derive real data from store
    const recentApplications = useMemo(() => {
        return jobs.slice(0, 5).map(job => ({
            id: job.id,
            company: job.company,
            role: job.title,
            status: job.status,
            time: new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            bg: job.status === 'offer' ? 'bg-emerald-50' :
                job.status === 'interview' ? 'bg-amber-50' :
                    job.status === 'rejected' ? 'bg-red-50' : 'bg-blue-50',
            color: job.status === 'offer' ? 'text-emerald-600' :
                job.status === 'interview' ? 'text-amber-600' :
                    job.status === 'rejected' ? 'text-red-600' : 'text-blue-600',
        }));
    }, [jobs]);

    // Stats calculation
    const totalApplied = jobs.length;
    const interviews = jobs.filter(j => j.status === 'interview').length;
    const offers = jobs.filter(j => j.status === 'offer').length;
    const offerRate = totalApplied > 0 ? ((offers / totalApplied) * 100).toFixed(0) : "0";
    const activePipeline = jobs.filter(j => j.status !== 'rejected').length;

    const dynamicStats = [
        { label: 'Total Tracked', val: totalApplied.toString(), icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50", path: '/dashboard/applications' },
        { label: 'Interviews', val: interviews.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-50", path: '/dashboard/interviews' },
        { label: 'Offer Rate', val: `${offerRate}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50", path: '/dashboard/applications?status=offer' },
        { label: 'Active Pipeline', val: activePipeline.toString(), icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50", path: '/dashboard/applications' },
    ];

    const pipelineStages = [
        { label: 'Applied', count: jobs.filter(j => j.status === 'applied').length, color: 'bg-blue-500' },
        { label: 'Interview', count: jobs.filter(j => j.status === 'interview').length, color: 'bg-amber-500' },
        { label: 'Offers', count: jobs.filter(j => j.status === 'offer').length, color: 'bg-emerald-500' },
    ];

    // Simple dynamic AI Insight logic
    const aiTips = [
        {
            condition: interviews > 0,
            text: `You have ${interviews} interviews coming up. We recommend practicing common STAR method questions today.`,
            tag: "Preparation"
        },
        {
            condition: totalApplied < 5,
            text: "Your pipeline is looking a bit thin. Try to aim for 3 more applications this week to stay competitive.",
            tag: "Strategy"
        },
        {
            condition: offerRate === "0" && totalApplied > 10,
            text: "Based on your application volume, we suggest refining your CV match for higher engagement.",
            tag: "CV Audit"
        },
        {
            condition: true, // Default
            text: "OpenAI and Anthropic just posted new roles in your industry. Applying early increases response rates by 40%.",
            tag: "Market Alert"
        }
    ];
    const currentTip = aiTips.find(t => t.condition) || aiTips[aiTips.length - 1];

    if (!isLoggedIn || !token) return null;

    return (
        <div className="space-y-10 relative overflow-x-clip pb-10">
            {/* Subtle Page Accents */}
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] bg-blue-50/20 rounded-full blur-[120px] -z-10" />

            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tight text-brand-blue-black"
                    >
                        Success <span className="text-blue-600">Overview.</span>
                    </motion.h1>
                    <p className="mt-2 text-sm font-medium text-zinc-400">
                        Welcome back, <span className="text-brand-blue font-bold">{userName}</span>. You've secured <span className="text-brand-blue-dark font-bold">{interviews} interviews</span> in your active pipeline.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => router.push('/dashboard/applications')} className="btn-secondary px-5 py-2.5">
                        View Pipeline
                    </button>
                    <button onClick={() => router.push('/dashboard/applications?new=true')} className="btn-primary py-2.5 px-6">
                        Add New Job
                        <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    </button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {dynamicStats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => router.push(stat.path)}
                        className="group relative bg-white border border-zinc-100 p-6 rounded-3xl hover:border-blue-200 transition-all flex flex-col justify-between cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center bg-zinc-50 border border-zinc-50 group-hover:scale-110 transition-transform", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div className="h-6 w-6 rounded-full flex items-center justify-center text-zinc-300 group-hover:text-brand-blue transition-colors">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">{stat.label}</span>
                            <div className="text-3xl font-black tracking-tight text-brand-blue-black">{stat.val}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Pipeline Strength & Recent Apps */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-black tracking-tight text-brand-blue-black uppercase text-[12px] tracking-widest text-zinc-400">Recent Pipeline</h2>
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <button
                                onClick={() => router.push('/dashboard/applications')}
                                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-brand-blue transition-colors"
                            >
                                View All
                            </button>
                        </div>

                        <div className="rounded-3xl border border-zinc-100 bg-white overflow-hidden p-1">
                            {recentApplications.length > 0 ? (
                                <div className="divide-y divide-zinc-50">
                                    {recentApplications.map((app, idx) => (
                                        <motion.div
                                            key={app.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + (idx * 0.05) }}
                                            className="group flex items-center justify-between p-5 rounded-2xl transition-all hover:bg-zinc-50/50 cursor-pointer"
                                            onClick={() => router.push(`/dashboard/applications/${app.id}`)}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-50 to-white border border-zinc-100 text-sm font-black text-brand-blue-dark group-hover:border-blue-200 transition-all">
                                                    {app.company[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-brand-blue-black tracking-tight">{app.company}</div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{app.role}</span>
                                                        <div className="h-0.5 w-0.5 rounded-full bg-zinc-200" />
                                                        <span className="text-[10px] font-medium text-zinc-300 uppercase tracking-widest">{app.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className={cn("rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest", app.bg, app.color)}>
                                                    {app.status}
                                                </div>
                                                <MoreVertical className="h-4 w-4 text-zinc-200 group-hover:text-zinc-400" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4">
                                        <Briefcase className="h-6 w-6 text-zinc-300" />
                                    </div>
                                    <p className="text-sm font-medium text-zinc-400">No applications tracked yet.</p>
                                    <button onClick={() => router.push('/dashboard/applications?new=true')} className="mt-4 text-xs font-black text-brand-blue uppercase tracking-widest">Add your first job</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Strategic Insight - Refined & Dense */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-3xl bg-brand-blue-black text-white relative overflow-hidden group border border-white/5"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                            <Sparkles className="h-40 w-40 text-blue-500" />
                        </div>
                        <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-blue-600/10 rounded-full blur-[100px]" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-black uppercase tracking-widest text-blue-400 border border-white/5 mb-2 inline-block">
                                        AI {currentTip.tag}
                                    </span>
                                    <p className="text-lg font-black leading-tight tracking-tight max-w-lg">
                                        "{currentTip.text}"
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => router.push('/dashboard/applications')} className="btn-secondary border-none bg-white text-brand-blue-black px-6 hover:bg-blue-50">
                                Upgrade Strategy
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Widgets Area */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Pipeline Strength Pulse */}
                    <section className="bg-white border border-zinc-100 rounded-3xl p-6">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 px-1">Pipeline Strength</h2>
                        <div className="space-y-5">
                            <div className="h-2.5 w-full bg-zinc-50 rounded-full overflow-hidden flex p-0.5 border border-zinc-50">
                                {pipelineStages.map((stage, i) => (
                                    <motion.div
                                        key={stage.label}
                                        initial={{ width: 0 }}
                                        animate={{ width: jobs.length > 0 ? `${(stage.count / jobs.length) * 100}%` : '0%' }}
                                        transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                        className={cn("h-full rounded-full mr-0.5 last:mr-0", stage.color)}
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {pipelineStages.map((stage) => (
                                    <div key={stage.label} className="text-center">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-300 mb-1">{stage.label}</div>
                                        <div className="text-lg font-black text-brand-blue-black">{stage.count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Quick Control Matrix */}
                    <section className="space-y-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'New Job', icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50", path: '/dashboard/applications?new=true' },
                                { label: 'Refactor CV', icon: Sparkles, color: "text-amber-500", bg: "bg-amber-50", path: '/dashboard/optimizer' },
                                { label: 'Calendar', icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50", path: '#' },
                                { label: 'Analyze', icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", path: '#' },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => router.push(item.path)}
                                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-100 bg-white p-5 transition-all hover:bg-zinc-50 hover:border-blue-100 group"
                                >
                                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110", item.bg)}>
                                        <item.icon className={cn("h-5 w-5", item.color)} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-brand-blue transition-colors text-center">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Momentum Indicator - Only One Intelligent one */}
                    <div className="rounded-3xl border border-blue-50 bg-gradient-to-br from-blue-50/40 to-white p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Zap className="h-24 w-24 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Search Momentum</span>
                        </div>
                        <div className="flex items-end justify-between px-1">
                            <span className="text-3xl font-black text-brand-blue-black tracking-tight">+24%</span>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Trending Up</span>
                        </div>
                        <p className="text-[11px] font-medium text-zinc-400 mt-3 px-1 leading-relaxed">
                            Your application frequency is currently <span className="text-brand-blue font-bold">higher than average</span> for your skill bracket.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

