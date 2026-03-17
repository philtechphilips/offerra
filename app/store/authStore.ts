import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    credits: number;
    plan?: {
        name: string;
        slug: string;
    } | null;
    google_account?: {
        email: string;
        last_synced_at: string | null;
        status?: string;
    } | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    _hasHydrated: boolean;
    setAuth: (user: User, token: string) => void;
    setUser: (user: User) => void;
    clearAuth: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set): AuthState => ({
            user: null,
            token: null,
            isLoggedIn: false,
            _hasHydrated: false,
            setAuth: (user: User, token: string) => set({ user, token, isLoggedIn: true }),
            setUser: (user: User) => set({ user }),
            clearAuth: () => set({ user: null, token: null, isLoggedIn: false }),
            setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
        }),
        {
            name: 'offerra-auth',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);
