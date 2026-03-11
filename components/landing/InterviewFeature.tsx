"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, ShieldCheck, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function InterviewFeature() {
    return (
        <section id="interview-coach" className="py-24 lg:py-32 relative overflow-hidden bg-[#F9FBFF]/50 border-y border-zinc-100">
            {/* Soft Glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-[100px] -z-10" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

                    {/* Visualization Side */}
                    <motion.div
                        className="relative order-2 lg:order-1"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="relative rounded-[3rem] border border-white bg-white/60 backdrop-blur-2xl p-6 lg:p-10 shadow-[0_64px_120px_-20px_rgba(0,0,0,0.08)]">
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Interview Coach</p>
                                            <p className="text-sm font-black text-black">Practice Session</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        Active match: 98%
                                    </div>
                                </div>

                                {/* AI Question Card */}
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="h-8 w-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                                            <MessageSquare className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <div className="bg-zinc-50/50 p-4 rounded-2xl rounded-tl-none border border-zinc-100 flex-grow">
                                            <p className="text-xs font-bold text-black leading-relaxed">
                                                "Tell me about a time you had to lead a difficult technical transition under tight deadlines."
                                            </p>
                                        </div>
                                    </div>

                                    {/* Coach Insight */}
                                    <motion.div
                                        className="ml-12 p-5 rounded-2xl bg-brand-blue-black text-white relative overflow-hidden shadow-xl"
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <ShieldCheck className="h-12 w-12" />
                                        </div>
                                        <div className="relative z-10 flex gap-4">
                                            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                                                <Zap className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Coach Insight</p>
                                                <p className="text-[11px] font-bold leading-relaxed">
                                                    "Recruiters here value 'Leadership' and 'Scaling'. Use your experience with the cloud migration to showcase both."
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Suggested Response */}
                                    <div className="flex gap-4 items-start justify-end">
                                        <div className="bg-blue-50 p-4 rounded-2xl rounded-tr-none border border-blue-100 max-w-[80%]">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Winning Response</p>
                                            <p className="text-[11px] font-medium text-blue-900 leading-relaxed italic">
                                                "In my previous role, I navigated a major migration by first identifying key stakeholders..."
                                            </p>
                                        </div>
                                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white font-black text-[10px]">
                                            ME
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            className="absolute -bottom-6 -right-6 p-4 rounded-2xl bg-white border border-zinc-100 shadow-2xl flex items-center gap-3"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <div className="h-9 w-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                <Play className="h-4 w-4 fill-current" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Confidence Score</p>
                                <p className="text-xs font-black text-black">Mastered</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        className="order-1 lg:order-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <Zap className="h-4 w-4 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Dynamic Coaching</span>
                        </motion.div>

                        <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black tracking-tighter leading-[0.9] mb-10 text-black text-gradient">
                            Walk into every <br />
                            interview <span className="text-blue-600 italic">ready.</span>
                        </h2>

                        <p className="text-xl font-medium text-zinc-400 mb-12 leading-relaxed max-w-lg">
                            Stop guessing what they'll ask. Our AI analyzes the job role and your history to predict questions and help you craft winning STAR-method answers.
                        </p>

                        <div className="space-y-8 mb-16">
                            {[
                                { title: "Predicted Questions", desc: "Know exactly what they're looking for before you even jump on the call." },
                                { title: "STAR-Method Magic", desc: "We help you frame your achievements so they sound as impressive as they are." },
                                { title: "Real-time Feedback", desc: "Get coaching tips on why specific answers work for specific companies." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    className="flex gap-6"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                >
                                    <div className="mt-1 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                                        <ShieldCheck className="h-3.5 w-3.5 text-white" />
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
                            Start Practicing
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
