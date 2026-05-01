"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import {
    Search,
    Trash2,
    Mail,
    Calendar,
    SearchX,
    UserCircle,
    CheckCircle2,
    ShieldCheck,
    Coins,
    Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PaginationMeta } from "@/app/lib/pagination";
import { useInfiniteScroll } from "@/app/lib/useInfiniteScroll";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    credits: number;
    created_at: string;
    job_applications_count: number;
}

interface ActivityItem {
    type: string;
    title: string;
    description: string;
    created_at: string;
    meta?: Record<string, any>;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userTimeline, setUserTimeline] = useState<ActivityItem[]>([]);
    const [isLoadingActivity, setIsLoadingActivity] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ title: string; description: string; confirmLabel?: string; onConfirm: () => void } | null>(null);

    const fetchUsers = async (targetPage = 1, reset = false) => {
        if (reset || targetPage === 1) setLoading(true);
        else setIsLoadingMore(true);

        try {
            const response = await api.get(`/admin/users?page=${targetPage}&per_page=20&search=${search}`);
            const fetchedUsers = response.data.data || [];
            setUsers(prev => (targetPage === 1 ? fetchedUsers : [...prev, ...fetchedUsers]));
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            });
            setHasMore(response.data.current_page < response.data.last_page);
        } catch (err) {
            console.error("Failed to fetch users", err);
            toast.error("Error loading users");
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(page, page === 1);
        }, 500);
        return () => clearTimeout(timer);
    }, [page, search]);

    const { sentinelRef } = useInfiniteScroll({
        hasMore,
        isLoading: loading || isLoadingMore,
        onLoadMore: () => {
            if (!pagination || !hasMore) return;
            setPage(prev => prev + 1);
        },
    });

    const handleUpdateRole = async (userId: string, currentRole: string) => {
        const nextRole = currentRole === 'admin' ? 'user' : 'admin';
        setUpdatingUserId(userId);
        try {
            await api.put(`/admin/users/${userId}/role`, { role: nextRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: nextRole } : u));
            toast.success(`User updated to ${nextRole}`);
        } catch (err) {
            toast.error("Failed to update user role");
        } finally {
            setUpdatingUserId(null);
        }
    };

    const handleUpdateCredits = async (userId: string, amount: number) => {
        try {
            await api.post(`/admin/users/${userId}/credits`, {
                amount,
                type: 'bonus',
                description: 'Admin bonus credits'
            });
            setUsers(users.map(u => u.id === userId ? { ...u, credits: u.credits + amount } : u));
            toast.success(`Added ${amount} credits to user`);
        } catch (err) {
            toast.error("Failed to update credits");
        }
    };

    const doDeleteUser = async (userId: string) => {
        setConfirmModal(null);
        setIsDeletingUser(true);
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
            toast.success("User deleted successfully");
        } catch (err) {
            toast.error("Failed to delete user");
        } finally {
            setIsDeletingUser(false);
        }
    };

    const handleDeleteUser = (userId: string) => {
        setConfirmModal({
            title: "Delete User",
            description: "Are you sure you want to delete this user? This action cannot be undone.",
            confirmLabel: "Delete User",
            onConfirm: () => doDeleteUser(userId),
        });
    };

    const openUserActivity = async (user: User) => {
        setSelectedUser(user);
        setIsActivityOpen(true);
        setIsLoadingActivity(true);
        setUserTimeline([]);
        try {
            const response = await api.get(`/admin/users/${user.id}/activity`);
            setUserTimeline(response.data.timeline || []);
        } catch (err) {
            toast.error("Failed to load user activity");
        } finally {
            setIsLoadingActivity(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tight">User <span className="text-blue-600">Control</span></h1>
                    <p className="text-sm text-zinc-400 mt-0.5">Manage platform accounts, roles, and access levels.</p>
                </div>

                <div className="relative group min-w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full h-10 pl-9 pr-4 bg-white border border-zinc-100 rounded-xl text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-600 placeholder:text-zinc-300 transition-all"
                    />
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-100">
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">User</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Role</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Jobs</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Coins className="h-3 w-3" /> Credits
                                    </div>
                                </th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Joined</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {users.length > 0 ? users.map((u, i) => (
                                <motion.tr
                                    key={u.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="hover:bg-zinc-50/50 transition-colors"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-xs shrink-0">
                                                {u.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-zinc-900 uppercase truncate max-w-44">{u.name}</p>
                                                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                                                    <Mail className="h-3 w-3" />
                                                    {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
                                            u.role === 'admin'
                                                ? "bg-blue-50 border-blue-100 text-blue-600"
                                                : "bg-zinc-50 border-zinc-100 text-zinc-500"
                                        )}>
                                            {u.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <UserCircle className="h-3 w-3" />}
                                            {u.role}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="text-sm font-black text-zinc-900">{u.job_applications_count}</span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="flex items-center gap-1">
                                                <Coins className="h-3.5 w-3.5 text-amber-500" />
                                                <span className="text-xs font-black text-zinc-900">{(u.credits || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleUpdateCredits(u.id, 100)}
                                                    className="px-1.5 py-0.5 bg-zinc-50 border border-zinc-100 rounded text-[8px] font-black text-zinc-400 hover:border-amber-200 hover:text-amber-600 transition-all"
                                                >
                                                    +100
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateCredits(u.id, 500)}
                                                    className="px-1.5 py-0.5 bg-zinc-50 border border-zinc-100 rounded text-[8px] font-black text-zinc-400 hover:border-emerald-200 hover:text-emerald-600 transition-all"
                                                >
                                                    +500
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                                            <Calendar className="h-3.5 w-3.5 text-zinc-300" />
                                            {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openUserActivity(u)}
                                                className="h-8 px-3 bg-white border border-zinc-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 transition-all"
                                            >
                                                Activity
                                            </button>
                                            <button
                                                onClick={() => handleUpdateRole(u.id, u.role)}
                                                disabled={updatingUserId === u.id}
                                                className="h-8 px-3 bg-white border border-zinc-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all disabled:opacity-50"
                                            >
                                                Toggle Role
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="h-8 w-8 flex items-center justify-center bg-white border border-zinc-100 rounded-lg text-zinc-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-5 py-16 text-center">
                                        {loading ? (
                                            <div className="h-7 w-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto text-zinc-200">
                                                    <SearchX size={28} />
                                                </div>
                                                <p className="text-sm font-black text-zinc-900">No users found</p>
                                                <p className="text-xs text-zinc-400">Try adjusting your search query.</p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {hasMore && (
                    <div ref={sentinelRef} className="py-6 flex items-center justify-center border-t border-zinc-50">
                        {isLoadingMore && <div className="h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                    </div>
                )}
            </div>
            <ConfirmModal
                isOpen={!!confirmModal}
                onClose={() => setConfirmModal(null)}
                onConfirm={() => confirmModal?.onConfirm()}
                title={confirmModal?.title ?? ""}
                description={confirmModal?.description ?? ""}
                confirmLabel={confirmModal?.confirmLabel}
                isLoading={isDeletingUser}
            />

            {isActivityOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-zinc-900/40"
                        onClick={() => setIsActivityOpen(false)}
                    />
                    <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-zinc-100 bg-white">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <Activity className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-zinc-900">
                                        Activity: {selectedUser?.name}
                                    </p>
                                    <p className="text-[11px] text-zinc-400">{selectedUser?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsActivityOpen(false)}
                                className="h-8 px-3 rounded-lg border border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-50"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto max-h-[65vh]">
                            {isLoadingActivity ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="h-7 w-7 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : userTimeline.length === 0 ? (
                                <div className="py-14 text-center">
                                    <p className="text-sm font-black text-zinc-900">No recent activity</p>
                                    <p className="text-xs text-zinc-400 mt-1">No logs found for this user yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {userTimeline.map((item, idx) => (
                                        <div key={`${item.type}-${idx}`} className="rounded-xl border border-zinc-100 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{item.title}</p>
                                                    <p className="text-sm font-bold text-zinc-900 mt-1">{item.description}</p>
                                                </div>
                                                <span className="text-[10px] font-black text-zinc-400 whitespace-nowrap">
                                                    {new Date(item.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
