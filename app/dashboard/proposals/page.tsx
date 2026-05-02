"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PenTool, Sparkles, Loader2, Copy, CheckCircle2,
    FileText, Zap, RefreshCw
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
        const loadingId = toast.loading("AI is writing your proposal...");
        try {
            const res = await api.post('/cv/proposal', {
                job_description: jobDescription,
                cv_id: selectedCvId
            });
            setResult(res.data);
            toast.success("Proposal ready!", { id: loadingId });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to generate proposal.", { id: loadingId });
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result?.proposal ?? '');
        setHasCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="w-full min-h-full pb-20">

            {/* Page header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <PenTool className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">AI-Powered</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">Proposal Writer</h1>
                <p className="text-sm text-zinc-400 mt-1.5 max-w-xl">
                    Generate high-converting Upwork proposals in seconds — tailored to the job post and your background.
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

                    {/* Step 2: Job post */}
                    <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
                            <div className="flex items-center gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shrink-0">2</span>
                                <span className="text-sm font-black text-zinc-900">Job / Gig Post</span>
                            </div>
                            <span className="text-[10px] text-zinc-300 font-bold">{jobDescription.length} chars</span>
                        </div>
                        <div className="p-4">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the Upwork job post or job description here..."
                                className="w-full h-56 p-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm text-zinc-700 leading-relaxed resize-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !jobDescription.trim() || !selectedCvId}
                        className="w-full h-12 rounded-xl bg-blue-600 text-white text-sm font-black flex items-center justify-center gap-2.5 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-40"
                    >
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {isGenerating ? "Writing your proposal..." : "Generate Proposal"}
                    </button>
                </div>

                {/* Right: Output */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="space-y-4"
                            >
                                <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                                    {/* Action bar */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
                                        <div>
                                            <p className="text-sm font-black text-zinc-900">Your Proposal</p>
                                            <p className="text-[11px] text-zinc-400">Ready to paste on Upwork</p>
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className={cn(
                                                "flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-bold transition-all",
                                                hasCopied
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                            )}
                                        >
                                            {hasCopied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                            {hasCopied ? "Copied!" : "Copy to Upwork"}
                                        </button>
                                    </div>

                                    {/* Proposal body */}
                                    <div className="p-6">
                                        <textarea
                                            readOnly
                                            value={result?.proposal ?? ''}
                                            className="w-full min-h-96 bg-zinc-50 border border-zinc-100 rounded-xl p-5 outline-none text-sm text-zinc-700 leading-relaxed resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Strategy note */}
                                {result.strategy_used && (
                                    <div className="rounded-2xl border border-zinc-100 bg-white p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="h-3.5 w-3.5 text-blue-600" />
                                            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Strategy applied</span>
                                        </div>
                                        <p className="text-sm text-zinc-600 leading-relaxed italic">"{result.strategy_used}"</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-2xl border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center text-center p-12 min-h-80 bg-zinc-50/30"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mb-4">
                                    <PenTool className="h-5 w-5 text-zinc-200" />
                                </div>
                                <p className="text-sm font-bold text-zinc-300 mb-1">Your proposal will appear here</p>
                                <p className="text-xs text-zinc-300 max-w-xs">Select a resume and paste a job post on the left, then click generate.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
