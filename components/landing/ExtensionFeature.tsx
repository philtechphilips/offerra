"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Chrome, Download, MousePointer2, Zap, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/app/lib/utils";
import { ExtensionModal } from "./ExtensionModal";

export function ExtensionFeature() {
    const [showMenu, setShowMenu] = useState(false);
    
    return (
        <section id="extension" className="py-24 lg:py-32 relative overflow-hidden bg-white text-black">
            {/* Light Mode Accents */}
            <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[120px] -z-10 opacity-70" />
            <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-indigo-50/30 rounded-full blur-[100px] -z-10 opacity-50" />
            
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Visualization Side */}
                    <motion.div 
                        className="relative order-2 lg:order-1"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Browser Window Mockup - Light Theme */}
                        <div className="relative rounded-[2.5rem] border border-zinc-100 bg-white p-3 overflow-hidden">
                            <div className="bg-zinc-50 rounded-t-[1.8rem] px-6 py-4 border-b border-zinc-100 flex items-center gap-4">
                                <div className="flex gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-400/20 border border-red-400/30" />
                                    <div className="h-3 w-3 rounded-full bg-amber-400/20 border border-amber-400/30" />
                                    <div className="h-3 w-3 rounded-full bg-emerald-400/20 border border-emerald-400/30" />
                                </div>
                                <div className="flex-grow h-7 rounded-lg bg-white border border-zinc-200/50 flex items-center px-4">
                                    <div className="h-1 w-32 bg-zinc-100 rounded-full" />
                                </div>
                            </div>
                            
                            <div className="relative aspect-[16/10] bg-zinc-50/30 p-8 flex items-center justify-center">
                                {/* Simulated Job Page */}
                                <div className="w-full space-y-6 opacity-40">
                                    <div className="h-8 w-48 bg-zinc-200 rounded-lg" />
                                    <div className="space-y-3">
                                        <div className="h-3 w-full bg-zinc-100 rounded-full" />
                                        <div className="h-3 w-[90%] bg-zinc-100 rounded-full" />
                                        <div className="h-3 w-[75%] bg-zinc-100 rounded-full" />
                                    </div>
                                    <div className="h-10 w-32 bg-blue-100 rounded-xl" />
                                </div>

                                {/* Extension Popup Overlay - Balanced Theme */}
                                <motion.div 
                                    className="absolute top-10 right-10 w-72 rounded-3xl border border-white bg-white p-6 z-20"
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
                                            <img src="/logo.png" className="h-6 w-6 brightness-0 invert" alt="" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black tracking-tight uppercase text-black">Offerra Companion</h4>
                                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Active Monitoring</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Detected Position</p>
                                            <p className="text-xs font-bold text-black">Senior Product Designer</p>
                                            <p className="text-[10px] text-zinc-500">at Stripe • San Francisco</p>
                                        </div>
                                    </div>

                                    <button className="w-full py-3 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-colors">
                                        Auto-Track Job
                                    </button>
                                </motion.div>

                                {/* Mouse Pointer Animation */}
                                <motion.div 
                                    className="absolute z-30 pointer-events-none"
                                    animate={{ 
                                        x: [100, 0, -50, 0],
                                        y: [100, 0, 50, 0]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <MousePointer2 className="h-8 w-8 text-black fill-blue-600" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        className="order-1 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div 
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 mb-10 backdrop-blur-sm"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <Chrome className="h-4 w-4 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Free Extension</span>
                        </motion.div>

                        <h2 className="text-[clamp(2rem,4.5vw,4.2rem)] font-black tracking-tighter leading-[1.1] mb-10 text-black font-black">
                            The assistant that <br />
                            tracks jobs <span className="text-blue-600 italic">for you.</span>
                        </h2>

                        <p className="text-xl font-medium text-zinc-400 mb-12 leading-relaxed max-w-lg">
                            Stop using spreadsheets. Our browser extension saves every job you look at with just one click.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                            {[
                                { 
                                    icon: Zap, 
                                    title: "Automatic Tracking", 
                                    desc: "Detects job applications on LinkedIn, Indeed, and more.",
                                    color: "text-blue-600"
                                },
                                { 
                                    icon: MousePointer2, 
                                    title: "One-Click Save", 
                                    desc: "Save full job descriptions and company info instantly.",
                                    color: "text-emerald-600"
                                },
                                { 
                                    icon: Sparkles, 
                                    title: "Real-time AI", 
                                    desc: "Get instant CV match scores while viewing any job post.",
                                    color: "text-amber-500"
                                },
                                { 
                                    icon: ShieldCheck, 
                                    title: "Private & Secure", 
                                    desc: "Your data is encrypted and only used to help you get hired.",
                                    color: "text-indigo-600"
                                }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={item.title}
                                    className="flex flex-col items-center lg:items-start gap-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                >
                                    <item.icon className={`h-6 w-6 ${item.color}`} />
                                    <div>
                                        <h4 className="text-base font-black text-black tracking-tight mb-1 tracking-wider">{item.title}</h4>
                                        <p className="text-xs font-medium text-zinc-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <button 
                                onClick={() => setShowMenu(true)}
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-4 rounded-3xl bg-blue-600 px-10 py-5 text-sm font-black text-white hover:bg-blue-700 transition-all uppercase tracking-[0.2em]"
                            >
                                <Download className="h-4 w-4" />
                                Download Extension
                            </button>
                            <a 
                                href="#how-it-works"
                                className="inline-flex items-center justify-center px-10 py-5 text-sm font-black text-zinc-400 hover:text-black transition-colors uppercase tracking-[0.2em]"
                            >
                                How it works
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
            <ExtensionModal 
                isOpen={showMenu} 
                onClose={() => setShowMenu(false)} 
            />
        </section>
    );
}
