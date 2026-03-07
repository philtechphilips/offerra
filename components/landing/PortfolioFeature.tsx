"use client";

import { motion } from "framer-motion";
import { Globe, Layout, Palette, ArrowRight, CheckCircle2, Cloud } from "lucide-react";
import Link from "next/link";

export function PortfolioFeature() {
    return (
        <section className="py-24 lg:py-32 relative overflow-hidden bg-[#F9FBFF]/50 border-y border-zinc-100">
            <div className="absolute inset-0 dot-pattern opacity-40" />
            {/* Premium Background Accents */}
            <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-blue-50/20 rounded-full blur-[120px] -z-10 opacity-50" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

                    {/* Visualization Side */}
                    <motion.div
                        className="lg:order-1 order-2 mt-20 lg:mt-0 relative"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Soft Glow */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-square bg-blue-100/30 blur-[130px] rounded-full -z-10" />

                        <div className="relative rounded-[3rem] border border-white/80 bg-white/40 backdrop-blur-3xl p-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
                            <div className="rounded-[2rem] border border-zinc-100 bg-white min-h-[500px] flex flex-col relative overflow-hidden group">
                                {/* High Fidelity Portfolio Preview */}
                                <div className="flex flex-col items-center gap-8 p-12 text-center">
                                    <div className="h-20 w-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center p-1 shadow-inner">
                                        <div className="h-full w-full rounded-full bg-gradient-to-br from-zinc-200 to-zinc-50" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-10 w-56 bg-zinc-900 rounded-2xl mx-auto" />
                                        <div className="h-4 w-72 bg-zinc-100 rounded-xl mx-auto" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 w-full mt-12">
                                        {[1, 2].map(i => (
                                            <div key={i} className="aspect-video rounded-3xl bg-zinc-50/50 border border-zinc-100 p-4 transition-all duration-500 group-hover:scale-[1.03]">
                                                <div className="h-full w-full rounded-2xl bg-white border border-zinc-50 shadow-sm overflow-hidden p-3">
                                                    <div className="h-full w-full bg-zinc-50/50 rounded-xl" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* High Fidelity Deploy Card */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded-[2.5rem] bg-white border border-blue-100 shadow-[0_48px_96px_-12px_rgba(28,78,216,0.18)] flex flex-col items-center gap-8 z-20 min-w-[320px] backdrop-blur-xl"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="h-20 w-20 rounded-[2rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-200">
                                        <Cloud className="h-9 w-9 text-white animate-pulse" />
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <h4 className="text-2xl font-black tracking-tighter text-black uppercase">Live in seconds</h4>
                                        <p className="text-[13px] font-medium text-zinc-500 max-w-[240px] text-center leading-relaxed">
                                            Your professional site is live at <span className="text-blue-600 font-bold">offerra.me/alex</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Online and ready</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        className="lg:order-2 order-1"
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
                            <Globe className="h-4 w-4 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Your Online Home</span>
                        </motion.div>

                        <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black tracking-tighter leading-[0.9] mb-10 text-black text-gradient">
                            Build your site, <br />
                            not the <span className="text-blue-600 italic">code.</span>
                        </h2>

                        <p className="text-xl font-medium text-zinc-400 mb-12 leading-relaxed max-w-lg">
                            Showcase your projects and experience with a stunning portfolio that builds itself. Zero coding, zero design skills required.
                        </p>

                        <div className="space-y-8 mb-16">
                            {[
                                { title: "Launch instantly", desc: "Get a professional web link for your work in one click." },
                                { title: "Professional designs", desc: "Choose a look that fits your job and your personality." },
                                { title: "See who's visiting", desc: "See exactly which companies are looking at your profile." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    className="flex gap-6"
                                    initial={{ opacity: 0, x: 10 }}
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
                            Make my portfolio
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
