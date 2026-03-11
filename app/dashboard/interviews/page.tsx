"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    Search,
    Building2,
    Calendar,
    MapPin,
    ExternalLink,
    Zap,
    Briefcase,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Video,
    Users,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { useJobStore } from "@/app/store/jobStore";
import { cn } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function InterviewsPage() {
    const { jobs, fetchJobs, isLoading } = useJobStore();
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const interviewJobs = useMemo(() => {
        return jobs.filter(job =>
            job.status === 'interview' &&
            (job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.company.toLowerCase().includes(search.toLowerCase()))
        );
    }, [jobs, search]);

    const stats = useMemo(() => {
        const interviewList = jobs.filter(j => j.status === 'interview');
        const total = interviewList.length;
        const higherMatch = interviewList.filter(j => j.cv_match_score && j.cv_match_score >= 70).length;

        // Calculate average match score for prep confidence
        const avgMatch = total > 0
            ? Math.round(interviewList.reduce((acc, curr) => acc + (curr.cv_match_score || 0), 0) / total)
            : 0;

        return [
            { label: 'Active Interviews', val: total.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
            { label: 'High Match Jobs', val: higherMatch.toString(), icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
            { label: 'Avg. Match Score', val: `${avgMatch}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: 'Success Rate', val: "🚀", icon: Sparkles, color: "text-indigo-600", bg: "bg-indigo-50" },
        ];
    }, [jobs]);

    const handleGeneratePrep = () => {
        if (interviewJobs.length > 0) {
            router.push(`/dashboard/prep?job=${interviewJobs[0].id}`);
        } else {
            toast.error("No active interviews to prepare for.");
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-brand-blue-black uppercase">
                        Interview <span className="text-blue-600">Command Center.</span>
                    </h1>
                    <p className="mt-2 text-sm font-medium text-zinc-400">
                        Manage your active rounds, prep for upcoming calls, and track your success rate.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/dashboard/prep')}
                        className="btn-secondary h-12 px-6"
                    >
                        <Zap className="h-4 w-4 shrink-0" />
                        Practice Mode
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/applications')}
                        className="btn-primary h-12 px-6"
                    >
                        <Briefcase className="h-4 w-4 shrink-0" />
                        View All Jobs
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-white border border-zinc-100 p-6 rounded-[2rem] hover:border-blue-200 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">{stat.label}</span>
                            <div className="text-3xl font-black tracking-tight text-brand-blue-black">{stat.val}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* AI Insights & Prep Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                <div className="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-brand-blue-black p-8 text-white group border border-white/5">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                        <Sparkles className="h-48 w-48 text-blue-500" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-blue-600/20 text-[9px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20">
                                AI Strategy
                            </span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight leading-tight max-w-xl">
                            {interviewJobs.length > 0
                                ? `You have ${interviewJobs.length} active interview rounds. Focus on the STAR method for ${interviewJobs[0].company} today.`
                                : "No active interviews. Apply for more jobs to start practicing your pitch."}
                        </h2>
                        {interviewJobs.length > 0 && (
                            <div className="flex flex-wrap gap-4 pt-4">
                                <button
                                    onClick={handleGeneratePrep}
                                    className="btn-secondary h-11 px-6 bg-white border-none hover:bg-blue-50 text-brand-blue-black"
                                >
                                    Generate Prep Sheet
                                </button>
                                <button className="h-11 px-6 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                                    Latest Tips
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            Readiness Level
                        </h3>
                        <div className="space-y-6 text-center py-4">
                            <div className="relative inline-flex items-center justify-center">
                                <svg className="h-28 w-28 -rotate-90">
                                    <circle className="text-zinc-50" strokeWidth="8" stroke="currentColor" fill="transparent" r="48" cx="56" cy="56" />
                                    <circle
                                        className="text-blue-600 transition-all duration-1000"
                                        strokeWidth="8"
                                        strokeDasharray={301.59}
                                        strokeDashoffset={301.59 * (1 - (interviewJobs.length > 0 ? 0.85 : 0.2))}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="48"
                                        cx="56"
                                        cy="56"
                                    />
                                </svg>
                                <span className="absolute text-2xl font-black text-brand-blue-black">{interviewJobs.length > 0 ? "85%" : "20%"}</span>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Confidence Score</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/prep')}
                        className="btn-secondary w-full py-4 text-zinc-500"
                    >
                        Boost My Score
                    </button>
                </div>
            </motion.div>

            {/* Active Interviews List */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-black tracking-tight text-brand-blue-black uppercase text-[12px] tracking-widest">Active Rounds</h2>
                        <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black">{interviewJobs.length}</span>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300" />
                        <input
                            type="text"
                            placeholder="Filter your rounds..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-11 w-full rounded-2xl bg-white border border-zinc-100 pl-11 pr-4 text-[11px] font-bold focus:border-blue-200 transition-all placeholder:text-zinc-300 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-64 rounded-[2rem] bg-zinc-50 border border-zinc-100 animate-pulse" />
                        ))
                    ) : interviewJobs.length > 0 ? (
                        interviewJobs.map((job, idx) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white border border-zinc-100 rounded-[2.5rem] p-8 hover:border-blue-200 transition-all relative overflow-hidden"
                            >
                                {/* Match Score Tag */}
                                <div className="absolute top-6 right-6">
                                    <div className={cn(
                                        "px-2.5 py-1 rounded-lg text-[10px] font-black tabular-nums border",
                                        job.cv_match_score && job.cv_match_score >= 70 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            job.cv_match_score && job.cv_match_score >= 40 ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                "bg-zinc-50 text-zinc-400 border-zinc-100"
                                    )}>
                                        {job.cv_match_score ? `${job.cv_match_score}% Match` : 'No Match Data'}
                                    </div>
                                </div>

                                <div className="flex flex-col h-full">
                                    <div className="mb-8">
                                        <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:border-blue-100 transition-all mb-6">
                                            <Building2 className="h-7 w-7 text-zinc-300 group-hover:text-blue-500 transition-all" />
                                        </div>
                                        <h3 className="text-xl font-black text-brand-blue-black tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                                        <p className="text-sm font-bold text-zinc-400 mt-1">{job.company}</p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3 text-zinc-500">
                                            <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <span className="text-xs font-bold">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-zinc-500">
                                            <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <span className="text-xs font-bold">Round scheduled soon</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => router.push(`/dashboard/prep?job=${job.id}`)}
                                            className="btn-primary h-12"
                                        >
                                            <Zap className="h-3.5 w-3.5 shrink-0" />
                                            Prep Now
                                        </button>
                                        <button
                                            onClick={() => router.push(`/dashboard/applications`)}
                                            className="btn-secondary h-12"
                                        >
                                            Details
                                            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-white border border-zinc-100 rounded-[3rem] text-center">
                            <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center mx-auto mb-6">
                                <Clock className="h-10 w-10 text-zinc-200" />
                            </div>
                            <h3 className="text-xl font-black text-brand-blue-black tracking-tight mb-2 uppercase">No active interviews found</h3>
                            <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto mb-8">
                                Update application statuses in your pipeline to track them here.
                            </p>
                            <button
                                onClick={() => router.push('/dashboard/applications')}
                                className="btn-primary h-12 px-8"
                            >
                                Manage Applications
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Video className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Video Setup Tip</h3>
                    </div>
                    <p className="text-sm font-bold text-zinc-600 leading-relaxed">
                        Ensure your camera is at eye level and lighting is coming from the front. A clean background increases professional trust by 35%.
                    </p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Follow-up Rule</h3>
                    </div>
                    <p className="text-sm font-bold text-zinc-600 leading-relaxed">
                        Always send a thank-you note within 12 hours of the interview. Mention a specific part of the conversation to stand out.
                    </p>
                </div>
            </div>
        </div>
    );
}
