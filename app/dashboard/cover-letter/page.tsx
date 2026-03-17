"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, Sparkles, Loader2, Copy, CheckCircle2,
    Briefcase, ArrowRight, Zap, Target, RefreshCw,
    Download, Printer
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
    const letterRef = useRef<HTMLDivElement>(null);

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
        const loadingId = toast.loading("AI is crafting your professional cover letter...");
        try {
            const res = await api.post('/cv/cover-letter', {
                job_description: jobDescription,
                cv_id: selectedCvId
            });

            setResult(res.data);
            toast.success("Cover letter ready for submission!", { id: loadingId });
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
                        body { 
                            font-family: 'Georgia', serif; 
                            line-height: 1.6; 
                            padding: 40mm 25mm; 
                            max-width: 210mm; 
                            margin: 0 auto;
                            color: #1a1a1a;
                            font-size: 11pt;
                        }
                        .content { white-space: pre-wrap; }
                        @page { size: A4; margin: 0; }
                    </style>
                </head>
                <body>
                    <div class="content">${result.cover_letter}</div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-32 px-4 md:px-0">
            {/* Background Decorations */}
            <div className="absolute -top-40 -right-40 h-[600px] w-[600px] bg-blue-50/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] bg-indigo-50/10 rounded-full blur-[100px] -z-10" />

            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm animate-pulse">
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">The Pitch Deck</span>
                </div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-black tracking-tight text-brand-blue-black uppercase leading-none"
                >
                    Write <span className="text-blue-600">to Win.</span>
                </motion.h1>
                <p className="text-sm font-medium text-zinc-400 max-w-2xl leading-relaxed">
                    AI-powered narrative design. We synchronize your career highlights with the company's pain points to create a cover letter that commands attention.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left: Engine Controls */}
                <div className="lg:col-span-5 space-y-8 sticky top-8">
                    <section className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 md:p-10 shadow-xl shadow-zinc-200/50 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-blue-500" />
                                    1. Source Profile
                                </h3>
                                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-600 border border-blue-100">
                                    {cvs.length}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {cvs.map((cv) => (
                                    <button
                                        key={cv.id}
                                        onClick={() => setSelectedCvId(cv.id)}
                                        className={cn(
                                            "group relative w-full text-left p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border",
                                            selectedCvId === cv.id
                                                ? "bg-brand-blue-black text-white border-brand-blue-black shadow-xl shadow-blue-900/10"
                                                : "bg-zinc-50 text-zinc-400 border-zinc-50 hover:bg-zinc-100 hover:border-zinc-200"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="truncate pr-4">{cv.profile_name || cv.filename}</span>
                                            {selectedCvId === cv.id && (
                                                <motion.div layoutId="active-check" className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                                {cvs.length === 0 && (
                                    <div className="p-10 text-center rounded-3xl bg-zinc-50 border-2 border-dashed border-zinc-200">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">No profiles found</p>
                                        <button className="mt-2 text-blue-600 font-bold text-xs">Upload CV First</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-blue-500" />
                                    2. Match Target
                                </h3>
                            </div>
                            <div className="relative group/textarea">
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job requirements or company mission here..."
                                    className="w-full h-80 p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none font-medium text-sm text-zinc-600 leading-relaxed resize-none shadow-inner"
                                />
                                <div className="absolute bottom-4 right-6 text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                                    {jobDescription.length} chars
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !jobDescription.trim() || !selectedCvId}
                            className="group relative w-full h-20 rounded-3xl bg-blue-600 text-white text-[13px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all hover:bg-brand-blue-black hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-blue-600/20 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            {isGenerating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                            Refactor Narrative
                        </button>
                    </section>
                </div>

                {/* Right: Premium Output Display */}
                <div className="lg:col-span-7 h-full">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ type: "spring", damping: 20 }}
                                className="space-y-8"
                            >
                                <div className="rounded-[2.5rem] border border-zinc-100 bg-white shadow-2xl shadow-zinc-200/40 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
                                        <Printer className="h-64 w-64 text-blue-600" />
                                    </div>

                                    {/* Action Bar */}
                                    <div className="flex items-center justify-between p-8 md:p-10 border-b border-zinc-50 bg-zinc-50/30 backdrop-blur-sm sticky top-0 z-20">
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight text-brand-blue-black uppercase">Cover Letter</h3>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Generated by Intelligence</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={downloadAsPDF}
                                                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white border border-zinc-100 text-zinc-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                                            >
                                                <Download className="h-4 w-4" />
                                                Download
                                            </button>
                                            <button
                                                onClick={copyToClipboard}
                                                className={cn(
                                                    "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95",
                                                    hasCopied ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-blue-600 text-white shadow-blue-200"
                                                )}
                                            >
                                                {hasCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                {hasCopied ? "Copied" : "Copy All"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Area - Designed to look like a high-end document */}
                                    <div className="p-10 md:p-16 relative">
                                        {/* Stylized Side Marker */}
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-blue-600/10 rounded-r-full" />

                                        <div className="max-w-[85%] mx-auto bg-white">
                                            <div className="prose prose-sm max-w-none">
                                                <textarea
                                                    readOnly
                                                    value={result.cover_letter}
                                                    className="w-full min-h-[600px] bg-transparent outline-none font-medium text-[16px] text-zinc-700 leading-[1.8] resize-none selection:bg-blue-100"
                                                    style={{ fontFamily: 'var(--font-serif, "Georgia", serif)' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Intelligence Strategy Overlay */}
                                    {result.strategic_approach && (
                                        <div className="m-8 p-8 rounded-3xl bg-brand-blue-black text-white relative overflow-hidden group/tip border border-white/5">
                                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/tip:scale-110 transition-transform">
                                                <Zap className="h-16 w-16 text-blue-400" />
                                            </div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-3 flex items-center gap-2">
                                                <Zap className="h-3 w-3 fill-blue-400" />
                                                Strategic Narrative
                                            </h4>
                                            <p className="text-sm font-bold text-zinc-300 leading-relaxed italic">
                                                "{result.strategic_approach}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[700px] rounded-[3rem] border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center text-center p-12 text-zinc-300 bg-zinc-50/10 relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="h-28 w-28 rounded-[2.5rem] bg-white border border-zinc-100 flex items-center justify-center mb-8 shadow-2xl shadow-zinc-100 group-hover:rotate-6 transition-transform duration-500">
                                        <RefreshCw className="h-12 w-12 animate-pulse text-blue-100" />
                                    </div>
                                    <h3 className="text-3xl font-black text-zinc-300 mb-3 uppercase tracking-tighter">Ready for Signal</h3>
                                    <p className="text-sm font-black text-zinc-300 uppercase tracking-widest max-w-sm leading-relaxed">
                                        Paste the Job Target & Select Profile<br />
                                        <span className="text-zinc-200">Our AI will generate the rest.</span>
                                    </p>
                                    <div className="mt-10 flex gap-2 justify-center opacity-30">
                                        <div className="h-1 w-8 bg-zinc-200 rounded-full" />
                                        <div className="h-1 w-1 bg-zinc-200 rounded-full" />
                                        <div className="h-1 w-1 bg-zinc-200 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
