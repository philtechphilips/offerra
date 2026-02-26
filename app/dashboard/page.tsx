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
    Mail
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";
import { useJobStore } from "@/app/store/jobStore";

const recentApplications = [
    { company: "Anthropic", role: "AI Researcher", status: "Interviewing", time: "2h ago", color: "text-blue-600", bg: "bg-blue-50" },
    { company: "OpenAI", role: "Software Engineer", status: "Applied", time: "5h ago", color: "text-zinc-500", bg: "bg-zinc-50" },
    { company: "Scale AI", role: "Product Designer", status: "Offer Extended", time: "1d ago", color: "text-emerald-600", bg: "bg-emerald-50" },
    { company: "Tesla", role: "Senior Developer", status: "Technical Round", time: "2d ago", color: "text-amber-600", bg: "bg-amber-50" },
];

const upcomingInterviews = [
    { company: "Stripe", date: "Today, 2:30 PM", type: "Culture Fit", status: "Starts in 1h" },
    { company: "AirBnB", date: "Tomorrow, 10:00 AM", type: "Technical Interview", status: "Prepare Now" },
];

export default function DashboardPage() {
    const { user, isLoggedIn, token, _hasHydrated } = useAuthStore();
    const router = useRouter();
    const [userName, setUserName] = useState("Pro User");

    const { jobs, fetchJobs } = useJobStore();

    useEffect(() => {
        // Wait for hydration to finish before checking auth
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

    if (!isLoggedIn || !token) return null;

    // Derived stats
    const totalApplied = jobs.length;
    const interviews = jobs.filter(j => j.status === 'interview').length;
    const offerRate = totalApplied > 0 ? ((jobs.filter(j => j.status === 'offer').length / totalApplied) * 100).toFixed(1) : "0";
    const activePipeline = jobs.filter(j => j.status !== 'rejected').length;

    const dynamicStats = [
        { label: 'Total Applied', val: totalApplied.toString(), sub: '+12% month over month', icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
        { label: 'Interviews', val: interviews.toString(), sub: '3 scheduled this week', icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        { label: 'Offer Rate', val: `${offerRate}%`, sub: 'Higher than average (1.8%)', icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: 'Active Pipeline', val: activePipeline.toString(), sub: 'Currently in discussion', icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
    ];

    return (
        <div className="space-y-10">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-black">Dashboard Overview</h1>
                    <p className="mt-2 text-sm font-medium text-zinc-400">Welcome back, {userName}. You have {interviews} interviews coming up this week.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-zinc-200" />
                        ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 translate-y-px">{jobs.length} Active applications</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {dynamicStats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group bg-white border border-zinc-100 p-8 rounded-2xl hover:border-blue-100 transition-all flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-zinc-200 group-hover:text-black transition-colors" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 block mb-1">{stat.label}</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black tracking-tight text-black">{stat.val}</span>
                                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+12%</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                {/* Recent Applications */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black tracking-tight text-black">Recent Activity</h2>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#1C4ED8] hover:opacity-70">View Portfolio</button>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                        <div className="divide-y divide-zinc-50">
                            {recentApplications.map((app) => (
                                <div key={app.company} className="group flex items-center justify-between p-6 transition-all hover:bg-zinc-50/50">
                                    <div className="flex items-center gap-5">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-[11px] font-black text-zinc-800 border border-zinc-100 group-hover:bg-white group-hover:text-[#1C4ED8] transition-all">
                                            {app.company[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-black tracking-tight">{app.company}</div>
                                            <div className="text-[11px] font-bold text-zinc-400 tracking-tight">{app.role}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{app.time}</div>
                                        </div>
                                        <div className={cn("rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em]", app.bg, app.color)}>
                                            {app.status}
                                        </div>
                                        <MoreVertical className="h-4 w-4 text-zinc-200 group-hover:text-black cursor-pointer" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-zinc-50/50 p-4 text-center border-t border-zinc-50">
                            <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black" onClick={() => router.push('/dashboard/applications')}>Show All Applications</button>
                        </div>
                    </div>

                    {/* AI Strategic Insight - Dashboard Version */}
                    <div className="p-8 rounded-2xl bg-[#1C4ED8] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                            <Sparkles className="h-32 w-32" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-start gap-6">
                                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div className="max-w-md">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">AI Opportunity Engine</div>
                                    <p className="text-lg font-bold leading-tight tracking-tight">
                                        "OpenAI just posted 3 new roles that perfectly match your tech stack. Submit before
                                        the application cap to be in the first 10% of candidates."
                                    </p>
                                </div>
                            </div>
                            <button className="rounded-xl bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#1C4ED8] hover:bg-zinc-100 transition-all flex items-center gap-2">
                                Deploy Now
                                <ArrowUpRight className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-10">
                    {/* Upcoming Rounds */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-300">Upcoming Rounds</h2>
                        <div className="space-y-4">
                            {upcomingInterviews.map((interview) => (
                                <div key={interview.company} className="rounded-2xl border border-zinc-100 bg-white p-6 group hover:border-[#1C4ED8] transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                                            <span className="text-[9px] font-black uppercase text-red-500 tracking-widest">{interview.status}</span>
                                        </div>
                                        <Calendar className="h-4 w-4 text-zinc-200 group-hover:text-black transition-colors" />
                                    </div>
                                    <div className="text-base font-black text-black tracking-tight">{interview.company}</div>
                                    <div className="text-[11px] font-bold text-zinc-400 mt-1">{interview.type} • {interview.date}</div>
                                    <button className="mt-6 w-full rounded-xl bg-zinc-50 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:bg-[#1C4ED8] group-hover:text-white transition-all">
                                        Prepare with AI
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-300">Quick Command</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'New Track', icon: Briefcase, color: "text-[#1C4ED8]", bg: "bg-blue-50" },
                                { label: 'Sync Mail', icon: Sparkles, color: "text-amber-500", bg: "bg-amber-50" },
                                { label: 'Resume Score', icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
                                { label: 'Search', icon: Search, color: "text-zinc-500", bg: "bg-zinc-100" },
                            ].map((item) => (
                                <button key={item.label} className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-100 bg-white p-6 transition-all hover:bg-zinc-50 hover:border-zinc-200 group">
                                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                                        <item.icon className={cn("h-5 w-5", item.color)} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Community Success */}
                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-8">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 mb-6">Network Health</div>
                        <div className="space-y-4">
                            <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
                                <div className="h-full w-[82%] bg-[#1C4ED8]" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-zinc-400">Response Rate Efficiency</span>
                                <span className="text-[10px] font-black text-black">82%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
