"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, Sparkles, Upload, Mail, FileText, BarChart2,
    CheckCircle2, Zap, Edit, Brain, MessageSquare, ChevronRight,
    Shield, Play, Pause, Volume2, VolumeX, Maximize, Clock, Star,
    ArrowRight, Users, TrendingUp, Target, Award
} from "lucide-react";
import { cn } from "@/app/lib/utils";

/* ─────────────────────────────────────────────
   CONSTANTS & DATA
───────────────────────────────────────────── */
const BRAND_BLUE = "#2563eb";

const features = [
    {
        id: "track",
        icon: Briefcase,
        label: "Smart Tracking",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        headline: "Every application. One place.",
        body: "Log jobs manually or let Offerra detect them from your Gmail. Status pipelines — Applied, Interview, Offer — update automatically.",
        stat: { value: "3×", label: "fewer missed follow-ups" },
        visual: <TrackVisual />,
    },
    {
        id: "ai-match",
        icon: Target,
        label: "CV–Job Matching",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        headline: "Know your odds before you apply.",
        body: "Offerra scores each job against your active resume — surfacing strengths, skills gaps, and quick-win tips in seconds.",
        stat: { value: "87%", label: "average match accuracy" },
        visual: <MatchVisual />,
    },
    {
        id: "optimizer",
        icon: Edit,
        label: "Resume Optimizer",
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100",
        headline: "Tailor your CV in one click.",
        body: "Paste a job description. Offerra rewrites your bullet points, surfaces the right keywords, and exports a polished PDF or Word doc.",
        stat: { value: "5 min", label: "from paste to download" },
        visual: <OptimizerVisual />,
    },
    {
        id: "prep",
        icon: Brain,
        label: "Interview Prep",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        headline: "Walk into every interview ready.",
        body: "AI generates role-specific STAR questions with model answers — explained so you understand the why, not just the words.",
        stat: { value: "40+", label: "questions per prep guide" },
        visual: <PrepVisual />,
    },
    {
        id: "bios",
        icon: Sparkles,
        label: "Social Bios",
        color: "text-pink-600",
        bg: "bg-pink-50",
        border: "border-pink-100",
        headline: "LinkedIn. GitHub. Upwork. Done.",
        body: "One click turns your CV into polished bios across all four platforms — with the right tone for each audience.",
        stat: { value: "4", label: "profiles generated at once" },
        visual: <BiosVisual />,
    },
    {
        id: "gmail",
        icon: Mail,
        label: "Gmail Sync",
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-100",
        headline: "Your inbox becomes your tracker.",
        body: "Connect Gmail with one tap. Offerra scans for application confirmations, interview invites, and technical tests — automatically.",
        stat: { value: "OAuth 2.0", label: "bank-grade security" },
        visual: <GmailVisual />,
    },
];

const steps = [
    { n: "01", icon: Upload, label: "Upload your CV", desc: "PDF, Word, or plain text — parsed by AI in seconds." },
    { n: "02", icon: Briefcase, label: "Add applications", desc: "Manually or synced from Gmail automatically." },
    { n: "03", icon: Zap, label: "Let AI work", desc: "Matching, optimization, prep guides — on demand." },
    { n: "04", icon: Award, label: "Land the offer", desc: "Track offers, compare roles, celebrate wins." },
];

/* ─────────────────────────────────────────────
   MINI VISUAL COMPONENTS (fake UI previews)
───────────────────────────────────────────── */
function TrackVisual() {
    const apps = [
        { title: "Senior Frontend Engineer", co: "Stripe", status: "Interview", match: 94, color: "bg-blue-100 text-blue-700" },
        { title: "Product Designer", co: "Notion", status: "Applied", match: 78, color: "bg-zinc-100 text-zinc-600" },
        { title: "Full-Stack Developer", co: "Linear", status: "Offer", match: 91, color: "bg-emerald-100 text-emerald-700" },
    ];
    return (
        <div className="space-y-3">
            {apps.map((a, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-white px-5 py-4"
                >
                    <div>
                        <p className="text-sm font-bold text-zinc-900">{a.title}</p>
                        <p className="text-xs text-zinc-400 font-medium mt-0.5">{a.co}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-blue-600">{a.match}%</span>
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", a.color)}>{a.status}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function MatchVisual() {
    const [score] = useState(87);
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative h-32 w-32">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f4f4f5" strokeWidth="12" />
                    <motion.circle
                        cx="60" cy="60" r="50"
                        fill="none"
                        stroke={BRAND_BLUE}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - score / 100) }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-zinc-900">{score}%</span>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Match</span>
                </div>
            </div>
            <div className="w-full space-y-2">
                {[["ATS Keywords", 95], ["Skills Alignment", 82], ["Experience Level", 88]].map(([label, val]) => (
                    <div key={label as string} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-zinc-600">
                            <span>{label}</span><span>{val}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-blue-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${val}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function OptimizerVisual() {
    const [phase, setPhase] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setPhase(1), 900);
        return () => clearTimeout(t);
    }, []);
    return (
        <div className="space-y-3">
            <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Before</p>
                <p className="text-xs text-zinc-500 leading-relaxed line-through">Worked on front-end tasks and helped the team with various projects.</p>
            </div>
            {phase === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-blue-50 border border-blue-100 p-4"
                >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-2">After — AI Optimized</p>
                    <p className="text-xs text-zinc-700 font-medium leading-relaxed">Architected 12 React components reducing bundle size by 34%, accelerating team delivery velocity by 2× across 3 product squads.</p>
                </motion.div>
            )}
        </div>
    );
}

function PrepVisual() {
    const qs = [
        "Describe a time you led a cross-functional project under a tight deadline.",
        "How do you approach debugging a production issue with incomplete logs?",
    ];
    return (
        <div className="space-y-4">
            {qs.map((q, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="rounded-2xl border border-zinc-100 bg-white p-5"
                >
                    <div className="flex items-start gap-3">
                        <Brain className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs font-bold text-zinc-800 leading-relaxed">{q}</p>
                    </div>
                    <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1">Suggested Answer →</p>
                        <p className="text-xs text-zinc-600">Start with context, then action, result…</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function BiosVisual() {
    const platforms = [
        { label: "LinkedIn", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        { label: "GitHub", color: "text-zinc-900", bg: "bg-zinc-100", border: "border-zinc-200" },
        { label: "X / Twitter", color: "text-zinc-900", bg: "bg-zinc-100", border: "border-zinc-200" },
        { label: "Upwork", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    ];
    return (
        <div className="grid grid-cols-2 gap-3">
            {platforms.map((p, i) => (
                <motion.div
                    key={p.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn("rounded-2xl border p-4 flex flex-col gap-2", p.bg, p.border)}
                >
                    <span className={cn("text-xs font-black", p.color)}>{p.label}</span>
                    <div className="space-y-1.5">
                        <div className="h-1.5 rounded-full bg-current opacity-20 w-full" />
                        <div className="h-1.5 rounded-full bg-current opacity-20 w-3/4" />
                        <div className="h-1.5 rounded-full bg-current opacity-20 w-5/6" />
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        <span className="text-[9px] font-bold text-zinc-400">Generated</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function GmailVisual() {
    const emails = [
        { from: "careers@stripe.com", subject: "Your application was received", tag: "Applied", color: "bg-blue-50 text-blue-600 border-blue-100" },
        { from: "recruiting@linear.app", subject: "Interview invite — Technical Round", tag: "Interview", color: "bg-violet-50 text-violet-600 border-violet-100" },
        { from: "hr@notion.so", subject: "Technical assessment enclosed", tag: "Test", color: "bg-amber-50 text-amber-600 border-amber-100" },
    ];
    return (
        <div className="space-y-3">
            {emails.map((e, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start justify-between rounded-2xl border border-zinc-100 bg-white p-4 gap-3"
                >
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-zinc-400">{e.from}</p>
                        <p className="text-xs font-bold text-zinc-800 mt-0.5 truncate">{e.subject}</p>
                    </div>
                    <span className={cn("shrink-0 px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider", e.color)}>{e.tag}</span>
                </motion.div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function DemoPage() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const resetInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (!paused) {
            intervalRef.current = setInterval(() => {
                setActive((p) => (p + 1) % features.length);
            }, 4500);
        }
    };

    useEffect(() => {
        resetInterval();
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused, active]);

    const feat = features[active];
    const Icon = feat.icon;

    return (
        <div className="min-h-screen bg-white selection:bg-blue-100 font-sans">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:px-12 text-center">
                {/* subtle radial bg */}
                <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
                    <div className="h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-3xl -translate-y-1/3" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Logo */}
                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-blue-600 shadow-xl shadow-blue-600/25">
                        <Briefcase className="h-9 w-9 text-white" />
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 mb-6">
                        <Sparkles className="h-3 w-3" /> AI-Powered Career Platform
                    </div>

                    <h1 className="mx-auto max-w-3xl text-5xl sm:text-7xl font-black tracking-tight text-zinc-900 leading-[1.05]">
                        Meet <span className="text-blue-600">Offerra</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl text-zinc-500 font-medium leading-relaxed">
                        The silent career assistant that tracks every application, sharpens your resume, preps your interviews, and writes your social bios — all powered by AI.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/dashboard"
                            className="inline-flex items-center gap-3 h-14 px-10 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-xl shadow-blue-600/20"
                        >
                            Get Started Free
                        </a>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-3 h-14 px-10 rounded-2xl bg-zinc-50 border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-100 transition-all"
                        >
                            See How It Works
                        </a>
                    </div>

                    {/* Social proof strip */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-zinc-400">
                        {[
                            { icon: Users, text: "Trusted by 2,000+ job seekers" },
                            { icon: Shield, text: "OAuth 2.0 secured" },
                            { icon: Zap, text: "Powered by GPT-4" },
                        ].map(({ icon: I, text }) => (
                            <span key={text} className="flex items-center gap-2">
                                <I className="h-4 w-4 text-blue-500" /> {text}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="bg-zinc-50 px-6 py-20 sm:px-12">
                <div className="mx-auto max-w-5xl">
                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">How It Works</p>
                    <h2 className="text-center text-4xl font-black tracking-tight text-zinc-900 mb-14">
                        From upload to offer in four steps
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s, i) => {
                            const SI = s.icon;
                            return (
                                <motion.div
                                    key={s.n}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="rounded-[2rem] bg-white border border-zinc-100 p-8 relative"
                                >
                                    <span className="text-[10px] font-black text-zinc-200 absolute top-6 right-8 text-5xl leading-none select-none">{s.n}</span>
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                                        <SI className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <p className="text-base font-black text-zinc-900 mb-2">{s.label}</p>
                                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">{s.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── FEATURE SHOWCASE ── */}
            <section id="features" className="px-6 py-24 sm:px-12">
                <div className="mx-auto max-w-6xl">
                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Everything You Need</p>
                    <h2 className="text-center text-4xl font-black tracking-tight text-zinc-900 mb-4">
                        Six powerful tools. One platform.
                    </h2>
                    <p className="text-center text-zinc-500 font-medium max-w-xl mx-auto mb-16">
                        Every feature works together — your CV feeds your match scores, match scores guide your prep, prep drives your confidence.
                    </p>

                    {/* Tab strip */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {features.map((f, i) => {
                            const FI = f.icon;
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => { setActive(i); setPaused(true); }}
                                    className={cn(
                                        "flex items-center gap-2 h-10 px-5 rounded-full text-xs font-bold border transition-all",
                                        active === i
                                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                                    )}
                                >
                                    <FI className="h-3.5 w-3.5" />
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Feature panel */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={feat.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center rounded-[3rem] border border-zinc-100 bg-zinc-50/60 p-10 sm:p-14"
                        >
                            {/* Left: text */}
                            <div className="space-y-6">
                                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center", feat.bg, feat.border, "border")}>
                                    <Icon className={cn("h-6 w-6", feat.color)} />
                                </div>
                                <div>
                                    <p className={cn("text-[10px] font-black uppercase tracking-widest mb-2", feat.color)}>{feat.label}</p>
                                    <h3 className="text-3xl font-black tracking-tight text-zinc-900 leading-tight">{feat.headline}</h3>
                                </div>
                                <p className="text-base text-zinc-500 font-medium leading-relaxed">{feat.body}</p>
                                <div className={cn("inline-flex items-center gap-3 rounded-2xl border px-6 py-4", feat.bg, feat.border)}>
                                    <span className={cn("text-3xl font-black", feat.color)}>{feat.stat.value}</span>
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{feat.stat.label}</span>
                                </div>
                            </div>

                            {/* Right: visual */}
                            <div className="rounded-[2rem] bg-white border border-zinc-100 p-8 shadow-sm">
                                {feat.visual}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress dots */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {features.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setActive(i); setPaused(true); }}
                                className={cn(
                                    "rounded-full transition-all",
                                    active === i ? "w-8 h-2.5 bg-blue-600" : "w-2.5 h-2.5 bg-zinc-200 hover:bg-zinc-300"
                                )}
                            />
                        ))}
                        <button
                            onClick={() => setPaused((p) => !p)}
                            className="ml-3 h-8 w-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-all"
                        >
                            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                        </button>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section className="bg-blue-600 px-6 py-16 sm:px-12">
                <div className="mx-auto max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                    {[
                        { val: "6", label: "AI-Powered Tools" },
                        { val: "2 min", label: "Average Prep Time" },
                        { val: "4×", label: "More Interview Calls" },
                        { val: "100%", label: "Privacy by Default" },
                    ].map(({ val, label }) => (
                        <div key={label}>
                            <p className="text-4xl sm:text-5xl font-black">{val}</p>
                            <p className="mt-2 text-sm font-bold text-blue-200 uppercase tracking-wider">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="px-6 py-24 sm:px-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl"
                >
                    <div className="mx-auto mb-6 h-16 w-16 rounded-[2rem] bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/25">
                        <Zap className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-5xl font-black tracking-tight text-zinc-900 mb-4">
                        Your next offer starts here.
                    </h2>
                    <p className="text-lg text-zinc-500 font-medium mb-10 leading-relaxed">
                        Stop juggling spreadsheets and blank cover-letter drafts. Let Offerra handle the busywork so you can focus on showing up great.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/dashboard"
                            className="inline-flex items-center gap-3 h-16 px-12 rounded-2xl bg-blue-600 text-base font-bold text-white hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-2xl shadow-blue-600/25"
                        >
                            Start for Free
                        </a>
                    </div>
                    <p className="mt-6 text-xs font-bold text-zinc-300 uppercase tracking-widest">
                        No credit card required · Cancel anytime
                    </p>
                </motion.div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-zinc-100 px-6 py-8 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-zinc-400">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-xl bg-blue-600 flex items-center justify-center">
                        <Briefcase className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-zinc-700">Offerra</span>
                </div>
                <span>© {new Date().getFullYear()} Offerra. Built for the modern job seeker.</span>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-zinc-700 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-zinc-700 transition-colors">Terms</a>
                    <a href="#" className="hover:text-zinc-700 transition-colors">Contact</a>
                </div>
            </footer>
        </div>
    );
}
