"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import {
    Search,
    MoreVertical,
    Trash2,
    ShieldAlert,
    User as UserIcon,
    Mail,
    Calendar,
    ChevronLeft,
    ChevronRight,
    SearchX,
    UserCircle,
    CheckCircle2,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
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
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

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
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [page, search]);

    const handleUpdateRole = async (userId: number, currentRole: string) => {
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

    const handleDeleteUser = async (userId: number) => {
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
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">User <span className="text-indigo-600">Control.</span></h1>
                    <p className="text-sm font-medium text-zinc-400 mt-1">Manage platform accounts, roles, and access levels.</p>
                </div>

                <div className="relative group min-w-[300px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full h-16 pl-16 pr-8 bg-white border border-zinc-100 rounded-[2rem] text-sm font-bold text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 placeholder:text-zinc-300 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* User List Table */}
            <div className="bg-white border border-zinc-100 rounded-[3rem] overflow-hidden shadow-sm shadow-zinc-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">User Details</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Account Role</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Engagement</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Joined</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {users.length > 0 ? users.map((u, i) => (
                                <motion.tr
                                    key={u.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-zinc-50/50 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-xs">
                                                {u.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-zinc-900 uppercase truncate max-w-[180px]">{u.name}</p>
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 mt-1">
                                                    <Mail className="h-3 w-3" />
                                                    {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest",
                                            u.role === 'admin'
                                                ? "bg-indigo-50 border-indigo-100 text-indigo-600"
                                                : "bg-zinc-50 border-zinc-100 text-zinc-500"
                                        )}>
                                            {u.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <UserCircle className="h-3 w-3" />}
                                            {u.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-black text-zinc-900">{u.job_applications_count}</span>
                                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Jobs</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[11px] font-black text-zinc-500 uppercase tracking-tighter">
                                            <Calendar className="h-4 w-4 text-zinc-300" />
                                            {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleUpdateRole(u.id, u.role)}
                                                disabled={updatingUserId === u.id}
                                                className="h-10 px-4 bg-white border border-zinc-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all disabled:opacity-50"
                                            >
                                                Toggle Role
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="h-10 w-10 flex items-center justify-center bg-white border border-zinc-100 rounded-xl text-zinc-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        {loading ? (
                                            <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center mx-auto text-zinc-300">
                                                    <SearchX size={40} />
                                                </div>
                                                <h5 className="text-xl font-black text-zinc-900 uppercase">No users found</h5>
                                                <p className="text-sm font-medium text-zinc-400">Try adjusting your search query.</p>
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
                    <div className="px-8 py-8 border-t border-zinc-50 bg-white flex items-center justify-between">
                        <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                            Showing page <span className="text-zinc-900">{pagination.current_page}</span> of {pagination.last_page} ({pagination.total} Users)
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="h-12 w-12 flex items-center justify-center bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                disabled={page === pagination.last_page}
                                onClick={() => setPage(page + 1)}
                                className="h-12 w-12 flex items-center justify-center bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-30 transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
