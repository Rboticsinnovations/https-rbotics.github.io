import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL, // Backend URL
    withCredentials: true, // This allows cookies (like refresh token) to be sent and received
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

// Request interceptor to attach access token
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401s and automatically refresh tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Call the refresh endpoint to get a new access token
                const res = await axios.get(`${API_BASE_URL}/auth/refresh`, {
                    withCredentials: true,
                });
                setAccessToken(res.data.accessToken);
                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, user needs to login again
                setAccessToken(null);
                window.dispatchEvent(new Event('auth-logout'));
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
