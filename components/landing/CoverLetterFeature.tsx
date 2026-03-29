"use client";

import { motion } from "framer-motion";
import { PenTool, CheckCircle2, Sparkles, FileText, Send } from "lucide-react";
import Link from "next/link";

export function CoverLetterFeature() {
    return (
        <section className="py-24 lg:py-32 relative bg-white overflow-hidden">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Visual Side (Right on Desktop) */}
                    <motion.div
                        className="order-2 lg:order-2 relative"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative aspect-square max-w-[600px] mx-auto group">
                            {/* Decorative Blobs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-[80px] -z-10 group-hover:bg-blue-100 transition-colors duration-700" />
                            
                            {/* Main Document UI */}
                            <div className="w-full h-full rounded-[2.5rem] border border-zinc-100 bg-white shadow-2xl overflow-hidden flex flex-col p-8 lg:p-12 relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-400/20" />
                                        <div className="h-3 w-3 rounded-full bg-amber-400/20" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-400/20" />
                                    </div>
                                    <div className="h-8 px-4 rounded-full bg-zinc-50 border border-zinc-100 flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5 text-zinc-400" />
                                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Proposal.pdf</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="h-4 w-1/3 bg-zinc-100 rounded-lg animate-pulse" />
                                    <div className="h-4 w-1/4 bg-zinc-50 rounded-lg" />
                                    <div className="pt-8 space-y-4">
                                        {[1, 1, 0.8, 0.6].map((w, i) => (
                                            <motion.div
                                                key={i}
                                                className="h-3 bg-zinc-50 rounded-full"
                                                style={{ width: `${w * 100}%` }}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${w * 100}%` }}
                                                transition={{ duration: 0.8, delay: 0.5 + (i * 0.1) }}
                                            />
                                        ))}
                                    </div>
                                    <div className="pt-4 space-y-4">
                                         <motion.div
                                            className="h-3 bg-blue-50 rounded-full w-full relative overflow-hidden"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 1.2 }}
                                         >
                                            <motion.div 
                                                className="absolute inset-0 bg-blue-100"
                                                initial={{ x: "-100%" }}
                                                whileInView={{ x: "0%" }}
                                                transition={{ duration: 1.5, delay: 1.2 }}
                                            />
                                         </motion.div>
                                         <motion.div
                                            className="h-3 bg-blue-50 rounded-full w-[90%] relative overflow-hidden"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 1.4 }}
                                         >
                                            <motion.div 
                                                className="absolute inset-0 bg-blue-100"
                                                initial={{ x: "-100%" }}
                                                whileInView={{ x: "0%" }}
                                                transition={{ duration: 1.5, delay: 1.4 }}
                                            />
                                         </motion.div>
                                    </div>
                                </div>
                                
                                <div className="mt-auto pt-12 flex justify-end">
                                    <motion.div
                                        className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center shadow-lg shadow-black/10"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <Send className="h-5 w-5 text-white" />
                                    </motion.div>
                                </div>

                                {/* Floating AI Insight */}
                                <motion.div
                                    className="absolute top-1/3 -right-6 lg:-right-12 p-5 rounded-2xl bg-white border border-blue-100 shadow-[0_20px_40px_rgba(28,78,216,0.1)] max-w-[200px] flex gap-3 backdrop-blur-md"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-600">Perfect Match</p>
                                        <p className="text-[10px] font-bold text-zinc-900 leading-snug">"Added your relevant Project X to this section."</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side (Left on Desktop) */}
                    <motion.div
                        className="order-1 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 mb-10 backdrop-blur-sm"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <PenTool className="h-4 w-4 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Proposal Writer</span>
                        </motion.div>

                        <h2 className="text-[clamp(2rem,4.5vw,4.2rem)] font-black tracking-tighter leading-[1.1] mb-10 text-black text-gradient">
                            Write perfect <br />
                            cover letters <span className="text-blue-600">in seconds.</span>
                        </h2>

                        <p className="text-xl font-medium text-zinc-400 mb-12 leading-relaxed max-w-lg">
                            Stop staring at a blank page. Our AI analyzes the job and your experience to write a personalized letter that makes you stand out.
                        </p>

                        <div className="space-y-8 mb-16">
                            {[
                                { title: "Fact-based writing", desc: "No more generic fluff. We use your actual work history to prove you're the right fit." },
                                { title: "Matching Tone", desc: "We adjust the language to match the company's culture and job description." },
                                { title: "Instant Generation", desc: "Get a complete, ready-to-send draft in less than 10 seconds." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    className="flex flex-col items-center sm:flex-row sm:items-start text-center sm:text-left gap-6"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                >
                                    <div className="mt-1 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <div className="sm:text-left">
                                        <h4 className="text-lg font-black text-black tracking-tight mb-1">{item.title}</h4>
                                        <p className="text-sm font-medium text-zinc-500">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Link
                            href="/signup"
                            className="group inline-flex items-center gap-4 rounded-3xl bg-blue-600 px-10 py-5 text-sm font-black text-white hover:bg-blue-700 transition-all uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 active:scale-95"
                        >
                            Start Writing
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
