"use client";

import { motion } from "framer-motion";
import { Mail, Globe, MapPin, Twitter, Linkedin, Github, Send, Sparkles, Phone, MessageCircle } from "lucide-react";
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="py-24 lg:py-32 border-t border-zinc-100 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-zinc-100 to-transparent" />
          
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4">
            <div className="flex flex-col lg:flex-row justify-between gap-24 lg:gap-32 items-center lg:items-start text-center lg:text-left">
              {/* Brand Column */}
              <div className="flex flex-col items-center lg:items-start max-w-sm">
                <Link href="/" className="flex items-center gap-1.5 mb-8 group transition-all active:scale-95">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    <img src="/logo.png" alt="Offerra Logo" className="h-full w-full object-contain p-1.5" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter text-black">Offerra<span className="text-blue-600">.</span></span>
                </Link>
                <p className="text-base font-medium text-zinc-400 leading-relaxed mb-10">
                  The intelligent command center for modern career progression. We help top talent land their dream roles using world-class AI.
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: Twitter, href: '#' },
                    { icon: Linkedin, href: '#' },
                    { icon: Github, href: '#' }
                  ].map((social, idx) => (
                    <a 
                      key={idx} 
                      href={social.href} 
                      className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-100 hover:bg-white transition-all active:scale-90"
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-24 w-full lg:w-auto">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-black mb-8">Product</h4>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: 'Features', href: '/#features' },
                      { label: 'Extension', href: '/#extension' },
                      { label: 'Process', href: '/#how-it-works' },
                      { label: 'Pricing', href: '/#pricing' }
                    ].map((item) => (
                      <a key={item.label} href={item.href} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors">{item.label}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-black mb-8">Resources</h4>
                  <div className="flex flex-col gap-4">
                    {['FAQ', 'Support', 'Contact', 'API'].map((item) => (
                      <a key={item} href={item === 'Contact' ? '/contact' : '#'} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors">{item}</a>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-black mb-8">Compliance</h4>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: 'Privacy', href: '/privacy' },
                      { label: 'Terms', href: '/terms' }
                    ].map((item) => (
                      <Link key={item.label} href={item.href} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors">{item.label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-24 pt-12 border-t border-zinc-50 flex flex-col sm:flex-row justify-between items-center gap-8">
              <div className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em] flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                © {new Date().getFullYear()} Offerra AI.
              </div>
            </div>
          </div>
        </footer>
    );
}
