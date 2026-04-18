"use client";

import { motion } from "framer-motion";
import { Check, ClipboardCheck, Sparkles, PenTool, Pencil, ShieldCheck } from "lucide-react";
import { cn } from "@/app/lib/utils";

const HIGHLIGHTS = [
  "High-Fidelity PDF Editor",
  "AI-Assisted Form Filling",
  "Freehand Ink Annotations",
  "Status-Aware Watermarking"
];

export function DocSignFeature() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden border-y border-zinc-100">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/30 -skew-x-12 translate-x-1/2" />
      
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-2 bg-zinc-50 rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden group"
            >
                <div className="aspect-[4/5] bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden relative">
                    {/* Mock Editor UI */}
                    <div className="absolute top-0 inset-x-0 h-12 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between px-4">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded-lg">Save</div>
                        </div>
                    </div>
                    
                    <div className="p-12 space-y-8 mt-4">
                        <div className="h-4 w-3/4 bg-zinc-100 rounded-full" />
                        <div className="h-4 w-full bg-zinc-50 rounded-full" />
                        <div className="h-4 w-5/6 bg-zinc-100 rounded-full" />
                        
                        <div className="relative p-6 border border-blue-200 border-dashed rounded-2xl bg-blue-50/30">
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-[7px] font-black rounded uppercase">Signature Required</div>
                            <div className="h-20 flex items-center justify-center">
                                <motion.div
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                >
                                    <PenTool className="h-8 w-8 text-blue-600 opacity-20" />
                                </motion.div>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="h-4 w-4 rounded border border-blue-600 bg-blue-600 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-white" />
                                </div>
                                <div className="h-4 w-1/2 bg-zinc-100 rounded-full" />
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="h-4 w-4 rounded border border-zinc-200 bg-white" />
                                <div className="h-4 w-1/3 bg-zinc-100 rounded-full" />
                             </div>
                        </div>
                    </div>

                    {/* Watermark Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-45 opacity-[0.03]">
                        <span className="text-[120px] font-black text-black">CONFIDENTIAL</span>
                    </div>

                    {/* Floating Toolbar */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl flex gap-1 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                        {[PenTool, Pencil, Sparkles, ShieldCheck].map((Icon, i) => (
                            <div key={i} className={cn("p-2.5 rounded-xl", i === 2 ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white transition-colors")}>
                                <Icon className="h-4 w-4" />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
                <Sparkles className="h-3 w-3 fill-blue-600/20" /> Introducing DocSign Pro
              </div>
              
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tighter leading-[0.95] mb-8 text-black text-gradient">
                Signing made <br /> <span className="text-zinc-400">intelligent.</span>
              </h2>
              
              <p className="text-xl font-medium text-zinc-400 leading-relaxed mb-10 max-w-lg">
                Stop jumping between apps to sign contracts. Our built-in suite handles high-fidelity PDF editing, AI-powered form filling, and professional signing in one seamless flow.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {HIGHLIGHTS.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="h-6 w-6 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center transition-colors group-hover:border-blue-200 group-hover:bg-blue-50">
                      <Check className="h-3 w-3 text-[#1C4ED8]" />
                    </div>
                    <span className="text-sm font-black text-zinc-900">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-black/10">
                  Try DocSign Pro
                </button>
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-zinc-100" />
                    ))}
                    <div className="h-8 pl-3 flex items-center">
                        <span className="text-[10px] font-bold text-zinc-400">Used by 4,000+ candidates</span>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
