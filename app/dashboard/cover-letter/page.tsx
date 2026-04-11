"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, Sparkles, Loader2, Copy, CheckCircle2,
    Briefcase, Zap, RefreshCw, Download
} from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { cn } from "@/app/lib/utils";

interface CoverLetterResult {
    cover_letter: string;
    strategic_approach: string;
}

export default function CoverLetterWriterPage() {
    const [jobDescription, setJobDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [cvs, setCvs] = useState<any[]>([]);
    const [selectedCvId, setSelectedCvId] = useState<string | null>(null);
    const [result, setResult] = useState<CoverLetterResult | null>(null);
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
        const loadingId = toast.loading("AI is crafting your cover letter...");
        try {
            const res = await api.post('/cv/cover-letter', {
                job_description: jobDescription,
                cv_id: selectedCvId
            });
            setResult(res.data);
            toast.success("Cover letter ready!", { id: loadingId });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to generate cover letter.", { id: loadingId });
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.cover_letter);
        setHasCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setHasCopied(false), 2000);
    };

    const downloadAsPDF = () => {
        if (!result) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(`
            <html>
                <head>
                    <title>Cover Letter</title>
                    <style>
                        body { font-family: 'Georgia', serif; line-height: 1.6; padding: 40mm 25mm; max-width: 210mm; margin: 0 auto; color: #1a1a1a; font-size: 11pt; }
                        .content { white-space: pre-wrap; }
                        @page { size: A4; margin: 0; }
                    </style>
                </head>
                <body>
                    <div class="content">${result.cover_letter}</div>
                    <script>window.onload = function() { window.print(); window.close(); }</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="w-full min-h-full pb-20">

            {/* Page header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">AI-Powered</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">Cover Letter Writer</h1>
                <p className="text-sm text-zinc-400 mt-1.5 max-w-xl">
                    Paste a job description and AI will craft a tailored cover letter aligned with your resume and the role.
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

                    {/* Step 2: Job description */}
                    <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
                            <div className="flex items-center gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shrink-0">2</span>
                                <span className="text-sm font-black text-zinc-900">Job Description</span>
                            </div>
                            <span className="text-[10px] text-zinc-300 font-bold">{jobDescription.length} chars</span>
                        </div>
                        <div className="p-4">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
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
                        {isGenerating ? "Writing your letter..." : "Generate Cover Letter"}
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
                                            <p className="text-sm font-black text-zinc-900">Cover Letter</p>
                                            <p className="text-[11px] text-zinc-400">Ready to submit</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={downloadAsPDF}
                                                className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                PDF
                                            </button>
                                            <button
                                                onClick={copyToClipboard}
                                                className={cn(
                                                    "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-bold transition-all",
                                                    hasCopied
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                )}
                                            >
                                                {hasCopied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                {hasCopied ? "Copied" : "Copy all"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Letter body */}
                                    <div className="p-6">
                                        <textarea
                                            readOnly
                                            value={result.cover_letter}
                                            className="w-full min-h-96 bg-zinc-50 border border-zinc-100 rounded-xl p-5 outline-none text-sm text-zinc-700 leading-relaxed resize-none"
                                            style={{ fontFamily: '"Georgia", serif' }}
                                        />
                                    </div>
                                </div>

                                {/* Strategic note */}
                                {result.strategic_approach && (
                                    <div className="rounded-2xl border border-zinc-100 bg-white p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="h-3.5 w-3.5 text-blue-600" />
                                            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Strategy applied</span>
                                        </div>
                                        <p className="text-sm text-zinc-600 leading-relaxed italic">"{result.strategic_approach}"</p>
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
                                    <FileText className="h-5 w-5 text-zinc-200" />
                                </div>
                                <p className="text-sm font-bold text-zinc-300 mb-1">Your cover letter will appear here</p>
                                <p className="text-xs text-zinc-300 max-w-xs">Select a resume and paste a job description on the left, then click generate.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
