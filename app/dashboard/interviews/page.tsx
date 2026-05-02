"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Clock, Search, Building2, Calendar, MapPin,
    Zap, Briefcase, TrendingUp,
    AlertCircle, Loader2, Video,
    ChevronRight, Sparkles
} from "lucide-react";
import { useJobStore, type JobApplication } from "@/app/store/jobStore";
import api from "@/app/lib/api";
import { cn } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
}

export default function InterviewsPage() {
    const { stats, fetchStats } = useJobStore();
    const [search, setSearch] = useState("");
    const [interviewJobs, setInterviewJobs] = useState<JobApplication[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const router = useRouter();
    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchInterviews = useCallback(async (page = 1, replace = true) => {
        if (replace) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }
        try {
            const response = await api.get('/jobs', {
                params: {
                    page: String(page),
                    per_page: '15',
                    status: 'interview',
                    ...(search ? { search } : {}),
                },
            });
            setMeta(response.data.meta);
            setInterviewJobs(prev => replace ? response.data.data : [...prev, ...response.data.data]);
        } catch (err) {
            // Global handler shows error toast as needed
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [search]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Debounced search refetch
    useEffect(() => {
        const t = setTimeout(() => {
            fetchInterviews(1, true);
        }, 300);
        return () => clearTimeout(t);
    }, [search, fetchInterviews]);

    // Infinite scroll
    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && meta?.has_more && !isLoadingMore && !isLoading) {
                    const nextPage = (meta.current_page ?? 1) + 1;
                    fetchInterviews(nextPage, false);
                }
            },
            { rootMargin: "120px", threshold: 0.1 }
        );
        observer.observe(target);
        return () => observer.unobserve(target);
    }, [meta?.has_more, meta?.current_page, isLoadingMore, isLoading, fetchInterviews]);

    const total = stats.by_status.interview;
    const higherMatch = stats.interview_insights.high_match;
    const avgMatch = stats.interview_insights.avg_match_score;

    const statTiles = useMemo(() => [
        { label: 'Active Interviews', val: total.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        { label: 'High Match', val: higherMatch.toString(), icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
        { label: 'Avg. Match', val: `${avgMatch}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: 'Success Rate', val: "🚀", icon: Sparkles, color: "text-indigo-600", bg: "bg-indigo-50" },
    ], [total, higherMatch, avgMatch]);

    const handleGeneratePrep = () => {
        if (interviewJobs.length > 0) {
            router.push(`/dashboard/prep?job=${interviewJobs[0].id}`);
        } else {
            toast.error("No active interviews to prepare for.");
        }
    };

    return (
        <div className="w-full min-h-full pb-20 space-y-6">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-zinc-900">Interviews</h1>
                    <p className="text-sm text-zinc-400 mt-0.5">Manage your active rounds and get ready for calls.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/dashboard/prep')}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-all"
                    >
                        <Zap className="h-3.5 w-3.5" />
                        Practice
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/applications')}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition-all"
                    >
                        <Briefcase className="h-3.5 w-3.5" />
                        All Applications
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statTiles.map((stat) => (
                    <div key={stat.label} className="bg-white border border-zinc-100 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", stat.bg)}>
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-zinc-900">{stat.val}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* AI banner + readiness */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-2xl bg-zinc-900 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Sparkles className="h-40 w-40" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-600/20 text-[10px] font-black text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                            AI Strategy
                        </span>
                        <p className="text-base font-bold text-white/90 leading-relaxed max-w-lg">
                            {total > 0
                                ? `You have ${total} active interview round${total > 1 ? 's' : ''}. Focus on the STAR method for ${interviewJobs[0]?.company ?? 'your next round'} today.`
                                : "No active interviews yet. Update your application statuses to track them here."}
                        </p>
                        {total > 0 && (
                            <div className="flex flex-wrap gap-3 pt-1">
                                <button
                                    onClick={handleGeneratePrep}
                                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-xs font-bold text-zinc-900 hover:bg-zinc-100 transition-all"
                                >
                                    <Zap className="h-3.5 w-3.5" />
                                    Generate Prep Sheet
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-100 bg-white p-5 flex flex-col items-center justify-center gap-4">
                    <div className="relative inline-flex items-center justify-center">
                        <svg className="h-24 w-24 -rotate-90">
                            <circle className="text-zinc-100" strokeWidth="6" stroke="currentColor" fill="transparent" r="42" cx="48" cy="48" />
                            <circle
                                className="text-blue-600 transition-all duration-700"
                                strokeWidth="6"
                                strokeDasharray={263.9}
                                strokeDashoffset={263.9 * (1 - (total > 0 ? 0.85 : 0.2))}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="42"
                                cx="48"
                                cy="48"
                            />
                        </svg>
                        <span className="absolute text-xl font-black text-zinc-900">{total > 0 ? "85%" : "20%"}</span>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black text-zinc-900">Readiness Score</p>
                        <p className="text-xs text-zinc-400 mt-0.5">Based on active interviews</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/prep')}
                        className="w-full h-9 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all"
                    >
                        Boost Score
                    </button>
                </div>
            </div>

            {/* Active interviews list */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black text-zinc-900">Active Rounds</h2>
                        <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-blue-50 text-[10px] font-black text-blue-600">{total}</span>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-300" />
                        <input
                            type="text"
                            placeholder="Filter by title or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 w-full rounded-xl bg-white border border-zinc-100 pl-9 pr-4 text-xs focus:border-blue-200 transition-all placeholder:text-zinc-300 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-52 rounded-2xl bg-zinc-50 border border-zinc-100 animate-pulse" />
                        ))
                    ) : interviewJobs.length > 0 ? (
                        interviewJobs.map((job, idx) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                                className="group bg-white border border-zinc-100 rounded-2xl p-5 hover:border-blue-200 transition-all relative overflow-hidden"
                            >
                                {/* Match badge */}
                                {job.cv_match_score != null && (
                                    <div className="absolute top-4 right-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-lg text-[10px] font-black border",
                                            job.cv_match_score >= 70 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                job.cv_match_score >= 40 ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                    "bg-zinc-50 text-zinc-400 border-zinc-100"
                                        )}>
                                            {job.cv_match_score}% match
                                        </span>
                                    </div>
                                )}

                                <div className="flex flex-col h-full gap-4">
                                    <div>
                                        <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-3 group-hover:border-blue-100 transition-all">
                                            <Building2 className="h-5 w-5 text-zinc-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <h3 className="text-sm font-black text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1 pr-16">{job.title}</h3>
                                        <p className="text-xs text-zinc-400 mt-0.5">{job.company}</p>
                                    </div>

                                    <div className="space-y-2">
                                        {job.location && (
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                <span className="text-xs">{job.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <Calendar className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                                            <span className="text-xs">Round scheduled soon</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => router.push(`/dashboard/prep?job=${job.id}`)}
                                            className="h-9 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-all"
                                        >
                                            <Zap className="h-3.5 w-3.5" />
                                            Prep
                                        </button>
                                        <button
                                            onClick={() => router.push('/dashboard/applications')}
                                            className="h-9 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 flex items-center justify-center gap-1.5 hover:bg-zinc-50 transition-all"
                                        >
                                            Details
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 bg-white border border-zinc-100 rounded-2xl text-center">
                            <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-5 w-5 text-zinc-200" />
                            </div>
                            <p className="text-sm font-black text-zinc-400 mb-1">No active interviews</p>
                            <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-6">Update your application statuses in the pipeline to track them here.</p>
                            <button
                                onClick={() => router.push('/dashboard/applications')}
                                className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition-all"
                            >
                                Manage Applications
                            </button>
                        </div>
                    )}
                </div>

                {/* Infinite scroll sentinel */}
                {(meta?.has_more || isLoadingMore) && (
                    <div ref={observerTarget} className="py-6 flex justify-center">
                        {isLoadingMore && (
                            <div className="flex items-center gap-3 text-zinc-400">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">Loading more...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-zinc-100 flex gap-4">
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Video className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-zinc-900 mb-1">Video Setup</p>
                        <p className="text-xs text-zinc-500 leading-relaxed">Camera at eye level, light from the front, clean background. Increases perceived professionalism significantly.</p>
                    </div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-zinc-100 flex gap-4">
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-amber-50 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-zinc-900 mb-1">Follow-up Rule</p>
                        <p className="text-xs text-zinc-500 leading-relaxed">Send a thank-you note within 12 hours. Reference something specific from the conversation to stand out.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
