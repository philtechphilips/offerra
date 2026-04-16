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

interface JobState {
    jobs: JobApplication[];
    meta: PaginationMeta | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    search: string;
    statusFilter: string;
    fetchJobs: (reset?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    setSearch: (search: string) => void;
    setStatusFilter: (status: string) => void;
    updateJobStatus: (jobId: string, newStatus: JobApplication['status']) => Promise<void>;
}

export const useJobStore = create<JobState>()((set, get) => ({
    jobs: [],
    meta: null,
    isLoading: false,
    isLoadingMore: false,
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
            set({
                jobs: response.data.data,
                meta: response.data.meta,
                isLoading: false,
            });
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
            set({
                jobs: [...jobs, ...response.data.data],
                meta: response.data.meta,
                isLoadingMore: false,
            });
        } catch (err) {
            set({ isLoadingMore: false });
        }
    },

    setSearch: (search: string) => {
        set({ search });
    },

    setStatusFilter: (status: string) => {
        set({ statusFilter: status });
    },

    updateJobStatus: async (jobId: string, newStatus: JobApplication['status']) => {
        const previousJobs = get().jobs;

        // Optimistic update
        set({
            jobs: previousJobs.map(j =>
                j.id === jobId ? { ...j, status: newStatus } : j
            ),
        });

        try {
            await api.put(`/jobs/${jobId}`, { status: newStatus });
        } catch (err) {
            // Revert on failure
            set({ jobs: previousJobs });
        }
    },
}));
