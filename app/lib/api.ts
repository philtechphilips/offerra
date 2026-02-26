import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    const authStorage = localStorage.getItem('offerra-auth');
    if (!authStorage) return null;
    try {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.token || null;
    } catch (e) {
        return null;
    }
};

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAuthToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors (like 401)
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: any) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('offerra-auth');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
