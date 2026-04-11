"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
    Zap, Sparkles, Loader2, Briefcase,
    CheckCircle2, MessageSquare, Lightbulb, ShieldCheck,
    ChevronDown, ChevronUp, Play, FileText
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
        const loadingId = toast.loading("AI is preparing your interview guide...");
        try {
            const res = await api.post('/cv/interview-prep', {
                job_description: jobDescription,
                cv_id: selectedCvId
            });
            setResult(res.data);
            setOpenIndex(0);
            toast.success("Interview prep guide ready!", { id: loadingId });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to generate prep guide.", { id: loadingId });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full min-h-full pb-20">

            {/* Page header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Zap className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">AI Coach</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">Interview Prep</h1>
                <p className="text-sm text-zinc-400 mt-1.5 max-w-xl">
                    Generate tailored interview questions with STAR-method answers based on your resume and the role.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                {/* Left: Controls */}
                <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-6">

                    {/* Step 1: Select CV */}
                    <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-50">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shrink-0">1</span>
                            <span className="text-sm font-black text-zinc-900">Select Resume</span>
                        </div>
                        <div className="p-4">
                            {cvs.length === 0 ? (
                                <div className="flex flex-col items-center py-6 text-center">
                                    <p className="text-xs font-bold text-zinc-400 mb-3">No resumes found</p>
                                    <a href="/dashboard/profile" className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition-all">
                                        Go to Profile
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {cvs.map((cv) => (
                                        <button
                                            key={cv.id}
                                            onClick={() => setSelectedCvId(cv.id)}
                                            className={cn(
                                                "w-full text-left flex items-center gap-3 p-3 rounded-xl text-sm transition-all border",
                                                selectedCvId === cv.id
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-zinc-50 text-zinc-700 border-transparent hover:border-zinc-200 hover:bg-white"
                                            )}
                                        >
                                            <div className={cn("h-7 w-7 shrink-0 rounded-lg flex items-center justify-center", selectedCvId === cv.id ? "bg-white/20" : "bg-white border border-zinc-100")}>
                                                <FileText className={cn("h-3.5 w-3.5", selectedCvId === cv.id ? "text-white" : "text-blue-600")} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold truncate">{cv.profile_name || cv.filename}</p>
                                                {cv.is_active && <p className={cn("text-[10px]", selectedCvId === cv.id ? "text-blue-200" : "text-blue-500")}>Active</p>}
                                            </div>
                                            {selectedCvId === cv.id && <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Job context */}
                    <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
                            <div className="flex items-center gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shrink-0">2</span>
                                <span className="text-sm font-black text-zinc-900">Job Context</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description or title (e.g. 'Senior Frontend Engineer at Stripe')..."
                                className="w-full h-44 p-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm text-zinc-700 leading-relaxed resize-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !jobDescription.trim()}
                        className="w-full h-12 rounded-xl bg-blue-600 text-white text-sm font-black flex items-center justify-center gap-2.5 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-40"
                    >
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                        {isGenerating ? "Preparing your guide..." : "Generate Prep Guide"}
                    </button>

                    {/* Tips card (shown after generation) */}
                    {result && result.general_tips.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-zinc-100 bg-white overflow-hidden"
                        >
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-50">
                                <Lightbulb className="h-4 w-4 text-amber-500" />
                                <span className="text-sm font-black text-zinc-900">Coaching Tips</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {result.general_tips.map((tip, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle2 className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <p className="text-xs text-zinc-600 leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right: Prep guide */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                            >
                                {result.prep_guide.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "rounded-2xl border bg-white overflow-hidden transition-all",
                                            openIndex === idx ? "border-blue-200 shadow-sm" : "border-zinc-100 hover:border-zinc-200"
                                        )}
                                    >
                                        <button
                                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                            className="w-full px-5 py-4 flex items-center gap-4 text-left"
                                        >
                                            <div className={cn(
                                                "h-8 w-8 shrink-0 rounded-lg flex items-center justify-center transition-colors",
                                                openIndex === idx ? "bg-blue-600 text-white" : "bg-zinc-50 text-zinc-400"
                                            )}>
                                                <MessageSquare className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block mb-0.5">{item.category}</span>
                                                <h3 className="text-sm font-bold text-zinc-900 leading-snug">{item.question}</h3>
                                            </div>
                                            {openIndex === idx
                                                ? <ChevronUp className="h-4 w-4 text-zinc-300 shrink-0" />
                                                : <ChevronDown className="h-4 w-4 text-zinc-300 shrink-0" />
                                            }
                                        </button>

                                        <AnimatePresence>
                                            {openIndex === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-5 space-y-4 border-t border-zinc-50 pt-4">
                                                        {/* Suggested answer */}
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">STAR Method Answer</p>
                                                            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap italic bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                                                                "{item.suggested_answer}"
                                                            </p>
                                                        </div>

                                                        {/* Coach analysis */}
                                                        <div className="flex gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                                            <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-[10px] font-black text-blue-600 mb-1">Why this works</p>
                                                                <p className="text-xs text-blue-900/70 leading-relaxed">{item.why_this_works}</p>
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
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-2xl border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center text-center p-12 min-h-80 bg-zinc-50/30"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mb-4">
                                    <MessageSquare className="h-5 w-5 text-zinc-200" />
                                </div>
                                <p className="text-sm font-bold text-zinc-300 mb-1">Your prep guide will appear here</p>
                                <p className="text-xs text-zinc-300 max-w-xs">Select a resume and add job context on the left, then click generate.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function InterviewPrepPage() {
    return (
        <Suspense fallback={<div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-zinc-300" /></div>}>
            <PrepContent />
        </Suspense>
    );
}
