"use client";

import { useRef, useState } from "react";
import { Building2, Bell, ExternalLink, MoreVertical, Pencil, Trash2, FileText, Loader2 } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useJobStore, type JobApplication } from "@/app/store/jobStore";
import { toast } from "sonner";

const COLUMNS: { status: JobApplication['status']; label: string; color: string; bg: string; dot: string }[] = [
    { status: 'tracking',  label: 'Tracking',  color: 'text-zinc-500',   bg: 'bg-zinc-50',    dot: 'bg-zinc-300' },
    { status: 'applied',   label: 'Applied',   color: 'text-blue-600',   bg: 'bg-blue-50',    dot: 'bg-blue-400' },
    { status: 'interview', label: 'Interview', color: 'text-amber-600',  bg: 'bg-amber-50',   dot: 'bg-amber-400' },
    { status: 'offer',     label: 'Offer',     color: 'text-emerald-600',bg: 'bg-emerald-50', dot: 'bg-emerald-400' },
    { status: 'rejected',  label: 'Rejected',  color: 'text-red-500',    bg: 'bg-red-50',     dot: 'bg-red-400' },
];

function FollowUpBadge({ date }: { date: string }) {
    const followUp = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    followUp.setHours(0, 0, 0, 0);
    const diff = Math.round((followUp.getTime() - today.getTime()) / 86400000);

    const label =
        diff === 0 ? "Today" :
        diff === 1 ? "Tomorrow" :
        diff < 0 ? `${Math.abs(diff)}d overdue` :
        `In ${diff}d`;

    const color =
        diff <= 0 ? "text-red-500" :
        diff <= 2 ? "text-amber-600" :
        "text-blue-500";

    return (
        <span className={cn("inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wide", color)}>
            <Bell className="h-2.5 w-2.5" />{label}
        </span>
    );
}

interface KanbanCardProps {
    job: JobApplication;
    onEdit: (job: JobApplication) => void;
    onDelete: (job: JobApplication) => void;
    onView: (job: JobApplication) => void;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent, job: JobApplication) => void;
}

function KanbanCard({ job, onEdit, onDelete, onView, isDragging, onDragStart }: KanbanCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, job)}
            className={cn(
                "bg-white rounded-2xl border border-zinc-100 p-4 cursor-grab active:cursor-grabbing",
                "hover:border-blue-200 hover:shadow-sm transition-all select-none",
                isDragging && "opacity-40 scale-95"
            )}
        >
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-black text-zinc-900 truncate leading-tight">{job.title}</p>
                        <p className="text-[10px] font-bold text-zinc-400 truncate mt-0.5">{job.company}</p>
                    </div>
                </div>
                <div className="relative shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                        className="h-6 w-6 rounded-lg flex items-center justify-center text-zinc-300 hover:text-zinc-600 hover:bg-zinc-50 transition-all"
                    >
                        <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                            <div className="absolute right-0 top-7 z-20 w-36 bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-lg">
                                <button onClick={() => { setShowMenu(false); onView(job); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-[10px] font-bold text-zinc-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                    <FileText className="h-3 w-3" />View Details
                                </button>
                                <div className="border-t border-zinc-50" />
                                <button onClick={() => { setShowMenu(false); onEdit(job); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-[10px] font-bold text-zinc-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                    <Pencil className="h-3 w-3" />Edit
                                </button>
                                <div className="border-t border-zinc-50" />
                                <button onClick={() => { setShowMenu(false); onDelete(job); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-[10px] font-bold text-red-500 hover:bg-red-50 transition-all">
                                    <Trash2 className="h-3 w-3" />Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                    {job.salary && (
                        <span className="text-[9px] font-bold text-zinc-400 truncate max-w-[80px]">{job.salary}</span>
                    )}
                    {job.follow_up_date && <FollowUpBadge date={job.follow_up_date} />}
                </div>
                {job.job_url && (
                    <a
                        href={job.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5 flex items-center justify-center text-zinc-300 hover:text-blue-500 transition-colors"
                    >
                        <ExternalLink className="h-3 w-3" />
                    </a>
                )}
            </div>

            {job.cv_match_score != null && (
                <div className="mt-3 pt-3 border-t border-zinc-50">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">CV Match</span>
                        <span className={cn(
                            "text-[9px] font-black",
                            job.cv_match_score >= 70 ? "text-emerald-600" :
                            job.cv_match_score >= 40 ? "text-amber-600" : "text-red-500"
                        )}>{job.cv_match_score}%</span>
                    </div>
                    <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all",
                                job.cv_match_score >= 70 ? "bg-emerald-400" :
                                job.cv_match_score >= 40 ? "bg-amber-400" : "bg-red-400"
                            )}
                            style={{ width: `${job.cv_match_score}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

interface KanbanBoardProps {
    onEdit: (job: JobApplication) => void;
    onDelete: (job: JobApplication) => void;
    onView: (job: JobApplication) => void;
}

export default function KanbanBoard({ onEdit, onDelete, onView }: KanbanBoardProps) {
    const { jobs, isLoading, updateJobStatus } = useJobStore();
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOverCol, setDragOverCol] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, job: JobApplication) => {
        e.dataTransfer.setData('jobId', job.id);
        e.dataTransfer.setData('currentStatus', job.status);
        e.dataTransfer.effectAllowed = 'move';
        setDraggingId(job.id);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
        setDragOverCol(null);
    };

    const handleDragOver = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverCol(status);
    };

    const handleDrop = async (e: React.DragEvent, targetStatus: JobApplication['status']) => {
        e.preventDefault();
        const jobId = e.dataTransfer.getData('jobId');
        const currentStatus = e.dataTransfer.getData('currentStatus') as JobApplication['status'];

        setDraggingId(null);
        setDragOverCol(null);

        if (!jobId || currentStatus === targetStatus) return;

        setUpdatingId(jobId);
        try {
            await updateJobStatus(jobId, targetStatus);
            toast.success(`Moved to ${targetStatus}`);
        } catch {
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[60vh]">
            {COLUMNS.map((col) => {
                const colJobs = (jobs ?? []).filter(j => j?.status === col.status);
                const isOver = dragOverCol === col.status;

                return (
                    <div
                        key={col.status}
                        onDragOver={(e) => handleDragOver(e, col.status)}
                        onDragLeave={() => setDragOverCol(null)}
                        onDrop={(e) => handleDrop(e, col.status)}
                        className={cn(
                            "flex flex-col min-w-[260px] w-[260px] rounded-2xl border-2 transition-all duration-150",
                            isOver
                                ? "border-blue-300 bg-blue-50/50 scale-[1.01]"
                                : "border-transparent bg-zinc-50/80"
                        )}
                    >
                        {/* Column header */}
                        <div className="flex items-center justify-between px-4 py-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className={cn("h-2 w-2 rounded-full", col.dot)} />
                                <span className={cn("text-[10px] font-black uppercase tracking-widest", col.color)}>
                                    {col.label}
                                </span>
                            </div>
                            <span className={cn("h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black", col.bg, col.color)}>
                                {colJobs.length}
                            </span>
                        </div>

                        {/* Drop zone */}
                        <div
                            className="flex-1 px-3 pb-3 space-y-3 overflow-y-auto min-h-[120px]"
                            onDragEnd={handleDragEnd}
                        >
                            {colJobs.length === 0 && (
                                <div className={cn(
                                    "h-20 rounded-xl border-2 border-dashed flex items-center justify-center transition-all",
                                    isOver ? "border-blue-300 bg-blue-50" : "border-zinc-200"
                                )}>
                                    <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                                        {isOver ? "Drop here" : "No jobs"}
                                    </p>
                                </div>
                            )}
                            {colJobs.map((job) => (
                                <div key={job.id} className="relative">
                                    {updatingId === job.id && (
                                        <div className="absolute inset-0 bg-white/70 rounded-2xl z-10 flex items-center justify-center">
                                            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                                        </div>
                                    )}
                                    <KanbanCard
                                        job={job}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onView={onView}
                                        isDragging={draggingId === job.id}
                                        onDragStart={handleDragStart}
                                    />
                                </div>
                            ))}

                            {/* Visible drop target when dragging over non-empty column */}
                            {isOver && colJobs.length > 0 && (
                                <div className="h-16 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 flex items-center justify-center">
                                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Drop here</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
