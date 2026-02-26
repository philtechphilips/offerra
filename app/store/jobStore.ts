import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/app/lib/api';

interface JobApplication {
    id: number;
    title: string;
    company: string;
    location: string;
    status: 'applied' | 'tracking' | 'interview' | 'rejected' | 'offer';
    job_url: string;
    company_url: string | null;
    salary: string | null;
    type: string;
    is_remote: boolean;
    created_at: string;
}

interface JobState {
    jobs: JobApplication[];
    isLoading: boolean;
    fetchJobs: () => Promise<void>;
}

export const useJobStore = create<JobState>()(
    persist(
        (set) => ({
            jobs: [],
            isLoading: false,
            fetchJobs: async () => {
                set({ isLoading: true });
                try {
                    const response = await api.get('/jobs');
                    set({ jobs: response.data, isLoading: false });
                } catch (err) {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'offerra-jobs',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
