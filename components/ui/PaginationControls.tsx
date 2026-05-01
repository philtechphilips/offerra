"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta, getPaginationLabel } from "@/app/lib/pagination";

interface PaginationControlsProps {
    meta: PaginationMeta;
    onPageChange: (nextPage: number) => void;
    itemLabel?: string;
    className?: string;
}

export function PaginationControls({
    meta,
    onPageChange,
    itemLabel = "items",
    className = "",
}: PaginationControlsProps) {
    if (meta.last_page <= 1) return null;

    const canGoPrev = meta.current_page > 1;
    const canGoNext = meta.current_page < meta.last_page;

    return (
        <div className={`px-5 py-4 border-t border-zinc-50 bg-white flex items-center justify-between ${className}`}>
            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                {getPaginationLabel(meta, itemLabel)}
            </p>
            <div className="flex items-center gap-2">
                <button
                    disabled={!canGoPrev}
                    onClick={() => onPageChange(meta.current_page - 1)}
                    className="h-9 w-9 flex items-center justify-center bg-white border border-zinc-100 rounded-xl text-zinc-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 transition-all"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                    disabled={!canGoNext}
                    onClick={() => onPageChange(meta.current_page + 1)}
                    className="h-9 w-9 flex items-center justify-center bg-white border border-zinc-100 rounded-xl text-zinc-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 transition-all"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
