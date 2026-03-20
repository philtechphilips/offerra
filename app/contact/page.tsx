"use client";

import { motion } from "framer-motion";
import { Mail, Globe, Twitter, Linkedin, Github, Send, Sparkles, Phone, MessageCircle } from "lucide-react";
import Link from 'next/link';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-600/10 to-transparent" />
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 relative">
                        <div className="max-w-3xl mx-auto text-center">
                            <motion.div
                                className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 shadow-sm"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">Get in touch</span>
                            </motion.div>
                            <motion.h1
                                className="text-[clamp(3.5rem,8vw,6rem)] font-black tracking-tighter leading-[1] text-black text-gradient uppercase mb-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                Let's talk <br />
                                <span className="text-blue-600">career.</span>
                            </motion.h1>
                            <motion.p
                                className="text-xl font-medium text-zinc-400 mb-12 leading-relaxed max-w-xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                Whether you have a question about features, pricing, or just want to say hi, our team is here for you.
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="pb-32 lg:pb-48 relative">
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                            {/* Left Side: Info */}
                            <motion.div
                                className="space-y-16 flex flex-col items-center lg:items-start text-center lg:text-left"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >

                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-10">Follow Our Journey</h3>
                                    <div className="flex gap-4">
                                        {[
                                            { icon: Twitter, href: '#', label: 'Twitter' },
                                            { icon: Linkedin, href: '#', label: 'LinkedIn' },
                                            { icon: Github, href: '#', label: 'Github' }
                                        ].map((social, idx) => (
                                            <a
                                                key={idx}
                                                href={social.href}
                                                className="group flex flex-col items-center gap-3 p-6 rounded-[2rem] border border-zinc-100 bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all active:scale-95 w-32"
                                            >
                                                <social.icon className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">{social.label}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Side: Form */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-50/50 rounded-full blur-[100px] -z-10" />
                                
                                <div className="p-8 lg:p-16 rounded-[3rem] border border-zinc-100 bg-white shadow-2xl relative z-10">
                                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="w-full px-8 py-5 rounded-2xl bg-zinc-50 border border-zinc-50 text-black font-bold placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Email Address</label>
                                                <input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    className="w-full px-8 py-5 rounded-2xl bg-zinc-50 border border-zinc-50 text-black font-bold placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Subject</label>
                                            <input
                                                type="text"
                                                placeholder="Support / Partnership / Hire Me"
                                                className="w-full px-8 py-5 rounded-2xl bg-zinc-50 border border-zinc-50 text-black font-bold placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Your Message</label>
                                            <textarea
                                                rows={5}
                                                placeholder="Tell us what's on your mind..."
                                                className="w-full px-8 py-5 rounded-2xl bg-zinc-50 border border-zinc-50 text-black font-bold placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none"
                                            />
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            className="w-full group inline-flex items-center justify-center gap-4 rounded-2xl bg-blue-600 px-10 py-6 text-sm font-black text-white hover:bg-blue-700 transition-all uppercase tracking-[0.25em] shadow-xl shadow-blue-200 active:scale-[0.98]"
                                        >
                                            <Send className="h-4 w-4" />
                                            Send Message
                                        </button>
                                        
                                        <p className="text-[9px] font-black text-zinc-300 text-center uppercase tracking-widest">
                                            We usually respond within 24 hours.
                                        </p>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    );
}
