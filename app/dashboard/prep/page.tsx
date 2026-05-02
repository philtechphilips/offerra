"use client";

import React, { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Zap,
    Loader2,
    Briefcase,
    CheckCircle2,
    MessageSquare,
    Lightbulb,
    ShieldCheck,
    ChevronDown,
    ChevronUp,
    Sparkles,
    FileText,
    Copy,
    ListChecks,
    ChevronRight,
    Trash2,
    BookOpen,
    Clock,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { cn } from "@/app/lib/utils";
import { useJobStore, type JobApplication } from "@/app/store/jobStore";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const STORAGE_KEY = "offerra-interview-prep-v1";
const JD_SOFT_MIN = 120;

interface PrepItem {
    category: string;
    question: string;
    suggested_answer: string;
    why_this_works: string;
}

interface PrepMeta {
    generated_at?: string;
    question_count?: number;
    credit_cost?: number;
}

interface PrepResult {
    prep_guide: PrepItem[];
    general_tips: string[];
    meta?: PrepMeta;
}

interface StoredSession {
    result: PrepResult;
    jobDescription: string;
    selectedCvId: string | null;
    linkedJobId: string | null;
}

function formatGeneratedAt(iso?: string) {
    if (!iso) return null;
    try {
        return new Date(iso).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        });
    } catch {
        return null;
    }
}

function PrepContent() {
    const searchParams = useSearchParams();
    const jobIdFromUrl = searchParams.get("job");
    const { jobs: storeJobs, fetchJobs } = useJobStore();

    const [cvs, setCvs] = useState<any[]>([]);
    const [selectedCvId, setSelectedCvId] = useState<string | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<PrepResult | null>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [allExpanded, setAllExpanded] = useState(false);
    const [jobOptions, setJobOptions] = useState<JobApplication[]>([]);
    const [linkedJobId, setLinkedJobId] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [confirmReplace, setConfirmReplace] = useState(false);

    useEffect(() => {
        fetchJobs(true);
        const fetchCVs = async () => {
            try {
                const res = await api.get("/cv");
                const list = res.data.cvs || [];
                setCvs(list);
                const active = list.find((c: any) => c.is_active);
                if (active) setSelectedCvId(active.id);
            } catch {
                toast.error("Could not load your resumes.");
            }
        };
        fetchCVs();
    }, [fetchJobs]);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const res = await api.get("/jobs", { params: { page: 1, per_page: 40 } });
                setJobOptions(res.data?.data || []);
            } catch {
                /* optional */
            }
        };
        loadJobs();
    }, []);

    const mergedJobList = useMemo(() => {
        const byId = new Map<string, JobApplication>();
        jobOptions.forEach((j) => byId.set(j.id, j));
        storeJobs.forEach((j) => {
            if (!byId.has(j.id)) byId.set(j.id, j);
        });
        return Array.from(byId.values()).sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }, [jobOptions, storeJobs]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as StoredSession;
            if (parsed?.result?.prep_guide?.length && parsed.jobDescription) {
                setResult(parsed.result);
                setJobDescription(parsed.jobDescription);
                if (parsed.selectedCvId) setSelectedCvId(parsed.selectedCvId);
                if (parsed.linkedJobId) setLinkedJobId(parsed.linkedJobId);
                setOpenIndex(0);
                setAllExpanded(false);
            }
        } catch {
            /* ignore corrupt storage */
        }
    }, []);

    useEffect(() => {
        if (!jobIdFromUrl || mergedJobList.length === 0) return;
        const job = mergedJobList.find((j) => j.id === jobIdFromUrl);
        if (job) {
            setLinkedJobId(job.id);
            if (job.description?.trim()) setJobDescription(job.description);
            else setJobDescription(`${job.title} at ${job.company}${job.location ? ` · ${job.location}` : ""}`);
        }
    }, [jobIdFromUrl, mergedJobList]);

    const persistSession = useCallback(
        (next: PrepResult | null, jd: string, cvId: string | null, jobId: string | null) => {
            if (typeof window === "undefined") return;
            if (!next?.prep_guide?.length) {
                localStorage.removeItem(STORAGE_KEY);
                return;
            }
            const payload: StoredSession = {
                result: next,
                jobDescription: jd,
                selectedCvId: cvId,
                linkedJobId: jobId,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        },
        []
    );

    useEffect(() => {
        persistSession(result, jobDescription, selectedCvId, linkedJobId);
    }, [result, jobDescription, selectedCvId, linkedJobId, persistSession]);

    const categories = useMemo(() => {
        if (!result?.prep_guide) return ["all"];
        const set = new Set<string>();
        (result.prep_guide ?? []).forEach((p) => {
            if (p.category?.trim()) set.add(p.category.trim());
        });
        return ["all", ...Array.from(set).sort()];
    }, [result]);

    const filteredGuide = useMemo(() => {
        if (!result?.prep_guide) return [];
        const rows = (result.prep_guide ?? []).map((item, origIdx) => ({ item, origIdx }));
        if (categoryFilter === "all") return rows;
        return rows.filter(({ item }) => (item?.category ?? '').trim() === categoryFilter);
    }, [result, categoryFilter]);

    const jdLength = jobDescription.trim().length;
    const jdHint =
        jdLength < JD_SOFT_MIN
            ? "Add responsibilities, tech stack, and team context for stronger questions."
            : "Good level of detail for tailored prep.";

    const runGenerate = async () => {
        if (!jobDescription.trim()) {
            toast.error("Add job context first (paste a posting or pick an application).");
            return;
        }
        setIsGenerating(true);
        const loadingId = toast.loading("Building a tough question lineup…");
        try {
            const res = await api.post("/cv/interview-prep", {
                job_description: jobDescription.trim(),
                cv_id: selectedCvId,
            });
            setResult(res.data);
            setAllExpanded(false);
            setOpenIndex(0);
            setCategoryFilter("all");
            toast.success("Pressure-test playbook ready — rehearse out loud.", { id: loadingId });
        } catch (err: any) {
            const msg = err.response?.data?.error || "Could not generate prep. Try again.";
            toast.error(msg, { id: loadingId });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateClick = () => {
        if (result?.prep_guide?.length) {
            setConfirmReplace(true);
            return;
        }
        void runGenerate();
    };

    const clearSession = () => {
        setResult(null);
        setOpenIndex(null);
        setAllExpanded(false);
        if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
        toast.success("Session cleared.");
    };

    const copyText = async (label: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${label} copied`);
        } catch {
            toast.error("Copy failed");
        }
    };

    const copyFullPlaybook = async () => {
        if (!result) return;
        const lines: string[] = [
            "# Interview practice playbook",
            "",
            "## Coaching tips",
            ...(result.general_tips || []).map((t, i) => `${i + 1}. ${t}`),
            "",
            "## Questions & answers",
        ];
        (result.prep_guide ?? []).forEach((item, idx) => {
            lines.push(`\n### ${idx + 1}. [${item?.category ?? ''}] ${item?.question ?? ''}\n`);
            lines.push(item?.suggested_answer ?? '');
            lines.push(`\n_Why this works:_ ${item?.why_this_works ?? ''}\n`);
        });
        await copyText("Full playbook", lines.join("\n"));
    };

    const isExpanded = (idx: number) => allExpanded || openIndex === idx;

    const toggleCard = (idx: number) => {
        if (allExpanded) {
            setAllExpanded(false);
            setOpenIndex(idx);
            return;
        }
        setOpenIndex(openIndex === idx ? null : idx);
    };

    const generatedLabel = formatGeneratedAt(result?.meta?.generated_at);

    return (
        <div className="w-full min-h-full pb-24">
            <div className="relative overflow-hidden rounded-[2rem] border border-zinc-100 bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950 p-8 lg:p-10 text-white mb-10 shadow-xl">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-4">
                        <Sparkles className="h-3 w-3" />
                        Practice studio
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-3">
                        Interview practice
                    </h1>
                    <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                        A large set of <span className="text-zinc-200">high-pressure</span>, role-specific questions—resume
                        stress-tests, trade-offs, curveballs, and bar-raiser style probes—with STAR-grounded answer drafts
                        from your real CV. Built for serious rehearsal.
                    </p>
                    {generatedLabel && (
                        <p className="mt-4 flex items-center gap-2 text-[11px] font-bold text-zinc-500">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            Last playbook: {generatedLabel}
                            {result?.meta?.question_count != null && (
                                <span className="text-zinc-600">· {result.meta.question_count} questions</span>
                            )}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-6">
                    <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 border-b border-zinc-50 px-5 py-4">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-black text-white">
                                1
                            </span>
                            <div>
                                <p className="text-sm font-black text-zinc-900">Resume source</p>
                                <p className="text-[11px] font-medium text-zinc-400">Which profile the coach reads from</p>
                            </div>
                        </div>
                        <div className="p-4">
                            {cvs.length === 0 ? (
                                <div className="flex flex-col items-center py-8 text-center">
                                    <FileText className="h-8 w-8 text-zinc-200 mb-3" />
                                    <p className="text-xs font-bold text-zinc-500 mb-4 max-w-[220px]">
                                        Upload a CV on your profile so we can anchor answers to your real experience.
                                    </p>
                                    <Link
                                        href="/dashboard/profile"
                                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-black text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Go to profile
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                    {cvs.map((cv) => (
                                        <button
                                            key={cv.id}
                                            type="button"
                                            onClick={() => setSelectedCvId(cv.id)}
                                            className={cn(
                                                "w-full text-left flex items-center gap-3 p-3 rounded-xl text-sm transition-all border",
                                                selectedCvId === cv.id
                                                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                                                    : "border-transparent bg-zinc-50 text-zinc-700 hover:border-zinc-200 hover:bg-white"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "h-8 w-8 shrink-0 rounded-lg flex items-center justify-center border",
                                                    selectedCvId === cv.id
                                                        ? "border-white/20 bg-white/10"
                                                        : "border-zinc-100 bg-white"
                                                )}
                                            >
                                                <FileText
                                                    className={cn(
                                                        "h-4 w-4",
                                                        selectedCvId === cv.id ? "text-white" : "text-blue-600"
                                                    )}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold truncate">
                                                    {cv.profile_name || cv.filename}
                                                </p>
                                                {cv.is_active && (
                                                    <p
                                                        className={cn(
                                                            "text-[10px] font-black uppercase tracking-wider",
                                                            selectedCvId === cv.id ? "text-blue-100" : "text-blue-600"
                                                        )}
                                                    >
                                                        Active
                                                    </p>
                                                )}
                                            </div>
                                            {selectedCvId === cv.id && (
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 border-b border-zinc-50 px-5 py-4">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-black text-white">
                                2
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-zinc-900">Role & company context</p>
                                <p className="text-[11px] font-medium text-zinc-400">
                                    Paste a posting or pull from your pipeline
                                </p>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">
                                    Application (optional)
                                </label>
                                <div className="relative">
                                    <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                    <select
                                        className="w-full appearance-none rounded-xl border border-zinc-100 bg-zinc-50 py-2.5 pl-10 pr-9 text-xs font-bold text-zinc-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
                                        value={linkedJobId || ""}
                                        onChange={(e) => {
                                            const id = e.target.value || null;
                                            setLinkedJobId(id);
                                            if (!id) return;
                                            const job = mergedJobList.find((j) => j.id === id);
                                            if (job) {
                                                if (job.description?.trim()) setJobDescription(job.description);
                                                else
                                                    setJobDescription(
                                                        `${job.title} at ${job.company}${job.location ? ` · ${job.location}` : ""}`
                                                    );
                                            }
                                        }}
                                    >
                                        <option value="">Custom — paste below</option>
                                        {mergedJobList.map((job) => (
                                            <option key={job.id} value={job.id}>
                                                {job.title} · {job.company}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                        Job description & notes
                                    </label>
                                    <span
                                        className={cn(
                                            "text-[10px] font-bold tabular-nums",
                                            jdLength < JD_SOFT_MIN ? "text-amber-600" : "text-emerald-600"
                                        )}
                                    >
                                        {jdLength} chars
                                    </span>
                                </div>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the full posting, or bullets: stack, responsibilities, team size, metrics they care about…"
                                    rows={9}
                                    className="w-full resize-y rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-800 outline-none transition-all focus:border-blue-500 focus:bg-white min-h-[180px]"
                                />
                                <p className="mt-1.5 text-[11px] font-medium text-zinc-400">{jdHint}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={handleGenerateClick}
                            disabled={isGenerating || !jobDescription.trim() || jdLength < 20}
                            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40"
                        >
                            {isGenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Zap className="h-4 w-4" />
                            )}
                            {isGenerating ? "Generating…" : result ? "Regenerate playbook" : "Generate playbook"}
                        </button>
                        {result && (
                            <button
                                type="button"
                                onClick={clearSession}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-black uppercase tracking-widest text-zinc-500 hover:border-red-200 hover:text-red-600 transition-all"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Clear
                            </button>
                        )}
                    </div>

                    {result && (result.general_tips?.length ?? 0) > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-amber-100 bg-amber-50/40 overflow-hidden"
                        >
                            <div className="flex items-center gap-2 border-b border-amber-100/80 px-5 py-3">
                                <Lightbulb className="h-4 w-4 text-amber-600" />
                                <span className="text-xs font-black text-amber-900">Session coaching tips</span>
                            </div>
                            <ul className="p-4 space-y-2.5">
                                {(result.general_tips ?? []).map((tip, i) => (
                                    <li key={i} className="flex gap-2.5 text-xs text-amber-950/80 leading-relaxed">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-black text-amber-700 border border-amber-100">
                                            {i + 1}
                                        </span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </div>

                <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-100 bg-zinc-50/80 px-4 py-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span>STAR = Situation · Task · Action · Result — speak it, don&apos;t memorize verbatim.</span>
                        </div>
                        {result && (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAllExpanded(true);
                                        setOpenIndex(null);
                                    }}
                                    className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-blue-200 hover:text-blue-700 transition-all"
                                >
                                    Expand all
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAllExpanded(false);
                                        setOpenIndex(null);
                                    }}
                                    className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-blue-200 hover:text-blue-700 transition-all"
                                >
                                    Collapse all
                                </button>
                                <button
                                    type="button"
                                    onClick={() => void copyFullPlaybook()}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-blue-200 hover:text-blue-700 transition-all"
                                >
                                    <Copy className="h-3 w-3" />
                                    Copy all
                                </button>
                            </div>
                        )}
                    </div>

                    {result && categories.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => {
                                        setCategoryFilter(cat);
                                        setAllExpanded(false);
                                        setOpenIndex(0);
                                    }}
                                    className={cn(
                                        "h-8 rounded-full px-3 text-[10px] font-black uppercase tracking-widest transition-all border",
                                        categoryFilter === cat
                                            ? "border-blue-600 bg-blue-600 text-white"
                                            : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
                                    )}
                                >
                                    {cat === "all" ? "All questions" : cat}
                                </button>
                            ))}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {result && filteredGuide.length > 0 ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                            >
                                {filteredGuide.map(({ item, origIdx }) => {
                                    const expanded = isExpanded(origIdx);
                                    return (
                                        <div
                                            key={`${origIdx}-${(item.question ?? '').slice(0, 40)}`}
                                            className={cn(
                                                "rounded-2xl border bg-white overflow-hidden transition-all shadow-sm",
                                                expanded ? "border-blue-200 ring-1 ring-blue-100" : "border-zinc-100 hover:border-zinc-200"
                                            )}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleCard(origIdx)}
                                                className="flex w-full items-start gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5"
                                            >
                                                <div
                                                    className={cn(
                                                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                                                        expanded
                                                            ? "border-blue-600 bg-blue-600 text-white"
                                                            : "border-zinc-100 bg-zinc-50 text-zinc-400"
                                                    )}
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <span className="mb-1 inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-zinc-500">
                                                        {item.category}
                                                    </span>
                                                    <h3 className="text-sm font-bold leading-snug text-zinc-900 sm:text-[15px]">
                                                        {item.question}
                                                    </h3>
                                                </div>
                                                {expanded ? (
                                                    <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
                                                ) : (
                                                    <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
                                                )}
                                            </button>

                                            <AnimatePresence>
                                                {expanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden border-t border-zinc-50"
                                                    >
                                                        <div className="space-y-4 px-4 pb-5 pt-4 sm:px-5">
                                                            <div>
                                                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                                        Suggested answer (draft)
                                                                    </p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            void copyText("Answer", item.suggested_answer)
                                                                        }
                                                                        className="inline-flex h-7 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:border-blue-200 hover:text-blue-700"
                                                                    >
                                                                        <Copy className="h-3 w-3" />
                                                                        Copy
                                                                    </button>
                                                                </div>
                                                                <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm leading-relaxed text-zinc-700">
                                                                    {item.suggested_answer}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                                                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                                                <div>
                                                                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-blue-700">
                                                                        Coach note
                                                                    </p>
                                                                    <p className="text-xs leading-relaxed text-blue-950/80">
                                                                        {item.why_this_works}
                                                                    </p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            void copyText("Coach note", item.why_this_works)
                                                                        }
                                                                        className="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        Copy note
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-zinc-100 bg-gradient-to-b from-white to-zinc-50/80 p-10 text-center"
                            >
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-100 bg-white shadow-sm">
                                    <ListChecks className="h-7 w-7 text-blue-500" />
                                </div>
                                <p className="text-base font-black text-zinc-900">Your playbook appears here</p>
                                <p className="mt-2 max-w-sm text-sm font-medium text-zinc-500 leading-relaxed">
                                    You&apos;ll get a long list of demanding questions—not softballs—plus draft answers
                                    grounded in your CV. Save a rich job posting (or pick an application), then generate.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmReplace}
                onClose={() => setConfirmReplace(false)}
                onConfirm={() => {
                    setConfirmReplace(false);
                    void runGenerate();
                }}
                title="Replace current playbook?"
                description="Generating again will overwrite the prep guide and coaching tips shown on this page. Your last session is cleared from view (you can still copy content first)."
                confirmLabel="Regenerate"
                isLoading={isGenerating}
            />
        </div>
    );
}

export default function InterviewPrepPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
                </div>
            }
        >
            <PrepContent />
        </Suspense>
    );
}
