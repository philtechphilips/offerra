"use client";

import { motion } from "framer-motion";
import { Sparkles, Gavel } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <main>
                <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-600/10 to-transparent" />
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 relative">
                        <div className="max-w-3xl mx-auto text-center">
                            <motion.div
                                className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 shadow-sm"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Gavel className="h-3.5 w-3.5 text-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">Terms of Service</span>
                            </motion.div>
                            <motion.h1
                                className="text-[clamp(3rem,6vw,5rem)] font-black tracking-tighter leading-[1] text-black text-gradient uppercase mb-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                Usage <br />
                                <span className="text-blue-600">Guidelines.</span>
                            </motion.h1>
                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Effective Date: March 20, 2026</p>
                        </div>
                    </div>
                </section>

                <section className="pb-32 lg:pb-48">
                    <div className="mx-auto max-w-3xl px-6">
                        <div className="prose prose-zinc max-w-none">
                            <div className="space-y-16">
                                <div>
                                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">1. Acceptance of Terms</h2>
                                    <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                                        By accessing or using Offerra AI, you agree to be bound by these Terms of Service and all applicable laws. 
                                        If you do not agree, please do not use our platform. We built Offerra to empower candidates, and we expect 
                                        all users to use our tools responsibly.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">2. Subscription & Credits</h2>
                                    <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                                        We offer both a free tier and various paid subscription plans that grant you "Offerra Credits" for AI generation. 
                                        Credits are consumed upon successful generation of career documents. Payments are handled via our secure billing 
                                        partners, and any disputes should be raised within 30 days of purchase.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">3. Proper Use of AI</h2>
                                    <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                                        You are responsible for any information generated using Offerra. While our AI is designed to be highly accurate, 
                                        we encourage you to review all outputs before sending them to employers. Usage for spam, deceptive practices, 
                                        or illegal activities is strictly prohibited and will result in account termination.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">4. Intellectual Property</h2>
                                    <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                                        Offerra AI owns the core technology and designs. However, any content you generate using our tools (such as your 
                                        resumes or cover letters) belongs to you. We do not claim ownership over your professional achievements or 
                                        personal documents.
                                    </p>
                                </div>

                                <div className="p-12 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10" />
                                    <h3 className="text-xl font-black text-black tracking-tight mb-4 text-center">Ready to build?</h3>
                                    <p className="text-zinc-400 text-center font-medium mb-8">
                                        Agree with our terms? Let's get back to landing that dream job.
                                    </p>
                                    <div className="flex justify-center">
                                        <Link href="/dashboard" className="px-10 py-5 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                                            Return to Dashboard
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    );
}
