"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Briefcase, ExternalLink, Sparkles, Filter, Search } from "lucide-react";

const recentApps = [
    { company: "Anthropic", role: "AI Researcher", status: "Interviewing", color: "text-blue-600", bg: "bg-blue-50", time: "2h ago" },
    { company: "OpenAI", role: "Software Engineer", status: "Applied", color: "text-zinc-500", bg: "bg-zinc-50", time: "5h ago" },
    { company: "Scale AI", role: "Product Designer", status: "Offer", color: "text-emerald-600", bg: "bg-emerald-50", time: "1d ago" },
];

export function DashboardPreview() {
    return (
        <div className="mx-auto mt-24 max-w-6xl px-4 lg:px-8">
            <motion.div
                className="relative overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-zinc-50/50 p-3 shadow-[0_0_100px_rgba(0,0,0,0.03)]"
                initial={{ opacity: 0, scale: 0.98, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="rounded-[2rem] bg-white border border-zinc-200 shadow-[0_30px_60px_rgba(0,0,0,0.04)] overflow-hidden">
                    {/* Header */}
                    <div className="flex flex-col border-b border-zinc-100">
                        <div className="flex h-12 items-center justify-between px-6 bg-zinc-50/50">
                            <div className="flex gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                                <div className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                                <div className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-6 w-32 rounded-lg bg-white border border-zinc-200 flex items-center px-2 shadow-sm">
                                    <div className="h-1.5 w-full rounded bg-zinc-100" />
                                </div>
                            </div>
                        </div>

                        <div className="flex h-16 items-center justify-between px-8">
                            <div className="flex items-center gap-6">
                                <h3 className="text-sm font-black tracking-tight text-black">Applications</h3>
                                <div className="h-4 w-px bg-zinc-100" />
                                <div className="flex gap-3 items-center">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">All (142)</span>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1C4ED8]"></span>
                                        </span>
                                        <span className="text-[10px] font-black text-[#1C4ED8] uppercase tracking-widest leading-none">Active (12)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 shadow-sm bg-white">
                                    <Search className="h-3.5 w-3.5 text-zinc-400" />
                                </div>
                                <div className="flex h-9 items-center gap-2 rounded-xl border border-zinc-100 bg-white px-3 shadow-sm">
                                    <Filter className="h-3.5 w-3.5 text-zinc-400" />
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Filter</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[550px]">
                        {/* Sidebar */}
                        <div className="hidden lg:block border-r border-zinc-50 p-8 bg-zinc-50/20">
                            <div className="space-y-8">
                                <div>
                                    <span className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">Inventory</span>
                                    <div className="mt-6 space-y-2">
                                        {['Overview', 'Applications', 'Interview Prep', 'Analytics'].map((item, i) => (
                                            <div key={item} className={`flex items-center justify-between py-2 px-4 rounded-xl text-xs font-black tracking-tight ${i === 1 ? 'bg-zinc-100 text-[#1C4ED8] shadow-sm' : 'text-zinc-400 cursor-pointer hover:bg-zinc-50 transition-colors'}`}>
                                                {item}
                                                {i === 1 && <span className="text-[9px] bg-red-500 h-2 w-2 rounded-full ring-4 ring-red-50" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-zinc-50">
                                    <span className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">Strategy</span>
                                    <div className="mt-6 space-y-2">
                                        {['Market Insights', 'Salary Engine'].map((item) => (
                                            <div key={item} className="flex items-center px-4 py-2 text-xs font-black text-zinc-400 hover:text-black transition-colors cursor-pointer">
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-3 p-10 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                {[
                                    { label: 'Applied', val: '142', sub: '+12%', icon: Briefcase },
                                    { label: 'Interviews', val: '12', sub: 'Active', icon: Clock },
                                    { label: 'Offers', val: '02', sub: 'Success', icon: Sparkles }
                                ].map((stat) => (
                                    <div key={stat.label} className="group rounded-[1.5rem] border border-zinc-100 p-6 transition-all hover:bg-zinc-50 hover:border-zinc-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <stat.icon className="h-4 w-4 text-zinc-300 group-hover:text-[#1C4ED8] transition-colors" />
                                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md leading-none tracking-wider">{stat.sub}</span>
                                        </div>
                                        <div className="text-3xl font-black text-black">{stat.val}</div>
                                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-2">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Activity Timeline</h4>
                                </div>
                                {recentApps.map((app, i) => (
                                    <motion.div
                                        key={app.company}
                                        className="group flex items-center justify-between rounded-2xl border border-zinc-100 p-5 transition-all hover:shadow-[0_10px_40px_rgba(28,78,216,0.03)] hover:border-blue-100 bg-white"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 text-[11px] font-black text-zinc-800 border border-zinc-100 group-hover:bg-blue-50 group-hover:text-[#1C4ED8] transition-colors">
                                                {app.company[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-black tracking-tight">{app.company}</div>
                                                <div className="text-[11px] font-bold text-zinc-400 tracking-tight">{app.role}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="hidden sm:block text-right">
                                                <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{app.time}</div>
                                            </div>
                                            <div className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] ${app.bg} ${app.color}`}>
                                                {app.status}
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-zinc-200 group-hover:text-[#1C4ED8] transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Insight Tooltip - Provolo Blue */}
                            <div className="mt-12 p-8 rounded-[2rem] bg-[#1C4ED8] text-white shadow-[0_20px_50px_rgba(28,78,216,0.2)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Sparkles className="h-28 w-28" />
                                </div>
                                <div className="relative z-10 flex items-start gap-6">
                                    <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div className="max-w-md">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">AI Strategic Insight</div>
                                        <p className="text-base font-bold leading-relaxed tracking-tight">
                                            "Scale AI has a high response rate for your background. Send a follow-up
                                            note to the hiring manager to increase your interview success by 24%."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
