"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Delete",
    isLoading = false,
}: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.18 }}
                        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 pb-0">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                                <h2 className="text-base font-black text-zinc-900 uppercase tracking-tight">
                                    {title}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all disabled:opacity-40"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 pt-4 pb-6">
                            <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 h-10 rounded-xl border border-zinc-200 bg-white text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-all disabled:opacity-40"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="flex-1 h-10 rounded-xl bg-red-500 text-sm font-bold text-white hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
