import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle, MoreVertical, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore, Notification } from "@/app/store/notificationStore";
import { cn } from "@/app/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
 
 function timeAgo(date: Date) {
     const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
     let interval = seconds / 31536000;
     if (interval > 1) return Math.floor(interval) + "y ago";
     interval = seconds / 2592000;
     if (interval > 1) return Math.floor(interval) + "mo ago";
     interval = seconds / 86400;
     if (interval > 1) return Math.floor(interval) + "d ago";
     interval = seconds / 3600;
     if (interval > 1) return Math.floor(interval) + "h ago";
     interval = seconds / 60;
     if (interval > 1) return Math.floor(interval) + "m ago";
     return "just now";
 }

export function NotificationDropdown() {
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        fetchNotifications();
        // Poll every 1 minute
        const interval = setInterval(() => {
            fetchNotifications();
        }, 60000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
    };

    const handleMarkAllRead = () => {
        markAllAsRead();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative rounded-xl p-2.5 text-zinc-400 transition-all hover:bg-zinc-50 hover:text-blue-600",
                    isOpen && "bg-zinc-50 text-blue-600"
                )}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500 animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 rounded-[2rem] border border-zinc-100 bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden z-[60]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-zinc-50 bg-zinc-50/50">
                            <div>
                                <h3 className="text-sm font-black text-brand-blue-black">Notifications</h3>
                                <p className="text-[10px] font-bold text-zinc-400 mt-1">
                                    {unreadCount} unread
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={handleMarkAllRead}
                                    className="p-2 rounded-lg hover:bg-white text-zinc-400 hover:text-blue-600 transition-all group"
                                    title="Mark all as read"
                                >
                                    <CheckCheck className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[420px] overflow-y-auto scrollbar-hide py-2">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id}
                                        onClick={() => n.read_at === null && handleMarkAsRead(n.id)}
                                        className={cn(
                                            "relative group p-4 sm:p-5 flex gap-4 transition-all border-b border-zinc-50/50 last:border-0 hover:bg-zinc-50/50 cursor-pointer",
                                            !n.read_at && "bg-blue-50/30"
                                        )}
                                    >
                                        <div className="shrink-0 h-10 w-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                            {getIcon(n.data.type || 'info')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h4 className="text-xs font-black text-brand-blue-black truncate tracking-tight">
                                                    {n.data.title}
                                                </h4>
                                                <span className="text-[9px] font-bold text-zinc-300 shrink-0">
                                                    {timeAgo(new Date(n.created_at))}
                                                </span>
                                            </div>
                                            <p className="text-[11px] font-medium text-zinc-500 leading-relaxed mb-2">
                                                {n.data.message}
                                            </p>
                                            {n.data.action_url && (
                                                <Link 
                                                    href={n.data.action_url}
                                                    className="inline-flex items-center text-[10px] font-black text-blue-600 hover:underline"
                                                >
                                                    View details
                                                </Link>
                                            )}
                                        </div>
                                        {!n.read_at && (
                                            <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="h-16 w-16 rounded-3xl bg-zinc-50 flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                                        <Bell className="h-6 w-6 text-zinc-300" />
                                    </div>
                                    <p className="text-[11px] font-black text-zinc-300">No new notifications</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-zinc-50 text-center bg-zinc-50/30">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push("/dashboard/activity");
                                }}
                                className="text-[11px] font-black text-zinc-400 hover:text-blue-600 transition-colors"
                            >
                                View all activity
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
