"use client";

import { motion } from "framer-motion";
import { PenTool, Wand2, MousePointerClick, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import Link from "next/link";

const showcaseFeatures = [
    {
        badge: "Cover Letters",
        icon: PenTool,
        title: <>Write cover letters<br />in <span className="text-blue-600 italic">seconds.</span></>,
        description: "Stop staring at a blank page. Paste the job description and our AI generates a personalized, recruiter-optimized cover letter that matches your experience and tone.",
        points: [
            { title: "Tailored to each job", desc: "Every letter is uniquely generated based on the role's requirements and your CV." },
            { title: "Multiple tones", desc: "Choose professional, conversational, or executive tone to match the company culture." },
            { title: "Edit & export", desc: "Fine-tune any section and export as PDF or copy to clipboard instantly." }
        ],
        cta: "Generate a Cover Letter",
        visual: (
            <div className="rounded-[2.5rem] border border-zinc-100 bg-white/60 backdrop-blur-2xl p-6 lg:p-10 relative">
                {/* Letter Preview */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                            <PenTool className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cover Letter</p>
                            <p className="text-sm font-black text-black">Senior Engineer @ Stripe</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-[11px] text-zinc-600 font-medium leading-relaxed">
                        <p>Dear Hiring Manager,</p>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-zinc-50 rounded-full" />
                            <div className="h-2 w-[95%] bg-zinc-50 rounded-full" />
                            <div className="h-2 w-[88%] bg-blue-50 rounded-full relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-blue-100"
                                    initial={{ x: "-100%" }}
                                    whileInView={{ x: "0%" }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </div>
                            <div className="h-2 w-full bg-zinc-50 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-[92%] bg-zinc-50 rounded-full" />
                            <div className="h-2 w-full bg-zinc-50 rounded-full" />
                            <div className="h-2 w-[85%] bg-emerald-50 rounded-full relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-emerald-100/50"
                                    initial={{ x: "-100%" }}
                                    whileInView={{ x: "0%" }}
                                    transition={{ duration: 1.5, delay: 0.8 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI Suggestion */}
                    <motion.div
                        className="p-4 rounded-2xl bg-blue-600 text-white"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="flex items-start gap-3">
                            <Wand2 className="h-4 w-4 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-200 mb-1">AI Suggestion</p>
                                <p className="text-[11px] font-bold leading-snug">&quot;Mention your payment systems experience — Stripe values this highly.&quot;</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    },
    {
        badge: "AI Auto-Fill",
        icon: MousePointerClick,
        title: <>Apply to jobs<br />with <span className="text-blue-600 italic">one click.</span></>,
        description: "Our browser extension doesn't just track — it fills out entire job applications for you. It reads form fields and maps your CV data automatically using AI.",
        points: [
            { title: "Instant form detection", desc: "Works on LinkedIn, Greenhouse, Lever, Workday and 50+ ATS platforms." },
            { title: "Smart field mapping", desc: "AI understands context — it knows where to put your phone number vs. your experience." },
            { title: "Review before submit", desc: "Every field is pre-filled for you to review. You stay in control." }
        ],
        cta: "Install Extension",
        visual: (
            <div className="rounded-[2.5rem] border border-zinc-100 bg-white/60 backdrop-blur-2xl p-6 lg:p-10 relative">
                {/* Application Form Mockup */}
                <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                            <MousePointerClick className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Auto-Fill Active</p>
                            <p className="text-sm font-black text-black">Filling 8 fields...</p>
                        </div>
                    </div>

                    {[
                        { label: "Full Name", value: "Alex Rivera", filled: true },
                        { label: "Email", value: "alex@email.com", filled: true },
                        { label: "Phone", value: "+1 (555) 123-4567", filled: true },
                        { label: "LinkedIn", value: "linkedin.com/in/alexrivera", filled: true },
                        { label: "Years of Experience", value: "6", filled: false },
                    ].map((field, idx) => (
                        <motion.div
                            key={field.label}
                            className="space-y-1"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + idx * 0.15 }}
                        >
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{field.label}</label>
                            <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${field.filled ? 'border-emerald-200 bg-emerald-50/30' : 'border-zinc-100 bg-zinc-50'}`}>
                                <span className="text-xs font-bold text-black">{field.value}</span>
                                {field.filled && (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                )}
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        className="flex items-center gap-2 pt-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.2 }}
                    >
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">5 of 8 fields filled</span>
                    </motion.div>
                </div>
            </div>
        )
    },
    {
        badge: "Proposal Writer",
        icon: Mail,
        title: <>Win more interviews<br />with <span className="text-blue-600 italic">strong proposals.</span></>,
        description: "Whether it is a job board, a referral, or a direct outreach — generate professional proposals that highlight your strengths and move you forward faster.",
        points: [
            { title: "Role-aware", desc: "Proposals are structured and toned for the role and channel you are applying through." },
            { title: "From your portfolio", desc: "AI pulls from your CV and past projects to build credibility automatically." },
            { title: "Win rate insights", desc: "Learn what works — our AI tells you which proposal strategies convert best." }
        ],
        cta: "Write a Proposal",
        visual: (
            <div className="rounded-[2.5rem] border border-zinc-100 bg-white/60 backdrop-blur-2xl p-6 lg:p-10 relative">
                <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                        <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Proposal</p>
                            <p className="text-sm font-black text-black">React Developer — Upwork</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-violet-50 border border-violet-100">
                            <p className="text-[9px] font-black uppercase tracking-widest text-violet-600 mb-1">Opening Hook</p>
                            <p className="text-[11px] font-medium text-violet-900 leading-snug italic">
                                &quot;Hi! I noticed you&apos;re looking for a React specialist with payment integration experience — that&apos;s exactly what I delivered for my last 3 clients.&quot;
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-zinc-50 rounded-full" />
                            <div className="h-2 w-[90%] bg-zinc-50 rounded-full" />
                            <div className="h-2 w-[95%] bg-zinc-50 rounded-full" />
                        </div>
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">Portfolio Highlight</p>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-black">P1</div>
                                <div>
                                    <p className="text-[11px] font-black text-black">E-commerce Dashboard</p>
                                    <p className="text-[9px] text-zinc-400 font-medium">React, Stripe, Tailwind</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Win probability</span>
                        <span className="text-sm font-black text-emerald-700">87%</span>
                    </motion.div>
                </div>
            </div>
        )
    }
];

export function MoreFeatures() {
    return (
        <>
            {showcaseFeatures.map((feature, sectionIdx) => (
                <section key={feature.badge} className={`py-24 lg:py-32 relative overflow-hidden ${sectionIdx % 2 === 0 ? 'bg-white' : 'bg-[#F9FBFF]/50 border-y border-zinc-100'}`}>
                    {sectionIdx % 2 === 0 && (
                        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-50/40 rounded-full blur-[120px] -z-10 opacity-70" />
                    )}

                    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            {/* Content */}
                            <motion.div
                                className={cn(
                                    "flex flex-col items-center lg:items-start text-center lg:text-left",
                                    sectionIdx % 2 !== 0 ? "order-1 lg:order-2" : ""
                                )}
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
                                    <feature.icon className="h-4 w-4 text-blue-600" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{feature.badge}</span>
                                </motion.div>

                                <h2 className="text-[clamp(2rem,4.5vw,4.2rem)] font-black tracking-tighter leading-[1.1] mb-10 text-black text-gradient">
                                    {feature.title}
                                </h2>

                                <p className="text-xl font-medium text-zinc-400 mb-12 leading-relaxed max-w-lg">
                                    {feature.description}
                                </p>

                                <div className="space-y-8 mb-16">
                                    {feature.points.map((point, idx) => (
                                        <motion.div
                                            key={point.title}
                                            className="flex flex-col items-center sm:flex-row sm:items-start text-center sm:text-left gap-6"
                                            initial={{ opacity: 0, x: sectionIdx % 2 !== 0 ? 20 : -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + (idx * 0.1) }}
                                        >
                                            <div className="mt-1 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-black tracking-tight mb-1">{point.title}</h4>
                                                <p className="text-sm font-medium text-zinc-500">{point.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <Link
                                    href="/signup"
                                    className="group inline-flex items-center gap-4 rounded-3xl bg-blue-600 px-10 py-5 text-sm font-black text-white hover:bg-blue-700 transition-all uppercase tracking-[0.2em]"
                                >
                                    {feature.cta}
                                </Link>
                            </motion.div>

                            {/* Visual */}
                            <motion.div
                                className={`relative ${sectionIdx % 2 !== 0 ? "order-2 lg:order-1" : ""}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-square bg-blue-100/30 blur-[140px] rounded-full -z-10" />
                                {feature.visual}
                            </motion.div>
                        </div>
                    </div>
                </section>
            ))}
        </>
    );
}
