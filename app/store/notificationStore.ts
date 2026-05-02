import { create } from 'zustand';
import api from '@/app/lib/api';

export interface Notification {
    id: string;
    data: {
        title: string;
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        action_url?: string;
    };
    read_at: string | null;
    created_at: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/notifications');
            set({ 
                notifications: response.data.notifications, 
                unreadCount: response.data.unread_count 
            });
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            set({ isLoading: false });
        }
    },

    markAsRead: async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            set((state) => ({
                notifications: state.notifications.map((n) => 
                    n.id === id ? { ...n, read_at: new Date().toISOString() } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    },

    markAllAsRead: async () => {
        try {
            await api.post('/notifications/read-all');
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read_at: new Date().toISOString() })),
                unreadCount: 0
            }));
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    },

    deleteNotification: async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            set((state) => {
                const target = state.notifications.find((n) => n.id === id);
                const wasUnread = target && target.read_at === null;
                return {
                    notifications: state.notifications.filter((n) => n.id !== id),
                    unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
                };
            });
        } catch (err) {
            console.error('Failed to delete notification', err);
        }
    },
}));
