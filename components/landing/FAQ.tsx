"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "How does the browser extension work?",
        answer: "Our browser companion automatically detects when you are on a job posting page (LinkedIn, Indeed, etc.). With one click, it saves the job details, role description, and company info directly to your Offerra dashboard, eliminating manual entry."
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. We use industry-standard encryption for all your personal data and resumes. We never sell your data to third parties. Your CV is only used to generate match scores and re-tailored versions for your eyes only."
    },
    {
        question: "How many resumes can I optimize?",
        answer: "The number of optimizations depends on your plan credits. Each 'Refactor' or 'Match' uses a small amount of credits. Our Pro plan offers generous monthly credits perfect for active job seekers."
    },
    {
        question: "Can I use Offerra for any role?",
        answer: "Yes, our AI is trained on hundreds of thousands of job descriptions across all industries, from tech and design to healthcare and finance. It understands specific jargon and skill requirements for almost any professional field."
    },
    {
        question: "Does the Gmail sync read all my emails?",
        answer: "No. Our Gmail integration only scans for emails specifically related to job applications (invites, follow-ups, and rejections) based on recognized recruiting platforms and keywords. We prioritize your privacy above all else."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 lg:py-32 bg-[#F9FBFF]/30 border-t border-zinc-100 relative overflow-hidden">
            <div className="absolute inset-0 dot-pattern opacity-30" />
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-20">
                    <motion.div
                        className="mb-6 flex items-center justify-center gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="h-0.5 w-6 bg-blue-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Got Questions?</span>
                        <div className="h-0.5 w-6 bg-blue-600 rounded-full" />
                    </motion.div>
                    <motion.h2
                        className="text-[clamp(1.8rem,4.5vw,2.8rem)] font-black tracking-tighter text-black mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Everything you <span className="italic">need</span> to know.
                    </motion.h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            className="group rounded-[1.5rem] border border-zinc-100 bg-white overflow-hidden transition-all duration-300 hover:border-blue-200"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="flex w-full items-center justify-between p-6 sm:p-8 text-left"
                            >
                                <span className="text-lg font-black tracking-tight text-black group-hover:text-blue-600 transition-colors tracking-[0.05em]">{faq.question}</span>
                                <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-50 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-zinc-400'}`}>
                                    {openIndex === idx ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                </div>
                            </button>
                            {openIndex === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-8 sm:px-8 border-t border-zinc-50"
                                >
                                    <p className="mt-6 text-base font-medium text-zinc-500 leading-relaxed max-w-2xl">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

