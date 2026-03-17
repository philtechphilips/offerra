"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PenTool, Sparkles, Loader2, Copy, CheckCircle2,
    Briefcase, ArrowRight, Zap, Target, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { cn } from "@/app/lib/utils";

interface ProposalResult {
    proposal: string;
    strategy_used: string;
}

export default function ProposalWriterPage() {
    const [jobDescription, setJobDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [cvs, setCvs] = useState<any[]>([]);
    const [selectedCvId, setSelectedCvId] = useState<string | null>(null);
    const [result, setResult] = useState<ProposalResult | null>(null);
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        const fetchCVs = async () => {
            try {
                const res = await api.get('/cv');
                const list = res.data.cvs || [];
                setCvs(list);
                const active = list.find((c: any) => c.is_active);
                if (active) setSelectedCvId(active.id);
                else if (list.length > 0) setSelectedCvId(list[0].id);
            } catch (err) {
                console.error("Failed to load CVs");
            }
        };
        fetchCVs();
    }, []);

    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            toast.error("Please paste the job description first.");
            return;
        }

        setIsGenerating(true);
        const loadingId = toast.loading("AI is crafting your irresistible proposal...");
        try {
            const res = await api.post('/cv/proposal', {
                job_description: jobDescription,
                cv_id: selectedCvId
            });

            setResult(res.data);
            toast.success("Proposal ready to win!", { id: loadingId });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to generate proposal.", { id: loadingId });
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.proposal);
        setHasCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-32">
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                        <PenTool className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Proposal Engine</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 uppercase">
                    Win the <span className="text-blue-600">Gig.</span>
                </h1>
                <p className="text-sm font-medium text-zinc-400 max-w-2xl leading-relaxed">
                    Generate high-converting Upwork proposals in seconds. Using your background and the job's unique needs to craft a hook that clients can't ignore.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Input */}
                <div className="lg:col-span-5 space-y-8">
                    <section className="rounded-[2.5rem] border border-zinc-100 bg-white p-10 space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-blue-500" />
                                Select Source CV
                            </h3>
                            <div className="space-y-3">
                                {cvs.map((cv) => (
                                    <button
                                        key={cv.id}
                                        onClick={() => setSelectedCvId(cv.id)}
                                        className={cn(
                                            "w-full text-left p-4 rounded-2xl text-[11px] font-bold transition-all border",
                                            selectedCvId === cv.id
                                                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                                                : "bg-zinc-50 text-zinc-500 border-zinc-100 hover:bg-zinc-100"
                                        )}
                                    >
                                        {cv.profile_name || cv.filename}
                                    </button>
                                ))}
                                {cvs.length === 0 && (
                                    <p className="text-[10px] text-zinc-400 italic">No CVs found. Upload one in Profile first.</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-blue-500" />
                                    Job Description
                                </h3>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the Upwork/Job post text here..."
                                className="w-full h-80 p-6 rounded-3xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-blue-600 transition-all outline-none font-medium text-sm text-zinc-600 leading-relaxed resize-none"
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !jobDescription.trim() || !selectedCvId}
                            className="w-full h-16 rounded-2xl bg-zinc-900 text-white text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all hover:bg-black hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-xl shadow-zinc-200"
                        >
                            {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                            Wrire Proposal
                        </button>
                    </section>
                </div>

                {/* Right: Output */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                        <PenTool className="h-40 w-40 text-blue-600" />
                                    </div>

                                    <div className="relative z-10 space-y-8">
                                        <div className="flex items-center justify-between border-b border-zinc-50 pb-6">
                                            <div>
                                                <h3 className="text-lg font-black tracking-tight text-zinc-900">Your Generated Proposal</h3>
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Ready for copy & paste</p>
                                            </div>
                                            <button
                                                onClick={copyToClipboard}
                                                className={cn(
                                                    "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    hasCopied ? "bg-emerald-500 text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                )}
                                            >
                                                {hasCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                {hasCopied ? "Copied!" : "Copy to Upwork"}
                                            </button>
                                        </div>

                                        <div className="bg-zinc-50/50 rounded-3xl p-8 border border-zinc-100">
                                            <textarea
                                                readOnly
                                                value={result.proposal}
                                                className="w-full min-h-[400px] bg-transparent outline-none font-medium text-sm text-zinc-600 leading-[1.8] resize-none"
                                            />
                                        </div>

                                        {result.strategy_used && (
                                            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 flex items-center gap-2">
                                                    <Zap className="h-3 w-3" />
                                                    AI Strategy Applied
                                                </h4>
                                                <p className="text-[11px] font-bold text-blue-900/70 leading-relaxed italic">
                                                    "{result.strategy_used}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[600px] rounded-[2.5rem] border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center text-center p-12 text-zinc-300 bg-zinc-50/20"
                            >
                                <div className="h-24 w-24 rounded-full bg-white border border-zinc-50 flex items-center justify-center mb-8 shadow-sm">
                                    <RefreshCw className="h-10 w-10 animate-pulse text-zinc-200" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-400 mb-2 uppercase tracking-tighter">Waiting for Input</h3>
                                <p className="text-sm font-medium max-w-sm">
                                    Paste the job description on the left to generate your custom-tailored proposal.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
