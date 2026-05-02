"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    CheckCircle2,
    Info,
    AlertTriangle,
    XCircle,
    CheckCheck,
    Trash2,
    Loader2,
    ArrowUpRight,
} from "lucide-react";
import api from "@/app/lib/api";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import { useNotificationStore, type Notification } from "@/app/store/notificationStore";

type Filter = "all" | "unread" | "info" | "success" | "warning" | "error";

interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
}

const PER_PAGE = 20;

const FILTERS: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "success", label: "Success" },
    { id: "info", label: "Info" },
    { id: "warning", label: "Warning" },
    { id: "error", label: "Error" },
];

function timeAgo(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
}

function getIcon(type: string) {
    switch (type) {
        case "success":
            return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
        case "warning":
            return <AlertTriangle className="h-4 w-4 text-amber-500" />;
        case "error":
            return <XCircle className="h-4 w-4 text-red-500" />;
        default:
            return <Info className="h-4 w-4 text-blue-500" />;
    }
}

function tonePillClass(type: string) {
    switch (type) {
        case "success":
            return "bg-emerald-50 text-emerald-600";
        case "warning":
            return "bg-amber-50 text-amber-600";
        case "error":
            return "bg-red-50 text-red-500";
        default:
            return "bg-blue-50 text-blue-600";
    }
}

export default function ActivityPage() {
    const { markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotificationStore();

    const [items, setItems] = useState<Notification[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [filter, setFilter] = useState<Filter>("all");
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchPage = useCallback(async (page: number, currentFilter: Filter) => {
        const params: Record<string, string | number> = {
            paginate: "true",
            per_page: PER_PAGE,
            page,
        };
        if (currentFilter !== "all") params.filter = currentFilter;

        const res = await api.get("/notifications", { params });
        return {
            data: (res.data?.data || []) as Notification[],
            meta: res.data?.meta as Meta,
            unread: Number(res.data?.unread_count || 0),
        };
    }, []);

    const refresh = useCallback(async (currentFilter: Filter) => {
        setIsLoading(true);
        try {
            const result = await fetchPage(1, currentFilter);
            setItems(result.data);
            setMeta(result.meta);
            setUnreadCount(result.unread);
        } catch (err) {
            console.error("Failed to load activity", err);
            toast.error("Could not load activity. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [fetchPage]);

    useEffect(() => {
        refresh(filter);
    }, [filter, refresh]);

    const loadMore = useCallback(async () => {
        if (!meta?.has_more || isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            const result = await fetchPage(meta.current_page + 1, filter);
            setItems((prev) => [...prev, ...result.data]);
            setMeta(result.meta);
            setUnreadCount(result.unread);
        } catch (err) {
            console.error("Failed to load more activity", err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [meta, isLoadingMore, fetchPage, filter]);

    useEffect(() => {
        const node = observerTarget.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMore();
            },
            { rootMargin: "120px", threshold: 0.1 }
        );
        observer.observe(node);
        return () => observer.unobserve(node);
    }, [loadMore]);

    const handleMarkAsRead = async (id: string) => {
        const target = items.find((n) => n.id === id);
        if (!target || target.read_at) return;
        await markAsRead(id);
        setItems((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
    };

    const handleMarkAllRead = async () => {
        if (unreadCount === 0) return;
        await markAllAsRead();
        const stamp = new Date().toISOString();
        setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? stamp })));
        setUnreadCount(0);
        toast.success("All notifications marked as read.");
    };

    const handleDelete = async (id: string) => {
        setPendingDeleteId(id);
        const target = items.find((n) => n.id === id);
        const wasUnread = target && target.read_at === null;
        try {
            await deleteNotification(id);
            setItems((prev) => prev.filter((n) => n.id !== id));
            if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
            setMeta((prev) => (prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev));
            await fetchNotifications();
            toast.success("Notification removed.");
        } catch (err) {
            console.error("Failed to delete notification", err);
            toast.error("Could not delete notification.");
        } finally {
            setPendingDeleteId(null);
        }
    };

    const total = meta?.total ?? items.length;

    const summaryLine = useMemo(() => {
        if (filter === "unread") return `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`;
        return `${total} notification${total === 1 ? "" : "s"} • ${unreadCount} unread`;
    }, [filter, total, unreadCount]);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 mb-2">Activity</p>
                    <h1 className="text-3xl font-black tracking-tight text-brand-blue-black">
                        All your <span className="text-blue-600">notifications</span>
                    </h1>
                    <p className="mt-2 text-sm font-medium text-zinc-400">{summaryLine}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleMarkAllRead}
                        disabled={unreadCount === 0}
                        className="btn-secondary h-11 px-5 text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCheck className="h-4 w-4" />
                        Mark all read
                    </button>
                </div>
            </header>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={cn(
                            "shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === f.id
                                ? "bg-[#1C4ED8] text-white"
                                : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="rounded-3xl border border-zinc-100 bg-white overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading activity...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="h-16 w-16 rounded-3xl bg-zinc-50 flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                            <Bell className="h-6 w-6 text-zinc-300" />
                        </div>
                        <p className="text-sm font-black text-brand-blue-black mb-1">Nothing here yet</p>
                        <p className="text-[11px] font-medium text-zinc-400 max-w-xs mx-auto">
                            {filter === "unread"
                                ? "You're all caught up — no unread notifications."
                                : "We'll surface job updates, AI suggestions and reminders here."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-50">
                        <AnimatePresence initial={false}>
                            {items.map((n) => {
                                const data = n?.data ?? ({} as Notification['data']);
                                const type = data.type || "info";
                                const isUnread = n.read_at === null;
                                const created = n?.created_at ? new Date(n.created_at) : null;
                                const validDate = created && !isNaN(created.getTime());
                                return (
                                    <motion.div
                                        key={n.id}
                                        layout
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className={cn(
                                            "group relative flex gap-4 p-5 sm:p-6 transition-colors",
                                            isUnread ? "bg-blue-50/30" : "hover:bg-zinc-50/50"
                                        )}
                                    >
                                        <div className="shrink-0 h-10 w-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center">
                                            {getIcon(type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-1">
                                                <h3 className="text-sm font-black text-brand-blue-black tracking-tight truncate">
                                                    {data.title ?? 'Notification'}
                                                </h3>
                                                <span className="shrink-0 text-[10px] font-bold text-zinc-300">
                                                    {validDate ? timeAgo(created!) : ''}
                                                </span>
                                            </div>
                                            <p className="text-xs font-medium text-zinc-500 leading-relaxed">
                                                {data.message ?? ''}
                                            </p>
                                            <div className="flex items-center flex-wrap gap-2 mt-3">
                                                <span
                                                    className={cn(
                                                        "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest",
                                                        tonePillClass(type)
                                                    )}
                                                >
                                                    {type}
                                                </span>
                                                {isUnread && (
                                                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white">
                                                        New
                                                    </span>
                                                )}
                                                {data.action_url && (
                                                    <Link
                                                        href={data.action_url}
                                                        onClick={() => isUnread && handleMarkAsRead(n.id)}
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-colors"
                                                    >
                                                        View details
                                                        <ArrowUpRight className="h-3 w-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        <div className="shrink-0 flex items-center gap-1 self-start">
                                            {isUnread && (
                                                <button
                                                    onClick={() => handleMarkAsRead(n.id)}
                                                    className="p-2 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                    title="Mark as read"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(n.id)}
                                                disabled={pendingDeleteId === n.id}
                                                className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {pendingDeleteId === n.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {(meta?.has_more || isLoadingMore) && (
                            <div ref={observerTarget} className="flex items-center justify-center py-6">
                                {isLoadingMore && (
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Loading more...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
