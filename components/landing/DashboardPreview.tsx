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
        <div className="mx-auto mt-24 sm:mt-32 max-w-6xl px-4 lg:px-8 relative">
            <div className="absolute -inset-4 bg-blue-100/30 blur-3xl -z-10 rounded-[3rem]" />
            <motion.div
                className="relative overflow-hidden rounded-[2rem] lg:rounded-[3rem] border border-white/50 bg-white/20 p-2 sm:p-4 backdrop-blur-sm shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]"
                initial={{ opacity: 0, scale: 0.95, y: 60 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="rounded-[1.5rem] lg:rounded-[2.5rem] bg-white border border-zinc-200/50 overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-col border-b border-zinc-100/80">
                        <div className="flex h-12 sm:h-14 items-center justify-between px-6 sm:px-8 bg-zinc-50/30">
                            <div className="flex gap-1.5">
                                <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-zinc-200" />
                                <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-zinc-200" />
                                <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-zinc-200" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-5 sm:h-6 w-24 sm:w-32 rounded-lg bg-white border border-zinc-200 flex items-center px-2">
                                    <div className="h-1.5 w-full rounded bg-zinc-100" />
                                </div>
                            </div>
                        </div>

                        <div className="flex h-12 sm:h-16 items-center justify-between px-4 sm:px-8">
                            <div className="flex items-center gap-3 sm:gap-6">
                                <h3 className="text-xs sm:text-sm font-black tracking-tight text-black">My Jobs</h3>
                                <div className="h-4 w-px bg-zinc-100 hidden sm:block" />
                                <div className="hidden sm:flex gap-3 items-center">
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
                                <div className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white">
                                    <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-zinc-400" />
                                </div>
                                <div className="hidden sm:flex h-9 items-center gap-2 rounded-xl border border-zinc-100 bg-white px-3">
                                    <Filter className="h-3.5 w-3.5 text-zinc-400" />
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Filter</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[350px] sm:min-h-[550px]">
                        {/* Sidebar - hidden on mobile */}
                        <div className="hidden lg:block border-r border-zinc-50 p-8 bg-zinc-50/20">
                            <div className="space-y-8">
                                <div>
                                    <span className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">Inventory</span>
                                    <div className="mt-6 space-y-2">
                                        {['Home', 'My Jobs', 'Practice', 'Analytics'].map((item, i) => (
                                            <div key={item} className={`flex items-center justify-between py-2 px-4 rounded-xl text-xs font-black tracking-tight ${i === 1 ? 'bg-zinc-100 text-[#1C4ED8]' : 'text-zinc-400 cursor-pointer hover:bg-zinc-50 transition-colors'}`}>
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
                        <div className="col-span-1 lg:col-span-3 p-4 sm:p-6 lg:p-10 bg-white">
                            <div className="grid grid-cols-3 gap-3 sm:gap-8 mb-6 sm:mb-12">
                                {[
                                    { label: 'Applied', val: '142', sub: '+12%', icon: Briefcase },
                                    { label: 'Interviews', val: '12', sub: 'Active', icon: Clock },
                                    { label: 'Offers', val: '02', sub: 'Success', icon: Sparkles }
                                ].map((stat) => (
                                    <div key={stat.label} className="group rounded-xl sm:rounded-[1.5rem] border border-zinc-100 p-3 sm:p-6 transition-all hover:bg-zinc-50 hover:border-zinc-200">
                                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                                            <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-300 group-hover:text-[#1C4ED8] transition-colors" />
                                            <span className="text-[8px] sm:text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md leading-none tracking-wider">{stat.sub}</span>
                                        </div>
                                        <div className="text-xl sm:text-3xl font-black text-black">{stat.val}</div>
                                        <div className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1 sm:mt-2">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between mb-3 sm:mb-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Activity Timeline</h4>
                                </div>
                                {recentApps.map((app, i) => (
                                    <motion.div
                                        key={app.company}
                                        className="group flex items-center justify-between rounded-xl sm:rounded-2xl border border-zinc-100 p-3 sm:p-5 transition-all hover:border-blue-100 bg-white"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <div className="flex items-center gap-3 sm:gap-5">
                                            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-zinc-50 text-[10px] sm:text-[11px] font-black text-zinc-800 border border-zinc-100 group-hover:bg-blue-50 group-hover:text-[#1C4ED8] transition-colors shrink-0">
                                                {app.company[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs sm:text-sm font-black text-black tracking-tight truncate">{app.company}</div>
                                                <div className="text-[10px] sm:text-[11px] font-bold text-zinc-400 tracking-tight truncate">{app.role}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 sm:gap-8 shrink-0">
                                            <div className="hidden sm:block text-right">
                                                <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{app.time}</div>
                                            </div>
                                            <div className={`rounded-full px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] ${app.bg} ${app.color}`}>
                                                {app.status}
                                            </div>
                                            <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-200 group-hover:text-[#1C4ED8] transition-colors hidden sm:block" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Insight Tooltip */}
                            <div className="mt-6 sm:mt-12 p-4 sm:p-8 rounded-xl sm:rounded-2xl bg-[#1C4ED8] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 sm:p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Sparkles className="h-16 w-16 sm:h-28 sm:w-28" />
                                </div>
                                <div className="relative z-10 flex items-start gap-4 sm:gap-6">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="max-w-md min-w-0">
                                        <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-1 sm:mb-2 opacity-80">Smart AI Tip</div>
                                        <p className="text-xs sm:text-base font-bold leading-relaxed tracking-tight">
                                            &quot;Scale AI has a high response rate for your background. Send a follow-up
                                            note to the hiring manager to increase your interview success by 24%.&quot;
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
