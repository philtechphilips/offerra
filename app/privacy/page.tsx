"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPage() {
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
                                <Shield className="h-3.5 w-3.5 text-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">Privacy Policy</span>
                            </motion.div>
                            <motion.h1
                                className="text-[clamp(3rem,6vw,5rem)] font-black tracking-tighter leading-[1] text-black text-gradient uppercase mb-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                Your data <br />
                                <span className="text-blue-600">is yours.</span>
                            </motion.h1>
                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Last Updated: March 20, 2026</p>
                        </div>
                    </div>
                </section>

                <section className="pb-32 lg:pb-48">
                    <div className="mx-auto max-w-3xl px-6">
                        <div className="prose prose-zinc max-w-none">
                            <div className="space-y-16">
                                <div>
                                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">1. Information We Collect</h2>
                                    <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                                        We collect information you provide directly to us when you create an account, such as your name, email address, 
                                        and professional details. We also collect data from your interactions with our AI tools to improve the quality 
                                        of your resume and cover letter generations.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">2. How We Use Your Data</h2>
                                    <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                                        Your data is used exclusively to power the Offerra experience. This includes:
                                    </p>
                                    <ul className="mt-6 space-y-4 text-zinc-500 text-lg font-medium list-disc pl-6 leading-relaxed">
                                        <li>Personalizing AI-generated content for your job applications.</li>
                                        <li>Syncing your career progress across devices.</li>
                                        <li>Communicating critical updates about your account.</li>
                                        <li>Improving our machine learning models (de-identified data).</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">3. Data Security & Storage</h2>
                                    <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                                        We implement industry-standard security measures to protect your information. Your data is stored on secure, 
                                        encrypted servers and is never sold to third-party advertisers. We believe your career journey is private.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">4. Your Rights</h2>
                                    <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                                        You have the right to access, export, or delete your data at any time through your dashboard settings. 
                                        If you choose to delete your account, all personal identifiers will be permanently removed from our systems.
                                    </p>
                                </div>
                                
                                <div className="p-12 rounded-[2.5rem] bg-zinc-50 border border-zinc-100">
                                    <h3 className="text-xl font-black text-black tracking-tight mb-4 text-center">Questions?</h3>
                                    <p className="text-zinc-400 text-center font-medium mb-8">
                                        If you have any concerns regarding your privacy at Offerra, please reach out.
                                    </p>
                                    <div className="flex justify-center">
                                        <a href="mailto:privacy@offerra.ai" className="px-10 py-5 bg-white border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-200 transition-all text-black shadow-sm">
                                            Contact Privacy Team
                                        </a>
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
