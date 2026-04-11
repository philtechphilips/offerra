"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import {
    Search,
    Trash2,
    Mail,
    Calendar,
    ChevronLeft,
    ChevronRight,
    SearchX,
    UserCircle,
    CheckCircle2,
    ShieldCheck,
    Coins
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    credits: number;
    created_at: string;
    job_applications_count: number;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    total: number;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/users?page=${page}&search=${search}`);
            setUsers(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            });
        } catch (err) {
            console.error("Failed to fetch users", err);
            toast.error("Error loading users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [page, search]);

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

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
            toast.success("User deleted successfully");
        } catch (err) {
            toast.error("Failed to delete user");
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

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="px-5 py-4 border-t border-zinc-50 bg-white flex items-center justify-between">
                        <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                            Page <span className="text-zinc-900">{pagination.current_page}</span> of {pagination.last_page} ({pagination.total} users)
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="h-9 w-9 flex items-center justify-center bg-white border border-zinc-100 rounded-xl text-zinc-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                disabled={page === pagination.last_page}
                                onClick={() => setPage(page + 1)}
                                className="h-9 w-9 flex items-center justify-center bg-white border border-zinc-100 rounded-xl text-zinc-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 transition-all"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
