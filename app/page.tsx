"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { Footer } from "@/components/landing/Footer";
import { ExtensionFeature } from "@/components/landing/ExtensionFeature";
import { CoverLetterFeature } from "@/components/landing/CoverLetterFeature";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, Globe, MapPin, Twitter, Linkedin, Github, MessageCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";

const COMMON_FEATURES = [
  "Automated Job Tracking",
  "AI Resume Optimization",
  "Interview Practice Coach",
  "Smart Gmail Sync",
  "Browser Companion",
  "Priority Support"
];

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
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/plans");
        const sortedPlans = response.data.sort((a: Plan, b: Plan) => a.price_usd - b.price_usd);
        setPlans(sortedPlans);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setIsLoading(false);
      }
    };

    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.country_code === "NG") {
          setCurrency("NGN");
        }
      } catch (err) {
        // Fallback or silent error if blocked/failed
      }
    };

    fetchPlans();
    detectCountry();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ExtensionFeature />
        <Features />
        {/* How it Works - Refined Flow */}
        <section id="how-it-works" className="py-24 lg:py-32 bg-[#F9FBFF]/50 border-y border-zinc-100 relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-40" />
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
              <div>
                <motion.div
                  className="flex flex-col items-center lg:items-start text-center lg:text-left"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-[clamp(2rem,4.5vw,3.8rem)] font-black tracking-tighter leading-[1.1] mb-10 text-black text-gradient">
                    Zero effort. <br />Better <span className="text-[#1C4ED8]">results.</span>
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
                    className="group flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left relative z-10"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    <div className="relative">
                      <span className="relative text-sm font-black text-[#1C4ED8] bg-white border border-blue-100 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
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
        <CoverLetterFeature />
        <InterviewFeature />
        <MoreFeatures />
        <Testimonials />


        {/* Pricing - Premium Tiers */}
        <section id="pricing" className="py-24 lg:py-32 relative bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 text-center">
            <div className="max-w-2xl mx-auto mb-16 text-center">
              <motion.h2
                className="text-[clamp(2rem,4.5vw,4.2rem)] font-black tracking-tighter leading-[1.1] text-black text-gradient mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Transparent plans.
              </motion.h2>
              <p className="text-xl font-medium text-zinc-400 tracking-tight mb-10">Scale your career with the right tools.</p>
              
              {/* Currency Selector */}
              <div className="flex items-center justify-center mb-16">
                <div className="inline-flex p-1 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <button
                    onClick={() => setCurrency('USD')}
                    className={cn(
                      "px-8 py-3 rounded-xl text-[11px] font-black transition-all flex items-center gap-2",
                      currency === 'USD' ? "bg-white text-blue-600 border border-zinc-100" : "text-zinc-400 hover:text-black"
                    )}
                  >
                    <Globe className="h-3 w-3" />
                    Global (USD)
                  </button>
                  <button
                    onClick={() => setCurrency('NGN')}
                    className={cn(
                      "px-8 py-3 rounded-xl text-[11px] font-black transition-all flex items-center gap-2",
                      currency === 'NGN' ? "bg-white text-blue-600 border border-zinc-100" : "text-zinc-400 hover:text-black"
                    )}
                  >
                    <span className="text-xs">🇳🇬</span>
                    Nigeria (NGN)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              {!isLoading && plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "group relative border p-8 rounded-2xl text-left transition-all flex flex-col",
                    plan.is_popular
                      ? "border-2 border-[#1C4ED8] md:scale-110 z-10 hover:scale-[1.12] shimmer"
                      : "border-zinc-100 bg-white hover:border-blue-200 hover:-translate-y-2"
                  )}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#1C4ED8] text-white px-6 py-2 rounded-full text-[11px] font-black">Most Popular</div>
                  )}
                  <div className={cn(
                    "text-[10px] font-black uppercase tracking-[0.25em] mb-5",
                    plan.is_popular ? "text-[#1C4ED8]" : "text-zinc-400"
                  )}>
                    {plan.name}
                  </div>
                  <div className={cn(
                    "flex flex-col mb-6",
                    plan.is_popular ? "text-[#1C4ED8]" : "text-black"
                  )}>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-7xl font-black tracking-tighter leading-none">
                        {currency === 'USD' ? '$' : '₦'}
                        {Math.round(currency === 'USD' ? plan.price_usd : plan.price_ngn).toLocaleString()}
                        </span>
                    </div>
                    <div className={cn(
                      "mt-2 text-sm font-black uppercase tracking-widest",
                      plan.is_popular ? "opacity-60" : "text-zinc-400"
                    )}>{plan.credits} Application Credits</div>
                  </div>
                  <ul className={cn(
                    "space-y-4 mb-8 text-sm font-black grow",
                    plan.is_popular ? "text-black" : "text-zinc-500"
                  )}>
                    {COMMON_FEATURES.map((f, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          plan.is_popular ? "bg-[#1C4ED8]" : "bg-blue-200"
                        )} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className={cn(
                      "w-full rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                      plan.is_popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
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
        <Footer />

      </main>
    </div>
  );
}
