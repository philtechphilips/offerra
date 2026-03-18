"use client";

import { useState, useEffect } from "react";
import api from "@/app/lib/api";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ResumeFeature } from "@/components/landing/ResumeFeature";
import { InterviewFeature } from "@/components/landing/InterviewFeature";
import { MoreFeatures } from "@/components/landing/MoreFeatures";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface Plan {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  price_ngn: number;
  credits: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  btn_text: string;
}

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/plans");
        setPlans(response.data);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        {/* How it Works - Refined Flow */}
        <section id="how-it-works" className="py-24 lg:py-32 bg-[#F9FBFF]/50 border-y border-zinc-100 relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-40" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tighter leading-[0.85] mb-10 text-black text-gradient uppercase">
                    Zero effort. <br />Better <span className="text-[#1C4ED8]">Results.</span>
                  </h2>
                  <p className="text-xl font-medium text-zinc-400 leading-relaxed max-w-md">
                    We built Offerra to do the hard work for you. Our tools run in the background while you focus on getting hired.
                  </p>
                </motion.div>
              </div>
              <div className="space-y-12 relative">
                {/* Connecting Line */}
                <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-blue-600/50 via-blue-200 to-transparent hidden sm:block" />

                {[
                  { step: "01", title: "Automated Tracking", desc: "Our browser companion captures job details instantly. No manual entry required." },
                  { step: "02", title: "AI Optimization", desc: "One click to refactor your CV and generate a winning proposal for every role." },
                  { step: "03", title: "Coach to Win", desc: "Master your upcoming interviews with predicted questions and expert STAR responses." }
                ].map((item, idx) => (
                  <motion.div
                    key={item.step}
                    className="group flex gap-8 items-start relative z-10"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative text-sm font-black text-[#1C4ED8] bg-white border border-blue-100 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                        {item.step}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black mb-3 tracking-tight text-black group-hover:text-blue-600 transition-colors uppercase tracking-[0.05em]">{item.title}</h3>
                      <p className="text-base font-medium text-zinc-500 leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ResumeFeature />
        <InterviewFeature />
        <MoreFeatures />
        <Testimonials />


        {/* Pricing - Premium Tiers */}
        <section id="pricing" className="py-24 lg:py-32 relative bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto mb-32 text-center">
              <motion.h2
                className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tighter mb-8 text-black text-gradient uppercase"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Transparent Plans.
              </motion.h2>
              <p className="text-xl font-medium text-zinc-400 tracking-tight">Scale your career with the right tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              {!isLoading && plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "group relative border p-10 rounded-[2rem] text-left transition-all flex flex-col",
                    plan.is_popular
                      ? "border-2 border-[#1C4ED8] md:scale-110 z-10 hover:scale-[1.12] shadow-[0_40px_80px_-20px_rgba(28,78,216,0.15)] shimmer"
                      : "border-zinc-100 bg-white hover:border-blue-200 hover:-translate-y-2"
                  )}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#1C4ED8] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">Most Popular</div>
                  )}
                  <div className={cn(
                    "text-[10px] font-black uppercase tracking-[0.25em] mb-10",
                    plan.is_popular ? "text-[#1C4ED8]" : "text-zinc-400"
                  )}>
                    {plan.name}
                  </div>
                  <div className={cn(
                    "flex items-baseline gap-1 mb-10",
                    plan.is_popular ? "text-[#1C4ED8]" : "text-black"
                  )}>
                    <span className="text-7xl font-black tracking-tighter">${Math.round(plan.price_usd)}</span>
                    <span className={cn(
                      "text-sm font-black uppercase tracking-widest",
                      plan.is_popular ? "opacity-60" : "text-zinc-400"
                    )}>{plan.credits} Credits</span>
                  </div>
                  <ul className={cn(
                    "space-y-6 mb-12 text-sm font-black flex-grow",
                    plan.is_popular ? "text-black" : "text-zinc-500"
                  )}>
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-4">
                        {f.toLowerCase().includes('gmail') ? (
                          <Mail className="h-4 w-4 shrink-0 text-red-500" />
                        ) : (
                          <div className={cn(
                            "h-2 w-2 rounded-full shadow-[0_0_10px_rgba(28,78,216,0.2)]",
                            plan.is_popular ? "bg-[#1C4ED8]" : "bg-blue-200"
                          )} />
                        )}
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className={cn(
                      "w-full rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                      plan.is_popular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200"
                        : "border border-zinc-200 hover:bg-zinc-50 text-black"
                    )}
                  >
                    {plan.btn_text || (plan.price_usd === 0 ? "Get Started" : "Buy Credits")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQ />
        <FinalCTA />

        {/* Footer */}
        <footer className="py-24 lg:py-32 border-t border-zinc-100 bg-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-600/10 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Offerra Logo" className="h-full w-full object-contain p-1" />
                </div>
                <span className="text-xl font-black tracking-tighter text-black">Offerra<span className="text-blue-600">.</span></span>
              </div>
              <p className="text-sm font-medium text-zinc-400 max-w-xs">
                The intelligent command center for modern career progression.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black mb-6">Product</h4>
                <div className="flex flex-col gap-4">
                  {['Features', 'Process', 'Pricing', 'FAQ'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-black text-zinc-400 hover:text-blue-600 transition-colors">{item}</a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black mb-6">Company</h4>
                <div className="flex flex-col gap-4">
                  {['Twitter', 'LinkedIn', 'Github'].map((item) => (
                    <a key={item} href="#" className="text-xs font-black text-zinc-400 hover:text-blue-600 transition-colors">{item}</a>
                  ))}
                </div>
              </div>
              <div className="hidden sm:block">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black mb-6">Legal</h4>
                <div className="flex flex-col gap-4">
                  {['Privacy', 'Terms'].map((item) => (
                    <a key={item} href="#" className="text-xs font-black text-zinc-400 hover:text-blue-600 transition-colors">{item}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-20 pt-10 border-t border-zinc-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
              © 2026 Offerra AI. All rights reserved.
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">All Systems Operational</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
