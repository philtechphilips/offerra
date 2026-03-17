"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
    Zap, Sparkles, Loader2, ChevronRight, Briefcase,
    Target, RefreshCw, CheckCircle2, AlertCircle,
    MessageSquare, Lightbulb, UserCheck, ShieldCheck,
    ChevronDown, ChevronUp, Play
} from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { cn } from "@/app/lib/utils";
import { useJobStore } from "@/app/store/jobStore";

interface PrepItem {
    category: string;
    question: string;
    suggested_answer: string;
    why_this_works: string;
}

interface PrepResult {
    prep_guide: PrepItem[];
    general_tips: string[];
}

function PrepContent() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get("job");
    const { jobs, fetchJobs } = useJobStore();

    const [cvs, setCvs] = useState<any[]>([]);
    const [selectedCvId, setSelectedCvId] = useState<string | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<PrepResult | null>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        fetchJobs();
        const fetchCVs = async () => {
            try {
                const res = await api.get('/cv');
                const list = res.data.cvs || [];
                setCvs(list);
                const active = list.find((c: any) => c.is_active);
                if (active) setSelectedCvId(active.id);
            } catch (err) {
                console.error("Failed to load CVs");
            }
        };
        fetchCVs();
    }, [fetchJobs]);

    useEffect(() => {
        if (jobId && jobs.length > 0) {
            const job = jobs.find(j => j.id === jobId);
            if (job) {
                // If the job has a description, we could use it
                // For now, we'll let the user paste or we'll try to find info
                if (job.description) setJobDescription(job.description);
                else setJobDescription(`${job.title} at ${job.company}`);
            }
        }
    }, [jobId, jobs]);

    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            toast.error("Please provide job context first.");
            return;
        }

        setIsGenerating(true);
        const loadingId = toast.loading("AI Coach is analyzing your match and preparing questions...");
        try {
            const res = await api.post('/cv/interview-prep', {
                job_description: jobDescription,
                cv_id: selectedCvId
            });

            setResult(res.data);
            setOpenIndex(0);
            toast.success("Interview Prep Guide Generated!", { id: loadingId });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to generate prep guide.", { id: loadingId });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-32">
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20">
                        <Zap className="h-5 w-5 text-brand-blue" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue">Practice</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 uppercase">
                    Practice.
                </h1>
                <p className="text-sm font-medium text-zinc-400 max-w-2xl leading-relaxed">
                    Get ready for your interviews. Our AI analyzes your resume against the job to find the best questions and help you craft great answers.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Configuration */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-brand-blue" />
                                Source Profile
                            </h3>
                            <div className="space-y-2">
                                {cvs.map((cv) => (
                                    <button
                                        key={cv.id}
                                        onClick={() => setSelectedCvId(cv.id)}
                                        className={cn(
                                            "w-full text-left p-4 rounded-2xl text-[11px] font-bold transition-all border",
                                            selectedCvId === cv.id
                                                ? "bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20"
                                                : "bg-zinc-50 text-zinc-500 border-zinc-100 hover:bg-zinc-100"
                                        )}
                                    >
                                        {cv.profile_name || cv.filename}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-brand-blue" />
                                Job Context
                            </h3>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste job description or title here..."
                                className="w-full h-40 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-brand-blue transition-all outline-none font-medium text-[13px] text-zinc-600 leading-relaxed resize-none"
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !jobDescription.trim()}
                            className="btn-primary w-full h-16"
                        >
                            {isGenerating ? <Loader2 className="h-5 w-5 animate-spin shrink-0" /> : <Play className="h-5 w-5 shrink-0" />}
                            Start Practice
                        </button>
                    </section>

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-2xl shadow-blue-200"
                        >
                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                Coaching Tips
                            </h4>
                            <div className="space-y-4">
                                {result.general_tips.map((tip, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                        </div>
                                        <p className="text-xs font-bold leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right: Prep Guide */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {result.prep_guide.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "rounded-[2.5rem] border border-zinc-100 bg-white overflow-hidden transition-all duration-300",
                                            openIndex === idx ? "ring-2 ring-blue-500/10 shadow-xl shadow-zinc-100" : "hover:border-blue-100"
                                        )}
                                    >
                                        <button
                                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                            className="w-full p-8 flex items-center justify-between text-left"
                                        >
                                            <div className="flex gap-6 items-center">
                                                <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 transition-colors">
                                                    <MessageSquare className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-blue mb-1 block">
                                                        {item.category}
                                                    </span>
                                                    <h3 className="text-lg font-black text-zinc-900 tracking-tight">{item.question}</h3>
                                                </div>
                                            </div>
                                            {openIndex === idx ? <ChevronUp className="h-5 w-5 text-zinc-300" /> : <ChevronDown className="h-5 w-5 text-zinc-300" />}
                                        </button>

                                        <AnimatePresence>
                                            {openIndex === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="px-8 pb-8 space-y-8 border-t border-zinc-50 pt-8">
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">STAR Method Answer</span>
                                                                <div className="h-[1px] flex-1 bg-zinc-50" />
                                                            </div>
                                                            <p className="text-sm font-medium text-zinc-600 leading-[1.8] whitespace-pre-wrap italic">
                                                                "{item.suggested_answer}"
                                                            </p>
                                                        </div>

                                                        <div className="p-6 rounded-2xl bg-brand-blue-light border border-brand-blue/10 flex gap-4">
                                                            <div className="h-10 w-10 rounded-xl bg-white border border-brand-blue/10 flex items-center justify-center shrink-0">
                                                                <ShieldCheck className="h-5 w-5 text-brand-blue" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-brand-blue-dark uppercase tracking-widest mb-1">Coach's Analysis</p>
                                                                <p className="text-[11px] font-bold text-brand-blue-black/70 leading-relaxed">
                                                                    {item.why_this_works}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[600px] rounded-[3rem] border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center text-center p-12 bg-zinc-50/20">
                                <div className="h-24 w-24 rounded-[2rem] bg-white border border-zinc-50 flex items-center justify-center mb-8 shadow-sm">
                                    <RefreshCw className="h-10 w-10 animate-pulse text-zinc-200" />
                                </div>
                                <h3 className="text-xl font-black text-zinc-400 mb-2 uppercase tracking-tighter">Ready for Selection</h3>
                                <p className="text-sm font-medium text-zinc-400 max-w-sm">
                                    Click "Start Preparation" on the left to generate your custom interview guide.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function InterviewPrepPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-blue" /></div>}>
            <PrepContent />
        </Suspense>
    );
}
