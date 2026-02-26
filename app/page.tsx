"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Features } from "@/components/landing/Features";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <DashboardPreview />
        <Features />

        {/* Simple Process - Provolo Inspired */}
        <section id="how-it-works" className="py-32 lg:py-48 bg-[#F9FBFF] border-y border-blue-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tight leading-[0.85] mb-10 text-black">
                  Engineered for <br /><span className="text-[#1C4ED8]">Simplicity.</span>
                </h2>
                <p className="text-xl font-medium text-zinc-400 leading-relaxed max-w-md">
                  ApplyTrack lives where you do. Install the extension, apply to a job, and watch
                  your career dashboard grow automatically.
                </p>
              </div>
              <div className="space-y-16">
                {[
                  { step: "01", title: "Plug in the Bridge", desc: "Our high-speed browser extension connects your application flow to your dashboard." },
                  { step: "02", title: "Automated Intelligence", desc: "Every 'Submit' triggers an instant metadata capture. No manual data entry ever required." },
                  { step: "03", title: "Master Your Results", desc: "View real-time response rates, recruiter activity, and AI-suggested next steps." }
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    className="group flex gap-8 items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-sm font-black text-[#1C4ED8] bg-white border border-blue-100 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_10px_rgba(28,78,216,0.05)]">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold mb-3 tracking-tight text-black">{item.title}</h3>
                      <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-xs">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing - High Contrast Blue Tier */}
        <section id="pricing" className="py-32 lg:py-48">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto mb-24 text-center">
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tight mb-8 text-black">Transparent Plans.</h2>
              <p className="text-xl font-medium text-zinc-400 font-sans tracking-tight">Choose the tier that accelerates your next career move.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="relative border border-zinc-100 bg-white p-12 rounded-[2.5rem] text-left transition-all hover:border-blue-200">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Basic Access</div>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-6xl font-black text-black">$0</span>
                  <span className="text-sm font-bold text-zinc-400">/mo</span>
                </div>
                <ul className="space-y-5 mb-12 text-sm font-bold text-zinc-500 tracking-tight">
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-blue-200" />5 tracks /mo</li>
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-blue-200" />Automated detection</li>
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-blue-200" />Standard dashboard</li>
                  <li className="flex items-center gap-4 opacity-30"><div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />AI Strategy</li>
                  <li className="flex items-center gap-4 opacity-30"><div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />Gmail Sync</li>
                </ul>
                <button className="w-full rounded-2xl border border-zinc-200 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-50 transition-colors text-black">Current Tier</button>
              </div>

              {/* Premium Plan - Provolo Highlight */}
              <div className="relative border-2 border-[#1C4ED8] bg-white p-12 rounded-[2.5rem] text-left shadow-[0_40px_80px_rgba(28,78,216,0.1)] scale-105 z-10 transition-transform hover:scale-[1.07]">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1C4ED8] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Recommended</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C4ED8] mb-8">Premium Pro</div>
                <div className="flex items-baseline gap-1 mb-10 text-[#1C4ED8]">
                  <span className="text-6xl font-black">$9</span>
                  <span className="text-sm font-bold opacity-60">/mo</span>
                </div>
                <ul className="space-y-5 mb-12 text-sm font-bold text-black tracking-tight">
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-[#1C4ED8]" />Unlimited tracking</li>
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-[#1C4ED8]" />Deep Gmail/Outlook Sync</li>
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-[#1C4ED8]" />AI Strategic Insights</li>
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-[#1C4ED8]" />Prioritized support</li>
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-[#1C4ED8]" />Advanced Analytics</li>
                </ul>
                <button className="w-full rounded-2xl bg-[#1C4ED8] py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-[#1e40af] transition-all shadow-2xl shadow-blue-600/30">Select Premium</button>
              </div>

              {/* Platinum Plan */}
              <div className="relative border border-zinc-100 bg-[#F9FBFF] p-12 rounded-[2.5rem] text-left transition-all hover:border-blue-100">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Platinum Elite</div>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-6xl font-black text-black">$19</span>
                  <span className="text-sm font-bold text-zinc-400">/mo</span>
                </div>
                <ul className="space-y-5 mb-12 text-sm font-bold text-zinc-500 tracking-tight">
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-black" />Everything in Premium</li>
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-black" />AI Interview Assistant</li>
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-black" />Portfolio Scoring</li>
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-black" />Executive Strategy</li>
                  <li className="flex items-center gap-4"><div className="h-1.5 w-1.5 rounded-full bg-black" />Network Referrals</li>
                </ul>
                <button className="w-full rounded-2xl border border-zinc-200 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-colors text-black">Maximize Output</button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 border-t border-zinc-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-sm font-black tracking-tight text-black">ApplyTrack AI</span>
              <div className="h-1 w-1 rounded-full bg-blue-100" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest leading-none">V1.4.2</span>
            </div>
            <div className="flex gap-12">
              {['Twitter', 'LinkedIn', 'Github', 'Privacy'].map((item) => (
                <a key={item} href="#" className="text-[10px] font-bold text-zinc-400 hover:text-[#1C4ED8] uppercase tracking-[0.2em] transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">
              © 2026 ApplyTrack AI. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
