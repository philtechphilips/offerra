"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ResumeFeature } from "@/components/landing/ResumeFeature";
import { motion } from "framer-motion";

export default function Home() {
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
                  <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tighter leading-[0.85] mb-10 text-black text-gradient">
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
                  { step: "01", title: "Add the Extension", desc: "Install our simple browser tool to start tracking your applications automatically." },
                  { step: "02", title: "Apply as Usual", desc: "Just hit 'Submit' on any job site. We'll capture all the details for you instantly." },
                  { step: "03", title: "Get Hired Faster", desc: "Use our AI to fix your resume for every job and stay ahead of the competition." }
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
                      <h3 className="text-2xl font-black mb-3 tracking-tight text-black group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="text-base font-medium text-zinc-500 leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ResumeFeature />


        {/* Pricing - Premium Tiers */}
        <section id="pricing" className="py-24 lg:py-32 relative bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto mb-32 text-center">
              <motion.h2
                className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tighter mb-8 text-black text-gradient"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Transparent Plans.
              </motion.h2>
              <p className="text-xl font-medium text-zinc-400 tracking-tight">Scale your career with the right tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="group relative border border-zinc-100 bg-white p-10 rounded-[2rem] text-left transition-all hover:border-blue-200 hover:-translate-y-2 flex flex-col">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-10">Essential</div>
                <div className="flex items-baseline gap-1 mb-10 text-black">
                  <span className="text-7xl font-black tracking-tighter">$0</span>
                  <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">/mo</span>
                </div>
                <ul className="space-y-6 mb-12 text-sm font-black text-zinc-500 flex-grow">
                  {['5 tracks /mo', 'Automated detection', 'Standard dashboard'].map((f) => (
                    <li key={f} className="flex items-center gap-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                      {f}
                    </li>
                  ))}
                  {['AI Strategy', 'Gmail Sync'].map((f) => (
                    <li key={f} className="flex items-center gap-4 opacity-30 grayscale">
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full rounded-2xl border border-zinc-200 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-50 transition-colors text-black">Current Tier</button>
              </div>

              {/* Premium Plan */}
              <div className="relative border-2 border-[#1C4ED8] bg-white p-10 rounded-[2rem] text-left md:scale-110 z-10 transition-all hover:scale-[1.12] flex flex-col shadow-[0_40px_80px_-20px_rgba(28,78,216,0.15)] shimmer">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#1C4ED8] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">Best Value</div>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#1C4ED8] mb-10">Pro Track</div>
                <div className="flex items-baseline gap-1 mb-10 text-[#1C4ED8]">
                  <span className="text-7xl font-black tracking-tighter">$9</span>
                  <span className="text-sm font-black opacity-60 uppercase tracking-widest">/mo</span>
                </div>
                <ul className="space-y-6 mb-12 text-sm font-black text-black flex-grow">
                  {[
                    { text: 'Unlimited tracking', icon: true },
                    { text: 'Deep Gmail/Outlook Sync', gmail: true },
                    { text: 'AI Strategic Insights', icon: true },
                    { text: 'Prioritized support', icon: true },
                    { text: 'Advanced Analytics', icon: true }
                  ].map((f) => (
                    <li key={f.text} className="flex items-center gap-4">
                      {f.gmail ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
                          <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.38l-9 6.75-9-6.75V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.41.17-.8.47-1.09.3-.29.69-.41 1.03-.41h.5l10 7.5 10-7.5h.5c.34 0 .73.12 1.03.41.3.29.47.68.47 1.09z" fill="#EA4335" />
                        </svg>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(28,78,216,0.4)]" />
                      )}
                      {f.text}
                    </li>
                  ))}
                </ul>
                <button className="w-full rounded-2xl bg-blue-600 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">Join Pro Now</button>
              </div>

              {/* Platinum Plan */}
              <div className="group relative border border-zinc-100 bg-zinc-50/50 p-10 rounded-[2rem] text-left transition-all hover:border-blue-100 hover:-translate-y-2 flex flex-col">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-10">Enterprise</div>
                <div className="flex items-baseline gap-1 mb-10 text-black">
                  <span className="text-7xl font-black tracking-tighter">$19</span>
                  <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">/mo</span>
                </div>
                <ul className="space-y-6 mb-12 text-sm font-black text-zinc-500 flex-grow">
                  {[
                    'Everything in Pro',
                    'AI Interview Assistant',
                    'Strategic Coaching',
                    'Executive Strategy',
                    'Network Referrals'
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full rounded-2xl border border-zinc-200 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-colors text-black">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 lg:py-32 border-t border-zinc-100 bg-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-600/10 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 font-black text-lg">O</span>
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
                  {['Features', 'Process', 'Pricing'].map((item) => (
                    <a key={item} href="#" className="text-xs font-black text-zinc-400 hover:text-blue-600 transition-colors">{item}</a>
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
