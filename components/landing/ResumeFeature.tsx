"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ResumeFeature() {
    return (
        <section className="py-24 lg:py-32 relative overflow-hidden bg-white">
            {/* Premium Background Accents */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-50/40 rounded-full blur-[120px] -z-10 opacity-70" />
            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-50/30 rounded-full blur-[100px] -z-10 opacity-50" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-100/50 mb-10 backdrop-blur-sm"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Smart Resume Helper</span>
                        </motion.div>

                        <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black tracking-tighter leading-[0.9] mb-10 text-black text-gradient">
                            The only resume <br />
                            you'll ever <span className="text-blue-600">need.</span>
                        </h2>

                        <p className="text-xl font-medium text-zinc-400 mb-12 leading-relaxed max-w-lg">
                            Don't manually rewrite your resume for every job. Paste the job description and our AI will instantly tailor your experience to match perfectly.
                        </p>

                        <div className="space-y-8 mb-16">
                            {[
                                { title: "Get noticed by recruiters", desc: "Our AI adds the right keywords so your resume doesn't get ignored." },
                                { title: "Beautiful layouts", desc: "Professional designs that work perfectly on any device." },
                                { title: "Better words", desc: "We replace boring words with strong ones that show what you've achieved." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    className="flex gap-6"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                >
                                    <div className="mt-1 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-black tracking-tight mb-1">{item.title}</h4>
                                        <p className="text-sm font-medium text-zinc-500">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Link
                            href="/signup"
                            className="group inline-flex items-center gap-4 rounded-3xl bg-blue-600 px-10 py-5 text-sm font-black text-white hover:bg-blue-700 transition-all uppercase tracking-[0.2em] shadow-2xl shadow-blue-200"
                        >
                            Build My Resume
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                    {/* Visualization Side */}
                    <motion.div
                        className="relative p-4 lg:p-12"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Soft Glow */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-square bg-blue-100/30 blur-[140px] rounded-full -z-10" />

                        <div className="relative rounded-[3rem] border border-white/80 bg-white/40 backdrop-blur-3xl p-4 lg:p-8 shadow-[0_64px_120px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
                            <div className="flex flex-col lg:flex-row gap-6">

                                {/* Left: Job Description Scanner */}
                                <div className="w-full lg:w-48 shrink-0 flex flex-col gap-4">
                                    <div className="p-4 rounded-2xl bg-white border border-blue-100/50 text-blue-900 shadow-xl shadow-blue-500/5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600/60">Checking job</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-1.5 w-full bg-blue-50 rounded-full" />
                                            <div className="h-1.5 w-[80%] bg-blue-50 rounded-full" />
                                            <div className="h-3 w-full bg-blue-600/10 rounded-lg flex items-center px-2">
                                                <span className="text-[7px] font-black text-blue-600 uppercase tracking-tight">Keyword: Leadership</span>
                                            </div>
                                            <div className="h-1.5 w-[90%] bg-blue-50 rounded-full" />
                                            <div className="h-3 w-full bg-emerald-600/10 rounded-lg flex items-center px-2">
                                                <span className="text-[7px] font-black text-emerald-600 uppercase tracking-tight">Keyword: Scaling</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm flex-grow">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Match score</span>
                                            <span className="text-[12px] font-black text-blue-600">98%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-blue-600"
                                                initial={{ width: "10%" }}
                                                whileInView={{ width: "98%" }}
                                                transition={{ duration: 2, delay: 0.5 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: The Resume Canvas */}
                                <div className="flex-grow rounded-3xl border border-zinc-100 bg-white p-8 shadow-inner min-h-[520px] relative">
                                    {/* Floating Match Indicators */}
                                    <motion.div
                                        className="absolute -right-4 top-20 p-3 rounded-xl bg-emerald-500 text-white shadow-lg border border-emerald-400 z-30"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                    </motion.div>

                                    {/* Resume Header */}
                                    <div className="flex flex-col items-center gap-2 mb-10 text-center">
                                        <div className="h-6 w-32 bg-blue-600/20 rounded-lg" />
                                        <div className="h-2 w-24 bg-zinc-100 rounded-full" />
                                    </div>

                                    <div className="space-y-8">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="relative group">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-2">
                                                        <div className="h-full w-full rounded-full bg-zinc-100" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="h-3 w-32 bg-blue-600/10 rounded-lg" />
                                                        <div className="h-2 w-24 bg-zinc-200 rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 pl-14">
                                                    <div className="h-1.5 w-full bg-zinc-50 rounded-full relative overflow-hidden">
                                                        {i === 1 && (
                                                            <motion.div
                                                                className="absolute inset-0 bg-blue-100"
                                                                initial={{ x: "-100%" }}
                                                                whileInView={{ x: "0%" }}
                                                                transition={{ duration: 1.5, delay: 1 }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="h-1.5 w-[90%] bg-zinc-50 rounded-full relative overflow-hidden">
                                                        {i === 1 && (
                                                            <motion.div
                                                                className="absolute inset-0 bg-emerald-100/50"
                                                                initial={{ x: "-100%" }}
                                                                whileInView={{ x: "0%" }}
                                                                transition={{ duration: 1.5, delay: 1.2 }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="h-1.5 w-[95%] bg-zinc-50 rounded-full" />
                                                </div>

                                                {/* Active Highlight Overlay */}
                                                {i === 1 && (
                                                    <motion.div
                                                        className="absolute -inset-2 bg-blue-50/20 rounded-2xl border border-blue-100/30 -z-10"
                                                        initial={{ opacity: 0 }}
                                                        whileInView={{ opacity: 1 }}
                                                        transition={{ delay: 0.8 }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* The "Brain" UI */}
                                    <motion.div
                                        className="absolute bottom-6 right-6 p-5 rounded-2xl bg-white border border-blue-100 shadow-[0_20px_40px_rgba(28,78,216,0.12)] max-w-[220px] flex items-start gap-3 backdrop-blur-md"
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                                            <Sparkles className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-600">AI at work</p>
                                            <p className="text-[11px] font-bold text-zinc-900 leading-snug">"I've improved your first point to show leadership."</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
