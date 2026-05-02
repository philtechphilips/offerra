import { create } from 'zustand';
import api from '@/app/lib/api';

export interface JobApplication {
    id: string;
    title: string;
    company: string;
    location: string;
    status: 'applied' | 'tracking' | 'interview' | 'rejected' | 'offer';
    job_url: string;
    company_url: string | null;
    salary: string | null;
    type: string;
    is_remote: boolean;
    cv_match_score: number | null;
    cv_match_details: { strengths?: string[]; gaps?: string[]; tip?: string } | null;
    created_at: string;
    description: string | null;
    follow_up_date: string | null;
    follow_up_note: string | null;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
}

export interface JobStats {
    total: number;
    by_status: {
        applied: number;
        tracking: number;
        interview: number;
        rejected: number;
        offer: number;
    };
    momentum: {
        recent_7d: number;
        previous_7d: number;
    };
    interview_insights: {
        with_score: number;
        avg_match_score: number;
        high_match: number;
    };
}

const EMPTY_STATS: JobStats = {
    total: 0,
    by_status: { applied: 0, tracking: 0, interview: 0, rejected: 0, offer: 0 },
    momentum: { recent_7d: 0, previous_7d: 0 },
    interview_insights: { with_score: 0, avg_match_score: 0, high_match: 0 },
};

function normalizeStats(raw: unknown): JobStats {
    const data = (raw && typeof raw === 'object') ? (raw as Partial<JobStats>) : {};
    const byStatus = (data.by_status && typeof data.by_status === 'object') ? data.by_status : {} as Partial<JobStats['by_status']>;
    const momentum = (data.momentum && typeof data.momentum === 'object') ? data.momentum : {} as Partial<JobStats['momentum']>;
    const insights = (data.interview_insights && typeof data.interview_insights === 'object') ? data.interview_insights : {} as Partial<JobStats['interview_insights']>;
    return {
        total: Number(data.total ?? 0),
        by_status: {
            applied: Number(byStatus.applied ?? 0),
            tracking: Number(byStatus.tracking ?? 0),
            interview: Number(byStatus.interview ?? 0),
            rejected: Number(byStatus.rejected ?? 0),
            offer: Number(byStatus.offer ?? 0),
        },
        momentum: {
            recent_7d: Number(momentum.recent_7d ?? 0),
            previous_7d: Number(momentum.previous_7d ?? 0),
        },
        interview_insights: {
            with_score: Number(insights.with_score ?? 0),
            avg_match_score: Number(insights.avg_match_score ?? 0),
            high_match: Number(insights.high_match ?? 0),
        },
    };
}

interface JobState {
    jobs: JobApplication[];
    meta: PaginationMeta | null;
    stats: JobStats;
    isLoading: boolean;
    isLoadingMore: boolean;
    isLoadingStats: boolean;
    search: string;
    statusFilter: string;
    fetchJobs: (reset?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    fetchStats: () => Promise<void>;
    setSearch: (search: string) => void;
    setStatusFilter: (status: string) => void;
    updateJobStatus: (jobId: string, newStatus: JobApplication['status']) => Promise<void>;
}

export const useJobStore = create<JobState>()((set, get) => ({
    jobs: [],
    meta: null,
    stats: EMPTY_STATS,
    isLoading: false,
    isLoadingMore: false,
    isLoadingStats: false,
    search: '',
    statusFilter: 'all',

    fetchJobs: async (reset = true) => {
        const { search, statusFilter } = get();
        set({ isLoading: true });

        try {
            const params: Record<string, string> = { page: '1', per_page: '15' };
            if (search) params.search = search;
            if (statusFilter && statusFilter !== 'all') params.status = statusFilter;

            const response = await api.get('/jobs', { params });
            const data = Array.isArray(response.data?.data) ? response.data.data : [];
            set({
                jobs: data,
                meta: response.data?.meta ?? null,
                isLoading: false,
            });

            // Refresh stats alongside the list so totals stay in sync.
            get().fetchStats();
        } catch (err) {
            set({ isLoading: false });
        }
    },

    loadMore: async () => {
        const { meta, search, statusFilter, jobs } = get();
        if (!meta || !meta.has_more || get().isLoadingMore) return;

        set({ isLoadingMore: true });

        try {
            const nextPage = meta.current_page + 1;
            const params: Record<string, string> = {
                page: String(nextPage),
                per_page: String(meta.per_page),
            };
            if (search) params.search = search;
            if (statusFilter && statusFilter !== 'all') params.status = statusFilter;

            const response = await api.get('/jobs', { params });
            const more = Array.isArray(response.data?.data) ? response.data.data : [];
            set({
                jobs: [...(jobs ?? []), ...more],
                meta: response.data?.meta ?? meta,
                isLoadingMore: false,
            });
        } catch (err) {
            set({ isLoadingMore: false });
        }
    },

    fetchStats: async () => {
        if (get().isLoadingStats) return;
        set({ isLoadingStats: true });

        try {
            const response = await api.get('/jobs/stats');
            set({ stats: normalizeStats(response.data), isLoadingStats: false });
        } catch (err) {
            set({ isLoadingStats: false });
        }
    },

    setSearch: (search: string) => {
        set({ search });
    },

    setStatusFilter: (status: string) => {
        set({ statusFilter: status });
    },

    updateJobStatus: async (jobId: string, newStatus: JobApplication['status']) => {
        const previousJobs = get().jobs ?? [];

        // Optimistic update
        set({
            jobs: previousJobs.map(j =>
                j.id === jobId ? { ...j, status: newStatus } : j
            ),
        });

        try {
            await api.put(`/jobs/${jobId}`, { status: newStatus });
            // Refresh aggregate counts so dashboard / sidebar reflect the new status.
            get().fetchStats();
        } catch (err) {
            // Revert on failure
            set({ jobs: previousJobs });
        }
    },
}));
