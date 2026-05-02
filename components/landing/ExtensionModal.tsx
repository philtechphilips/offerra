"use client";

import type { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";

interface ExtensionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChromeLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <path
            fill="#4285F4"
            d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0z"
        />
        <path
            fill="#34A853"
            d="M1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29z"
        />
        <path
            fill="#FBBC05"
            d="M15.273 7.636a5.446 5.446 0 0 1 1.45 7.09l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364z"
        />
        <circle cx="12" cy="12" r="4.364" fill="#FFFFFF" />
        <circle cx="12" cy="12" r="3.5" fill="#1A73E8" />
    </svg>
);

const EdgeLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <path
            fill="#0078D7"
            d="M21.86 17.86q.14 0 .25.12.1.13.1.25t-.11.33l-.32.46-.43.53-.44.5q-.21.25-.38.42l-.22.23q-.58.53-1.34 1.04-.76.51-1.6.91-.86.4-1.74.64t-1.67.24q-.9 0-1.69-.28-.8-.28-1.48-.78-.68-.5-1.22-1.17-.53-.66-.92-1.44-.38-.77-.58-1.6-.2-.83-.2-1.67 0-1 .32-1.96.33-.97.87-1.8.14.95.55 1.77.41.82 1.02 1.5.6.68 1.38 1.21.78.54 1.64.9.86.36 1.77.56.92.2 1.8.2 1.12 0 2.18-.24 1.06-.23 2.06-.72l.2-.1.2-.05zm-15.5-1.27q0 1.1.27 2.15.27 1.06.78 2.03.51.96 1.24 1.77.74.82 1.66 1.4-1.47-.2-2.8-.74-1.33-.55-2.48-1.37-1.15-.83-2.08-1.9-.92-1.07-1.58-2.33T.36 14.94Q0 13.54 0 12.06q0-.81.32-1.49.31-.68.83-1.23.53-.55 1.2-.96.66-.4 1.35-.66.74-.27 1.5-.39.78-.12 1.55-.12.7 0 1.42.1.72.12 1.4.35.68.23 1.32.57.63.35 1.16.83-.35 0-.7.07-.33.07-.65.23v-.02q-.63.28-1.2.74-.57.46-1.05 1.04-.48.58-.87 1.26-.38.67-.65 1.39-.27.71-.42 1.44-.15.72-.15 1.38zM11.96.06q1.7 0 3.33.39 1.63.38 3.07 1.15 1.43.77 2.62 1.93 1.18 1.16 1.98 2.7.49.94.76 1.96.28 1 .28 2.08 0 .89-.23 1.7-.24.8-.69 1.48-.45.68-1.1 1.22-.64.53-1.45.88-.54.24-1.11.36-.58.13-1.16.13-.42 0-.97-.03-.54-.03-1.1-.12-.55-.1-1.05-.28-.5-.19-.84-.5-.12-.09-.23-.24-.1-.16-.1-.33 0-.15.16-.35.16-.2.35-.5.2-.28.36-.68.16-.4.16-.95 0-1.06-.4-1.96-.4-.91-1.06-1.64-.66-.74-1.52-1.28-.86-.55-1.79-.89-.84-.3-1.72-.44-.87-.14-1.76-.14-1.55 0-3.06.45T.94 7.55q.71-1.74 1.81-3.13 1.1-1.38 2.52-2.35Q6.68 1.1 8.37.58q1.7-.52 3.58-.52Z"
        />
    </svg>
);

const FirefoxLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <path
            fill="#FF7139"
            d="M8.824 7.287c.008 0 .004 0 0 0zm-2.8-1.4c.006 0 .003 0 0 0zm16.754 2.161c-.505-1.215-1.53-2.528-2.333-2.943.654 1.283 1.033 2.57 1.177 3.53l.002.02c-1.314-3.278-3.544-4.6-5.366-7.477-.091-.147-.184-.292-.273-.446a3.545 3.545 0 01-.13-.24 2.118 2.118 0 01-.172-.46.03.03 0 00-.027-.03.038.038 0 00-.021 0l-.006.001a.037.037 0 00-.01.005L15.624 0c-2.585 1.515-3.657 4.168-3.932 5.856a6.197 6.197 0 00-2.305.587.297.297 0 00-.147.37c.057.162.24.24.396.17a5.622 5.622 0 012.008-.523l.067-.005a5.847 5.847 0 011.957.222l.095.03a5.816 5.816 0 01.616.228c.08.036.16.073.238.112l.107.055a5.835 5.835 0 01.368.211 5.953 5.953 0 012.034 2.104c-.62-.437-1.733-.868-2.803-.681 4.183 2.09 3.06 9.292-2.737 9.02a5.164 5.164 0 01-1.513-.292 4.42 4.42 0 01-.538-.232c-1.42-.735-2.593-2.121-2.74-3.806 0 0 .537-2 3.845-2 .357 0 1.38-.998 1.398-1.287-.005-.095-2.029-.9-2.817-1.677-.422-.416-.622-.616-.8-.767a3.47 3.47 0 00-.301-.227 5.388 5.388 0 01-.032-2.842c-1.195.544-2.124 1.403-2.8 2.163h-.006c-.46-.584-.428-2.51-.402-2.913-.006-.025-.343.176-.389.206-.406.29-.787.616-1.136.974-.397.403-.76.839-1.085 1.303a9.816 9.816 0 00-1.562 3.52c-.003.013-.11.487-.19 1.073-.013.09-.026.181-.037.272a7.8 7.8 0 00-.069.667l-.002.034-.023.387-.001.06C.386 18.795 5.593 24 12.016 24c5.752 0 10.527-4.176 11.463-9.661.02-.149.035-.298.052-.448.232-1.994-.025-4.09-.753-5.844z"
        />
    </svg>
);

interface BrowserOption {
    name: string;
    Logo: ({ className }: { className?: string }) => ReactElement;
    href: string | null;
    desc: string;
    bg: string;
    comingSoon?: boolean;
}

const browsers: BrowserOption[] = [
    {
        name: "Google Chrome",
        Logo: ChromeLogo,
        href: "https://chromewebstore.google.com/detail/offerra/cidmgihbhcenlcbblehpnhjnfcgehfjb",
        desc: "Available now in the Chrome Web Store.",
        bg: "bg-blue-50",
    },
    {
        name: "Microsoft Edge",
        Logo: EdgeLogo,
        href: null,
        desc: "Built for Windows productivity workflows.",
        bg: "bg-sky-50",
        comingSoon: true,
    },
    {
        name: "Mozilla Firefox",
        Logo: FirefoxLogo,
        href: null,
        desc: "Privacy-first version for Firefox users.",
        bg: "bg-orange-50",
        comingSoon: true,
    },
];

export function ExtensionModal({ isOpen, onClose }: ExtensionModalProps) {
    const handleSelect = (browser: BrowserOption) => {
        if (browser.comingSoon || !browser.href) {
            toast.info(`${browser.name} support is coming soon — we’ll let you know the moment it’s live.`);
            return;
        }
        window.open(browser.href, "_blank", "noopener,noreferrer");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden border border-zinc-100"
                    >
                        {/* Header Area */}
                        <div className="p-8 pb-0 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center">
                                    <Download className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-black uppercase">Install the Offerra extension</h3>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-3 w-3 text-blue-600 animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pick your browser to get started</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* List Area */}
                        <div className="p-8 space-y-3">
                            {browsers.map((browser, idx) => (
                                <motion.button
                                    key={browser.name}
                                    type="button"
                                    onClick={() => handleSelect(browser)}
                                    className={cn(
                                        "group block w-full text-left p-6 rounded-3xl border transition-all duration-300",
                                        "bg-white border-zinc-100 hover:border-blue-200 hover:-translate-y-1",
                                    )}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0", browser.bg)}>
                                            <browser.Logo className="h-8 w-8" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h4 className="text-lg font-black text-black uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                                    {browser.name}
                                                </h4>
                                                {browser.comingSoon && (
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[9px] font-black uppercase tracking-widest text-amber-600">
                                                        Coming soon
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-zinc-400 leading-snug">
                                                {browser.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Footer Area */}
                        <div className="px-8 py-6 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-center gap-4">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">
                                Used by job seekers <span className="text-black">worldwide.</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
