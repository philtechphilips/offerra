"use client";

import { motion } from "framer-motion";
import { Layout, ArrowRightLeft, Bell, MousePointer2, Zap, Sparkles } from "lucide-react";
import { cn } from "@/app/lib/utils";

const STAGES = [
  { id: "applied", name: "Applied", color: "bg-blue-100 border-blue-200 text-blue-700", count: 12 },
  { id: "interview", name: "Interview", color: "bg-amber-100 border-amber-200 text-amber-700", count: 4 },
  { id: "offer", name: "Offer", color: "bg-emerald-100 border-emerald-200 text-emerald-700", count: 1 }
];

export function KanbanFeature() {
  return (
    <section className="py-24 lg:py-32 bg-[#F9FBFF] border-y border-zinc-100 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest mb-6 border border-zinc-800 shadow-xl shadow-black/5">
                <Layout className="h-3 w-3" /> Command Center
              </div>
              
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tighter leading-[0.95] mb-8 text-black text-gradient">
                Your career <br /> <span className="text-blue-600">orchestrated.</span>
              </h2>
              
              <p className="text-xl font-medium text-zinc-400 leading-relaxed mb-10 max-w-lg">
                Ditch the spreadsheets. Our visual Kanban board turns job hunting into a high-performance workflow. Drag, drop, and let our background automation handle the reminders and follow-ups.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  { icon: ArrowRightLeft, title: "Visual Lifecycle", desc: "Instantly see where you stand in every application." },
                  { icon: Zap, title: "Automated Triggers", desc: "Moves between stages trigger smart actions automatically." },
                  { icon: Bell, title: "Follow-up Reminders", desc: "Never miss a deadline with intelligent push notifications." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:border-blue-100">
                      <item.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-black mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.title}</h3>
                      <p className="text-sm font-medium text-zinc-500 max-w-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-3 bg-white rounded-3xl border border-zinc-200 shadow-2xl shadow-blue-500/5 overflow-hidden"
            >
              <div className="bg-zinc-50 rounded-2xl p-6 min-h-[500px]">
                <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                  {STAGES.map((stage) => (
                    <div key={stage.id} className="min-w-[180px] flex-1">
                      <div className={cn("px-3 py-2 rounded-xl border mb-4 flex items-center justify-between", stage.color)}>
                        <span className="text-[10px] font-black uppercase tracking-widest">{stage.name}</span>
                        <span className="text-[10px] font-black opacity-60">{stage.count}</span>
                      </div>
                      
                      <div className="space-y-3">
                        {Array.from({ length: stage.id === 'applied' ? 2 : 1 }).map((_, j) => (
                          <div key={j} className="p-4 bg-white rounded-xl border border-zinc-100 shadow-sm hover:border-blue-200 transition-all cursor-grab active:cursor-grabbing group">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-4 w-4 rounded bg-zinc-100" />
                                <div className="h-2 w-16 bg-zinc-100 rounded-full" />
                            </div>
                            <div className="h-3 w-full bg-zinc-50 rounded-full mb-2" />
                            <div className="h-3 w-1/2 bg-zinc-50 rounded-full" />
                          </div>
                        ))}
                        
                        {stage.id === 'offer' && (
                            <motion.div 
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="p-4 bg-emerald-600 rounded-xl border-2 border-emerald-400 shadow-xl"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-3 w-3 text-white fill-white" />
                                    <span className="text-[8px] font-black text-white uppercase">Dream Offer</span>
                                </div>
                                <div className="h-3 w-full bg-emerald-500 rounded-full mb-2" />
                                <div className="h-3 w-1/2 bg-emerald-500 rounded-full" />
                            </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Automation Prompt */}
                <div className="absolute bottom-10 right-10 flex items-center gap-3 bg-white border border-zinc-200 p-4 rounded-2xl shadow-2xl animate-bounce">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-emerald-600 fill-emerald-600/10" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">Workflow Triggered</span>
                    <span className="text-[11px] font-bold text-zinc-900">Follow-up email sent</span>
                  </div>
                </div>

                {/* Mouse Interaction Overlay */}
                <div className="absolute top-1/2 left-2/3 pointer-events-none">
                    <MousePointer2 className="h-6 w-6 text-black drop-shadow-lg" />
                    <div className="ml-4 -mt-2 bg-black text-white px-2 py-1 rounded text-[8px] font-black uppercase">Dragging...</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
